
const BASE_URL = 'http://127.0.0.1:3001';

async function testWeatherEndpoints() {
    console.log('🧪 Testing Weather Endpoints...');

    try {
        // Test Current Weather
        console.log('\n1. Testing /api/weather/current (London)...');
        const currentRes = await fetch(`${BASE_URL}/api/weather/current?city=London`);
        if (currentRes.ok) {
            const data = await currentRes.json();
            console.log('✅ Current Weather Success:', data.weather[0].description);
        } else {
            console.error('❌ Current Weather Failed:', currentRes.status, await currentRes.text());
        }

        // Test 16-Day Daily Forecast
        console.log('\n2. Testing /api/weather/forecast/daily (London)...');
        const dailyRes = await fetch(`${BASE_URL}/api/weather/forecast/daily?city=London&cnt=16`);
        if (dailyRes.ok) {
            const data = await dailyRes.json();
            console.log('✅ Daily Forecast Success:', data.list?.length, 'days');
            if (data.list && data.list.length > 0) {
                console.log('   Sample:', new Date(data.list[0].dt * 1000).toISOString().split('T')[0],
                    'Temp:', data.list[0].temp.day, '°C');
            }
        } else {
            console.error('❌ Daily Forecast Failed:', dailyRes.status, await dailyRes.text());
        }

        // Test Hourly Forecast
        console.log('\n3. Testing /api/weather/forecast/hourly (London)...');
        const hourlyRes = await fetch(`${BASE_URL}/api/weather/forecast/hourly?city=London`);
        if (hourlyRes.ok) {
            const data = await hourlyRes.json();
            console.log('✅ Hourly Forecast Success:', data.list?.length, 'items');
            if (data.isFallback) console.log('   (Using fallback standard forecast)');
        } else {
            console.error('❌ Hourly Forecast Failed:', hourlyRes.status, await hourlyRes.text());
        }
    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        console.log('Make sure the backend server is running on port 3001');
    }
}

testWeatherEndpoints();
