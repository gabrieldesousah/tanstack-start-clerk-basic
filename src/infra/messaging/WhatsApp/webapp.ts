import bodyParser from 'body-parser';
import { WebApp } from 'meteor/webapp';

import { receiveMessage } from '/imports/infra/messaging/chats/messageOrchestrator';

WebApp.connectHandlers.use(bodyParser.json());

WebApp.handlers.post('/webhooks/whatsapp', async (req, res) => {
	const body = await req.body;
	const data = body.entry[0].changes[0].value;

	const contact = data.contacts[0];
	const message = data.messages[0];
	const metadata = data.metadata;

	await receiveMessage(contact, message, metadata);

	res.writeHead(200);
	res.end();
});
