import { Meteor } from 'meteor/meteor';

import { getReviewWordsCursor } from '/imports/api/user-learning/words/publications';
import { Dictionary } from '/imports/api/words/collections';
import { getRandomWord } from '/imports/api/words/methods';

import { sendInteractiveMessage } from '/imports/infra/messaging/WhatsApp/sendInteractiveMessage';

export const findTasksFromAllUsers = async (limit = 100, skip = 0) => {
	const activeUsers = await Meteor.users
		.find({ active: { $ne: false } })
		.fetchAsync();

	await Promise.all(
		activeUsers.map(async (user) => {
			const whatsappPhone = user.services.whatsapp.uid;
			if (!whatsappPhone) return;

			const reviewWordsCursor = await getReviewWordsCursor({
				userId: user._id,
				limit,
				skip,
			});
			const reviewWords = await reviewWordsCursor.fetchAsync();

			const firstWord = reviewWords.pop();
			if (!reviewWords.length || !firstWord || !firstWord._id) {
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
				text: `🔍 Word Review Time! 🔍

Remember this word?

🌟 *${firstWord?.en?.text}*

Did you get that right? Check your understanding:
👇 Tap the correct translation! 👇`,
				phone: whatsappPhone,
				buttons: buttons.sort(() => Math.random() - 0.5),
			});
		}),
	);
};
