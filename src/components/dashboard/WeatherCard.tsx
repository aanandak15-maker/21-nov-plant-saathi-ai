import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Thermometer, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WeatherCardProps {
  weatherData: any;
  irrigationData: any;
}

export const WeatherCard = ({ weatherData, irrigationData }: WeatherCardProps) => {
  const { t } = useTranslation();

  if (!weatherData) {
    return null;
  }

  const { current, daily } = weatherData;
  const todayIrrigation = irrigationData?.schedule?.find((s: any) => {
    const today = new Date().toISOString().split('T')[0];
    return s.date === today && !s.isSkipped;
  });

  return (
    <div className="bg-gradient-to-br from-blue-400 to-cyan-500 text-white rounded-2xl p-5 shadow-lg mb-6">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm opacity-90">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
          </p>
        </div>
        {/* Large Sun Icon */}
        <div className="w-16 h-16">
          <img
            src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
            alt={current.description}
            className="w-full h-full filter drop-shadow-lg"
          />
        </div>
      </div>

      {/* Temperature Display */}
      <div className="mb-4">
        <div className="text-5xl font-bold">{current.temp}°C</div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 text-sm mb-4">
        <div className="flex items-center gap-1.5">
          <Droplets className="h-4 w-4" />
          <span>Humidity: {current.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind className="h-4 w-4" />
          <span>Wind: {current.wind_speed} km/h</span>
        </div>
      </div>

      {/* Irrigation Status Badge */}
      {todayIrrigation ? (
        <div className="bg-white/25 backdrop-blur-sm border border-white/40 rounded-lg px-3 py-2 inline-block">
          <p className="text-xs font-semibold">Irrigation: {todayIrrigation.time}</p>
        </div>
      ) : (
        <div className="bg-white/25 backdrop-blur-sm border border-white/40 rounded-lg px-3 py-2 inline-block">
          <p className="text-xs font-semibold">Irrigation: Skip Today</p>
        </div>
      )}
    </div>
  );
};
