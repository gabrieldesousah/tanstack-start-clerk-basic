import { Meteor } from 'meteor/meteor';
import { WABAClient } from 'whatsapp-business';

export const WhatsAppClient = new WABAClient({
	accountId: Meteor.settings.whatsapp.wabaId,
	apiToken: Meteor.settings.whatsapp.apiToken,
	phoneId: Meteor.settings.whatsapp.phoneId,
});
