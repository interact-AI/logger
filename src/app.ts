import {
	type ProcessErrorArgs,
	ServiceBusClient,
	type ServiceBusMessage,
	type ServiceBusReceiver,
} from '@azure/service-bus';
import processMessage from './process_message';
import type InfoPackage from './models/info_package';

const connectionString = process.env.QUEUE_CON_STRING!;

const queueName = process.env.QUEUE_NAME!;

async function main(): Promise<void> {
	const serviceBusClient = new ServiceBusClient(
		connectionString,
	);

	const serviceBusReceiver: ServiceBusReceiver
		= serviceBusClient.createReceiver(queueName);

	const myMessageHandler = async (
		messageReceived: ServiceBusMessage,
	): Promise<void> => {
		console.log(`Received body: ${JSON.stringify(messageReceived.body)}`);
		if (messageReceived.body === undefined) {
			return;
		}

		const isBodyList = Array.isArray(messageReceived.body);
		if (isBodyList) {
			for (const message of messageReceived.body as InfoPackage[]) {
				// eslint-disable-next-line no-await-in-loop
				await processMessage(message);
			}

			return;
		}

		await processMessage(messageReceived.body as InfoPackage);
	};

	const myErrorHandler = async (error: ProcessErrorArgs): Promise<void> => {
		console.log(error);
	};

	serviceBusReceiver.subscribe({
		processMessage: myMessageHandler,
		processError: myErrorHandler,
	});
	console.log('Listening for messages...');
}

main().catch((err: Error) => {
	console.log('Error occurred: ', err);
	process.exit(1);
});
