import express from 'express';
import { db } from '../db';
import { validateWifiConnection } from '../validators/connection.validators';

const router = express.Router();

// CRUD dla tabeli POLACZONA_Z (połączenia między kartami sieciowymi)
router.get('/', async (req, res) => {
  try {
    const [rows]: [any[], any] = await db.query('SELECT * FROM POLACZONA_Z');
    res.json(rows);
  } catch (error) {
    console.error('Błąd podczas pobierania połączeń kart:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania połączeń kart' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows]: [any[], any] = await db.query('SELECT * FROM POLACZONA_Z WHERE id_k_1 = ? OR id_k_2 = ?', [id, id]);
    res.json(rows);
  } catch (error) {
    console.error('Błąd podczas pobierania połączeń karty:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania połączeń karty' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id_k_1, id_k_2, max_predkosc, pasmo } = req.body;
    
    // Walidacja połączenia kart WiFi
    const validationResult = await validateWifiConnection(id_k_1, id_k_2, max_predkosc, pasmo);
    
    if (!validationResult.isValid) {
      return res.status(400).json({
        error: 'Błędy walidacji',
        details: validationResult.errors
      });
    }
    
    await db.query('INSERT INTO POLACZONA_Z (id_k_1, id_k_2, max_predkosc, pasmo) VALUES (?, ?, ?, ?)', [id_k_1, id_k_2, max_predkosc, pasmo]);
    res.status(201).json({ message: 'Połączenie kart dodane.' });
  } catch (error) {
    console.error('Błąd podczas dodawania połączenia kart:', error);
    res.status(500).json({ error: 'Błąd serwera podczas dodawania połączenia kart' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_k_1, id_k_2, max_predkosc, pasmo } = req.body;
    
    // Walidacja połączenia kart WiFi
    const validationResult = await validateWifiConnection(id_k_1, id_k_2, max_predkosc, pasmo);
    
    if (!validationResult.isValid) {
      return res.status(400).json({
        error: 'Błędy walidacji',
        details: validationResult.errors
      });
    }
    
    await db.query('UPDATE POLACZONA_Z SET id_k_1 = ?, id_k_2 = ?, max_predkosc = ?, pasmo = ? WHERE id_k_1 = ? OR id_k_2 = ?', [id_k_1, id_k_2, max_predkosc, pasmo, id, id]);
    res.json({ message: 'Połączenie kart zaktualizowane.' });
  } catch (error) {
    console.error('Błąd podczas aktualizacji połączenia kart:', error);
    res.status(500).json({ error: 'Błąd serwera podczas aktualizacji połączenia kart' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM POLACZONA_Z WHERE id_k_1 = ? OR id_k_2 = ?', [id, id]);
    res.json({ message: 'Połączenie kart usunięte.' });
  } catch (error) {
    console.error('Błąd podczas usuwania połączenia kart:', error);
    res.status(500).json({ error: 'Błąd serwera podczas usuwania połączenia kart' });
  }
});

// DELETE połączenia kart na podstawie id_k_1 i id_k_2 (niezależnie od kolejności)
router.delete('/', async (req, res) => {
  try {
    const { id_k_1, id_k_2 } = req.body;
    if (!id_k_1 || !id_k_2) {
      return res.status(400).json({ error: 'Brak wymaganych parametrów id_k_1 lub id_k_2.' });
    }
    await db.query(
      'DELETE FROM POLACZONA_Z WHERE (id_k_1 = ? AND id_k_2 = ?) OR (id_k_1 = ? AND id_k_2 = ?)',
      [id_k_1, id_k_2, id_k_2, id_k_1]
    );
    res.json({ message: 'Połączenie kart usunięte.' });
  } catch (error) {
    console.error('Błąd podczas usuwania połączenia kart:', error);
    res.status(500).json({ error: 'Błąd serwera podczas usuwania połączenia kart' });
  }
});

export default router;
