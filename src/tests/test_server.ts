import express from 'express';
import cors from 'cors';
import { validateDevice } from '../validators/device.validators';

// Konfiguracja testowa
const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint
app.post('/test-validation', (req, res) => {
  try {
    console.log('Otrzymane dane:', JSON.stringify(req.body, null, 2));
    
    const validationResult = validateDevice(req.body);
    
    if (!validationResult.isValid) {
      console.log('❌ Błędy walidacji:');
      validationResult.errors.forEach(error => {
        console.log(`  - ${error.field}: ${error.message}`);
      });
      return res.status(400).json({ 
        error: 'Błędy walidacji', 
        details: validationResult.errors 
      });
    }
    
    console.log('✅ Walidacja przeszła pomyślnie!');
    res.json({ 
      success: true, 
      message: 'Walidacja przeszła pomyślnie',
      data: req.body 
    });
  } catch (error) {
    console.error('Błąd w teście:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// Testowe dane
const testData = {
    "urzadzenie": {
        "nazwa_urzadzenia": "apacy apacy2",
        "ilosc_portow": 2
    },
    "typ": {
        "id_typu": 66,
        "id_u": 17,
        "typ_u": "Access Point"
    },
    "lokalizacja": {
        "miejsce": "Serwerownia A",
        "szafa": "formtest2",
        "rack": "Rack 2"
    },
    "mac": {
        "MAC": "10:1A:2B:3C:4D:5E"
    },
    "porty": [
        {
            "nazwa": "eth0",
            "status": "aktywny",
            "typ": "RJ45",
            "predkosc_portu": {
                "predkosc": "1Gb/s"
            },
            "polaczenia_portu": []
        },
        {
            "nazwa": "eth1",
            "status": "aktywny",
            "typ": "RJ45",
            "predkosc_portu": {
                "predkosc": "1Gb/s"
            },
            "polaczenia_portu": []
        }
    ],
    "karty_wifi": [
        {
            "nazwa": "kartaskibidi",
            "status": "aktywny",
            "pasmo": {
                "pasmo24GHz": 1,
                "pasmo5GHz": 1,
                "pasmo6GHz": 0
            },
            "wersja": {
                "wersja": "AC"
            },
            "predkosc": {
                "predkosc": 2137
            }
        }
    ]
};

const port = 3001;

app.listen(port, () => {
  console.log(`Test serwer uruchomiony na porcie ${port}`);
  
  // Automatyczny test
  setTimeout(async () => {
    try {
      const response = await fetch(`http://localhost:${port}/test-validation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      console.log('\n=== WYNIK TESTU ===');
      if (response.ok) {
        console.log('✅ Test przeszedł pomyślnie!');
        console.log('Odpowiedź:', result);
      } else {
        console.log('❌ Test nieudany');
        console.log('Błędy:', result);
      }
      
      process.exit(0);
    } catch (error) {
      console.error('❌ Błąd podczas testu:', error);
      process.exit(1);
    }
  }, 1000);
});
