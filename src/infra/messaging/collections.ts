import { Mongo } from 'meteor/mongo';

import { MessageDTO } from '/imports/infra/messaging/message-dto';

export const MessagesCollection = new Mongo.Collection<MessageDTO, MessageDTO>(
	'messages',
);
