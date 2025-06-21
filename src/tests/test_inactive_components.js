import { validateDevice } from '../validators/device.validators';

// Test dodawania urządzenia z nieaktywnymi portami i kartami WiFi
const testDataWithInactivePorts = {
    "urzadzenie": {
        "nazwa_urzadzenia": "testRouter",
        "ilosc_portow": 2
    },
    "typ": {
        "id_typu": 0,
        "id_u": 1,
        "typ_u": "Router"
    },
    "lokalizacja": {
        "miejsce": "Serwerownia A",
        "szafa": "Szafa 1",
        "rack": "Rack 2"
    },
    "mac": {
        "MAC": "AC:BB:CC:DD:EE:03"
    },
    "porty": [
        {
            "nazwa": "eth0",
            "status": "nieaktywny", // Port nieaktywny
            "typ": "RJ45",
            "predkosc_portu": {
                "predkosc": "1Gb/s"
            },
            "polaczenia_portu": []
        },
        {
            "nazwa": "eth1",
            "status": "nieaktywny", // Port nieaktywny
            "typ": "RJ45",
            "predkosc_portu": {
                "predkosc": "1Gb/s"
            },
            "polaczenia_portu": []
        }
    ],
    "karty_wifi": [
        {
            "nazwa": "wifiCard",
            "status": "nieaktywny", // Karta WiFi nieaktywna
            "pasmo": {
                "pasmo24GHz": 1,
                "pasmo5GHz": 1,
                "pasmo6GHz": 0
            },
            "wersja": {
                "wersja": "AC"
            },
            "predkosc": {
                "predkosc": 1200
            }
        }
    ]
};

// Test Access Point z nieaktywną kartą WiFi
const testAccessPointWithInactiveWifi = {
    "urzadzenie": {
        "nazwa_urzadzenia": "testAP",
        "ilosc_portow": 1
    },
    "typ": {
        "id_typu": 0,
        "id_u": 2,
        "typ_u": "Access Point"
    },
    "lokalizacja": {
        "miejsce": "Biuro A"
    },
    "porty": [
        {
            "nazwa": "eth0",
            "status": "aktywny",
            "typ": "RJ45",
            "predkosc_portu": {
                "predkosc": "1Gb/s"
            }
        }
    ],
    "karty_wifi": [
        {
            "nazwa": "wifiCard",
            "status": "nieaktywny", // Karta WiFi nieaktywna - wcześniej było to wymagane dla AP
            "pasmo": {
                "pasmo24GHz": 1,
                "pasmo5GHz": 1,
                "pasmo6GHz": 0
            },
            "wersja": {
                "wersja": "AC"
            },
            "predkosc": {
                "predkosc": 1200
            }
        }
    ]
};

// Test urządzenia bez portów i kart WiFi
const testDeviceWithoutComponents = {
    "urzadzenie": {
        "nazwa_urzadzenia": "testServer",
        "ilosc_portow": 0
    },
    "typ": {
        "id_typu": 0,
        "id_u": 3,
        "typ_u": "Server"
    },
    "lokalizacja": {
        "miejsce": "Serwerownia B"
    },
    "porty": [],
    "karty_wifi": []
};

console.log('🧪 Testowanie walidacji urządzeń z nieaktywnymi komponentami...\n');

// Test 1: Router z nieaktywnymi portami i kartami WiFi
console.log('Test 1: Router z nieaktywnymi portami i kartami WiFi');
const result1 = validateDevice(testDataWithInactivePorts);

if (result1.isValid) {
    console.log('✅ PRZESZEDŁ - Router może mieć nieaktywne porty i karty WiFi');
} else {
    console.log('❌ NIEPOMYŚLNY - Router powinien móc mieć nieaktywne komponenty');
    result1.errors.forEach(error => {
        console.log(`  - ${error.field}: ${error.message}`);
    });
}

// Test 2: Access Point z nieaktywną kartą WiFi
console.log('\nTest 2: Access Point z nieaktywną kartą WiFi');
const result2 = validateDevice(testAccessPointWithInactiveWifi);

if (result2.isValid) {
    console.log('✅ PRZESZEDŁ - Access Point może mieć nieaktywną kartę WiFi');
} else {
    console.log('❌ NIEPOMYŚLNY - Access Point powinien móc mieć nieaktywną kartę WiFi');
    result2.errors.forEach(error => {
        console.log(`  - ${error.field}: ${error.message}`);
    });
}

// Test 3: Server bez portów i kart WiFi
console.log('\nTest 3: Server bez portów i kart WiFi');
const result3 = validateDevice(testDeviceWithoutComponents);

if (result3.isValid) {
    console.log('✅ PRZESZEDŁ - Server może nie mieć żadnych portów ani kart WiFi');
} else {
    console.log('❌ NIEPOMYŚLNY - Server powinien móc nie mieć żadnych komponentów');
    result3.errors.forEach(error => {
        console.log(`  - ${error.field}: ${error.message}`);
    });
}

console.log('\n📋 Podsumowanie:');
console.log('   - Usunięto wymagania dotyczące minimum aktywnych portów dla Router/Switch/Access Point');
console.log('   - Usunięto wymagania dotyczące minimum aktywnych kart WiFi dla Access Point');
console.log('   - Urządzenia mogą mieć tylko nieaktywne komponenty lub w ogóle ich nie mieć');

if (result1.isValid && result2.isValid && result3.isValid) {
    console.log('\n✅ WSZYSTKIE TESTY PRZESZŁY - Walidacja działa poprawnie!');
} else {
    console.log('\n❌ NIEKTÓRE TESTY NIEPOMYŚLNE - Sprawdź powyższe błędy');
}
