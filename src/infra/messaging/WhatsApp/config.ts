import { WABAClient } from "whatsapp-business";

if (
  !process.env.WHATSAPP_WABA_ID ||
  !process.env.WHATSAPP_API_TOKEN ||
  !process.env.WHATSAPP_PHONE_ID
) {
  console.warn(
    "WhatsApp credentials not configured. Set WHATSAPP_WABA_ID, WHATSAPP_API_TOKEN, and WHATSAPP_PHONE_ID environment variables.",
  );
}

export const whatsappConfig = {
  wabaId: process.env.WHATSAPP_WABA_ID || "",
  apiToken: process.env.WHATSAPP_API_TOKEN || "",
  phoneId: process.env.WHATSAPP_PHONE_ID || "",
  phoneNumber: process.env.WHATSAPP_PHONE_NUMBER || "",
};

export const WhatsAppClient = new WABAClient({
  accountId: whatsappConfig.wabaId,
  apiToken: whatsappConfig.apiToken,
  phoneId: whatsappConfig.phoneId,
});
