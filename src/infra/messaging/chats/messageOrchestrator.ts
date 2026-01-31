import { eq } from "drizzle-orm";
import {
  WebhookContact,
  WebhookMessage,
  WebhookMetadata,
} from "whatsapp-business";

import { db } from "~/db";
import { userProfiles } from "~/db/schema";

import { getLastSentMessage } from "~/infra/messaging/collections";
import { saveWhatsAppMessageAsGenericMessage } from "~/infra/messaging/methods";

export const receiveMessage = async (
  contact: WebhookContact,
  message: WebhookMessage,
  metadata: WebhookMetadata,
) => {
  const channel_uid = metadata.display_phone_number;
  console.log("received message in channel", channel_uid);

  const contact_uid = contact.wa_id;
  await updateLastReceivedMessageAt(contact_uid);

  const lastMessage = await verifyLastSentMessage(contact_uid);
  if (lastMessage === MessageInteractionTypes.OPEN_WINDOW) {
    // Check if the received message is a direct response to the CTA or fits another type
  }

  await saveWhatsAppMessageAsGenericMessage({
    account_channel_uid: metadata.display_phone_number,
    external_message_id: message.id,
    data: message,
    contact_uid: contact.wa_id,
    direction: "IN",
  });
};

export const MessageInteractionTypes = {
  OPEN_WINDOW: {
    label: "Open Window",
  },
  QUIZ: {
    label: "Quiz",
  },
  INTERACTION: {
    label: "Interaction",
  },
  ASK_FOR_TRANSLATION: {
    label: "Ask for Translation",
  },
};

const verifyLastSentMessage = async (contact_uid: string) => {
  const lastSentMessage = await getLastSentMessage(contact_uid);

  if (!lastSentMessage) {
    return;
  }

  console.log("last message sent", lastSentMessage);

  // Check if last message was a template and determine its type
  // (window opening, quiz, or interaction)

  return MessageInteractionTypes.OPEN_WINDOW;
};

const updateLastReceivedMessageAt = async (phone: string) => {
  const result = await db
    .update(userProfiles)
    .set({
      whatsappLastReceivedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.whatsappPhone, phone));

  if (!result) {
    return;
  }
};
