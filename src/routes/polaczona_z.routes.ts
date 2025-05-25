import express from 'express';
import { db } from '../db';

const router = express.Router();

// CRUD dla tabeli POLACZONA_Z (połączenia między kartami sieciowymi)
router.get('/', async (req, res) => {
  const [rows]: [any[], any] = await db.query('SELECT * FROM POLACZONA_Z');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows]: [any[], any] = await db.query('SELECT * FROM POLACZONA_Z WHERE id_k_1 = ? OR id_k_2 = ?', [id, id]);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { id_k_1, id_k_2, max_predkosc, pasmo } = req.body;
  await db.query('INSERT INTO POLACZONA_Z (id_k_1, id_k_2, max_predkosc, pasmo) VALUES (?, ?, ?, ?)', [id_k_1, id_k_2, max_predkosc, pasmo]);
  res.status(201).json({ message: 'Połączenie kart dodane.' });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { id_k_1, id_k_2, max_predkosc, pasmo } = req.body;
  await db.query('UPDATE POLACZONA_Z SET id_k_1 = ?, id_k_2 = ?, max_predkosc = ?, pasmo = ? WHERE id_k_1 = ? OR id_k_2 = ?', [id_k_1, id_k_2, max_predkosc, pasmo, id, id]);
  res.json({ message: 'Połączenie kart zaktualizowane.' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM POLACZONA_Z WHERE id_k_1 = ? OR id_k_2 = ?', [id, id]);
  res.json({ message: 'Połączenie kart usunięte.' });
});

export default router;
