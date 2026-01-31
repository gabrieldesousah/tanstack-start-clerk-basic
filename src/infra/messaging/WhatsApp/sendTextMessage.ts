import { eq } from "drizzle-orm";
import { WABAErrorAPI } from "whatsapp-business";

import { db } from "~/db";
import { userProfiles } from "~/db/schema";

import { WhatsAppClient } from "~/infra/messaging/WhatsApp/config";

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
      type: "text",
      text: { body: text },
    });

    console.log("res", res);

    await db
      .update(userProfiles)
      .set({
        whatsappLastSentAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.whatsappPhone, phone));
  } catch (err) {
    const error = err as WABAErrorAPI;
    console.error(error.message);
  }
};
