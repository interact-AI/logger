import express from 'express';
const app = express();
const port = 3000;

function pedro(hola) {
	console.log(hola);
}

app.get('/', (req, res) => {
	res.send('Hello World!');

	pedro('hola');
});

app.listen(port, () => {
	console.log(`Express is listening at http://localhost:${port}`);
});
