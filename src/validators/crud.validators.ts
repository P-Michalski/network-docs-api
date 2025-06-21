// Dodatkowe walidatory dla podstawowych operacji CRUD

import { validateRequired, validateEnum, validateNumber, GeneralValidationError } from './general.validators';

export interface CrudValidationResult {
  isValid: boolean;
  errors: GeneralValidationError[];
}

// Walidacja dla prostego dodawania urządzenia
export const validateBasicDevice = (deviceData: any): CrudValidationResult => {
  const errors: GeneralValidationError[] = [];
  
  errors.push(...validateRequired(deviceData.nazwa_urzadzenia, 'nazwa_urzadzenia'));
  
  if (deviceData.ilosc_portow !== undefined) {
    errors.push(...validateNumber(deviceData.ilosc_portow, 'ilosc_portow', 0, 48));
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Walidacja dla dodawania portu
export const validateBasicPort = (portData: any): CrudValidationResult => {
  const errors: GeneralValidationError[] = [];
  
  errors.push(...validateRequired(portData.nazwa, 'nazwa'));
  errors.push(...validateEnum(portData.status, ['aktywny', 'nieaktywny'], 'status'));
  errors.push(...validateEnum(portData.typ, ['RJ45', 'SFP'], 'typ'));
  errors.push(...validateNumber(portData.id_u, 'id_u', 1));
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Walidacja dla dodawania karty WiFi
export const validateBasicWifiCard = (cardData: any): CrudValidationResult => {
  const errors: GeneralValidationError[] = [];
  
  errors.push(...validateRequired(cardData.nazwa, 'nazwa'));
  errors.push(...validateEnum(cardData.status, ['aktywny', 'nieaktywny'], 'status'));
  errors.push(...validateNumber(cardData.id_u, 'id_u', 1));
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Walidacja dla dodawania typu urządzenia
export const validateDeviceType = (typeData: any): CrudValidationResult => {
  const errors: GeneralValidationError[] = [];
  
  errors.push(...validateEnum(typeData.typ_u, ['Router', 'Switch', 'Access Point'], 'typ_u'));
  errors.push(...validateNumber(typeData.id_u, 'id_u', 1));
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Walidacja dla aktualizacji lokalizacji
export const validateLocation = (locationData: any): CrudValidationResult => {
  const errors: GeneralValidationError[] = [];
  
  errors.push(...validateRequired(locationData.miejsce, 'miejsce'));
  errors.push(...validateNumber(locationData.id_u, 'id_u', 1));
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Walidacja dla dodawania prędkości portu
export const validatePortSpeed = (speedData: any): CrudValidationResult => {
  const errors: GeneralValidationError[] = [];
  
  const allowedSpeeds = ['10Mb/s', '100Mb/s', '1Gb/s', '2,5Gb/s', '5Gb/s', '10Gb/s', '25Gb/s'];
  errors.push(...validateEnum(speedData.predkosc, allowedSpeeds, 'predkosc'));
  errors.push(...validateNumber(speedData.id_p, 'id_p', 1));
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Walidacja dla dodawania wersji WiFi
export const validateWifiVersion = (versionData: any): CrudValidationResult => {
  const errors: GeneralValidationError[] = [];
  
  errors.push(...validateEnum(versionData.wersja, ['B', 'G', 'N', 'AC', 'AX', 'BE'], 'wersja'));
  errors.push(...validateNumber(versionData.id_k, 'id_k', 1));
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Walidacja dla dodawania prędkości karty WiFi
export const validateWifiSpeed = (speedData: any): CrudValidationResult => {
  const errors: GeneralValidationError[] = [];
  
  errors.push(...validateNumber(speedData.predkosc, 'predkosc', 1, 50000));
  errors.push(...validateNumber(speedData.id_k, 'id_k', 1));
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Walidacja dla dodawania pasma WiFi
export const validateWifiBand = (bandData: any): CrudValidationResult => {
  const errors: GeneralValidationError[] = [];
  
  errors.push(...validateNumber(bandData.id_k, 'id_k', 1));
  
  // Sprawdź czy przynajmniej jedno pasmo jest ustawione
  const hasBand = bandData.pasmo24GHz || bandData.pasmo5GHz || bandData.pasmo6GHz;
  if (!hasBand) {
    errors.push({ field: 'pasmo', message: 'Przynajmniej jedno pasmo musi być aktywne' });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
