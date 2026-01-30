import { Meteor } from 'meteor/meteor';
import { ContactMessage, Message, WebhookMessage } from 'whatsapp-business';

import { MessagesCollection } from '/imports/infra/messaging/collections';
import {
	Components,
	Context,
	Interactive,
	MessageDTO,
} from '/imports/infra/messaging/message-dto';

export async function getComponents(message: WebhookMessage | Message) {
	const components: Components = {};

	if (message.text) {
		components.body = { text: message.text.body };
	}

	if (message.image || message.sticker) {
		/**
		 * This is the content for image:
		 *  "image": {
		 *     "caption": "This is a caption",
		 *     "mime_type": "image/jpeg",
		 *     "sha256": "81d3bd8a8db4868c9520ed47186e8b7c5789e61ff79f7f834be6950b808a90d3",
		 *     "id": "2754859441498128"
		 * 	}
		 * 	It don't have a URL, so we need to get the image from the API and just then save it
		 */
		// components.attachments =
	}

	if (message.interactive?.body) {
		components.body = message.interactive.body;
	}

	if (message?.contacts) {
		components.attachments = message.contacts.map((contact: ContactMessage) => {
			return {
				type: 'contacts',
				contact: contact,
			};
		});
	}

	return components;
}

export async function getContext(message: WebhookMessage | Message) {
	const context = {};

	if (message?.referral) {
		context.type = 'post';
		context.referral = message?.referral;
	}

	if (!Object.values(context).length) return;

	return context as Context;
}

export async function getInteractive(message: WebhookMessage | Message) {
	const interactive: any = [];

	if (
		message?.interactive &&
		'type' in message.interactive &&
		'action' in message.interactive
	) {
		interactive[0] = {
			type: message.interactive.type,
			action: message.interactive.action,
		};
	}

	if (!interactive.length) return;

	return interactive as Interactive[];
}

export async function saveWhatsAppMessageAsGenericMessage({
	data,
	contact_uid,
	external_message_id,
	account_channel_uid,
	active_message_type,
	direction,
}: {
	data: WebhookMessage | Message;
	contact_uid: string;
	external_message_id: string;
	account_channel_uid: string;
	active_message_type?:
		| 'QUIZ'
		| 'INTERACTION'
		| 'ASK_FOR_TRANSLATION'
		| 'OPEN_WINDOW';
	direction: 'IN' | 'OUT' | 'SYSTEM';
}) {
	console.log('external_message_id', external_message_id);
	// Save the message to the database
	const message: MessageDTO = {
		uid: external_message_id,
		account_channel_uid,
		type: data.type,
		active_message_type,
		direction,
		contact: {
			uid: contact_uid,
		},
		context: await getContext(data),
		components: await getComponents(data),
		interactive: await getInteractive(data),
	};

	await MessagesCollection.insertAsync(message);
}

Meteor.methods({
	'words.saveWhatsAppMessage': saveWhatsAppMessageAsGenericMessage,
});
