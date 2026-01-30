import { Meteor } from 'meteor/meteor';
import { Message, WABAErrorAPI } from 'whatsapp-business';

import { WhatsAppClient } from '/imports/infra/messaging/WhatsApp/config';
import { saveWhatsAppMessageAsGenericMessage } from '/imports/infra/messaging/methods';

interface InteractiveMessageProps {
	type: 'button' | 'list';
	text: string;
	phone: string;
	buttons?: {
		type: 'reply';
		reply: {
			id: string;
			title: string;
		};
	}[];
	button?: string;
	sections?: {
		title: string;
		rows: {
			id: string;
			title: string;
			description: string;
		}[];
	}[];
}

export const sendInteractiveMessage = async ({
	type,
	text,
	phone,
	buttons,
	button,
	sections,
}: InteractiveMessageProps) => {
	try {
		const data = {
			to: phone,
			type: 'interactive',
			interactive: {
				type,
				body: {
					text,
				},
				action: {
					buttons,
					button,
					sections,
				},
			},
		} as Message;

		const response = await WhatsAppClient.sendMessage(data);
		const external_message_id = response.messages[0].id;
		const contact = response.contacts[0];
		console.log('response from api', response);

		await saveWhatsAppMessageAsGenericMessage({
			account_channel_uid: Meteor.settings.whatsapp.phoneNumber,
			data,
			external_message_id,
			contact_uid: contact.wa_id,
			active_message_type: 'QUIZ',
			direction: 'OUT',
		});

		await Meteor.users.updateAsync(
			{ 'services.whatsapp.uid': contact.wa_id },
			{
				$set: {
					'services.whatsapp.lastSentMessageAt': new Date(),
				},
			},
		);
	} catch (err) {
		const error = err as WABAErrorAPI;
		console.error(error.message);
	}
};
