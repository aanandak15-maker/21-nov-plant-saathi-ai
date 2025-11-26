/**
 * WeatherService - OpenWeather API integration for agricultural weather forecasting
 */

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
  uv_index?: number;
  sunrise?: number;
  sunset?: number;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  pop: number; // Probability of precipitation
  description: string;
  icon: string;
}

export interface WeatherData {
  location: string;
  country: string;
  current: CurrentWeather;
  daily: ForecastDay[]; // 16-day forecast
  hourly: HourlyForecast[]; // 4-day hourly forecast
  farmingAdvice: string[];
}

export class WeatherService {
  private baseUrl: string;

  constructor() {
    // Use the backend proxy URL (default to localhost:3001 if not set)
    this.baseUrl = import.meta.env.VITE_SATELLITE_PROXY_URL || 'http://localhost:3001';
  }

  /**
   * Get current weather and forecast by city name
   */
  async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      // Get current weather from backend
      const currentResponse = await fetch(
        `${this.baseUrl}/api/weather/current?city=${encodeURIComponent(city)}`
      );

      if (!currentResponse.ok) {
        console.error(`Weather API error: ${currentResponse.status}`);
        return this.getMockWeatherData(city);
      }

      const currentData = await currentResponse.json();
      const { lat, lon } = currentData.coord;

