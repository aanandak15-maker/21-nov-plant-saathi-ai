import { useNavigate } from "react-router-dom";
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";

interface Props {
  weather: any;
  irrigation: any;
}

export const WeatherWaterWidget = ({ weather, irrigation }: Props) => {
  const navigate = useNavigate();

  if (!weather) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <p className="text-sm text-gray-600 text-center">Loading weather...</p>
      </div>
    );
  }

  const current = weather.current || {};
  const temp = Math.round(current.temp || 0);
  const humidity = current.humidity || 0;
  const windSpeed = Math.round(current.wind_speed || 0);
  const description = current.weather?.[0]?.description || 'Clear';

  const getWeatherEmoji = (desc: string) => {
    const lower = desc.toLowerCase();
    if (lower.includes('rain')) return '🌧️';
    if (lower.includes('cloud')) return '☁️';
    if (lower.includes('clear')) return '☀️';
    if (lower.includes('storm')) return '⛈️';
    return '🌤️';
  };

  const getIrrigationAdvice = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 10) {
      return {
        icon: '💧',
        text: 'Perfect time to water',
        detail: 'Morning watering saves water & money',
        color: 'bg-blue-50 border-blue-500 text-blue-900'
      };
    }
    
    if (hour >= 16 && hour < 19) {
      return {
        icon: '💧',
        text: 'Good time to water',
        detail: 'Evening watering is also effective',
        color: 'bg-blue-50 border-blue-500 text-blue-900'
      };
    }
    
    if (irrigation?.nextIrrigation) {
      return {
        icon: '📅',
        text: 'Next watering',
        detail: new Date(irrigation.nextIrrigation).toLocaleDateString(),
        color: 'bg-gray-50 border-gray-300 text-gray-900'
      };
    }
    
    return null;
  };

  const irrigationAdvice = getIrrigationAdvice();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Weather & Water</h2>
              <p className="text-xs text-blue-50">Today's conditions</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/weather')}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            Forecast →
          </button>
        </div>
      </div>

      {/* Weather Info */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getWeatherEmoji(description)}</span>
              <div>
                <p className="text-2xl font-bold text-gray-900">{temp}°C</p>
                <p className="text-sm text-gray-600 capitalize">{description}</p>
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="text-center">
              <Droplets className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              <p className="text-xs text-gray-600">Humidity</p>
              <p className="text-sm font-bold text-gray-900">{humidity}%</p>
            </div>
            <div className="text-center">
              <Wind className="w-4 h-4 mx-auto text-gray-600 mb-1" />
              <p className="text-xs text-gray-600">Wind</p>
              <p className="text-sm font-bold text-gray-900">{windSpeed} km/h</p>
            </div>
            <div className="text-center">
              <Thermometer className="w-4 h-4 mx-auto text-red-600 mb-1" />
              <p className="text-xs text-gray-600">Feels Like</p>
              <p className="text-sm font-bold text-gray-900">{Math.round(current.feels_like || temp)}°C</p>
            </div>
          </div>
        </div>

        {/* Irrigation Advice */}
        {irrigationAdvice && (
          <div className={`rounded-lg p-4 border-l-4 ${irrigationAdvice.color}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{irrigationAdvice.icon}</span>
              <div>
                <p className="font-bold text-sm">{irrigationAdvice.text}</p>
                <p className="text-xs opacity-80">{irrigationAdvice.detail}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
