import express from 'express';
import { db } from '../db';
import { validateDevice } from '../validators/device.validators';

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
        const [porty]: [any[], any] = await db.query('SELECT * FROM PORTY WHERE id_u = ?', [deviceId]);        const porty_z_polaczeniami = await Promise.all(
          (porty as any[]).map(async (port) => {
            const [polaczenia]: [any[], any] = await db.query('SELECT * FROM POLACZONY_Z WHERE id_p_1 = ? OR id_p_2 = ?', [port.id_p, port.id_p]);
            const [predkoscPortu]: [any[], any] = await db.query('SELECT * FROM PREDKOSC_P WHERE id_p = ?', [port.id_p]);
            return {
              ...port,
              predkosc_portu: predkoscPortu[0] || null,
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
            const [predkoscRows]: [any[], any] = await db.query('SELECT * FROM PREDKOSC_K WHERE id_k = ?', [karta.id_k]);
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
    const [karty_wifi]: [any[], any] = await db.query('SELECT * FROM KARTY_WIFI WHERE id_u = ?', [deviceId]);    // Pobierz porty wraz z połączeniami każdego portu
    const porty_z_polaczeniami = await Promise.all(
      (porty as any[]).map(async (port) => {
        const [polaczenia]: [any[], any] = await db.query('SELECT * FROM POLACZONY_Z WHERE id_p_1 = ? OR id_p_2 = ?', [port.id_p, port.id_p]);
        const [predkoscPortu]: [any[], any] = await db.query('SELECT * FROM PREDKOSC_P WHERE id_p = ?', [port.id_p]);        return {
          ...port,
          predkosc_portu: predkoscPortu[0] || null,
          polaczenia_portu: polaczenia
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
        const [predkoscRows]: [any[], any] = await db.query('SELECT * FROM PREDKOSC_K WHERE id_k = ?', [karta.id_k]);
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
  try {
    const { nazwa_urzadzenia, ilosc_portow } = req.body;
    await db.query('INSERT INTO URZADZENIA (nazwa_urzadzenia, ilosc_portow) VALUES (?, ?)', [nazwa_urzadzenia, ilosc_portow]);
    res.status(201).json({ message: 'Urządzenie dodane.' });
  } catch (error) {
    console.error('Błąd podczas dodawania urządzenia:', error);
    res.status(500).json({ error: 'Błąd serwera podczas dodawania urządzenia' });
  }
});

router.post('/full', async (req, res) => {
  try {
    console.log('=== DEBUG POST /full ===');
    console.log('req.body:', JSON.stringify(req.body, null, 2));
    console.log('req.headers["content-type"]:', req.headers['content-type']);
    console.log('req.body type:', typeof req.body);
    console.log('req.body keys:', Object.keys(req.body || {}));
    
    const deviceData = req.body;
    console.log('deviceData:', deviceData);
    console.log('deviceData.urzadzenie:', deviceData.urzadzenie);
    console.log('deviceData.typ:', deviceData.typ);

    // Walidacja danych
    const validationResult = validateDevice(deviceData);
    console.log('validationResult:', validationResult);
    
    if (!validationResult.isValid) {
      console.log('Walidacja NIEUDANA:', validationResult.errors);
      return res.status(400).json({ 
        error: 'Błędy walidacji', 
        details: validationResult.errors 
      });
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Dodaj urządzenie
      const [urzadzenieResult]: any = await conn.query(
        'INSERT INTO URZADZENIA (nazwa_urzadzenia, ilosc_portow) VALUES (?, ?)',
        [deviceData.urzadzenie.nazwa_urzadzenia, deviceData.urzadzenie.ilosc_portow || 0]
      );
      const id_u = urzadzenieResult.insertId;

      // Dodaj typ urządzenia
      if (deviceData.typ && deviceData.typ.typ_u) {
        await conn.query(
          'INSERT INTO TYPY_URZADZEN (typ_u, id_u) VALUES (?, ?)',
          [deviceData.typ.typ_u, id_u]
        );
      }

      // Dodaj porty
      if (Array.isArray(deviceData.porty)) {
        for (const port of deviceData.porty) {
          if (!port) continue;
          
          const [portResult]: any = await conn.query(
            'INSERT INTO PORTY (nazwa, status, typ, id_u) VALUES (?, ?, ?, ?)',
            [port.nazwa, port.status, port.typ, id_u]
          );
          const id_p = portResult.insertId;
          
          // Dodaj prędkość portu
          if (port.predkosc_portu) {
            let predkosc = null;
            if (typeof port.predkosc_portu === 'object' && port.predkosc_portu.predkosc) {
              predkosc = port.predkosc_portu.predkosc;
            } else if (typeof port.predkosc_portu === 'string') {
              predkosc = port.predkosc_portu;
            }
            
            if (predkosc) {
              await conn.query(
                'INSERT INTO PREDKOSC_P (id_p, predkosc) VALUES (?, ?)',
                [id_p, predkosc]
              );
            }
          }
        }
      }

      // Dodaj karty wifi i ich szczegóły
      if (Array.isArray(deviceData.karty_wifi)) {
        for (const karta of deviceData.karty_wifi) {
          if (!karta) continue;
          
          const [kartaResult]: any = await conn.query(
            'INSERT INTO KARTY_WIFI (nazwa, status, id_u) VALUES (?, ?, ?)',
            [karta.nazwa, karta.status, id_u]
          );
          const id_k = kartaResult.insertId;

          // Pasmo - normalizuj wartości z frontendu
          if (karta.pasmo) {
            const pasmo24 = !!(Number(karta.pasmo.pasmo24GHz) || karta.pasmo.pasmo24GHz === true) ? 1 : 0;
            const pasmo5 = !!(Number(karta.pasmo.pasmo5GHz) || karta.pasmo.pasmo5GHz === true) ? 1 : 0;
            const pasmo6 = !!(Number(karta.pasmo.pasmo6GHz) || karta.pasmo.pasmo6GHz === true) ? 1 : 0;
            
            await conn.query(
              'INSERT INTO PASMO (id_k, pasmo24GHz, pasmo5GHz, pasmo6GHz) VALUES (?, ?, ?, ?)',
              [id_k, pasmo24, pasmo5, pasmo6]
            );
          }
          
          // Wersja - obsłuż różne struktury z frontendu
          if (karta.wersja) {
            let wersja = null;
            if (typeof karta.wersja === 'object' && karta.wersja.wersja) {
              wersja = karta.wersja.wersja;
            } else if (typeof karta.wersja === 'string') {
              wersja = karta.wersja;
            }
            
            if (wersja) {
              await conn.query(
                'INSERT INTO WERSJA_WIFI (id_k, wersja) VALUES (?, ?)',
                [id_k, wersja]
              );
            }
          }
          
          // Prędkość - obsłuż różne struktury z frontendu
          if (karta.predkosc) {
            let predkosc = null;
            if (typeof karta.predkosc === 'object' && karta.predkosc.predkosc) {
              predkosc = karta.predkosc.predkosc;
            } else if (typeof karta.predkosc === 'number') {
              predkosc = karta.predkosc;
            }
            
            if (predkosc) {
              await conn.query(
                'INSERT INTO PREDKOSC_K (id_k, predkosc) VALUES (?, ?)',
                [id_k, predkosc]
              );
            }
          }
        }
      }

      // Dodaj MAC
      if (deviceData.mac && deviceData.mac.MAC) {
        await conn.query(
          'INSERT INTO MAC_U (id_u, MAC) VALUES (?, ?)',
          [id_u, deviceData.mac.MAC]
        );
      }
      
      // Dodaj lokalizację
      if (deviceData.lokalizacja && deviceData.lokalizacja.miejsce) {
        await conn.query(
          'INSERT INTO LOK_FIZ (id_u, miejsce, szafa, rack) VALUES (?, ?, ?, ?)',
          [id_u, deviceData.lokalizacja.miejsce, deviceData.lokalizacja.szafa || '', deviceData.lokalizacja.rack || '']
        );
      }

      await conn.commit();
      res.status(201).json({ 
        message: 'Urządzenie z detalami dodane.',
        id_u: id_u
      });
    } catch (err) {
      await conn.rollback();
      console.error('Błąd przy dodawaniu urządzenia z detalami:', err);
      res.status(500).json({ 
        error: 'Błąd serwera podczas dodawania urządzenia',
        details: err instanceof Error ? err.message : 'Nieznany błąd'
      });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Błąd w endpoincie POST /full:', err);
    res.status(500).json({ 
      error: 'Błąd serwera',
      details: err instanceof Error ? err.message : 'Nieznany błąd'
    });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nazwa_urzadzenia, ilosc_portow } = req.body;
    await db.query('UPDATE URZADZENIA SET nazwa_urzadzenia = ?, ilosc_portow = ? WHERE id_u = ?', [nazwa_urzadzenia, ilosc_portow, id]);
    res.json({ message: 'Urządzenie zaktualizowane.' });
  } catch (error) {
    console.error('Błąd podczas aktualizacji urządzenia:', error);
    res.status(500).json({ error: 'Błąd serwera podczas aktualizacji urządzenia' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Usuń wszystkie powiązane dane w prawidłowej kolejności
      
      // 1. Usuń połączenia portów i prędkości portów PRZED usunięciem portów
      const [porty]: [any[], any] = await conn.query('SELECT id_p FROM PORTY WHERE id_u = ?', [id]);
      for (const port of porty) {
        // Usuń połączenia portów
        await conn.query('DELETE FROM POLACZONY_Z WHERE id_p_1 = ? OR id_p_2 = ?', [port.id_p, port.id_p]);
        // Usuń prędkości portów
        await conn.query('DELETE FROM PREDKOSC_P WHERE id_p = ?', [port.id_p]);
      }
      // Teraz usuń porty
      await conn.query('DELETE FROM PORTY WHERE id_u = ?', [id]);

      // 2. Usuń połączenia kart wifi i dane kart PRZED usunięciem kart
      const [karty]: [any[], any] = await conn.query('SELECT id_k FROM KARTY_WIFI WHERE id_u = ?', [id]);
      for (const karta of karty) {
        // Usuń połączenia kart wifi
        await conn.query('DELETE FROM POLACZONA_Z WHERE id_k_1 = ? OR id_k_2 = ?', [karta.id_k, karta.id_k]);
        // Usuń dane kart wifi
        await conn.query('DELETE FROM PASMO WHERE id_k = ?', [karta.id_k]);
        await conn.query('DELETE FROM WERSJA_WIFI WHERE id_k = ?', [karta.id_k]);
        await conn.query('DELETE FROM PREDKOSC_K WHERE id_k = ?', [karta.id_k]);
      }
      // Teraz usuń karty wifi
      await conn.query('DELETE FROM KARTY_WIFI WHERE id_u = ?', [id]);

      // 3. Usuń pozostałe dane urządzenia
      await conn.query('DELETE FROM TYPY_URZADZEN WHERE id_u = ?', [id]);
      await conn.query('DELETE FROM MAC_U WHERE id_u = ?', [id]);
      await conn.query('DELETE FROM LOK_FIZ WHERE id_u = ?', [id]);
      
      // 4. Na końcu usuń urządzenie
      await conn.query('DELETE FROM URZADZENIA WHERE id_u = ?', [id]);

      await conn.commit();
      res.json({ message: 'Urządzenie usunięte.' });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Błąd podczas usuwania urządzenia:', error);
    res.status(500).json({ 
      error: 'Błąd serwera podczas usuwania urządzenia',
      details: error instanceof Error ? error.message : 'Nieznany błąd'
    });
  }
});

// DELETE /api/urzadzenia/full/:id — usuń urządzenie i wszystkie powiązane dane
router.delete('/full/:id', async (req, res) => {
  const { id } = req.params;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Usuń połączenia portów i prędkości portów PRZED usunięciem portów
    const [porty]: [any[], any] = await conn.query('SELECT id_p FROM PORTY WHERE id_u = ?', [id]);
    for (const port of porty) {
      // Usuń połączenia portów
      await conn.query('DELETE FROM POLACZONY_Z WHERE id_p_1 = ? OR id_p_2 = ?', [port.id_p, port.id_p]);
      // Usuń prędkości portów (to powodowało błąd foreign key)
      await conn.query('DELETE FROM PREDKOSC_P WHERE id_p = ?', [port.id_p]);
    }
    // Teraz usuń porty (po usunięciu foreign key dependencies)
    await conn.query('DELETE FROM PORTY WHERE id_u = ?', [id]);

    // Usuń połączenia kart wifi i dane kart PRZED usunięciem kart
    const [karty]: [any[], any] = await conn.query('SELECT id_k FROM KARTY_WIFI WHERE id_u = ?', [id]);
    for (const karta of karty) {
      // Usuń połączenia kart wifi
      await conn.query('DELETE FROM POLACZONA_Z WHERE id_k_1 = ? OR id_k_2 = ?', [karta.id_k, karta.id_k]);
      // Usuń dane kart wifi (foreign key dependencies)
      await conn.query('DELETE FROM PASMO WHERE id_k = ?', [karta.id_k]);
      await conn.query('DELETE FROM WERSJA_WIFI WHERE id_k = ?', [karta.id_k]);
      await conn.query('DELETE FROM PREDKOSC_K WHERE id_k = ?', [karta.id_k]);
    }
    // Teraz usuń karty wifi (po usunięciu foreign key dependencies)
    await conn.query('DELETE FROM KARTY_WIFI WHERE id_u = ?', [id]);

    // Usuń pozostałe dane urządzenia
    await conn.query('DELETE FROM TYPY_URZADZEN WHERE id_u = ?', [id]);
    await conn.query('DELETE FROM MAC_U WHERE id_u = ?', [id]);
    await conn.query('DELETE FROM LOK_FIZ WHERE id_u = ?', [id]);
    
    // Na końcu usuń urządzenie
    await conn.query('DELETE FROM URZADZENIA WHERE id_u = ?', [id]);

    await conn.commit();
    res.json({ message: 'Urządzenie i powiązane dane zostały usunięte.' });
  } catch (err) {
    await conn.rollback();
    console.error('Błąd przy usuwaniu urządzenia z detalami:', err);
    res.status(500).json({ 
      error: 'Błąd serwera podczas usuwania urządzenia',
      details: err instanceof Error ? err.message : 'Nieznany błąd'
    });
  } finally {
    conn.release();
  }
});

// PUT /api/urzadzenia/full/:id — zaktualizuj urządzenie i wszystkie powiązane dane
router.put('/full/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deviceData = req.body;

    // Walidacja danych
    const validationResult = validateDevice(deviceData);
    if (!validationResult.isValid) {
      return res.status(400).json({ 
        error: 'Błędy walidacji', 
        details: validationResult.errors 
      });
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Aktualizuj podstawowe dane urządzenia
      await conn.query(
        'UPDATE URZADZENIA SET nazwa_urzadzenia = ?, ilosc_portow = ? WHERE id_u = ?',
        [deviceData.urzadzenie.nazwa_urzadzenia, deviceData.urzadzenie.ilosc_portow || 0, id]
      );

      // Usuń powiązane dane (jak w DELETE /full/:id, ale nie usuwaj samego urządzenia)
      // Usuń połączenia portów i prędkości portów PRZED usunięciem portów
      const [portyRows]: [any[], any] = await conn.query('SELECT id_p FROM PORTY WHERE id_u = ?', [id]);
      for (const port of portyRows) {
        await conn.query('DELETE FROM POLACZONY_Z WHERE id_p_1 = ? OR id_p_2 = ?', [port.id_p, port.id_p]);
        await conn.query('DELETE FROM PREDKOSC_P WHERE id_p = ?', [port.id_p]);
      }
      await conn.query('DELETE FROM PORTY WHERE id_u = ?', [id]);

      // Usuń połączenia kart wifi i dane kart PRZED usunięciem kart
      const [kartyRows]: [any[], any] = await conn.query('SELECT id_k FROM KARTY_WIFI WHERE id_u = ?', [id]);
      for (const karta of kartyRows) {
        await conn.query('DELETE FROM POLACZONA_Z WHERE id_k_1 = ? OR id_k_2 = ?', [karta.id_k, karta.id_k]);
        await conn.query('DELETE FROM PASMO WHERE id_k = ?', [karta.id_k]);
        await conn.query('DELETE FROM WERSJA_WIFI WHERE id_k = ?', [karta.id_k]);
        await conn.query('DELETE FROM PREDKOSC_K WHERE id_k = ?', [karta.id_k]);
      }
      await conn.query('DELETE FROM KARTY_WIFI WHERE id_u = ?', [id]);
      
      // Usuń pozostałe dane
      await conn.query('DELETE FROM TYPY_URZADZEN WHERE id_u = ?', [id]);
      await conn.query('DELETE FROM MAC_U WHERE id_u = ?', [id]);
      await conn.query('DELETE FROM LOK_FIZ WHERE id_u = ?', [id]);

      // Dodaj typ urządzenia
      if (deviceData.typ && deviceData.typ.typ_u) {
        await conn.query(
          'INSERT INTO TYPY_URZADZEN (typ_u, id_u) VALUES (?, ?)',
          [deviceData.typ.typ_u, id]
        );
      }

      // Dodaj porty
      if (Array.isArray(deviceData.porty)) {
        for (const port of deviceData.porty) {
          if (!port) continue;
          
          const [portResult]: any = await conn.query(
            'INSERT INTO PORTY (nazwa, status, typ, id_u) VALUES (?, ?, ?, ?)',
            [port.nazwa, port.status, port.typ, id]
          );
          const id_p = portResult.insertId;
          
          // Dodaj prędkość portu
          if (port.predkosc_portu) {
            let predkosc = null;
            if (typeof port.predkosc_portu === 'object' && port.predkosc_portu.predkosc) {
              predkosc = port.predkosc_portu.predkosc;
            } else if (typeof port.predkosc_portu === 'string') {
              predkosc = port.predkosc_portu;
            }
            
            if (predkosc) {
              await conn.query(
                'INSERT INTO PREDKOSC_P (id_p, predkosc) VALUES (?, ?)',
                [id_p, predkosc]
              );
            }
          }
        }
      }

      // Dodaj karty wifi i ich szczegóły
      if (Array.isArray(deviceData.karty_wifi)) {
        for (const karta of deviceData.karty_wifi) {
          if (!karta) continue;
          
          const [kartaResult]: any = await conn.query(
            'INSERT INTO KARTY_WIFI (nazwa, status, id_u) VALUES (?, ?, ?)',
            [karta.nazwa, karta.status, id]
          );
          const id_k = kartaResult.insertId;

          // Pasmo - normalizuj wartości z frontendu
          if (karta.pasmo) {
            const pasmo24 = !!(Number(karta.pasmo.pasmo24GHz) || karta.pasmo.pasmo24GHz === true) ? 1 : 0;
            const pasmo5 = !!(Number(karta.pasmo.pasmo5GHz) || karta.pasmo.pasmo5GHz === true) ? 1 : 0;
            const pasmo6 = !!(Number(karta.pasmo.pasmo6GHz) || karta.pasmo.pasmo6GHz === true) ? 1 : 0;
            
            await conn.query(
              'INSERT INTO PASMO (id_k, pasmo24GHz, pasmo5GHz, pasmo6GHz) VALUES (?, ?, ?, ?)',
              [id_k, pasmo24, pasmo5, pasmo6]
            );
          }
          
          // Wersja - obsłuż różne struktury z frontendu
          if (karta.wersja) {
            let wersja = null;
            if (typeof karta.wersja === 'object' && karta.wersja.wersja) {
              wersja = karta.wersja.wersja;
            } else if (typeof karta.wersja === 'string') {
              wersja = karta.wersja;
            }
            
            if (wersja) {
              await conn.query(
                'INSERT INTO WERSJA_WIFI (id_k, wersja) VALUES (?, ?)',
                [id_k, wersja]
              );
            }
          }
          
          // Prędkość - obsłuż różne struktury z frontendu
          if (karta.predkosc) {
            let predkosc = null;
            if (typeof karta.predkosc === 'object' && karta.predkosc.predkosc) {
              predkosc = karta.predkosc.predkosc;
            } else if (typeof karta.predkosc === 'number') {
              predkosc = karta.predkosc;
            }
            
            if (predkosc) {
              await conn.query(
                'INSERT INTO PREDKOSC_K (id_k, predkosc) VALUES (?, ?)',
                [id_k, predkosc]
              );
            }
          }
        }
      }

      // Dodaj MAC
      if (deviceData.mac && deviceData.mac.MAC) {
        await conn.query(
          'INSERT INTO MAC_U (id_u, MAC) VALUES (?, ?)',
          [id, deviceData.mac.MAC]
        );
      }
      
      // Dodaj lokalizację
      if (deviceData.lokalizacja && deviceData.lokalizacja.miejsce) {
        await conn.query(
          'INSERT INTO LOK_FIZ (id_u, miejsce, szafa, rack) VALUES (?, ?, ?, ?)',
          [id, deviceData.lokalizacja.miejsce, deviceData.lokalizacja.szafa || '', deviceData.lokalizacja.rack || '']
        );
      }

      await conn.commit();
      res.json({ 
        message: 'Urządzenie zostało zaktualizowane.',
        id_u: id
      });
    } catch (err) {
      await conn.rollback();
      console.error('Błąd przy aktualizacji urządzenia z detalami:', err);
      res.status(500).json({ 
        error: 'Błąd serwera podczas aktualizacji urządzenia',        details: err instanceof Error ? err.message : 'Nieznany błąd'
      });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Błąd w endpoincie PUT /full/:id:', err);
    res.status(500).json({ 
      error: 'Błąd serwera',
      details: err instanceof Error ? err.message : 'Nieznany błąd'
    });  }
});

export default router;