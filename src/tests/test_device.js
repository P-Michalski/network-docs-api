// Test dodawania urządzenia z przykładowymi danymi z frontendu
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

async function testDevice() {
    try {
        const response = await fetch('http://localhost:3000/api/urzadzenia/full', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Błąd:', errorData);
            return;
        }

        const result = await response.json();
        console.log('Sukces:', result);
    } catch (error) {
        console.error('Błąd sieci:', error);
    }
}

// Uruchom test po uruchomieniu serwera
// testDevice();

console.log('Test data prepared. To run test, start server and call testDevice()');
console.log(JSON.stringify(testData, null, 2));
