import { Mongo } from 'meteor/mongo';

export interface WhatsAppTemplates {
	_id?: string;
	name: string;
	type: 'review' | 'discovery' | 'reminder';
	status: 'APPROVED' | 'REJECTED' | 'PENDING';
	category: 'UTILITY' | 'MARKETING';
	language: 'en' | 'pt_BR';
	components: any;
	variables?: string[];
}

export const WhatsAppTemplatesCollection = new Mongo.Collection<
	WhatsAppTemplates,
	WhatsAppTemplates
>('whatsapp_templates');
