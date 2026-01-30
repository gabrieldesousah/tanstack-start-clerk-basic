import { Meteor } from 'meteor/meteor';

import { Dictionary } from '/imports/api/words/collections';
import { getRandomWord } from '/imports/api/words/methods';
import { getUnlearnedWordsCursor } from '/imports/api/words/publications';

import { sendInteractiveMessage } from '/imports/infra/messaging/WhatsApp/sendInteractiveMessage';

export const discoveryWordsFromAllUsers = async (limit = 100, skip = 0) => {
	const activeUsers = await Meteor.users
		.find({ active: { $ne: false } })
		.fetchAsync();

	await Promise.all(
		activeUsers.map(async (user) => {
			const whatsappPhone = user.services.whatsapp.uid;
			if (!whatsappPhone) return;
			console.log('whatsappPhone', whatsappPhone);

			const discoveryWordsCursor = await getUnlearnedWordsCursor({
				userId: user._id,
				level: user.profile?.languages?.en.level,
				limit,
				skip,
			});
			const discoveryWords = await discoveryWordsCursor.fetchAsync();

			const firstWord = discoveryWords.pop();
			if (!discoveryWords.length || !firstWord || !firstWord._id) {
				return;
			}

			const wrongRandomWords = await getRandomWord({
				notIn: [firstWord._id],
				limit: 2,
			});

			const buttons = wrongRandomWords.map((word: Dictionary) => ({
				type: 'reply',
				reply: { id: `QA#wrong#${word._id}`, title: word?.pt?.text },
			}));
			buttons.push({
				type: 'reply',
				reply: {
					id: `QA#correct#${firstWord?._id}`,
					title: firstWord?.pt?.text,
				},
			});

			await sendInteractiveMessage({
				type: 'button',
				text: `📝 New Vocabulary! 📝

🌟 *${firstWord?.en?.text}*

👇 What's the correct meaning? 👇`,
				phone: whatsappPhone,
				buttons: buttons.sort(() => Math.random() - 0.5),
			});
		}),
	);
};
