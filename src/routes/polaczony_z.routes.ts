import express from 'express';
import { db } from '../db';
import { validatePortConnection } from '../validators/connection.validators';

const router = express.Router();

// CRUD dla tabeli POLACZONY_Z (połączenia między portami)
router.get('/', async (req, res) => {
  try {
    const [rows]: [any[], any] = await db.query('SELECT * FROM POLACZONY_Z');
    res.json(rows);
  } catch (error) {
    console.error('Błąd podczas pobierania połączeń portów:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania połączeń portów' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows]: [any[], any] = await db.query('SELECT * FROM POLACZONY_Z WHERE id_p_1 = ? OR id_p_2 = ?', [id, id]);
    res.json(rows);
  } catch (error) {
    console.error('Błąd podczas pobierania połączeń portu:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania połączeń portu' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id_p_1, id_p_2, max_predkosc } = req.body;
    
    // Walidacja podstawowa
    if (!id_p_1 || !id_p_2) {
      return res.status(400).json({ error: 'id_p_1 i id_p_2 są wymagane' });
    }

    // Walidacja połączenia
    const validationResult = await validatePortConnection(id_p_1, id_p_2, max_predkosc);
    if (!validationResult.isValid) {
      return res.status(400).json({ 
        error: 'Błędy walidacji połączenia', 
        details: validationResult.errors 
      });
    }

    await db.query('INSERT INTO POLACZONY_Z (id_p_1, id_p_2, max_predkosc) VALUES (?, ?, ?)', [id_p_1, id_p_2, max_predkosc]);
    res.status(201).json({ message: 'Połączenie portów dodane.' });
  } catch (error) {
    console.error('Błąd podczas dodawania połączenia portów:', error);
    res.status(500).json({ error: 'Błąd serwera podczas dodawania połączenia portów' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_p_1, id_p_2, max_predkosc } = req.body;
    
    // Walidacja podstawowa
    if (!id_p_1 || !id_p_2) {
      return res.status(400).json({ error: 'id_p_1 i id_p_2 są wymagane' });
    }

    // Walidacja połączenia (opcjonalnie można dodać dodatkowe sprawdzenia dla PUT)
    const validationResult = await validatePortConnection(id_p_1, id_p_2, max_predkosc);
    if (!validationResult.isValid) {
      return res.status(400).json({ 
        error: 'Błędy walidacji połączenia', 
        details: validationResult.errors 
      });
    }
    
    await db.query('UPDATE POLACZONY_Z SET id_p_1 = ?, id_p_2 = ?, max_predkosc = ? WHERE id_p_1 = ? OR id_p_2 = ?', [id_p_1, id_p_2, max_predkosc, id, id]);
    res.json({ message: 'Połączenie portów zaktualizowane.' });
  } catch (error) {
    console.error('Błąd podczas aktualizacji połączenia portów:', error);
    res.status(500).json({ error: 'Błąd serwera podczas aktualizacji połączenia portów' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM POLACZONY_Z WHERE id_p_1 = ? OR id_p_2 = ?', [id, id]);
    res.json({ message: 'Połączenie portów usunięte.' });
  } catch (error) {
    console.error('Błąd podczas usuwania połączenia portów:', error);
    res.status(500).json({ error: 'Błąd serwera podczas usuwania połączenia portów' });
  }
});

// DELETE połączenia portów na podstawie id_p_1 i id_p_2 (niezależnie od kolejności)
router.delete('/', async (req, res) => {
  const { id_p_1, id_p_2 } = req.body;
  if (!id_p_1 || !id_p_2) {
    return res.status(400).json({ error: 'Brak wymaganych parametrów id_p_1 lub id_p_2.' });
  }
  await db.query(
    'DELETE FROM POLACZONY_Z WHERE (id_p_1 = ? AND id_p_2 = ?) OR (id_p_1 = ? AND id_p_2 = ?)',
    [id_p_1, id_p_2, id_p_2, id_p_1]
  );
  res.json({ message: 'Połączenie portów usunięte.' });
});

export default router;
