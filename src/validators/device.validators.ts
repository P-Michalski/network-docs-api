import { 
  validateRequired, 
  validateEnum, 
  validateObjectProperties,
  validateMaxLength,
} from './general.validators';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Walidacja nazwy urządzenia
export const validateDeviceName = (nazwa: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Sprawdź czy nazwa jest wymagana
  errors.push(...validateRequired(nazwa, 'nazwa_urzadzenia'));
  
  // Sprawdź maksymalną długość nazwy (standardowo 100 znaków)
  if (nazwa) {
    errors.push(...validateMaxLength(nazwa.trim(), 100, 'nazwa_urzadzenia'));
  }
  
  return errors;
};

// Walidacja typu urządzenia
export const validateDeviceType = (typ: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const allowedTypes = ['Router', 'Switch', 'Access Point', 'PC'];
  
  errors.push(...validateEnum(typ, allowedTypes, 'typ_u'));
  
  return errors;
};

// Walidacja lokalizacji
export const validateLocation = (lokalizacja: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Sprawdź strukturę obiektu lokalizacji
  errors.push(...validateObjectProperties(lokalizacja, ['miejsce'], 'lokalizacja'));
  
  if (lokalizacja && lokalizacja.miejsce) {
    errors.push(...validateRequired(lokalizacja.miejsce, 'lokalizacja.miejsce'));
    errors.push(...validateMaxLength(lokalizacja.miejsce, 200, 'lokalizacja.miejsce'));
  }
  
  return errors;
};

// Walidacja adresu MAC/IP
export const validateMacAddress = (mac: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (mac && mac.MAC) {
    // Sprawdź czy to jest adres IP czy MAC
    const macValue = mac.MAC;
    
    // Sprawdź format MAC (XX:XX:XX:XX:XX:XX lub XX-XX-XX-XX-XX-XX)
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    
    // Akceptuj albo MAC albo IP
    if (!macRegex.test(macValue)) {
      errors.push({ field: 'mac.MAC', message: 'Nieprawidłowy format adresu MAC (XX:XX:XX:XX:XX:XX)' });
    }
  }
  
  return errors;
};

