import express from 'express';

const app = express();

app.get('/', (req, res) => res.send('SiPelMasD backend berjalan!'));

app.listen(4000, () => console.log('Server on http://localhost:4000'));
