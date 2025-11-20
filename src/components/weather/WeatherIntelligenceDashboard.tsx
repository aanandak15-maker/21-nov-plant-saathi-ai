/**
 * Weather Intelligence Dashboard
 * Comprehensive weather analysis and recommendations for farmers
 */

import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, AlertTriangle, Sprout, Calendar, TrendingUp } from 'lucide-react';
import { weatherIntelligenceService } from '../../lib/weather/weatherIntelligenceService';
import { weatherAlertService } from '../../lib/weather/weatherAlertService';
import { weatherCacheService } from '../../lib/weather/weatherCacheService';
import type { SprayWindow, DiseaseRisk, IrrigationSchedule, CropAdvisory, WeatherAlert } from '../../lib/weather/weatherIntelligenceService';

interface Props {
  fieldId: string;
  lat: number;
  lon: number;
  cropType: string;
}

export const WeatherIntelligenceDashboard: React.FC<Props> = ({
  fieldId,
  lat,
  lon,
  cropType,
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'spray' | 'disease' | 'irrigation' | 'advisory'>('alerts');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [sprayWindows, setSprayWindows] = useState<SprayWindow[]>([]);
  const [diseaseRisks, setDiseaseRisks] = useState<DiseaseRisk[]>([]);
  const [irrigationSchedule, setIrrigationSchedule] = useState<IrrigationSchedule | null>(null);
  const [cropAdvisory, setCropAdvisory] = useState<CropAdvisory[]>([]);

  useEffect(() => {
    loadWeatherIntelligence();
  }, [fieldId, lat, lon, cropType]);

  const loadWeatherIntelligence = async () => {
    setLoading(true);
    try {
      // Load all intelligence data in parallel
      const [alertsData, sprayData, diseaseData, irrigationData, advisoryData] = await Promise.all([
        weatherAlertService.checkFieldAlerts(fieldId, lat, lon, cropType),
        weatherIntelligenceService.getSprayWindows(lat, lon),
        weatherIntelligenceService.predictDiseaseRisk(lat, lon, cropType),
        weatherIntelligenceService.getIrrigationSchedule(lat, lon, cropType),
        weatherIntelligenceService.get16DayCropAdvisory(lat, lon, cropType),
      ]);

      setAlerts(alertsData);
      setSprayWindows(sprayData);
      setDiseaseRisks(diseaseData);
      setIrrigationSchedule(irrigationData);
      setCropAdvisory(advisoryData);
    } catch (error) {
      console.error('Error loading weather intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Weather Intelligence</h2>
        <p className="text-green-50">AI-powered weather analysis for {cropType}</p>
      </div>

      {/* Critical Alerts Banner */}
      {alerts.filter(a => a.severity === 'critical').length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Critical Alerts!</h3>
              {alerts
                .filter(a => a.severity === 'critical')
                .map(alert => (
                  <div key={alert.id} className="mb-2">
                    <p className="text-red-700 font-medium">{alert.title}</p>
                    <p className="text-red-600 text-sm">{alert.message}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[
          { id: 'alerts', label: 'Alerts', icon: AlertTriangle, count: alerts.length },
          { id: 'spray', label: 'Spray Windows', icon: Sprout, count: sprayWindows.length },
          { id: 'disease', label: 'Disease Risk', icon: Cloud, count: diseaseRisks.length },
          { id: 'irrigation', label: 'Irrigation', icon: Droplets },
          { id: 'advisory', label: '16-Day Advisory', icon: Calendar },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="bg-white text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'alerts' && <AlertsTab alerts={alerts} />}
        {activeTab === 'spray' && <SprayWindowsTab windows={sprayWindows} />}
        {activeTab === 'disease' && <DiseaseRiskTab risks={diseaseRisks} />}
        {activeTab === 'irrigation' && <IrrigationTab schedule={irrigationSchedule} />}
        {activeTab === 'advisory' && <AdvisoryTab advisory={cropAdvisory} />}
      </div>
    </div>
  );
};

// ============================================================================
// TAB COMPONENTS
// ============================================================================

const AlertsTab: React.FC<{ alerts: WeatherAlert[] }> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>No active alerts. Your field is safe!</p>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-500 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      default: return 'bg-blue-50 border-blue-500 text-blue-800';
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map(alert => (
        <div key={alert.id} className={`border-l-4 p-4 rounded-lg ${getSeverityColor(alert.severity)}`}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold">{alert.title}</h3>
            <span className="text-xs uppercase font-bold">{alert.severity}</span>
          </div>
          <p className="mb-3">{alert.message}</p>
          {alert.actions.length > 0 && (
            <div>
              <p className="font-medium text-sm mb-2">Actions to take:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {alert.actions.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const SprayWindowsTab: React.FC<{ windows: SprayWindow[] }> = ({ windows }) => {
  if (windows.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Sprout className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>No good spray windows in next 4 days</p>
      </div>
    );
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-500';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-500';
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-500';
      default: return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {windows.map((window, idx) => (
        <div key={idx} className={`border-l-4 p-4 rounded-lg ${getQualityColor(window.quality)}`}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold">{window.date}</h3>
              <p className="text-sm">{window.startTime} - {window.endTime} ({window.duration}h)</p>
            </div>
            <span className="text-xs uppercase font-bold px-2 py-1 rounded bg-white">
              {window.quality}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
            <div>Wind: {window.conditions.windSpeed} km/h</div>
            <div>Humidity: {window.conditions.humidity}%</div>
            <div>Temp: {Math.round(window.conditions.temperature)}°C</div>
            <div>Rain: {window.conditions.precipitation}%</div>
          </div>
          <p className="text-sm">{window.recommendation}</p>
        </div>
      ))}
    </div>
  );
};

const DiseaseRiskTab: React.FC<{ risks: DiseaseRisk[] }> = ({ risks }) => {
  if (risks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Cloud className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>Low disease risk. Keep monitoring!</p>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-500';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-500';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-500';
      default: return 'bg-green-100 text-green-800 border-green-500';
    }
  };

  return (
    <div className="space-y-4">
      {risks.map((risk, idx) => (
        <div key={idx} className={`border-l-4 p-4 rounded-lg ${getRiskColor(risk.riskLevel)}`}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold">{risk.disease}</h3>
            <span className="text-xs uppercase font-bold px-2 py-1 rounded bg-white">
              {risk.probability}% Risk
            </span>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Symptoms:</p>
              <ul className="list-disc list-inside space-y-1">
                {risk.symptoms.map((symptom, i) => (
                  <li key={i}>{symptom}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <p className="font-medium mb-1">Prevention:</p>
              <ul className="list-disc list-inside space-y-1">
                {risk.preventiveMeasures.map((measure, i) => (
                  <li key={i}>{measure}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <p className="font-medium mb-1">Chemical Control:</p>
              <ul className="list-disc list-inside space-y-1">
                {risk.chemicalControl.map((control, i) => (
                  <li key={i}>{control}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const IrrigationTab: React.FC<{ schedule: IrrigationSchedule | null }> = ({ schedule }) => {
  if (!schedule) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Droplets className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>Loading irrigation schedule...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Next Irrigation</h3>
        <p className="text-blue-700 mb-1">{schedule.nextIrrigationDate}</p>
        {schedule.skipReason ? (
          <p className="text-blue-600 text-sm">{schedule.skipReason}</p>
        ) : (
          <div className="space-y-2 text-sm text-blue-700">
            <p>Amount: <span className="font-medium">{schedule.amount}</span></p>
            <p>Timing: <span className="font-medium">{schedule.timing}</span></p>
            <p>Method: <span className="font-medium">{schedule.method}</span></p>
            <p>Days until next: <span className="font-medium">{schedule.daysUntilNext}</span></p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Recommendations:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {schedule.recommendations.map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-white border rounded-lg p-3">
          <p className="text-gray-600">Soil Moisture</p>
          <p className="font-semibold text-lg capitalize">{schedule.soilMoistureEstimate}</p>
        </div>
        <div className="bg-white border rounded-lg p-3">
          <p className="text-gray-600">ET₀ Rate</p>
          <p className="font-semibold text-lg">{schedule.evapotranspirationRate.toFixed(1)} mm/day</p>
        </div>
      </div>
    </div>
  );
};

const AdvisoryTab: React.FC<{ advisory: CropAdvisory[] }> = ({ advisory }) => {
  if (advisory.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>Loading 16-day advisory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {advisory.map((day, idx) => (
        <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold">{day.day}</h3>
              <p className="text-sm text-gray-600">{day.date}</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold text-lg">{day.weather.tempMax}°C</p>
              <p className="text-gray-600">{day.weather.tempMin}°C</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-gray-600">
            <div>💧 {day.weather.rainfall}%</div>
            <div>💨 {day.weather.windSpeed} km/h</div>
            <div>💦 {day.weather.humidity}%</div>
          </div>

          {day.alerts.length > 0 && (
            <div className="mb-2">
              {day.alerts.map((alert, i) => (
                <span key={i} className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                  {alert}
                </span>
              ))}
            </div>
          )}

          {day.activities.recommended.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-medium text-green-700 mb-1">✅ Recommended:</p>
              <p className="text-xs text-gray-700">{day.activities.recommended.join(', ')}</p>
            </div>
          )}

          {day.activities.avoid.length > 0 && (
            <div>
              <p className="text-xs font-medium text-red-700 mb-1">❌ Avoid:</p>
              <p className="text-xs text-gray-700">{day.activities.avoid.join(', ')}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
