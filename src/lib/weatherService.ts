/**
 * WeatherService - OpenWeather API integration for agricultural weather forecasting
 */

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  visibility: number;
  dt: number;
}

export interface ForecastDay {
  date: string;
  day: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
  precipitation: number;
  humidity: number;
  wind_speed: number;
}

export interface WeatherData {
  location: string;
  country: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
  farmingAdvice: string[];
}

export class WeatherService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = OPENWEATHER_API_KEY;
    this.baseUrl = OPENWEATHER_BASE_URL;
  }

  /**
   * Get current weather and forecast by city name
   */
  async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      // Validate city name (not coordinates)
      if (!city || city.includes('°') || city.includes(',')) {
        city = 'Delhi';
      }

      // Get current weather
      const currentResponse = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
      );

      if (!currentResponse.ok) {
        // Silently return mock data for 404 errors
        if (currentResponse.status === 404) {
          return this.getMockWeatherData(city);
        }
        console.error(`Weather API error: ${currentResponse.status}`);
        // Return mock data if API fails
        return this.getMockWeatherData(city);
      }

      const currentData = await currentResponse.json();

      // Get 5-day forecast (40 data points, 3-hour intervals)
      const forecastResponse = await fetch(
        `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric&cnt=40`
      );

      if (!forecastResponse.ok) {
        console.error(`Forecast API error: ${forecastResponse.status}`);
        // Return mock data if API fails
        return this.getMockWeatherData(city);
      }

      const forecastData = await forecastResponse.json();
      console.log('📊 Forecast API response for', city, ':', {
        count: forecastData.list?.length,
        sample: forecastData.list?.slice(0, 2)
      });

      const result = this.formatWeatherData(currentData, forecastData);
      console.log('📅 Formatted forecast days:', result.forecast.length, result.forecast.map(d => ({
        day: d.day,
        date: d.date,
        precip: d.precipitation
      })));

      return result;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      // Return mock data as fallback
      return this.getMockWeatherData(city);
    }
  }

  /**
   * Get weather by coordinates (using Daily Forecast API for 16-day forecast)
   */
  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    // Validate coordinates
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      console.warn('Invalid coordinates provided, using default location');
      return this.getWeatherByCity('Delhi');
    }

    try {
      // Use Daily Forecast API (16-day forecast - you have paid access!)
      const dailyForecastResponse = await fetch(
        `${this.baseUrl}/forecast/daily?lat=${lat}&lon=${lon}&cnt=16&appid=${this.apiKey}&units=metric`
      );

      if (dailyForecastResponse.ok) {
        const dailyData = await dailyForecastResponse.json();
        console.log('✅ Using Daily Forecast API - 16-day forecast available');
        console.log(`� Fornecast days: ${dailyData.list?.length || 0}`);

        return this.formatDailyForecastData(dailyData);
      } else {
        // Only log non-404 errors (404 means location not found, which is expected for invalid coords)
        if (dailyForecastResponse.status !== 404) {
          console.log(`⚠️ Daily Forecast API returned ${dailyForecastResponse.status}. Falling back to 5-day forecast.`);
        }
        // Fallback to standard API (5-day forecast)
        return this.getWeatherByCoordsFallback(lat, lon);
      }
    } catch (error) {
      // Silently fallback for network errors
      return this.getWeatherByCity('Delhi');
    }
  }

  /**
   * Fallback method using old API (5-day forecast)
   */
  private async getWeatherByCoordsFallback(lat: number, lon: number): Promise<WeatherData> {
    try {
      // Get current weather
      const currentResponse = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );

      if (!currentResponse.ok) {
        // If coordinates are invalid, use default location
        if (currentResponse.status === 404 || currentResponse.status === 400) {
          return this.getWeatherByCity('Delhi');
        }
        throw new Error(`Weather API error: ${currentResponse.status}`);
      }

      const currentData = await currentResponse.json();

      // Get 5-day forecast
      const forecastResponse = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );

      if (!forecastResponse.ok) {
        // If forecast fails, use current weather only with mock forecast
        return this.getMockWeatherData(currentData.name);
      }

      const forecastData = await forecastResponse.json();

      return this.formatWeatherData(currentData, forecastData);
    } catch (error) {
      // Silently fallback to default location
      return this.getWeatherByCity('Delhi');
    }
  }

  /**
   * Format One Call API 3.0 response (16-day forecast)
   */
  private formatOneCallData(oneCallData: any, locationName: string, country: string): WeatherData {
    const current: CurrentWeather = {
      temp: Math.round(oneCallData.current.temp),
      feels_like: Math.round(oneCallData.current.feels_like),
      temp_min: Math.round(oneCallData.current.temp),
      temp_max: Math.round(oneCallData.current.temp),
      humidity: oneCallData.current.humidity,
      pressure: oneCallData.current.pressure,
      description: oneCallData.current.weather[0].description,
      icon: oneCallData.current.weather[0].icon,
      wind_speed: oneCallData.current.wind_speed,
      wind_deg: oneCallData.current.wind_deg,
      clouds: oneCallData.current.clouds,
      visibility: oneCallData.current.visibility,
      dt: oneCallData.current.dt,
    };

    // Process daily forecast (up to 16 days)
    const forecast: ForecastDay[] = oneCallData.daily.slice(0, 16).map((day: any, index: number) => {
      const date = new Date(day.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];
      const dayName = this.getDayName(date);

      return {
        date: dateKey,
        day: dayName,
        temp_max: Math.round(day.temp.max),
        temp_min: Math.round(day.temp.min),
        description: day.weather[0].main,
        icon: day.weather[0].icon,
        precipitation: Math.round((day.pop || 0) * 100),
        humidity: day.humidity,
        wind_speed: Math.round(day.wind_speed),
      };
    });

    // Generate farming advice based on weather
    const farmingAdvice = this.generateFarmingAdvice(current, forecast);

    return {
      location: locationName,
      country: country,
      current,
      forecast,
      farmingAdvice,
    };
  }

  /**
   * Format Daily Forecast API response (16-day forecast)
   */
  private formatDailyForecastData(dailyData: any): WeatherData {
    const city = dailyData.city;
    
    // Use first day's data for current weather
    const firstDay = dailyData.list[0];
    const current: CurrentWeather = {
      temp: Math.round(firstDay.temp.day),
      feels_like: Math.round(firstDay.feels_like.day),
      temp_min: Math.round(firstDay.temp.min),
      temp_max: Math.round(firstDay.temp.max),
      humidity: firstDay.humidity,
      pressure: firstDay.pressure,
      description: firstDay.weather[0].description,
      icon: firstDay.weather[0].icon,
      wind_speed: firstDay.speed,
      wind_deg: firstDay.deg,
      clouds: firstDay.clouds,
      visibility: 10000, // Default visibility
      dt: firstDay.dt,
    };

    // Process daily forecast (up to 16 days)
    const forecast: ForecastDay[] = dailyData.list.map((day: any) => {
      const date = new Date(day.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];
      const dayName = this.getDayName(date);

      return {
        date: dateKey,
        day: dayName,
        temp_max: Math.round(day.temp.max),
        temp_min: Math.round(day.temp.min),
        description: day.weather[0].main,
        icon: day.weather[0].icon,
        precipitation: Math.round((day.pop || 0) * 100),
        humidity: day.humidity,
        wind_speed: Math.round(day.speed),
      };
    });

    // Generate farming advice based on weather
    const farmingAdvice = this.generateFarmingAdvice(current, forecast);

    return {
      location: city.name,
      country: city.country,
      current,
      forecast,
      farmingAdvice,
    };
  }

  /**
   * Format API response to our data structure (fallback method)
   */
  private formatWeatherData(currentData: any, forecastData: any): WeatherData {
    const current: CurrentWeather = {
      temp: Math.round(currentData.main.temp),
      feels_like: Math.round(currentData.main.feels_like),
      temp_min: Math.round(currentData.main.temp_min),
      temp_max: Math.round(currentData.main.temp_max),
      humidity: currentData.main.humidity,
      pressure: currentData.main.pressure,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      wind_speed: currentData.wind.speed,
      wind_deg: currentData.wind.deg,
      clouds: currentData.clouds.all,
      visibility: currentData.visibility,
      dt: currentData.dt,
    };

    // Process forecast (group by day)
    const forecastByDay = this.groupForecastByDay(forecastData.list);

    const forecast: ForecastDay[] = forecastByDay.slice(0, 16);

    // Generate farming advice based on weather
    const farmingAdvice = this.generateFarmingAdvice(current, forecast);

    return {
      location: currentData.name,
      country: currentData.sys.country,
      current,
      forecast,
      farmingAdvice,
    };
  }

  /**
   * Group forecast data by day
   */
  private groupForecastByDay(forecastList: any[]): ForecastDay[] {
    console.log('🔄 Grouping forecast data, total items:', forecastList.length);
    const days: { [key: string]: any[] } = {};

    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];

      if (!days[dateKey]) {
        days[dateKey] = [];
      }
      days[dateKey].push(item);
    });

    console.log('📅 Grouped into days:', Object.keys(days).length, 'days');

    return Object.entries(days).map(([dateKey, items]) => {
      const temps = items.map((i) => i.main.temp);
      const date = new Date(dateKey);
      const dayName = this.getDayName(date);

      // Calculate precipitation probability
      const precipProb = Math.max(...items.map((i) => (i.pop || 0) * 100));

      // Get most common weather condition
      const weatherCounts: { [key: string]: number } = {};
      items.forEach((i) => {
        const desc = i.weather[0].main;
        weatherCounts[desc] = (weatherCounts[desc] || 0) + 1;
      });
      const mostCommon = Object.entries(weatherCounts).sort((a, b) => b[1] - a[1])[0][0];
      const icon = items.find((i) => i.weather[0].main === mostCommon)?.weather[0].icon || items[0].weather[0].icon;

      return {
        date: dateKey,
        day: dayName,
        temp_max: Math.round(Math.max(...temps)),
        temp_min: Math.round(Math.min(...temps)),
        description: mostCommon,
        icon,
        precipitation: Math.round(precipProb),
        humidity: Math.round(items.reduce((sum, i) => sum + i.main.humidity, 0) / items.length),
        wind_speed: Math.round(items.reduce((sum, i) => sum + i.wind.speed, 0) / items.length),
      };
    });
  }

  /**
   * Get day name from date
   */
  private getDayName(date: Date): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
  }

  /**
   * Generate actionable farming advice based on weather conditions
   */
  private generateFarmingAdvice(current: CurrentWeather, forecast: ForecastDay[]): string[] {
    const advice: string[] = [];

    // Critical temperature alerts with specific actions
    if (current.temp > 38) {
      advice.push('🔥 HEAT ALERT: Temperature above 38°C! Irrigate NOW if soil is dry. Apply light irrigation in evening (6-7 PM) to cool plants. Cover young seedlings with shade net.');
    } else if (current.temp > 35) {
      advice.push('☀️ Hot weather: Irrigate early morning (5-6 AM) or evening (6-7 PM). Avoid midday irrigation - 50% water will evaporate. Apply mulch to reduce soil temperature.');
    } else if (current.temp < 10) {
      advice.push('❄️ COLD ALERT: Frost risk! Cover crops with plastic sheets or straw before sunset. Smoke in field early morning to prevent frost damage. Delay irrigation until temperature rises.');
    } else if (current.temp < 15) {
      advice.push('🌡️ Cool weather: Good for wheat, mustard, peas. Reduce irrigation frequency. Apply light nitrogen dose for better growth. Watch for aphids in mustard.');
    }

    // Humidity-based disease prevention
    if (current.humidity > 85) {
      advice.push('💧 Very high humidity (>85%): HIGH RISK of fungal diseases! Spray Mancozeb (2g/L) or Copper Oxychloride (3g/L) preventively. Ensure good air circulation. Remove infected leaves immediately.');
    } else if (current.humidity > 75) {
      advice.push('🌫️ High humidity: Watch for leaf spot, blight, and powdery mildew. Spray Carbendazim (1g/L) if you see white patches. Avoid overhead irrigation. Space plants properly.');
    } else if (current.humidity < 30) {
      advice.push('🏜️ Very low humidity: Plants losing water fast! Increase irrigation by 20%. Spray water on leaves in evening. Apply Kaolin clay spray to reduce water loss.');
    } else if (current.humidity < 40) {
      advice.push('☀️ Low humidity: Check soil moisture daily. Irrigate when top 2 inches are dry. Mulch with straw or dry grass to retain moisture. Avoid fertilizer application.');
    }

    // Rainfall-based actionable advice
    const heavyRain = forecast.slice(0, 3).some((day) => day.precipitation > 70);
    const moderateRain = forecast.slice(0, 3).some((day) => day.precipitation > 40);
    const upcomingRain = forecast.slice(0, 2).some((day) => day.precipitation > 30);
    
    if (heavyRain) {
      advice.push('🌧️ HEAVY RAIN ALERT (>70%): Clear drainage channels NOW! Harvest ripe vegetables today. Don\'t irrigate for next 3 days. Apply fungicide after rain stops. Check for waterlogging.');
    } else if (moderateRain) {
      advice.push('🌦️ Rain expected (40-70%): Postpone pesticide/fertilizer application. Harvest ready crops. Skip irrigation. Prepare drainage. Apply Bordeaux mixture after rain to prevent fungal attack.');
    } else if (upcomingRain) {
      advice.push('☁️ Light rain possible: Hold fertilizer application. If you must spray, do it early morning. Rain will wash away chemicals. Wait 24 hours after rain for any spray.');
    } else if (forecast.every((day) => day.precipitation < 10)) {
      advice.push('☀️ No rain for 5+ days: Plan irrigation schedule. Apply fertilizer with irrigation. Good time for pesticide application. Mulch to conserve moisture. Check drip system for blockages.');
    }

    // Wind-based practical advice
    if (current.wind_speed > 25) {
      advice.push('💨 STRONG WIND (>25 km/h): Don\'t spray pesticides - waste of money! Stake tall plants (tomato, brinjal). Cover nursery beds. Check for lodging in wheat/paddy. Postpone drone spraying.');
    } else if (current.wind_speed > 15) {
      advice.push('🌬️ Windy conditions: Reduce spray pressure. Use coarse nozzles. Add sticker (Triton) to spray solution. Best time to spray: early morning when wind is calm.');
    } else if (current.wind_speed < 5) {
      advice.push('🎯 Calm weather: Perfect for pesticide application! Spray between 6-10 AM or 4-6 PM. Use recommended dose. Add surfactant for better coverage. Check spray equipment.');
    }

    // Combined conditions - critical farming windows
    if (current.temp >= 25 && current.temp <= 32 && current.humidity >= 50 && current.humidity <= 70 && current.wind_speed < 10) {
      advice.push('✅ PERFECT FARMING WEATHER: Ideal for all operations! Apply fertilizers, spray pesticides, transplant seedlings, harvest crops. Make most of this window!');
    }

    // Pest and disease alerts based on weather
    if (current.temp > 30 && current.humidity < 50) {
      advice.push('🐛 Pest Alert: Hot & dry weather favors aphids, whiteflies, and mites. Check undersides of leaves. Spray Imidacloprid (0.3ml/L) or Neem oil (5ml/L) in evening.');
    }

    if (current.temp >= 20 && current.temp <= 28 && current.humidity > 70) {
      advice.push('🦠 Disease Alert: Perfect conditions for fungal diseases! Inspect crops daily. Remove infected parts. Spray Propiconazole (1ml/L) preventively. Improve drainage.');
    }

    // Irrigation timing advice
    if (current.temp > 32) {
      advice.push('⏰ Irrigation Timing: Water between 5-7 AM (best) or 6-8 PM. Never irrigate 10 AM-4 PM in hot weather. Use drip/sprinkler to save 40% water. Check soil before watering.');
    }

    // Fertilizer application advice
    const goodForFertilizer = current.temp >= 20 && current.temp <= 35 && !upcomingRain && current.wind_speed < 15;
    if (goodForFertilizer) {
      advice.push('🌱 Fertilizer Window: Good time to apply fertilizers! Apply with irrigation. Use split doses. For vegetables: 19:19:19 (5g/L). For cereals: Urea (10kg/acre). Water immediately after application.');
    }

    // Harvest timing
    if (current.humidity < 60 && !upcomingRain && current.wind_speed < 15) {
      advice.push('🌾 Harvest Window: Good conditions for harvesting! Low humidity means faster drying. Harvest grains at 20-22% moisture. Dry immediately. Store in moisture-proof bags.');
    }

    // Specific crop advice based on season and weather
    const month = new Date().getMonth(); // 0-11
    if (month >= 9 || month <= 2) { // Oct-Feb (Rabi season)
      if (current.temp >= 15 && current.temp <= 25) {
        advice.push('🌾 Rabi Season: Perfect for wheat, mustard, chickpea, peas. First irrigation at 20-25 days. Apply Urea (50kg/acre) at tillering stage. Watch for aphids in mustard.');
      }
    } else if (month >= 5 && month <= 8) { // Jun-Sep (Kharif season)
      if (current.temp >= 25 && current.temp <= 35) {
        advice.push('🌾 Kharif Season: Good for rice, cotton, maize, soybean. Maintain 2-3 inch water in paddy. Apply Potash at flowering. Watch for stem borer in rice, bollworm in cotton.');
      }
    }

    // Water conservation tips
    if (forecast.every((day) => day.precipitation < 20) && current.temp > 30) {
      advice.push('💧 Water Conservation: Use drip irrigation (saves 50% water). Mulch with crop residue. Do basin irrigation for trees. Irrigate alternate furrows. Check for leaks in pipes.');
    }

    return advice;
  }

  /**
   * Get user's current location
   */
  async getCurrentLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * Get mock weather data as fallback when API fails
   */
  private getMockWeatherData(location: string): WeatherData {
    const current: CurrentWeather = {
      temp: 28,
      feels_like: 30,
      temp_min: 24,
      temp_max: 32,
      humidity: 65,
      pressure: 1013,
      description: 'partly cloudy',
      icon: '02d',
      wind_speed: 12,
      wind_deg: 180,
      clouds: 40,
      visibility: 10000,
      dt: Math.floor(Date.now() / 1000),
    };

    const forecast: ForecastDay[] = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      forecast.push({
        date: date.toISOString().split('T')[0],
        day: this.getDayName(date),
        temp_max: 30 + Math.floor(Math.random() * 5),
        temp_min: 22 + Math.floor(Math.random() * 5),
        description: i % 2 === 0 ? 'Sunny' : 'Partly Cloudy',
        icon: i % 2 === 0 ? '01d' : '02d',
        precipitation: Math.floor(Math.random() * 30),
        humidity: 60 + Math.floor(Math.random() * 20),
        wind_speed: 10 + Math.floor(Math.random() * 10),
      });
    }

    const farmingAdvice = this.generateFarmingAdvice(current, forecast);

    return {
      location,
      country: 'IN',
      current,
      forecast,
      farmingAdvice,
    };
  }
}

// Create singleton instance
export const weatherService = new WeatherService();
