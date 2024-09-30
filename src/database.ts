/* eslint-disable guard-for-in */
import {connect, type ConnectionPool, type IResult} from 'mssql';
import {config} from 'dotenv';

config();

let pool: ConnectionPool;

export async function connectToDb(): Promise<void> {
	console.log(`Connecting to the database... host: 
		${process.env.DB_CONN_STRING?.split(';')[1].split('=')[1]}`,
	);

	try {
		const localPool = await connect(process.env.DB_CONN_STRING!);
		await localPool.connect();
		pool = localPool;
		console.log('Connected to Azure SQL Database');
	} catch (error) {
		console.error('Failed to connect to Azure SQL Database:', error);
	}
}

export async function createIfNotExitsConversation(
	id: string,
	ownerId: number,
	createdAt: Date,
	phoneNumber: string,
): Promise<void> {
	const isCreated = await isConversationCreated(id);
	if (isCreated) {
		console.log(`Conversation with ID ${id} already exists.`);
		return;
	}

	console.log('Creating conversation...');

	const query = `
		INSERT INTO conversations 
		(id, owner_id, created_at, phone_number, conversation_name)
		VALUES (@id, @ownerId, @createdAt, @phoneNumber, @conversationName)
	  `;
	const values = {
		id, ownerId, createdAt, phoneNumber, conversationName: '',
	};

	await executeQuery(query, values);
	console.log(`Conversation with ID ${id} created successfully.`);
}

export async function createMessage(
	conversationId: string,
	messageContent: string,
	isUser: boolean,
	ownerId: number,
	createdAt: Date,
): Promise<void> {
	const query = `
	INSERT INTO messages (conversation_id, message_content, is_user, owner_id, created_at)
	VALUES (@conversationId, @messageContent, @isUser, @ownerId, @createdAt)
  `;
	const values = {
		conversationId, messageContent, isUser, ownerId, createdAt,
	};

	await executeQuery(query, values);
	console.log('Message created successfully.');
}

async function isConversationCreated(conversationId: string): Promise<boolean> {
	const query = 'SELECT * FROM conversations WHERE id = @conversationId';
	const result = await executeQuery(query, {conversationId});
	return result.recordset.length > 0;
}

async function executeQuery(query: string, params: Record<string, any>):
Promise<IResult<any>> {
	const request = pool.request();

	for (const param in params) {
		request.input(param, params[param]);
	}

	const result = await request.query(query);
	return result;
}
