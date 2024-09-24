import express from 'express';
import processMessage from './process_message';
import type InfoPackage from './models/info_package';
const app = express();
const port = 3000;

app.post('/message', async (req, res) => {
	try {
		const bodyData = req.body as InfoPackage;
		await processMessage(bodyData);
		res.send('Message processed');
	} catch (e) {
		res.status(500).send(e.message);
	}
});

app.get('/status', (req, res) => {
	res.send('Server is running');
});

app.listen(port, () => {
	console.log(`Express is listening at http://localhost:${port}`);
});
