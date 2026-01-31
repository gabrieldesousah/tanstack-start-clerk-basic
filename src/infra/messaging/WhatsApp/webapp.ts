// WhatsApp webhook handler
// This file should be imported as an API route in TanStack Start
// Create a route at: src/routes/api/webhooks/whatsapp.ts

import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";

import { receiveMessage } from "~/infra/messaging/chats/messageOrchestrator";

// Webhook verification for WhatsApp (GET request)
async function handleGet(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    console.log("WhatsApp webhook verified");
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

// Incoming message handler (POST request)
async function handlePost(request: Request) {
  try {
    const body = await request.json();

    // Check if this is a valid WhatsApp webhook payload
    if (!body.entry?.[0]?.changes?.[0]?.value) {
      return json({ error: "Invalid payload" }, { status: 400 });
    }

    const data = body.entry[0].changes[0].value;

    // Only process if there are messages
    if (data.messages && data.contacts) {
      const contact = data.contacts[0];
      const message = data.messages[0];
      const metadata = data.metadata;

      await receiveMessage(contact, message, metadata);
    }

    return json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}

// Export handlers for use in the API route
export const whatsappWebhookHandlers = {
  GET: handleGet,
  POST: handlePost,
};

// API Route definition for TanStack Start
// Copy this to: src/routes/api/webhooks/whatsapp.ts
/*
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { whatsappWebhookHandlers } from "~/infra/messaging/WhatsApp/webapp";

export const APIRoute = createAPIFileRoute("/api/webhooks/whatsapp")({
  GET: ({ request }) => whatsappWebhookHandlers.GET(request),
  POST: ({ request }) => whatsappWebhookHandlers.POST(request),
});
*/
