/**
 * Test OpenWeather API key capabilities
 * Run with: node test-weather-premium.js
 */

const API_KEY = 'c1a7f0bdd3017863f8fd443972557632';
const lat = 28.3670;
const lon = 77.5673;

async function testWeatherAPIs() {
  console.log('🧪 Testing OpenWeather API Key Capabilities\n');
  console.log(`API Key: ${API_KEY}`);
  console.log(`Location: ${lat}°N, ${lon}°E (Dankaur, UP)\n`);

  // Test 1: Current Weather (Free tier)
  console.log('1️⃣ Testing Current Weather API (Free tier)...');
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    console.log(`   Status: ${response.status} ${response.statusText}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ SUCCESS: ${data.name}, ${data.main.temp}°C, ${data.weather[0].description}`);
    } else {
      const error = await response.text();
      console.log(`   ❌ FAILED: ${error}`);
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }

  console.log('');

  // Test 2: 5-day Forecast (Free tier)
  console.log('2️⃣ Testing 5-day Forecast API (Free tier)...');
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    console.log(`   Status: ${response.status} ${response.statusText}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ SUCCESS: ${data.list.length} forecast points`);
    } else {
      const error = await response.text();
      console.log(`   ❌ FAILED: ${error}`);
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }

  console.log('');

  // Test 3: One Call API 2.5 (Deprecated but might still work)
  console.log('3️⃣ Testing One Call API 2.5 (Deprecated)...');
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,hourly`
    );
    console.log(`   Status: ${response.status} ${response.statusText}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ SUCCESS: ${data.daily?.length || 0} days forecast`);
    } else {
      const error = await response.text();
      console.log(`   ❌ FAILED: ${error}`);
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }

  console.log('');

  // Test 4: One Call API 3.0 (Requires paid subscription)
  console.log('4️⃣ Testing One Call API 3.0 (Requires Pro/Student plan)...');
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,hourly`
    );
    console.log(`   Status: ${response.status} ${response.statusText}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ SUCCESS: ${data.daily?.length || 0} days forecast available`);
      console.log(`   🎉 Your Pro/Student plan is ACTIVE!`);
    } else {
      const error = await response.text();
      console.log(`   ❌ FAILED: ${error}`);
      if (response.status === 401) {
        console.log(`   ℹ️  This means:`);
        console.log(`      - Your API key is valid for free tier`);
        console.log(`      - One Call API 3.0 is not activated`);
        console.log(`      - Check your OpenWeather subscription status`);
        console.log(`      - Student plan might need manual activation`);
      }
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }

  console.log('\n📊 Summary:');
  console.log('   - If tests 1 & 2 pass: Free tier is working');
  console.log('   - If test 4 passes: Pro/Student plan is active');
  console.log('   - If test 4 fails with 401: One Call API 3.0 not activated');
  console.log('\n💡 Next Steps if One Call API 3.0 fails:');
  console.log('   1. Log into https://home.openweathermap.org/');
  console.log('   2. Go to "Billing" or "Subscriptions"');
  console.log('   3. Verify your Student/Pro plan is active');
  console.log('   4. Check if One Call API 3.0 is enabled');
  console.log('   5. You might need to generate a new API key after activation');
}

testWeatherAPIs();
