import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import urzadzeniaRoutes from './routes/urzadzenia.routes';
import typyUrzadzenRoutes from './routes/typy_urzadzen.routes';
import portyRoutes from './routes/porty.routes';
import kartyWifiRoutes from './routes/karty_wifi.routes';
import polaczonyZRoutes from './routes/polaczony_z.routes';
import polaczonaZRoutes from './routes/polaczona_z.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/urzadzenia', urzadzeniaRoutes);
app.use('/api/typy_urzadzen', typyUrzadzenRoutes);
app.use('/api/porty', portyRoutes);
app.use('/api/karty_wifi', kartyWifiRoutes);
app.use('/api/polaczony_z', polaczonyZRoutes);
app.use('/api/polaczona_z', polaczonaZRoutes);

app.get('/', (_req, res) => {
  res.send('API działa!');
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});