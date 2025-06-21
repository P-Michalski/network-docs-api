console.log('Starting simple validation test...');

// Symulacja walidacji typu PC
function testDeviceTypeValidation() {
    const allowedTypes = ['Router', 'Switch', 'Access Point', 'PC', 'Server', 'Printer'];
    const testType = 'PC';
    
    console.log('Test typu urządzenia:');
    console.log('Dozwolone typy:', allowedTypes);
    console.log('Testowany typ:', testType);
    console.log('Czy dozwolony?', allowedTypes.includes(testType));
}

testDeviceTypeValidation();

// Test prędkości portu
function testPortSpeedValidation() {
    const allowedSpeeds = ['10Mb/s', '100Mb/s', '1Gb/s', '2,5Gb/s', '5Gb/s', '10Gb/s', '25Gb/s'];
    const testSpeed = '5Gb/s';
    
    console.log('\nTest prędkości portu:');
    console.log('Dozwolone prędkości:', allowedSpeeds);
    console.log('Testowana prędkość:', testSpeed);
    console.log('Czy dozwolona?', allowedSpeeds.includes(testSpeed));
}

testPortSpeedValidation();

console.log('\nTest zakończony.');
