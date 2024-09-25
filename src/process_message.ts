import {createIfNotExitsConversation, createMessage} from './database';
import type InfoPackage from './models/info_package';

export default async function processMessage(data: InfoPackage): Promise<void> {
	console.log('Creating conversation...');
	const parseDate = new Date(data.timeStamp * 1000);
	await createIfNotExitsConversation(data.conversationId,
		data.ownerId,
		parseDate,
		data.phoneNumber);
	console.log('Creating message for user...');
	await createMessage(data.conversationId,
		data.message,
		true,
		data.ownerId,
		new Date(data.timeStamp * 1000));
	console.log('Creating message for bot...');
	await createMessage(data.conversationId,
		data.response,
		false,
		data.ownerId,
		new Date(data.timeStamp * 1000));
}

