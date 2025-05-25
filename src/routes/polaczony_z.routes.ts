import express from 'express';
import { db } from '../db';

const router = express.Router();

// CRUD dla tabeli POLACZONY_Z (połączenia między portami)
router.get('/', async (req, res) => {
  const [rows]: [any[], any] = await db.query('SELECT * FROM POLACZONY_Z');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows]: [any[], any] = await db.query('SELECT * FROM POLACZONY_Z WHERE id_p_1 = ? OR id_p_2 = ?', [id, id]);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { id_p_1, id_p_2, max_predkosc } = req.body;
  await db.query('INSERT INTO POLACZONY_Z (id_p_1, id_p_2, max_predkosc) VALUES (?, ?, ?)', [id_p_1, id_p_2, max_predkosc]);
  res.status(201).json({ message: 'Połączenie portów dodane.' });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { id_p_1, id_p_2, max_predkosc } = req.body;
  await db.query('UPDATE POLACZONY_Z SET id_p_1 = ?, id_p_2 = ?, max_predkosc = ? WHERE id_p_1 = ? OR id_p_2 = ?', [id_p_1, id_p_2, max_predkosc, id, id]);
  res.json({ message: 'Połączenie portów zaktualizowane.' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM POLACZONY_Z WHERE id_p_1 = ? OR id_p_2 = ?', [id, id]);
  res.json({ message: 'Połączenie portów usunięte.' });
});

export default router;
