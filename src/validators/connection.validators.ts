import { db } from '../db';

export interface ConnectionValidationError {
  field: string;
  message: string;
}

export interface ConnectionValidationResult {
  isValid: boolean;
  errors: ConnectionValidationError[];
}

// Walidacja połączenia portów
export const validatePortConnection = async (
  id_p_1: number,
  id_p_2: number,
  max_predkosc?: string
): Promise<ConnectionValidationResult> => {
  const errors: ConnectionValidationError[] = [];

  try {
    // Sprawdź czy oba porty istnieją
    const [port1]: [any[], any] = await db.query('SELECT * FROM PORTY WHERE id_p = ?', [id_p_1]);
    const [port2]: [any[], any] = await db.query('SELECT * FROM PORTY WHERE id_p = ?', [id_p_2]);

    if (port1.length === 0) {
      errors.push({ field: 'id_p_1', message: 'Port o podanym ID nie istnieje' });
    }
    if (port2.length === 0) {
      errors.push({ field: 'id_p_2', message: 'Port o podanym ID nie istnieje' });
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Sprawdź czy porty są różne
    if (id_p_1 === id_p_2) {
      errors.push({ field: 'connection', message: 'Nie można połączyć portu z samym sobą' });
    }

    // Sprawdź czy porty są aktywne (zgodnie z logiką z frontendu - tylko aktywne komponenty)
    if (port1[0].status !== 'aktywny') {
      errors.push({ field: 'id_p_1', message: 'Port musi być aktywny aby można było go połączyć' });
    }
    if (port2[0].status !== 'aktywny') {
      errors.push({ field: 'id_p_2', message: 'Port musi być aktywny aby można było go połączyć' });
    }

    // Sprawdź czy porty należą do różnych urządzeń
    if (port1[0].id_u === port2[0].id_u) {
      errors.push({ field: 'connection', message: 'Nie można połączyć portów tego samego urządzenia' });
    }

    // Sprawdź czy połączenie już istnieje (duplikaty)
    const [existingConnection]: [any[], any] = await db.query(
      'SELECT * FROM POLACZONY_Z WHERE (id_p_1 = ? AND id_p_2 = ?) OR (id_p_1 = ? AND id_p_2 = ?)',
      [id_p_1, id_p_2, id_p_2, id_p_1]
    );

    if (existingConnection.length > 0) {
      errors.push({ field: 'connection', message: 'Połączenie między tymi portami już istnieje' });
    }

    // Sprawdź dostępność portów (czy nie są już zajęte)
    const availabilityCheck1 = await validatePortAvailability(id_p_1);
    const availabilityCheck2 = await validatePortAvailability(id_p_2);
    
    errors.push(...availabilityCheck1.errors);
    errors.push(...availabilityCheck2.errors);

    // Sprawdź obliczanie prędkości (minimum z dwóch portów)
    if (max_predkosc) {
      const speedCheck = await validatePortSpeedCalculation(id_p_1, id_p_2, max_predkosc);
      errors.push(...speedCheck.errors);
    }

  } catch (error) {
    errors.push({ field: 'database', message: 'Błąd podczas sprawdzania połączenia portów' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Walidacja połączenia kart WiFi
export const validateWifiConnection = async (
  id_k_1: number,
  id_k_2: number,
  max_predkosc?: string,
  pasmo?: string
): Promise<ConnectionValidationResult> => {
  const errors: ConnectionValidationError[] = [];

  try {
    // Sprawdź czy obie karty istnieją
    const [karta1]: [any[], any] = await db.query('SELECT * FROM KARTY_WIFI WHERE id_k = ?', [id_k_1]);
    const [karta2]: [any[], any] = await db.query('SELECT * FROM KARTY_WIFI WHERE id_k = ?', [id_k_2]);

    if (karta1.length === 0) {
      errors.push({ field: 'id_k_1', message: 'Karta WiFi o podanym ID nie istnieje' });
    }
    if (karta2.length === 0) {
      errors.push({ field: 'id_k_2', message: 'Karta WiFi o podanym ID nie istnieje' });
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Sprawdź czy karty są różne
    if (id_k_1 === id_k_2) {
      errors.push({ field: 'connection', message: 'Nie można połączyć karty z samą sobą' });
    }

    // Sprawdź czy karty są aktywne (zgodnie z logiką z frontendu - tylko aktywne komponenty)
    if (karta1[0].status !== 'aktywny') {
      errors.push({ field: 'id_k_1', message: 'Karta WiFi musi być aktywna aby można było ją połączyć' });
    }
    if (karta2[0].status !== 'aktywny') {
      errors.push({ field: 'id_k_2', message: 'Karta WiFi musi być aktywna aby można było ją połączyć' });
    }

    // Sprawdź czy karty należą do różnych urządzeń
    if (karta1[0].id_u === karta2[0].id_u) {
      errors.push({ field: 'connection', message: 'Nie można połączyć kart tego samego urządzenia' });
    }    // Sprawdź czy połączenie już istnieje (duplikaty)
    const [existingConnection]: [any[], any] = await db.query(
      'SELECT * FROM POLACZONA_Z WHERE (id_k_1 = ? AND id_k_2 = ?) OR (id_k_1 = ? AND id_k_2 = ?)',
      [id_k_1, id_k_2, id_k_2, id_k_1]
    );

    if (existingConnection.length > 0) {
      errors.push({ field: 'connection', message: 'Połączenie między tymi kartami już istnieje' });
    }

    // USUNIĘTO: Sprawdzanie dostępności kart (pozwalamy na wielokrotne połączenia)
    // Karty WiFi mogą być połączone z wieloma innymi kartami jednocześnie

    // Sprawdź kompatybilność pasm WiFi (wspólne pasmo wymagane)
    if (pasmo) {
      const [pasmo1]: [any[], any] = await db.query('SELECT * FROM PASMO WHERE id_k = ?', [id_k_1]);
      const [pasmo2]: [any[], any] = await db.query('SELECT * FROM PASMO WHERE id_k = ?', [id_k_2]);

      if (pasmo1.length > 0 && pasmo2.length > 0) {
        const bands1 = pasmo1[0];
        const bands2 = pasmo2[0];
        
        let hasCommonBand = false;
        
        if (pasmo === '2.4GHz' && bands1.pasmo24GHz && bands2.pasmo24GHz) {
          hasCommonBand = true;
        } else if (pasmo === '5GHz' && bands1.pasmo5GHz && bands2.pasmo5GHz) {
          hasCommonBand = true;
        } else if (pasmo === '6GHz' && bands1.pasmo6GHz && bands2.pasmo6GHz) {
          hasCommonBand = true;
        }

        if (!hasCommonBand) {
          errors.push({ field: 'pasmo', message: `Obie karty muszą obsługiwać pasmo ${pasmo}` });
        }
      } else {
        errors.push({ field: 'pasmo', message: 'Nie można sprawdzić kompatybilności pasm - brak danych o pasmach kart' });
      }
    } else {
      // Jeśli pasmo nie zostało podane, sprawdź czy karty mają jakiekolwiek wspólne pasmo
      const [pasmo1]: [any[], any] = await db.query('SELECT * FROM PASMO WHERE id_k = ?', [id_k_1]);
      const [pasmo2]: [any[], any] = await db.query('SELECT * FROM PASMO WHERE id_k = ?', [id_k_2]);

      if (pasmo1.length > 0 && pasmo2.length > 0) {
        const bands1 = pasmo1[0];
        const bands2 = pasmo2[0];
        
        const hasAnyCommonBand = 
          (bands1.pasmo24GHz && bands2.pasmo24GHz) ||
          (bands1.pasmo5GHz && bands2.pasmo5GHz) ||
          (bands1.pasmo6GHz && bands2.pasmo6GHz);

        if (!hasAnyCommonBand) {
          errors.push({ field: 'pasmo', message: 'Karty muszą mieć co najmniej jedno wspólne pasmo' });
        }
      }
    }

    // Oblicz minimalną prędkość z dwóch kart (minimum z dwóch komponentów)
    if (max_predkosc) {
      const [predkosc1]: [any[], any] = await db.query('SELECT * FROM PREDKOSC_K WHERE id_k = ?', [id_k_1]);
      const [predkosc2]: [any[], any] = await db.query('SELECT * FROM PREDKOSC_K WHERE id_k = ?', [id_k_2]);

      if (predkosc1.length > 0 && predkosc2.length > 0) {
        const minSpeed = Math.min(predkosc1[0].predkosc, predkosc2[0].predkosc);
        const providedSpeed = parseInt(max_predkosc);
        
        if (providedSpeed > minSpeed) {
          errors.push({ 
            field: 'max_predkosc', 
            message: `Maksymalna prędkość nie może być większa niż ${minSpeed} Mb/s (minimum z dwóch kart)` 
          });
        }
      }
    }

  } catch (error) {
    errors.push({ field: 'database', message: 'Błąd podczas sprawdzania połączenia kart WiFi' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Walidacja mieszanego połączenia (port z kartą WiFi - jeśli jest to możliwe)
export const validateMixedConnection = async (
  deviceType: 'port' | 'wifi',
  id1: number,
  id2: number
): Promise<ConnectionValidationResult> => {
  const errors: ConnectionValidationError[] = [];
  
  errors.push({ 
    field: 'connection', 
    message: 'Nie można łączyć portów z kartami WiFi' 
  });

  return {
    isValid: false,
    errors
  };
};

// Walidacja połączeń mieszanych (dodatkowa walidacja dla ConnectionManagerPage)
export const validateConnectionDeviceSelection = async (
  id_u_1: number, 
  id_u_2: number
): Promise<ConnectionValidationResult> => {
  const errors: ConnectionValidationError[] = [];

  try {
    // Sprawdź czy oba urządzenia istnieją
    const [device1]: [any[], any] = await db.query('SELECT * FROM URZADZENIA WHERE id_u = ?', [id_u_1]);
    const [device2]: [any[], any] = await db.query('SELECT * FROM URZADZENIA WHERE id_u = ?', [id_u_2]);

    if (device1.length === 0) {
      errors.push({ field: 'id_u_1', message: 'Pierwsze urządzenie nie istnieje' });
    }
    if (device2.length === 0) {
      errors.push({ field: 'id_u_2', message: 'Drugie urządzenie nie istnieje' });
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Sprawdź czy urządzenia są różne (zgodnie z logiką z frontendu)
    if (id_u_1 === id_u_2) {
      errors.push({ field: 'connection', message: 'Oba urządzenia muszą być różne' });
    }

  } catch (error) {
    errors.push({ field: 'database', message: 'Błąd podczas sprawdzania urządzeń' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Walidacja dostępności portu (czy nie jest już połączony)
export const validatePortAvailability = async (id_p: number): Promise<ConnectionValidationResult> => {
  const errors: ConnectionValidationError[] = [];

  try {
    // Sprawdź czy port nie jest już połączony
    const [connections]: [any[], any] = await db.query(
      'SELECT * FROM POLACZONY_Z WHERE id_p_1 = ? OR id_p_2 = ?',
      [id_p, id_p]
    );

    if (connections.length > 0) {
      errors.push({ field: `port_${id_p}`, message: 'Port jest już połączony z innym portem' });
    }

  } catch (error) {
    errors.push({ field: 'database', message: 'Błąd podczas sprawdzania dostępności portu' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Walidacja obliczania minimalnej prędkości dla połączeń portów
export const validatePortSpeedCalculation = async (
  id_p_1: number,
  id_p_2: number,
  requested_speed?: string
): Promise<ConnectionValidationResult> => {
  const errors: ConnectionValidationError[] = [];

  try {
    // Pobierz prędkości obu portów
    const [port1Speed]: [any[], any] = await db.query(
      'SELECT ps.predkosc FROM PORTY p JOIN PREDKOSC_P ps ON p.id_p = ps.id_p WHERE p.id_p = ?',
      [id_p_1]
    );
    const [port2Speed]: [any[], any] = await db.query(
      'SELECT ps.predkosc FROM PORTY p JOIN PREDKOSC_P ps ON p.id_p = ps.id_p WHERE p.id_p = ?',
      [id_p_2]
    );

    if (port1Speed.length > 0 && port2Speed.length > 0 && requested_speed) {
      // Konwertuj prędkości na liczby (usuń jednostki)
      const speed1 = parseFloat(port1Speed[0].predkosc.replace(/[^\d.,]/g, '').replace(',', '.'));
      const speed2 = parseFloat(port2Speed[0].predkosc.replace(/[^\d.,]/g, '').replace(',', '.'));
      const requestedSpeedNum = parseFloat(requested_speed.replace(/[^\d.,]/g, '').replace(',', '.'));
      
      const minSpeed = Math.min(speed1, speed2);
      
      if (requestedSpeedNum > minSpeed) {
        errors.push({ 
          field: 'max_predkosc', 
          message: `Maksymalna prędkość połączenia nie może być większa niż ${minSpeed} (minimum z dwóch portów)` 
        });
      }
    }

  } catch (error) {
    errors.push({ field: 'database', message: 'Błąd podczas obliczania prędkości połączenia' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
