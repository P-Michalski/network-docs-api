import express from 'express';
import { db } from '../db';

const router = express.Router();

// CRUD dla tabeli KARTY_WIFI
router.get('/', async (req, res) => {
  const [rows]: [any[], any] = await db.query('SELECT * FROM KARTY_WIFI');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows]: [any[], any] = await db.query('SELECT * FROM KARTY_WIFI WHERE id_k = ?', [id]);
  res.json(rows[0] || null);
});

router.post('/', async (req, res) => {
  const { nazwa, status, id_u } = req.body;
  await db.query('INSERT INTO KARTY_WIFI (nazwa, status, id_u) VALUES (?, ?, ?)', [nazwa, status, id_u]);
  res.status(201).json({ message: 'Karta WiFi dodana.' });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nazwa, status, id_u } = req.body;
  await db.query('UPDATE KARTY_WIFI SET nazwa = ?, status = ?, id_u = ? WHERE id_k = ?', [nazwa, status, id_u, id]);
  res.json({ message: 'Karta WiFi zaktualizowana.' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM KARTY_WIFI WHERE id_k = ?', [id]);
  res.json({ message: 'Karta WiFi usunięta.' });
});

export default router;