      // Now fetch the full 16-day and hourly data using coordinates
      return this.getWeatherByCoords(lat, lon, city);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return this.getMockWeatherData(city);
    }
  }

  /**
   * Get weather by coordinates (16-day daily + hourly)
   */
  async getWeatherByCoords(lat: number, lon: number, cityName?: string): Promise<WeatherData> {
    try {
      console.log('📊 Fetching 16-day & hourly forecast from Backend Proxy');

      // 1. Get Current Weather
      const currentResponse = await fetch(
        `${this.baseUrl}/api/weather/current?lat=${lat}&lon=${lon}`
      );
      const currentData = await currentResponse.json();

      // 2. Get 16-Day Daily Forecast
      const dailyResponse = await fetch(
        `${this.baseUrl}/api/weather/forecast/daily?lat=${lat}&lon=${lon}&cnt=16`
      );
      const dailyData = await dailyResponse.json();

      // 3. Get Hourly Forecast
      const hourlyResponse = await fetch(
        `${this.baseUrl}/api/weather/forecast/hourly?lat=${lat}&lon=${lon}`
      );
      const hourlyData = await hourlyResponse.json();

      return this.formatWeatherData(currentData, dailyData, hourlyData, cityName);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw error;
    }
  }

  /**
   * Format API response to our data structure
   */
  private formatWeatherData(currentData: any, dailyData: any, hourlyData: any, cityName?: string): WeatherData {
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

    // Process 16-day daily forecast
    const daily: ForecastDay[] = (dailyData.list || []).map((day: any) => {
      const date = new Date(day.dt * 1000);
      return {
        date: date.toISOString().split('T')[0],
        day: this.getDayName(date),
        temp_max: Math.round(day.temp.max),
        temp_min: Math.round(day.temp.min),
        description: day.weather[0].main,
        icon: day.weather[0].icon,
        precipitation: Math.round((day.pop || 0) * 100),
        humidity: day.humidity,
        wind_speed: Math.round(day.speed),
        uv_index: 0, // Not available in standard daily forecast, would need OneCall
        sunrise: day.sunrise,
        sunset: day.sunset
      };
    });

    // Process hourly forecast
    const hourly: HourlyForecast[] = (hourlyData.list || []).map((hour: any) => ({
      dt: hour.dt,
      temp: Math.round(hour.main.temp),
      feels_like: Math.round(hour.main.feels_like),
      humidity: hour.main.humidity,
      pressure: hour.main.pressure,
      wind_speed: hour.wind.speed,
      wind_deg: hour.wind.deg,
      clouds: hour.clouds.all,
      pop: hour.pop || 0,
      description: hour.weather[0].description,
      icon: hour.weather[0].icon
    }));

    // Generate advanced farming advice based on 16-day data
    const farmingAdvice = this.generateFarmingAdvice(current, daily, hourly);

    return {
      location: cityName || currentData.name,
      country: currentData.sys.country,
      current,
      daily,
      hourly,
      farmingAdvice,
    };
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
   * Generate actionable farming advice based on 16-day and hourly weather
   */
  private generateFarmingAdvice(current: CurrentWeather, daily: ForecastDay[], hourly: HourlyForecast[]): string[] {
    const advice: string[] = [];

    // 1. Spray Window Finder (Hourly Analysis)
    // Look for next 24h window with wind < 15km/h, no rain, humidity > 50%
    const bestSprayWindow = hourly.slice(0, 24).find(h =>
      h.wind_speed < 15 && h.pop < 0.2 && h.humidity > 50 && h.humidity < 85
    );
    if (bestSprayWindow) {
      const time = new Date(bestSprayWindow.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      advice.push(`🚿 **Best Spray Window**: Tomorrow around ${time}. Low wind & no rain.`);
    } else {
      advice.push(`⚠️ **Avoid Spraying**: High wind or rain expected in next 24h.`);
    }

    // 2. Irrigation Scheduling (16-Day Forecast)
    const rainComing = daily.slice(0, 5).some(d => d.precipitation > 30);
    if (rainComing) {
      const rainDay = daily.find(d => d.precipitation > 30);
      advice.push(`🌧️ **Rain Alert**: Heavy rain expected on ${rainDay?.day}. **SKIP irrigation** to save water.`);
    } else if (current.temp > 35) {
      advice.push(`💧 **Irrigation Needed**: High heat & no rain next 5 days. Irrigate immediately.`);
    }

    // 3. Disease Risk (Humidity + Temp)
    const highRiskDays = daily.filter(d => d.humidity > 85 && d.temp_max > 20 && d.temp_max < 30);
    if (highRiskDays.length >= 2) {
      advice.push(`🍄 **Disease Risk HIGH**: Humid & warm weather ahead. Watch for fungal outbreaks (Blight/Mildew).`);
    }

    // 4. Heat Stress
    const heatWave = daily.filter(d => d.temp_max > 38);
    if (heatWave.length > 0) {
      advice.push(`🔥 **Heat Stress Alert**: Temperatures > 38°C expected. Apply mulch & light irrigation.`);
    }

    // 5. Frost Risk
    const frostDays = daily.filter(d => d.temp_min < 5);
    if (frostDays.length > 0) {
      advice.push(`❄️ **Frost Warning**: Low temps (<5°C) expected. Cover crops or smoke fields.`);
    }

    // 6. Harvest Planning
    const drySpell = daily.slice(0, 7).every(d => d.precipitation < 10);
    if (drySpell && daily[0].temp_max > 25) {
      advice.push(`🌾 **Harvest Window**: Next 7 days are dry. Perfect for harvesting & drying.`);
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

    const daily: ForecastDay[] = [];
    for (let i = 0; i < 16; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      daily.push({
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

    const hourly: HourlyForecast[] = [];
    for (let i = 0; i < 24; i++) {
      hourly.push({
        dt: Math.floor(Date.now() / 1000) + i * 3600,
        temp: 28 + Math.random() * 2,
        feels_like: 30,
        humidity: 60,
        pressure: 1012,
        wind_speed: 10,
        wind_deg: 180,
        clouds: 20,
        pop: 0,
        description: 'Sunny',
        icon: '01d'
      });
    }

    const farmingAdvice = this.generateFarmingAdvice(current, daily, hourly);

    return {
      location,
      country: 'IN',
      current,
      daily,
      hourly,
      farmingAdvice,
    };
  }
}

// Create singleton instance
export const weatherService = new WeatherService();
