import { validateWifiConnection } from '../validators/connection.validators';

// Test walidacji połączenia karty WiFi z samą sobą
async function testWifiSelfConnection() {
    console.log('🧪 Testowanie walidacji połączenia karty WiFi z samą sobą...');
    
    // Test 1: Próba połączenia karty z samą sobą (to samo ID)
    try {
        const result = await validateWifiConnection(1, 1, "100Mb/s", "2.4GHz");
        
        if (!result.isValid) {
            const selfConnectionError = result.errors.find(error => 
                error.message.includes('Nie można połączyć karty z samą sobą')
            );
            
            if (selfConnectionError) {
                console.log('✅ Test 1 PRZESZEDŁ: Walidacja poprawnie odrzuca połączenie karty z samą sobą');
                console.log(`   Komunikat błędu: ${selfConnectionError.message}`);
            } else {
                console.log('❌ Test 1 NIEPOMYŚLNY: Brak odpowiedniego komunikatu błędu');
                console.log('   Wszystkie błędy:', result.errors);
            }
        } else {
            console.log('❌ Test 1 NIEPOMYŚLNY: Walidacja pozwala na połączenie karty z samą sobą');
        }
    } catch (error) {
        console.log('❌ Test 1 BŁĄD:', error);
    }
    
    // Test 2: Próba połączenia dwóch różnych kart (powinno przejść przez walidację self-connection)
    try {
        const result = await validateWifiConnection(1, 2, "100Mb/s", "2.4GHz");
        
        // Sprawdzamy tylko czy nie ma błędu self-connection (inne błędy mogą wystąpić z powodu braku danych w bazie)
        const selfConnectionError = result.errors.find(error => 
            error.message.includes('Nie można połączyć karty z samą sobą')
        );
        
        if (!selfConnectionError) {
            console.log('✅ Test 2 PRZESZEDŁ: Walidacja nie blokuje połączenia różnych kart WiFi (pod względem self-connection)');
        } else {
            console.log('❌ Test 2 NIEPOMYŚLNY: Walidacja błędnie blokuje połączenie różnych kart');
            console.log(`   Niepoprawny komunikat: ${selfConnectionError.message}`);
        }
    } catch (error) {
        console.log('❌ Test 2 BŁĄD:', error);
    }
}

// Test walidacji identycznych ID vs różnych ID
async function testIdComparison() {
    console.log('\n🧪 Testowanie porównania ID kart WiFi...');
    
    const testCases = [
        { id1: 1, id2: 1, shouldFail: true, description: "Identyczne ID (1, 1)" },
        { id1: 0, id2: 0, shouldFail: true, description: "Identyczne ID (0, 0)" },
        { id1: 1, id2: 2, shouldFail: false, description: "Różne ID (1, 2)" },
        { id1: 2, id2: 1, shouldFail: false, description: "Różne ID odwrócone (2, 1)" },
        { id1: 100, id2: 200, shouldFail: false, description: "Różne ID większe (100, 200)" }
    ];
    
    for (const testCase of testCases) {
        try {
            const result = await validateWifiConnection(testCase.id1, testCase.id2, "100Mb/s", "2.4GHz");
            
            const selfConnectionError = result.errors.find(error => 
                error.message.includes('Nie można połączyć karty z samą sobą')
            );
            
            const hasSelfConnectionError = !!selfConnectionError;
            
            if (testCase.shouldFail && hasSelfConnectionError) {
                console.log(`✅ Test ${testCase.description}: PRZESZEDŁ (poprawnie odrzucono)`);
            } else if (!testCase.shouldFail && !hasSelfConnectionError) {
                console.log(`✅ Test ${testCase.description}: PRZESZEDŁ (poprawnie nie odrzucono self-connection)`);
            } else if (testCase.shouldFail && !hasSelfConnectionError) {
                console.log(`❌ Test ${testCase.description}: NIEPOMYŚLNY (powinno być odrzucone, ale nie było)`);
            } else {
                console.log(`❌ Test ${testCase.description}: NIEPOMYŚLNY (nie powinno być odrzucone, ale było)`);
            }
            
        } catch (error) {
            console.log(`❌ Test ${testCase.description}: BŁĄD - ${error}`);
        }
    }
}

// Uruchom testy
async function runTests() {
    console.log('🚀 Rozpoczynam testy walidacji połączeń WiFi...\n');
    
    await testWifiSelfConnection();
    await testIdComparison();
    
    console.log('\n✨ Testy zakończone!');
}

runTests().catch(console.error);
