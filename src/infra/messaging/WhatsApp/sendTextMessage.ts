import { Meteor } from 'meteor/meteor';
import { WABAErrorAPI } from 'whatsapp-business';

import { WhatsAppClient } from '/imports/infra/messaging/WhatsApp/config';

/**
 * Começar a receber o usuário, e não o phone!
 * @param phone
 * @param text
 */
export const sendTextMessage = async ({
	phone,
	text,
}: {
	phone: string;
	text: string;
}) => {
	try {
		const res = await WhatsAppClient.sendMessage({
			to: phone,
			type: 'text',
			text: { body: text },
		});

		console.log('res', res);

		await Meteor.users.updateAsync(
			{ 'services.whatsapp.uid': phone },
			{
				$set: {
					'services.whatsapp.last_send_message_at': new Date(),
				},
			},
		);
	} catch (err) {
		const error = err as WABAErrorAPI;
		console.error(error.message);
	}
};
