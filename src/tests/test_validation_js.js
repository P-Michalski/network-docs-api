const { validateDevice } = require('../../dist/validators/device.validators');

const testData = {
    "urzadzenie": {
        "nazwa_urzadzenia": "testPC",
        "ilosc_portow": 2
    },
    "typ": {
        "id_typu": 0,
        "id_u": 1,
        "typ_u": "PC"
    },
    "lokalizacja": {
        "miejsce": "Serwerownia A",
        "szafa": "Szafa 1",
        "rack": "Rack 2"
    },
    "mac": {
        "MAC": "AC:BB:CC:DD:EE:02"
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
                "predkosc": "5Gb/s"
            },
            "polaczenia_portu": []
        }
    ],
    "karty_wifi": [
        {
            "nazwa": "kartaWIFI",
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
                "predkosc": 1224
            }
        }
    ]
};

console.log('Testing validation with PC device...');
try {
    const result = validateDevice(testData);
    
    if (result.isValid) {
        console.log('✅ Walidacja PRZESZŁA pomyślnie!');
    } else {
        console.log('❌ Walidacja NIEPOMYŚLNA:');
        result.errors.forEach(error => {
            console.log(`  - ${error.field}: ${error.message}`);
        });
    }
    
    console.log('\nWynik walidacji:', result);
} catch (error) {
    console.error('Błąd podczas testowania:', error);
}
