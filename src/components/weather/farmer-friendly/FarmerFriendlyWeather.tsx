import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cloud, Droplets, Wind, Calendar, AlertTriangle } from "lucide-react";
import { weatherService } from "@/lib/weatherService";

interface WeatherData {
  current: any;
  forecast: any[];
}

export const FarmerFriendlyWeather = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    try {
      setLoading(true);
      const location = await weatherService.getCurrentLocation();
      const data = await weatherService.getWeatherByCoords(location.lat, location.lon);
      setWeather(data);
    } catch (error) {
      console.error("Failed to load weather:", error);
      const data = await weatherService.getWeatherByCity("Delhi");
      setWeather(data);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherEmoji = (description: string) => {
    const lower = description.toLowerCase();
    if (lower.includes('rain')) return '🌧️';
    if (lower.includes('cloud')) return '☁️';
    if (lower.includes('clear')) return '☀️';
    if (lower.includes('storm')) return '⛈️';
    if (lower.includes('snow')) return '❄️';
    return '🌤️';
  };

  const getIrrigationAdvice = () => {
    if (!weather) return null;
    
    const hour = new Date().getHours();
    const humidity = weather.current?.humidity || 0;
    
    // Check for upcoming rain
    const rainSoon = weather.forecast?.slice(0, 2).some((day: any) => 
      day.weather?.[0]?.main === 'Rain'
    );
    
    if (rainSoon) {
      return {
        icon: '🌧️',
        title: 'Rain expected soon',
        advice: 'No need to water - rain will do it',
        color: 'bg-blue-50 border-blue-500 text-blue-900'
      };
    }
    
    if (hour >= 5 && hour < 10) {
      return {
        icon: '💧',
        title: 'Perfect time to water',
        advice: 'Morning watering saves water & money',
        color: 'bg-green-50 border-green-500 text-green-900'
      };
    }
    
    if (hour >= 16 && hour < 19) {
      return {
        icon: '💧',
        title: 'Good time to water',
        advice: 'Evening watering is also effective',
        color: 'bg-blue-50 border-blue-500 text-blue-900'
      };
    }
    
    if (humidity > 80) {
      return {
        icon: '🦠',
        title: 'High disease risk',
        advice: 'Humid weather favors fungal diseases',
        color: 'bg-orange-50 border-orange-500 text-orange-900'
      };
    }
    
    return null;
  };

  const getFarmingAdvice = () => {
    if (!weather) return [];
    
    const advice: string[] = [];
    const current = weather.current;
    const forecast = weather.forecast || [];
    
    // Wind advice
    const windSpeed = current?.wind_speed || 0;
    if (windSpeed < 10) {
      advice.push('🧪 Low wind - Good for spraying pesticides');
    } else if (windSpeed > 20) {
      advice.push('🌬️ High wind - Avoid spraying today');
    }
    
    // Rain advice
    const rainToday = forecast[0]?.weather?.[0]?.main === 'Rain';
    const rainTomorrow = forecast[1]?.weather?.[0]?.main === 'Rain';
    
    if (rainToday) {
      advice.push('🌧️ Rain today - Postpone field work');
    } else if (rainTomorrow) {
      advice.push('🌧️ Rain tomorrow - Complete urgent work today');
    }
    
    // Temperature advice
    const temp = current?.temp || 0;
    if (temp > 35) {
      advice.push('🌡️ Very hot - Water crops in evening');
    } else if (temp < 15) {
      advice.push('🌡️ Cold weather - Protect sensitive crops');
    }
    
    return advice;
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Cloud className="w-12 h-12 mx-auto text-blue-600 animate-pulse mb-2" />
          <p className="text-sm text-gray-600">Loading weather...</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-orange-600 mb-2" />
          <p className="text-sm text-gray-600">Failed to load weather</p>
          <button
            onClick={loadWeather}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const current = weather.current;
  const temp = Math.round(current?.temp || 0);
  const humidity = current?.humidity || 0;
  const windSpeed = Math.round(current?.wind_speed || 0);
  const description = current?.weather?.[0]?.description || 'Clear';
  const irrigationAdvice = getIrrigationAdvice();
  const farmingAdvice = getFarmingAdvice();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-1">🌦️ Weather</h1>
        <p className="text-sm text-blue-50">Your location forecast</p>
      </header>

      <div className="p-4 space-y-4">
        {/* Today's Weather */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white shadow-lg">
          <h2 className="text-lg font-bold mb-4">☀️ Today</h2>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-6xl">{getWeatherEmoji(description)}</span>
              <div>
                <p className="text-4xl font-bold">{temp}°C</p>
                <p className="text-sm text-blue-50 capitalize">{description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center">
              <Droplets className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs text-blue-50">Humidity</p>
              <p className="text-lg font-bold">{humidity}%</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center">
              <Wind className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs text-blue-50">Wind</p>
              <p className="text-lg font-bold">{windSpeed} km/h</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center">
              <Cloud className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs text-blue-50">Feels Like</p>
              <p className="text-lg font-bold">{Math.round(current?.feels_like || temp)}°C</p>
            </div>
          </div>
        </div>

        {/* Irrigation Advice */}
        {irrigationAdvice && (
          <div className={`rounded-xl p-5 border-l-4 ${irrigationAdvice.color}`}>
            <div className="flex items-start gap-3">
              <span className="text-3xl">{irrigationAdvice.icon}</span>
              <div>
                <h3 className="font-bold text-lg mb-1">{irrigationAdvice.title}</h3>
                <p className="text-sm opacity-80">{irrigationAdvice.advice}</p>
              </div>
            </div>
          </div>
        )}

        {/* Farming Advice */}
        {farmingAdvice.length > 0 && (
          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h3 className="font-bold text-green-900 mb-3">💡 Farming Advice</h3>
            <div className="space-y-2">
              {farmingAdvice.map((advice, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-green-800">
                  <span>•</span>
                  <span>{advice}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7-Day Forecast */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-900">7-Day Forecast</h2>
            </div>
            <button
              onClick={() => navigate('/weather/detailed')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View Details →
            </button>
          </div>

          <div className="space-y-2">
            {weather.forecast?.slice(0, 7).map((day: any, idx: number) => {
              const dayTemp = Math.round(day.temp?.day || day.temp || 0);
              const dayDesc = day.weather?.[0]?.description || 'Clear';
              const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : getDayName(day.dt_txt || day.dt);
              
              return (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getWeatherEmoji(dayDesc)}</span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{dayName}</p>
                      <p className="text-xs text-gray-600 capitalize">{dayDesc}</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{dayTemp}°C</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/weather/detailed')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all active:scale-98"
          >
            <Calendar className="w-8 h-8 text-blue-600 mb-2" />
            <p className="font-bold text-gray-900 text-sm">16-Day Forecast</p>
            <p className="text-xs text-gray-600">Extended view</p>
          </button>

          <button
            onClick={() => navigate('/jal-saathi')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all active:scale-98"
          >
            <Droplets className="w-8 h-8 text-cyan-600 mb-2" />
            <p className="font-bold text-gray-900 text-sm">Irrigation Plan</p>
            <p className="text-xs text-gray-600">Water schedule</p>
          </button>
        </div>
      </div>
    </div>
  );
};
