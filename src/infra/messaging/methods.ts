import { ContactMessage, Message, WebhookMessage } from "whatsapp-business";

import { createMessage, type NewMessage } from "~/infra/messaging/collections";
import {
  Components,
  Context,
  Interactive,
} from "~/infra/messaging/message-dto";

export async function getComponents(
  message: WebhookMessage | Message,
): Promise<Components> {
  const components: Components = {};

  if (message.text) {
    components.body = { text: message.text.body };
  }

  if (message.image || message.sticker) {
    // Image content handling would go here
    // Note: WhatsApp API returns image ID, need to fetch URL separately
  }

  if (message.interactive?.body) {
    components.body = message.interactive.body;
  }

  if (message?.contacts) {
    components.attachments = message.contacts.map((contact: ContactMessage) => {
      return {
        type: "contacts" as const,
        contact: contact,
      };
    });
  }

  return components;
}

export async function getContext(
  message: WebhookMessage | Message,
): Promise<Context | undefined> {
  const context: Partial<Context> = {};

  if (message?.referral) {
    context.type = "post";
    context.referral = message?.referral;
  }

  if (!Object.values(context).length) return;

  return context as Context;
}

export async function getInteractive(
  message: WebhookMessage | Message,
): Promise<Interactive[] | undefined> {
  const interactive: Interactive[] = [];

  if (
    message?.interactive &&
    "type" in message.interactive &&
    "action" in message.interactive
  ) {
    interactive[0] = {
      type: message.interactive.type,
      action: message.interactive.action,
    };
  }

  if (!interactive.length) return;

  return interactive;
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
    | "QUIZ"
    | "INTERACTION"
    | "ASK_FOR_TRANSLATION"
    | "OPEN_WINDOW";
  direction: "IN" | "OUT" | "SYSTEM";
}) {
  console.log("external_message_id", external_message_id);

  const context = await getContext(data);
  const components = await getComponents(data);
  const interactive = await getInteractive(data);

  const message: NewMessage = {
    uid: external_message_id,
    accountChannelUid: account_channel_uid,
    type: data.type,
    activeMessageType: active_message_type,
    direction,
    contactUid: contact_uid,
    context: context,
    components: components,
    interactive: interactive,
  };

  await createMessage(message);
}
