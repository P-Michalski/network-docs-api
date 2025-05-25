import express from 'express';
import { db } from '../db';

const router = express.Router();

// CRUD dla tabeli TYPY_URZADZEN
router.get('/', async (req, res) => {
  const [rows]: [any[], any] = await db.query('SELECT * FROM TYPY_URZADZEN');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows]: [any[], any] = await db.query('SELECT * FROM TYPY_URZADZEN WHERE id_typu = ?', [id]);
  res.json(rows[0] || null);
});

router.post('/', async (req, res) => {
  const { typ_u, id_u } = req.body;
  await db.query('INSERT INTO TYPY_URZADZEN (typ_u, id_u) VALUES (?, ?)', [typ_u, id_u]);
  res.status(201).json({ message: 'Typ urządzenia dodany.' });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { typ_u, id_u } = req.body;
  await db.query('UPDATE TYPY_URZADZEN SET typ_u = ?, id_u = ? WHERE id_typu = ?', [typ_u, id_u, id]);
  res.json({ message: 'Typ urządzenia zaktualizowany.' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM TYPY_URZADZEN WHERE id_typu = ?', [id]);
  res.json({ message: 'Typ urządzenia usunięty.' });
});

export default router;
