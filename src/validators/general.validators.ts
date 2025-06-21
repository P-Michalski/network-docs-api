// Ogólne walidatory używane w całej aplikacji

export interface GeneralValidationError {
  field: string;
  message: string;
}

export interface GeneralValidationResult {
  isValid: boolean;
  errors: GeneralValidationError[];
}

// Walidacja czy wartość jest liczbą
export const validateNumber = (value: any, fieldName: string, min?: number, max?: number): GeneralValidationError[] => {
  const errors: GeneralValidationError[] = [];
  
  if (value === null || value === undefined || value === '') {
    errors.push({ field: fieldName, message: `${fieldName} jest wymagane` });
    return errors;
  }
  
  const numValue = Number(value);
  if (isNaN(numValue)) {
    errors.push({ field: fieldName, message: `${fieldName} musi być liczbą` });
    return errors;
  }
  
  if (min !== undefined && numValue < min) {
    errors.push({ field: fieldName, message: `${fieldName} musi być większe lub równe ${min}` });
  }
  
  if (max !== undefined && numValue > max) {
    errors.push({ field: fieldName, message: `${fieldName} musi być mniejsze lub równe ${max}` });
  }
  
  return errors;
};

// Walidacja czy wartość nie jest pusta
export const validateRequired = (value: any, fieldName: string): GeneralValidationError[] => {
  const errors: GeneralValidationError[] = [];
  
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    errors.push({ field: fieldName, message: `${fieldName} jest wymagane` });
  }
  
  return errors;
};

// Walidacja maksymalnej długości stringa
export const validateMaxLength = (value: string, maxLength: number, fieldName: string): GeneralValidationError[] => {
  const errors: GeneralValidationError[] = [];
  
  if (value && value.length > maxLength) {
    errors.push({ field: fieldName, message: `${fieldName} może mieć maksymalnie ${maxLength} znaków` });
  }
  
  return errors;
};

// Walidacja czy wartość jest w dozwolonych opcjach
export const validateEnum = (value: any, allowedValues: string[], fieldName: string): GeneralValidationError[] => {
  const errors: GeneralValidationError[] = [];
  
  if (!value || !allowedValues.includes(value)) {
    errors.push({ 
      field: fieldName, 
      message: `${fieldName} musi być jedną z wartości: ${allowedValues.join(', ')}` 
    });
  }
  
  return errors;
};

// Walidacja adresu IP
export const validateIPAddress = (ip: string, fieldName: string, required: boolean = false): GeneralValidationError[] => {
  const errors: GeneralValidationError[] = [];
  
  if (!ip || ip.trim() === '') {
    if (required) {
      errors.push({ field: fieldName, message: `${fieldName} jest wymagany` });
    }
    return errors;
  }
  
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (!ipRegex.test(ip.trim())) {
    errors.push({ field: fieldName, message: `${fieldName} ma nieprawidłowy format IP` });
  }
  
  return errors;
};

// Walidacja adresu MAC
export const validateMACAddress = (mac: string, fieldName: string, required: boolean = false): GeneralValidationError[] => {
  const errors: GeneralValidationError[] = [];
  
  if (!mac || mac.trim() === '') {
    if (required) {
      errors.push({ field: fieldName, message: `${fieldName} jest wymagany` });
    }
    return errors;
  }
  
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  if (!macRegex.test(mac.trim())) {
    errors.push({ field: fieldName, message: `${fieldName} ma nieprawidłowy format MAC (XX:XX:XX:XX:XX:XX lub XX-XX-XX-XX-XX-XX)` });
  }
  
  return errors;
};

// Walidacja tablicy
export const validateArray = (array: any, fieldName: string, minLength?: number, maxLength?: number): GeneralValidationError[] => {
  const errors: GeneralValidationError[] = [];
  
  if (!Array.isArray(array)) {
    errors.push({ field: fieldName, message: `${fieldName} musi być tablicą` });
    return errors;
  }
  
  if (minLength !== undefined && array.length < minLength) {
    errors.push({ field: fieldName, message: `${fieldName} musi zawierać co najmniej ${minLength} elementów` });
  }
  
  if (maxLength !== undefined && array.length > maxLength) {
    errors.push({ field: fieldName, message: `${fieldName} może zawierać maksymalnie ${maxLength} elementów` });
  }
  
  return errors;
};

// Walidacja czy obiekt ma wymagane właściwości
export const validateObjectProperties = (obj: any, requiredProperties: string[], objectName: string): GeneralValidationError[] => {
  const errors: GeneralValidationError[] = [];
  
  if (!obj || typeof obj !== 'object') {
    errors.push({ field: objectName, message: `${objectName} musi być obiektem` });
    return errors;
  }
  
  requiredProperties.forEach(prop => {
    if (!(prop in obj) || obj[prop] === null || obj[prop] === undefined) {
      errors.push({ field: `${objectName}.${prop}`, message: `${prop} w ${objectName} jest wymagane` });
    }
  });
  
  return errors;
};