// Walidacja portów
export const validatePorts = (porty: any[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Sprawdź czy porty to tablica
  if (!Array.isArray(porty)) {
    errors.push({ field: 'porty', message: 'Porty muszą być tablicą' });
    return errors;
  }
  
  // Sprawdź unikalność nazw portów
  const portNames = porty.map(port => port?.nazwa?.trim()).filter(name => name);
  const duplicateNames = portNames.filter((name, index) => portNames.indexOf(name) !== index);
  if (duplicateNames.length > 0) {
    errors.push({ field: 'porty', message: `Znalezione duplikaty nazw portów: ${[...new Set(duplicateNames)].join(', ')}` });
  }
  
  porty.forEach((port, index) => {
    if (!port) {
      errors.push({ field: `porty[${index}]`, message: 'Dane portu są wymagane' });
      return;
    }
    
    // Nazwa portu
    if (!port.nazwa || !port.nazwa.trim()) {
      errors.push({ field: `porty[${index}].nazwa`, message: 'Nazwa portu jest wymagana' });
    } else if (port.nazwa.trim().length > 50) {
      errors.push({ field: `porty[${index}].nazwa`, message: 'Nazwa portu jest za długa (max 50 znaków)' });
    }
    
    // Status
    if (!port.status || !['aktywny', 'nieaktywny'].includes(port.status)) {
      errors.push({ field: `porty[${index}].status`, message: 'Status musi być "aktywny" lub "nieaktywny"' });
    }
    
    // Typ
    if (!port.typ || !['RJ45', 'SFP'].includes(port.typ)) {
      errors.push({ field: `porty[${index}].typ`, message: 'Typ musi być "RJ45" lub "SFP"' });
    }
    
    // Prędkość (jeśli istnieje) - sprawdź różne możliwe struktury z frontendu
    if (port.predkosc_portu) {
      let predkoscValue = null;
      if (typeof port.predkosc_portu === 'object' && port.predkosc_portu.predkosc) {
        predkoscValue = port.predkosc_portu.predkosc;
      } else if (typeof port.predkosc_portu === 'string') {
        predkoscValue = port.predkosc_portu;
      }
      
      if (predkoscValue) {
        const allowedSpeeds = ['10Mb/s', '100Mb/s', '1Gb/s', '2,5Gb/s', '5Gb/s', '10Gb/s', '25Gb/s'];
        if (!allowedSpeeds.includes(predkoscValue)) {
          errors.push({ field: `porty[${index}].predkosc_portu`, message: 'Nieprawidłowa prędkość portu' });
        }
      }
    }
  });
  
  return errors;
};

// Walidacja kart WiFi
export const validateWifiCards = (karty_wifi: any[], deviceType: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Sprawdź czy karty WiFi to tablica
  if (!Array.isArray(karty_wifi)) {
    errors.push({ field: 'karty_wifi', message: 'Karty WiFi muszą być tablicą' });
    return errors;
  }
  
  // Switch nie może mieć kart WiFi
  if (deviceType === 'Switch' && karty_wifi.length > 0) {
    errors.push({ field: 'karty_wifi', message: 'Switch nie może mieć kart WiFi' });
    return errors;
  }
  
  // Sprawdź unikalność nazw kart WiFi
  const cardNames = karty_wifi.map(karta => karta?.nazwa?.trim()).filter(name => name);
  const duplicateNames = cardNames.filter((name, index) => cardNames.indexOf(name) !== index);
  if (duplicateNames.length > 0) {
    errors.push({ field: 'karty_wifi', message: `Znalezione duplikaty nazw kart WiFi: ${[...new Set(duplicateNames)].join(', ')}` });
  }
  
  karty_wifi.forEach((karta, index) => {
    if (!karta) {
      errors.push({ field: `karty_wifi[${index}]`, message: 'Dane karty WiFi są wymagane' });
      return;
    }
    
    // Nazwa
    if (!karta.nazwa || !karta.nazwa.trim()) {
      errors.push({ field: `karty_wifi[${index}].nazwa`, message: 'Nazwa karty WiFi jest wymagana' });
    } else if (karta.nazwa.trim().length > 50) {
      errors.push({ field: `karty_wifi[${index}].nazwa`, message: 'Nazwa karty WiFi jest za długa (max 50 znaków)' });
    }
    
    // Status
    if (!karta.status || !['aktywny', 'nieaktywny'].includes(karta.status)) {
      errors.push({ field: `karty_wifi[${index}].status`, message: 'Status musi być "aktywny" lub "nieaktywny"' });
    }
    
    // Wersja - sprawdź różne możliwe struktury z frontendu
    let wersjaValue = null;
    if (karta.wersja && typeof karta.wersja === 'object' && karta.wersja.wersja) {
      wersjaValue = karta.wersja.wersja;
    } else if (typeof karta.wersja === 'string') {
      wersjaValue = karta.wersja;
    }
    
    if (!wersjaValue) {
      errors.push({ field: `karty_wifi[${index}].wersja`, message: 'Wersja WiFi jest wymagana' });
    } else if (!['B', 'G', 'N', 'AC', 'AX', 'BE'].includes(wersjaValue)) {
      errors.push({ field: `karty_wifi[${index}].wersja`, message: 'Nieprawidłowa wersja WiFi' });
    }
    
    // Prędkość - sprawdź różne możliwe struktury z frontendu
    let predkoscValue = null;
    if (karta.predkosc && typeof karta.predkosc === 'object' && karta.predkosc.predkosc) {
      predkoscValue = karta.predkosc.predkosc;
    } else if (typeof karta.predkosc === 'number') {
      predkoscValue = karta.predkosc;
    }
    
    if (!predkoscValue || predkoscValue <= 0) {
      errors.push({ field: `karty_wifi[${index}].predkosc`, message: 'Prędkość karty WiFi musi być liczbą większą od 0' });
    }
    
    // Pasmo - sprawdź różne możliwe struktury z frontendu i normalizuj do boolean
    if (!karta.pasmo) {
      errors.push({ field: `karty_wifi[${index}].pasmo`, message: 'Informacje o paśmie są wymagane' });
    } else {
      // Normalizuj wartości do boolean (akceptuje 0/1, true/false, "0"/"1")
      const pasmo24 = !!(Number(karta.pasmo.pasmo24GHz) || karta.pasmo.pasmo24GHz === true);
      const pasmo5 = !!(Number(karta.pasmo.pasmo5GHz) || karta.pasmo.pasmo5GHz === true);
      const pasmo6 = !!(Number(karta.pasmo.pasmo6GHz) || karta.pasmo.pasmo6GHz === true);
      
      const hasBand = pasmo24 || pasmo5 || pasmo6;
      if (!hasBand) {
        errors.push({ field: `karty_wifi[${index}].pasmo`, message: 'Minimum jedno pasmo musi być aktywne' });
      }
    }
  });
  
  return errors;
};





// Walidacja kompatybilności wersji WiFi z pasmami
export const validateWifiVersionBandCompatibility = (karty_wifi: any[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!Array.isArray(karty_wifi)) {
    return errors;
  }
  
  karty_wifi.forEach((karta, index) => {
    if (!karta || !karta.wersja || !karta.pasmo) {
      return; // Te błędy będą złapane w podstawowej walidacji
    }
    
    // Pobierz wersję z różnych możliwych struktur
    let version = null;
    if (typeof karta.wersja === 'object' && karta.wersja.wersja) {
      version = karta.wersja.wersja;
    } else if (typeof karta.wersja === 'string') {
      version = karta.wersja;
    }
    
    if (!version) return;
    
    // Normalizuj wartości pasm do boolean
    const pasmo24 = !!(Number(karta.pasmo.pasmo24GHz) || karta.pasmo.pasmo24GHz === true);
    const pasmo5 = !!(Number(karta.pasmo.pasmo5GHz) || karta.pasmo.pasmo5GHz === true);
    const pasmo6 = !!(Number(karta.pasmo.pasmo6GHz) || karta.pasmo.pasmo6GHz === true);
    
    // Sprawdź kompatybilność wersji z pasmami
    if (version === 'B' || version === 'G') {
      if (pasmo5 || pasmo6) {
        errors.push({ 
          field: `karty_wifi[${index}].pasmo`, 
          message: `Wersja WiFi ${version} obsługuje tylko pasmo 2.4GHz` 
        });
      }
    }
    
    if (version === 'N' || version === 'AC') {
      if (pasmo6) {
        errors.push({ 
          field: `karty_wifi[${index}].pasmo`, 
          message: `Wersja WiFi ${version} nie obsługuje pasma 6GHz` 
        });
      }
    }
    
    // Sprawdź czy wybrane pasma są logiczne dla danej wersji
    if ((version === 'AX' || version === 'BE') && !pasmo5 && pasmo6) {
      errors.push({ 
        field: `karty_wifi[${index}].pasmo`, 
        message: `Karty WiFi ${version} z pasmem 6GHz powinny również obsługiwać pasmo 5GHz` 
      });
    }
  });
  
  return errors;
};

// Walidacja logicznej spójności prędkości WiFi z wersją
export const validateWifiSpeedVersionCompatibility = (karty_wifi: any[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!Array.isArray(karty_wifi)) {
    return errors;
  }
  
  karty_wifi.forEach((karta, index) => {
    if (!karta || !karta.wersja || !karta.predkosc) {
      return; // Te błędy będą złapane w podstawowej walidacji
    }
    
    // Pobierz wersję z różnych możliwych struktur
    let version = null;
    if (typeof karta.wersja === 'object' && karta.wersja.wersja) {
      version = karta.wersja.wersja;
    } else if (typeof karta.wersja === 'string') {
      version = karta.wersja;
    }
    
    // Pobierz prędkość z różnych możliwych struktur
    let speed = null;
    if (typeof karta.predkosc === 'object' && karta.predkosc.predkosc) {
      speed = karta.predkosc.predkosc;
    } else if (typeof karta.predkosc === 'number') {
      speed = karta.predkosc;
    }
    
    if (!version || !speed) return;
    
    // Sprawdź czy prędkość jest realistyczna dla danej wersji
    const maxSpeeds: { [key: string]: number } = {
      'B': 11,
      'G': 54,
      'N': 600,
      'AC': 6933,
      'AX': 9608,
      'BE': 46000
    };
    
    if (maxSpeeds[version] && speed > maxSpeeds[version]) {
      errors.push({ 
        field: `karty_wifi[${index}].predkosc`, 
        message: `Prędkość ${speed} Mb/s jest zbyt wysoka dla wersji WiFi ${version} (max: ${maxSpeeds[version]} Mb/s)` 
      });
    }
  });
  
  return errors;
};

// Główna funkcja walidacji urządzenia
export const validateDevice = (deviceData: any): ValidationResult => {
  console.log('=== DEBUG validateDevice ===');
  console.log('Otrzymane deviceData:', JSON.stringify(deviceData, null, 2));
  console.log('deviceData type:', typeof deviceData);
  console.log('deviceData keys:', Object.keys(deviceData || {}));
  console.log('deviceData.urzadzenie:', deviceData?.urzadzenie);
  console.log('deviceData.typ:', deviceData?.typ);
  console.log('!!deviceData:', !!deviceData);
  console.log('!!deviceData.urzadzenie:', !!deviceData?.urzadzenie);
  console.log('!!deviceData.typ:', !!deviceData?.typ);
  
  const errors: ValidationError[] = [];

  // Sprawdź czy podstawowe pola istnieją
  if (!deviceData) {
    console.log('BŁĄD: brak deviceData');
    errors.push({ field: 'deviceData', message: 'Dane urządzenia są wymagane' });
    return { isValid: false, errors };
  }
  
  // Walidacja podstawowych danych urządzenia
  if (deviceData.urzadzenie) {
    console.log('OK: deviceData.urzadzenie istnieje');
    if (!deviceData.urzadzenie.nazwa_urzadzenia) {
      errors.push({ field: 'urzadzenie.nazwa_urzadzenia', message: 'Nazwa urządzenia jest wymagana' });
    } else {
      errors.push(...validateDeviceName(deviceData.urzadzenie.nazwa_urzadzenia));
    }
  } else {
    console.log('BŁĄD: brak deviceData.urzadzenie');
    errors.push({ field: 'urzadzenie', message: 'Dane urządzenia są wymagane' });
  }
  
  if (deviceData.typ) {
    console.log('OK: deviceData.typ istnieje');
    if (!deviceData.typ.typ_u) {
      errors.push({ field: 'typ.typ_u', message: 'Typ urządzenia jest wymagany' });
    } else {
      errors.push(...validateDeviceType(deviceData.typ.typ_u));
    }
  } else {
    console.log('BŁĄD: brak deviceData.typ');
    errors.push({ field: 'typ', message: 'Typ urządzenia jest wymagany' });
  }
  
  // Walidacja lokalizacji (może być opcjonalna)
  if (deviceData.lokalizacja) {
    errors.push(...validateLocation(deviceData.lokalizacja));
  }
  
  // Walidacja MAC (może być opcjonalna)
  if (deviceData.mac) {
    errors.push(...validateMacAddress(deviceData.mac));
  }
  
  // Walidacja portów (może być pustą tablicą)
  const porty = deviceData.porty || [];
  errors.push(...validatePorts(porty));
  
  // Walidacja kart WiFi (może być pustą tablicą)
  const karty_wifi = deviceData.karty_wifi || [];
  const deviceType = deviceData.typ?.typ_u || '';
  
  errors.push(...validateWifiCards(karty_wifi, deviceType));
    // Walidacja dodatkowych reguł tylko jeśli podstawowe dane są prawidłowe
  if (deviceType) {
    // Usunięto walidacje minimum aktywnych portów i kart WiFi - urządzenia mogą mieć tylko nieaktywne komponenty
  }
  
  errors.push(...validateWifiVersionBandCompatibility(karty_wifi));
  errors.push(...validateWifiSpeedVersionCompatibility(karty_wifi));
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
