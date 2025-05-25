import express from 'express';
import { db } from '../db';

const router = express.Router();

// CRUD dla tabeli PORTY
router.get('/', async (req, res) => {
  const [rows]: [any[], any] = await db.query('SELECT * FROM PORTY');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows]: [any[], any] = await db.query('SELECT * FROM PORTY WHERE id_p = ?', [id]);
  res.json(rows[0] || null);
});

router.post('/', async (req, res) => {
  const { nazwa, status, id_u } = req.body;
  await db.query('INSERT INTO PORTY (nazwa, status, id_u) VALUES (?, ?, ?)', [nazwa, status, id_u]);
  res.status(201).json({ message: 'Port dodany.' });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nazwa, status, id_u } = req.body;
  await db.query('UPDATE PORTY SET nazwa = ?, status = ?, id_u = ? WHERE id_p = ?', [nazwa, status, id_u, id]);
  res.json({ message: 'Port zaktualizowany.' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM PORTY WHERE id_p = ?', [id]);
  res.json({ message: 'Port usunięty.' });
});

export default router;
