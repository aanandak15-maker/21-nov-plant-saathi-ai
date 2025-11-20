import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus, TrendingUp, TrendingDown, RefreshCw, Archive, Sprout } from "lucide-react";
import { supabaseFieldService } from "@/lib/supabaseFieldService";

interface Field {
  id: string;
  name: string;
  crop_type: string;
  area: number;
  healthScore: number;
  healthStatus: string;
  moisture?: number;
  ndvi?: number;
  lastUpdated?: string;
  status?: string;
}

export const FarmerFriendlyFieldsList = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      setLoading(true);
      const allFields = await supabaseFieldService.getFields();
      // Filter out archived fields
      const fieldsData = allFields.filter((field: any) => field.status !== 'archived');
      
      const enrichedFields = await Promise.all(
        fieldsData.map(async (field: any) => {
          try {
            const latestData = await supabaseFieldService.getLatestFieldData(field.id);
            const healthScore = latestData?.health_score || latestData?.ndvi * 100 || 75;
            
            return {
              id: field.id,
              name: field.name,
              crop_type: field.crop_type,
              area: field.area,
              healthScore: Math.round(healthScore),
              healthStatus: getHealthStatus(healthScore / 100),
              moisture: latestData?.soil_moisture,
              ndvi: latestData?.ndvi,
              lastUpdated: latestData?.timestamp,
              status: field.status || 'active'
            };
          } catch (error) {
            return {
              id: field.id,
              name: field.name,
              crop_type: field.crop_type,
              area: field.area,
              healthScore: 75,
              healthStatus: 'healthy',
              lastUpdated: new Date().toISOString(),
              status: field.status || 'active'
            };
          }
        })
      );
      
      setFields(enrichedFields);
    } catch (error) {
      console.error("Failed to load fields:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFields();
    setRefreshing(false);
  };

  const getHealthStatus = (score: number) => {
    if (score > 0.7) return 'healthy';
    if (score > 0.5) return 'monitor';
    if (score > 0.3) return 'attention';
    return 'critical';
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-50 border-green-500 text-green-900';
      case 'monitor': return 'bg-yellow-50 border-yellow-500 text-yellow-900';
      case 'attention': return 'bg-orange-50 border-orange-500 text-orange-900';
      case 'critical': return 'bg-red-50 border-red-500 text-red-900';
      default: return 'bg-gray-50 border-gray-300 text-gray-900';
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
    switch (status) {
      case 'healthy': return `Healthy (${score}%)`;
      case 'monitor': return `Monitor (${score}%)`;
      case 'attention': return `Needs attention (${score}%)`;
      case 'critical': return `Critical (${score}%)`;
      default: return `${score}%`;
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

  const getTimeAgo = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? 's' : ''} ago`;
  };

  // Filter fields based on showHistory toggle
  const filteredFields = showHistory 
    ? fields.filter(f => f.status === 'harvested' || f.status === 'dormant')
    : fields.filter(f => !f.status || f.status === 'active');

  const activeCount = fields.filter(f => !f.status || f.status === 'active').length;
  const historyCount = fields.filter(f => f.status === 'harvested' || f.status === 'dormant').length;

  const healthyCount = filteredFields.filter(f => f.healthStatus === 'healthy').length;
  const monitorCount = filteredFields.filter(f => f.healthStatus === 'monitor').length;
  const attentionCount = filteredFields.filter(f => f.healthStatus === 'attention' || f.healthStatus === 'critical').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto text-green-600 animate-spin mb-2" />
          <p className="text-sm text-gray-600">Loading your fields...</p>
        </div>
      </div>
    );
  }

  if (fields.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
        <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Fields Yet</h3>
        <p className="text-sm text-gray-600 mb-6">
          Add your first field to start monitoring crop health and getting farming advice
        </p>
        <button
          onClick={() => navigate('/soilsati/map-field')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Your First Field
        </button>
      </div>
    );
  }

  if (filteredFields.length === 0) {
    return (
      <div className="space-y-4">
        {/* Toggle Buttons */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setShowHistory(false)}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              !showHistory
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sprout className="w-4 h-4" />
            Active ({activeCount})
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              showHistory
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Archive className="w-4 h-4" />
            History ({historyCount})
          </button>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
          {showHistory ? (
            <>
              <Archive className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Archived Fields</h3>
              <p className="text-sm text-gray-600">
                Harvested fields will appear here
              </p>
            </>
          ) : (
            <>
              <Sprout className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Fields</h3>
              <p className="text-sm text-gray-600 mb-6">
                Add your first field to start monitoring
              </p>
              <button
                onClick={() => navigate('/soilsati/map-field')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Field
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toggle Buttons - Beautiful Segmented Control */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg shadow-inner">
        <button
          onClick={() => setShowHistory(false)}
          className={`flex-1 py-3 px-4 rounded-md font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            !showHistory
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md transform scale-105'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Sprout className="w-4 h-4" />
          🌱 Active ({activeCount})
        </button>
        <button
          onClick={() => setShowHistory(true)}
          className={`flex-1 py-3 px-4 rounded-md font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            showHistory
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md transform scale-105'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Archive className="w-4 h-4" />
          📦 History ({historyCount})
        </button>
      </div>

      {/* Summary Card */}
      <div className={`rounded-xl p-5 text-white shadow-md transition-all duration-300 ${
        showHistory 
          ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
          : 'bg-gradient-to-r from-green-500 to-emerald-500'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              {showHistory ? (
                <>
                  <Archive className="w-5 h-5" />
                  Archived Fields
                </>
              ) : (
                <>
                  <Sprout className="w-5 h-5" />
                  Active Fields
                </>
              )}
            </h2>
            <p className="text-sm opacity-90">
              {filteredFields.length} field{filteredFields.length !== 1 ? 's' : ''} {showHistory ? 'archived' : 'monitored'}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {!showHistory && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{healthyCount}</p>
              <p className="text-xs opacity-90">Healthy</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{monitorCount}</p>
              <p className="text-xs opacity-90">Monitor</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{attentionCount}</p>
              <p className="text-xs opacity-90">Attention</p>
            </div>
          </div>
        )}
        
        {showHistory && (
          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 text-center">
            <p className="text-sm opacity-90">
              View your harvested and dormant fields
            </p>
          </div>
        )}
      </div>

      {/* Fields List */}
      <div className="space-y-3">
        {filteredFields.map((field) => (
          <div
            key={field.id}
            onClick={() => navigate(`/soilsati/field/${field.id}`)}
            className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all cursor-pointer active:scale-98 ${
              showHistory 
                ? 'border-amber-200 hover:border-amber-400 hover:shadow-amber-100' 
                : 'border-gray-200 hover:border-green-300 hover:shadow-md'
            }`}
          >
            {/* Field Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getCropEmoji(field.crop_type)}</span>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    {field.name}
                    {showHistory && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                        Archived
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-600 capitalize">
                    {field.crop_type} • {field.area} acres
                  </p>
                </div>
              </div>
              {!showHistory && (
                <div className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getHealthColor(field.healthStatus)}`}>
                  {getHealthEmoji(field.healthStatus)} {getHealthText(field.healthStatus, field.healthScore)}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
              {field.moisture !== undefined && (
                <div className="flex items-center gap-1">
                  <span>💧</span>
                  <span>Moisture: {Math.round(field.moisture)}%</span>
                </div>
              )}
              {field.ndvi !== undefined && (
                <div className="flex items-center gap-1">
                  {field.ndvi > 0.6 ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span>Growth: {Math.round(field.ndvi * 100)}%</span>
                </div>
              )}
            </div>

            {/* Last Updated */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {showHistory ? 'Archived' : 'Updated'}: {getTimeAgo(field.lastUpdated)}
              </p>
              <span className={`text-xs font-medium ${showHistory ? 'text-amber-600' : 'text-green-600'}`}>
                View Details →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Field Button - Only show for active fields */}
      {!showHistory && (
        <button
          onClick={() => navigate('/soilsati/map-field')}
          className="w-full py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-gray-600 hover:text-green-700 font-medium flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Field
        </button>
      )}
    </div>
  );
};
