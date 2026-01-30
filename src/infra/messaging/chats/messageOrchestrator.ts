import { Meteor } from 'meteor/meteor';
import {
	WebhookContact,
	WebhookMessage,
	WebhookMetadata,
} from 'whatsapp-business';

import { MessagesCollection } from '/imports/infra/messaging/collections';
import { saveWhatsAppMessageAsGenericMessage } from '/imports/infra/messaging/methods';

export const receiveMessage = async (
	contact: WebhookContact,
	message: WebhookMessage,
	metadata: WebhookMetadata,
) => {
	const channel_uid = metadata.display_phone_number;
	console.log('received message in channel', channel_uid);

	const contact_uid = contact.wa_id;
	await updateLastReceivedMessageAt(contact_uid);

	const lastMessage = await verifyLastSentMessage(contact_uid);
	if (lastMessage == MessageInteractionTypes.OPEN_WINDOW) {
		// 	Verificar se a mensagem recebida é diretamente uma resposta ao CTA ou encaixa em outro tipo
	}

	await saveWhatsAppMessageAsGenericMessage({
		account_channel_uid: metadata.display_phone_number,
		external_message_id: message.id,
		data: message,
		contact_uid: contact.wa_id,
		direction: 'IN',
	});
};

export const MessageInteractionTypes = {
	OPEN_WINDOW: {
		label: 'Open Window',
	},
	QUIZ: {
		label: 'Quiz',
	},
	INTERACTION: {
		label: 'Interaction',
	},
	ASK_FOR_TRANSLATION: {
		label: 'Ask for Translation',
	},
};

const verifyLastSentMessage = async (contact_uid: string) => {
	const lastSentMessage = await MessagesCollection.findOneAsync(
		{
			'contact.uid': contact_uid,
			'direction': 'OUT',
		},
		{
			sort: { timestamp: 1 },
		},
	);

	if (!lastSentMessage) {
		return;
	}

	console.log('last message sent', lastSentMessage);

	/**
	 * Devo verificar se a última mensagem foi um template (Importante registrar a mensagem com essa informação na hora do envio)
	 * - O tipo do template (abertura da janela de conversação, um quiz ou uma interação)
	 *
	 * Por esta razão, é melhor usar a Poli message do que replicar a mensagem do whatsapp
	 *
	 */

	return MessageInteractionTypes.OPEN_WINDOW;
};

const updateLastReceivedMessageAt = async (phone: string) => {
	const update_user = await Meteor.users.updateAsync(
		{ 'services.whatsapp.uid': phone },
		{
			$set: {
				'services.whatsapp.lastReceivedMessageAt': new Date(),
			},
		},
	);
	if (!update_user) {
		return;
	}
};
