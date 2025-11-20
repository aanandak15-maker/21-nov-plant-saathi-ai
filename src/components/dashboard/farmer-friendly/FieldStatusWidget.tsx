import { useNavigate } from "react-router-dom";
import { MapPin, TrendingUp, TrendingDown } from "lucide-react";

interface Field {
  id: string;
  name: string;
  cropType: string;
  healthScore: number;
  healthStatus: string;
  moisture?: number;
  ndvi?: number;
}

interface Props {
  fields: Field[];
}

export const FieldStatusWidget = ({ fields }: Props) => {
  const navigate = useNavigate();

  if (fields.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="text-center">
          <span className="text-4xl mb-3 block">🌾</span>
          <h3 className="font-bold text-gray-900 mb-2">No Fields Yet</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add your first field to start monitoring
          </p>
          <button
            onClick={() => navigate('/soilsati')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Add Field
          </button>
        </div>
      </div>
    );
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'monitor': return 'text-yellow-600 bg-yellow-50';
      case 'attention': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getHealthEmoji = (status: string) => {
    switch (status) {
      case 'healthy': return '🌱';
      case 'monitor': return '👀';
      case 'attention': return '⚠️';
      case 'critical': return '🚨';
      default: return '❓';
    }
  };

  const getHealthText = (status: string, score: number) => {
    // Handle null, undefined, or 0 scores
    if (score == null || score === 0) {
      return 'No data yet';
    }
    
    switch (status) {
      case 'healthy': return `Healthy (${Math.round(score)}%)`;
      case 'monitor': return `Monitor (${Math.round(score)}%)`;
      case 'attention': return `Needs attention (${Math.round(score)}%)`;
      case 'critical': return `Critical (${Math.round(score)}%)`;
      default: return `${Math.round(score)}%`;
    }
  };

  const getCropEmoji = (cropType: string) => {
    const crops: Record<string, string> = {
      rice: '🌾',
      wheat: '🌾',
      cotton: '🌸',
      sugarcane: '🎋',
      corn: '🌽',
      soybean: '🫘',
      potato: '🥔',
      tomato: '🍅'
    };
    return crops[cropType?.toLowerCase()] || '🌱';
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">My Fields</h2>
              <p className="text-xs text-green-50">{fields.length} field{fields.length > 1 ? 's' : ''} monitored</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/soilsati')}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            View All →
          </button>
        </div>
      </div>

      {/* Fields List */}
      <div className="p-4 space-y-3">
        {fields.slice(0, 4).map((field) => (
          <div
            key={field.id}
            onClick={() => navigate(`/soilsati?field=${field.id}`)}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all cursor-pointer active:scale-98"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCropEmoji(field.cropType)}</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{field.name}</h3>
                  <p className="text-xs text-gray-600 capitalize">{field.cropType || 'Unknown crop'}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getHealthColor(field.healthStatus)}`}>
                {getHealthEmoji(field.healthStatus)} {getHealthText(field.healthStatus, field.healthScore)}
              </div>
            </div>

            {/* Health Progress Bar */}
            {field.healthScore != null && field.healthScore > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Field Health</span>
                  <span className="font-medium text-gray-900">{Math.round(field.healthScore)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      field.healthScore > 70
                        ? 'bg-green-500'
                        : field.healthScore > 50
                        ? 'bg-yellow-500'
                        : field.healthScore > 30
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(field.healthScore, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="flex items-center gap-4 mt-3 text-xs">
              {field.moisture !== undefined && (
                <div className="flex items-center gap-1">
                  <span>💧</span>
                  <span className="text-gray-600">Moisture: {Math.round(field.moisture)}%</span>
                </div>
              )}
              {field.ndvi !== undefined && (
                <div className="flex items-center gap-1">
                  {field.ndvi > 0.6 ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className="text-gray-600">Growth: {Math.round(field.ndvi * 100)}%</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {fields.length > 4 && (
          <button
            onClick={() => navigate('/soilsati')}
            className="w-full py-2 text-sm text-green-700 hover:text-green-800 font-medium"
          >
            View all {fields.length} fields →
          </button>
        )}
      </div>
    </div>
  );
};
