import express from 'express';
import { db } from '../db';

const router = express.Router();

// CRUD dla tabeli URZADZENIA
router.get('/', async (req, res) => {
  const [rows]: [any[], any] = await db.query('SELECT * FROM URZADZENIA');
  res.json(rows);
});

router.get('/all-details', async (_req, res) => {
  try {
    const [urzadzenia]: [any[], any] = await db.query('SELECT * FROM URZADZENIA');

    const szczegoly = await Promise.all(
      urzadzenia.map(async (urzadzenie) => {
        const deviceId = urzadzenie.id_u;
        const [typRows]: [any[], any] = await db.query('SELECT * FROM TYPY_URZADZEN WHERE id_u = ?', [deviceId]);
        const typ = typRows[0] || null;
        const [porty]: [any[], any] = await db.query('SELECT * FROM PORTY WHERE id_u = ?', [deviceId]);
        const porty_z_polaczeniami = await Promise.all(
          (porty as any[]).map(async (port) => {
            const [polaczenia]: [any[], any] = await db.query('SELECT * FROM POLACZONY_Z WHERE id_p_1 = ? OR id_p_2 = ?', [port.id_p, port.id_p]);
            return {
              ...port,
              polaczenia_portu: polaczenia
            };
          })
        );
        const [karty_wifi]: [any[], any] = await db.query('SELECT * FROM KARTY_WIFI WHERE id_u = ?', [deviceId]);
        const karty_wifi_z_danymi = await Promise.all(
          (karty_wifi as any[]).map(async (karta) => {
            const [pasmoRows]: [any[], any] = await db.query('SELECT * FROM PASMO WHERE id_k = ?', [karta.id_k]);
            const pasmo = pasmoRows[0] || null;
            const [wersjaRows]: [any[], any] = await db.query('SELECT * FROM WERSJA_WIFI WHERE id_k = ?', [karta.id_k]);
            const wersja = wersjaRows[0] || null;
            const [predkoscRows]: [any[], any] = await db.query('SELECT * FROM PREDKOSC WHERE id_k = ?', [karta.id_k]);
            const predkosc = predkoscRows[0] || null;
            const [polaczenia]: [any[], any] = await db.query('SELECT * FROM POLACZONA_Z WHERE id_k_1 = ? OR id_k_2 = ?', [karta.id_k, karta.id_k]);
            return {
              ...karta,
              pasmo,
              wersja,
              predkosc,
              polaczenia_karty: polaczenia
            };
          })
        );
        const [macRows]: [any[], any] = await db.query('SELECT * FROM MAC_U WHERE id_u = ?', [deviceId]);
        const mac = macRows[0] || null;
        const [lokRows]: [any[], any] = await db.query('SELECT * FROM LOK_FIZ WHERE id_u = ?', [deviceId]);
        const lokalizacja = lokRows[0] || null;

        return {
          urzadzenie,
          typ,
          porty: porty_z_polaczeniami,
          karty_wifi: karty_wifi_z_danymi,
          mac,
          lokalizacja,
        };
      })
    );

    res.json(szczegoly);
  } catch (err) {
    console.error('Błąd przy pobieraniu szczegółów wszystkich urządzeń:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows]: [any[], any] = await db.query('SELECT * FROM URZADZENIA WHERE id_u = ?', [id]);
  res.json(rows[0] || null);
});

// GET /api/urzadzenia/:id — pobierz pełne dane urządzenia
router.get('/:id/all', async (req, res) => {
  const deviceId = req.params.id;

  try {
    const [urzadzeniaRows]: [any[], any] = await db.query('SELECT * FROM URZADZENIA WHERE id_u = ?', [deviceId]);
    const urzadzenie = urzadzeniaRows[0];
    if (!urzadzenie) return res.status(404).json({ error: 'Urządzenie nie istnieje' });

    const [typRows]: [any[], any] = await db.query('SELECT * FROM TYPY_URZADZEN WHERE id_u = ?', [deviceId]);
    const typ = typRows[0] || null;
    const [porty]: [any[], any] = await db.query('SELECT * FROM PORTY WHERE id_u = ?', [deviceId]);
    const [karty_wifi]: [any[], any] = await db.query('SELECT * FROM KARTY_WIFI WHERE id_u = ?', [deviceId]);

    // Pobierz porty wraz z połączeniami każdego portu
    const porty_z_polaczeniami = await Promise.all(
      (porty as any[]).map(async (port) => {
        const [polaczenia]: [any[], any] = await db.query('SELECT * FROM POLACZONY_Z WHERE id_p_1 = ? OR id_p_2 = ?', [port.id_p, port.id_p]);
        return {
          ...port,
          polaczenie_portu: polaczenia
        };
      })
    );

    // Pobierz dodatkowe informacje dla każdej karty WiFi oraz połączenia kart
    const karty_wifi_z_danymi = await Promise.all(
      (karty_wifi as any[]).map(async (karta) => {
        const [pasmoRows]: [any[], any] = await db.query('SELECT * FROM PASMO WHERE id_k = ?', [karta.id_k]);
        const pasmo = pasmoRows[0] || null;
        const [wersjaRows]: [any[], any] = await db.query('SELECT * FROM WERSJA_WIFI WHERE id_k = ?', [karta.id_k]);
        const wersja = wersjaRows[0] || null;
        const [predkoscRows]: [any[], any] = await db.query('SELECT * FROM PREDKOSC WHERE id_k = ?', [karta.id_k]);
        const predkosc = predkoscRows[0] || null;
        // Połączenia tej karty
        const [polaczenia]: [any[], any] = await db.query('SELECT * FROM POLACZONA_Z WHERE id_k_1 = ? OR id_k_2 = ?', [karta.id_k, karta.id_k]);
        return {
          ...karta,
          pasmo,
          wersja,
          predkosc,
          polaczenia_karty: polaczenia
        };
      })
    );

    const [macRows]: [any[], any] = await db.query('SELECT * FROM MAC_U WHERE id_u = ?', [deviceId]);
    const mac = macRows[0] || null;
    const [lokRows]: [any[], any] = await db.query('SELECT * FROM LOK_FIZ WHERE id_u = ?', [deviceId]);
    const lokalizacja = lokRows[0] || null;

    res.json({
      urzadzenie,
      typ,
      porty: porty_z_polaczeniami,
      karty_wifi: karty_wifi_z_danymi,
      mac,
      lokalizacja,
    });
  } catch (err) {
    console.error('Błąd przy pobieraniu danych urządzenia:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

router.post('/', async (req, res) => {
  const { nazwa_urzadzenia, ilosc_portow } = req.body;
  await db.query('INSERT INTO URZADZENIA (nazwa_urzadzenia, ilosc_portow) VALUES (?, ?)', [nazwa_urzadzenia, ilosc_portow]);
  res.status(201).json({ message: 'Urządzenie dodane.' });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nazwa_urzadzenia, ilosc_portow } = req.body;
  await db.query('UPDATE URZADZENIA SET nazwa_urzadzenia = ?, ilosc_portow = ? WHERE id_u = ?', [nazwa_urzadzenia, ilosc_portow, id]);
  res.json({ message: 'Urządzenie zaktualizowane.' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM URZADZENIA WHERE id_u = ?', [id]);
  res.json({ message: 'Urządzenie usunięte.' });
});

export default router;