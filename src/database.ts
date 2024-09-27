import {Pool} from 'pg';
import {config} from 'dotenv';

config();

const pool = new Pool({
	user: process.env.POSTGRES_USER,
	host: process.env.POSTGRES_HOST ?? '0.0.0.0',
	database: process.env.POSTGRES_DB,
	password: process.env.POSTGRES_PASSWORD,
	port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
});

export async function connectToDb(): Promise<void> {
	console.log('Connecting to the database... host: ' + process.env.POSTGRES_HOST);
	try {
		const client = await pool.connect();
		console.log('Connected to the database');
		client.release();
	} catch (err) {
		console.error('Error connecting to the database', err);
		process.exit(1);
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

	const query = `
		INSERT INTO conversations 
		(id, owner_id, created_at, phone_number, conversation_name)
		VALUES ($1, $2, $3, $4, $5)
	  `;
	const values = [id, ownerId, createdAt, phoneNumber, ''];

	await pool.query(query, values);
	console.log(`Conversation with ID ${id} created successfully.`);
}

export async function createMessage(
	conversationId: string,
	text: string,
	isUser: boolean,
	ownerId: number,
	createdAt: Date,
): Promise<void> {
	const query = `
	INSERT INTO messages (conversation_id, message_content, is_user, owner_id, created_at)
	VALUES ($1, $2, $3, $4, $5)
  `;
	const values = [conversationId, text, isUser, ownerId, createdAt];

	await pool.query(query, values);
	console.log('Message created successfully.');
}

async function isConversationCreated(conversationId: string): Promise<boolean> {
	const query = 'SELECT COUNT(1) FROM conversations WHERE id = $1';
	const result = await pool.query(query, [conversationId]);

	return result.rows[0].count > 0;
}
