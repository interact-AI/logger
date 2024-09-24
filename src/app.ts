import express from 'express';
import processMessage from './process_message';
import type InfoPackage from './models/info_package';
import {connectToDb} from './database';
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/messages', async (req, res) => {
	try {
		const bodyData = req.body as InfoPackage;
		console.log('Processing message...');
		await processMessage(bodyData);
		res.send('Message processed');
	} catch (e) {
		res.status(500).send(e.message);
	}
});

app.get('/status', (req, res) => {
	res.send('Server is running');
});

app.listen(port, async () => {
	console.log(`Expasync ress is listening at http://localhost:${port}`);
	await connectToDb();
});
