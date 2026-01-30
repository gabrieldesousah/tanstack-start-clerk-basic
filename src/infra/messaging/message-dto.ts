import { ContactMessage, MessageType } from 'whatsapp-business';
import { z } from 'zod';

export type Author = {
	_id: string;
	type: string;
	attributes: {
		name: string;
		picture?: {
			url: string;
		};
	};
};

export type MessageDTO = {
	_id?: string;
	uid?: string;
	// event?: 'MESSAGE' | 'CALL';
	type:
		| MessageType
		| 'system'
		| 'unknown'
		| 'request_welcome'
		| 'button'
		| 'order';
	// provider?: 'WHATSAPP' | 'WEBCHAT' | 'INSTAGRAM';
	account_channel_uid: string;
	direction?: 'IN' | 'OUT' | 'SYSTEM';
	ack?: MessageACK;
	timestamp?: number;
	template?: Template;
	author?: Author;
	contact?: ContactDTO;
	context?: Context;
	preview?: Preview[];
	components?: Components;
	interactive?: Interactive[];
	metadata?: Metadata;
};

export interface ContactDTO {
	_id?: string;
	uid: string;
	profile?: {
		name: string;
	};
}

export const MessageACKList = z.enum([
	'AUDIO_LISTENED',
	'CREATED',
	'ERROR',
	'LEAVING',
	'QUEUED_BY_PROVIDER',
	'READ_BY_CLIENT',
	'RECEIVED_BY_CLIENT',
	'RECEIVED_BY_PROVIDER',
	'UNDEFINED',
	'UNKNOWN',
]);

export type MessageACK = z.infer<typeof MessageACKList>;

export type Template = {
	_id: string;
	key: string;
	status: string;
	message: string;
};

export type Context = {
	type: string;
	message?: MessageDTO;
	referral?: any;
};

export type Preview = {
	type: string;
	website?: {
		link: string;
	};
};

export type Interactive = {
	type: string;
	action: any;
};

export type Attachment = {
	type: MessageType;
	caption?: string;
	product?: Media;
	media?: Media;
	deprecated_media?: Media;
	document?: Media;
	link?: Media;
	video?: Media;
	image?: Media;
	sticker?: Media;
	audio?: Media;
	ptt?: Media;
	location?: Location;
	contact?: ContactMessage;
};

export type Media = {
	id?: string;
	url?: string;
	mime_type?: string;
	mimetype?: string;
	uploaded?: boolean;
	file_id?: string;
	caption?: string;
};

export type Location = {
	latitude: string;
	longitude: string;
	name?: string;
};

export type Components = {
	header?: {
		text: string;
		parameters?: Parameters[];
	};
	body?: {
		text: string;
		parameters?: Parameters[];
	};
	footer?: {
		text: string;
		parameters?: Parameters[];
	};
	attachments?: Attachment[];
};

export type Parameters = {
	type: string;
	text?: string;
	date_time?: string;
	currency?: string;
	variable?: string;
};

export type Metadata = {
	deprecated_customer_id?: number;
	deprecated_message_id?: number;
	direction: string;
	created_at: string;
	updated_at?: string;
};
