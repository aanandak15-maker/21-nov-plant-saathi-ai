import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "./DashboardHeader";
import { CriticalAlerts } from "./CriticalAlerts";
import { WeatherCard } from "./WeatherCard";
import { FieldsOverview } from "./FieldsOverview";
import { ActionableInsights } from "./ActionableInsights";
import { QuickActions } from "./QuickActions";
import { YieldSummary } from "./YieldSummary";
import { DiseaseMonitoring } from "./DiseaseMonitoring";
import { MarketplaceRecommendations } from "./MarketplaceRecommendations";
import { EducationalVideos } from "./EducationalVideos";
import { CommunityGallery } from "./CommunityGallery";
import { FarmerStories } from "./FarmerStories";
import { weatherService } from "@/lib/weatherService";
import { jalSaathiService } from "@/lib/jalSaathiService";
import { diseaseDetectionService } from "@/lib/diseaseDetectionService";
import { supabaseFieldService } from "@/lib/supabaseFieldService";
import { migrateLocalStorageToSupabase, needsMigration } from "@/lib/migrateLocalStorageToSupabase";
import { mandiPriceService } from "@/lib/mandiPriceService";

import { DashboardSkeleton } from './DashboardSkeleton';

export const DashboardView = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [irrigationData, setIrrigationData] = useState<any>(null);
  const [fieldsData, setFieldsData] = useState<any[]>([]);
  const [diseaseOutbreaks, setDiseaseOutbreaks] = useState<any[]>([]);
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [criticalAlerts, setCriticalAlerts] = useState<any[]>([]);
  const [priceAlert, setPriceAlert] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (fieldsData.length > 0) {
      checkForCriticalAlerts();
    }
  }, [fieldsData, weatherData]);

  useEffect(() => {
    // Quick Win #3: Market Price Alert
    checkMarketPrices();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('DEBUG: loadDashboardData - Starting load');

      // Check if migration is needed
      const shouldMigrate = await needsMigration();
      if (shouldMigrate) {
        setShowMigrationPrompt(true);
      }

      // Load weather data
      try {
        const location = await weatherService.getCurrentLocation();
        const weather = await weatherService.getWeatherByCoords(location.lat, location.lon);
        setWeatherData(weather);
      } catch (error) {
        console.error("Failed to load weather:", error);
        // Fallback to default location
        const weather = await weatherService.getWeatherByCity("Delhi");
        setWeatherData(weather);
      }

      // Load fields data from Supabase
      console.log('DEBUG: loadDashboardData - Fetching fields...');
      const fields = await loadFieldsFromSupabase();
      console.log('DEBUG: loadDashboardData - Fields loaded:', fields.length);
      setFieldsData(fields);

      // Load disease outbreaks
      const outbreaks = diseaseDetectionService.getAllFieldsWithDiseases();
      setDiseaseOutbreaks(outbreaks);

      // Load irrigation schedule for first field (if exists)
      if (fields.length > 0) {
        try {
          const firstField = fields[0];
          const cropStage = jalSaathiService.getCropStage(
            new Date(firstField.sowingDate || Date.now() - 60 * 24 * 60 * 60 * 1000),
            firstField.cropType || "rice"
          );
          const soilType = jalSaathiService.determineSoilType(firstField.soilData);

          // Extract location properly  
          let location: { lat: number; lon: number } | string = "Delhi";
          if (firstField.location && typeof firstField.location === 'object') {
            location = {
              lat: firstField.location.lat || firstField.location.latitude,
              lon: firstField.location.lng || firstField.location.lon || firstField.location.longitude
            };
          } else if (typeof firstField.location === 'string') {
            location = firstField.location;
          }

          const irrigation = await jalSaathiService.generateIrrigationSchedule(
            firstField.id,
            firstField.cropType || "rice",
            cropStage,
            soilType,
            location
          );
          setIrrigationData(irrigation);
        } catch (error) {
          console.error("Failed to load irrigation data:", error);
        }
      }

    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFieldsFromSupabase = async () => {
    try {
      // Load fields from Supabase (now optimized to include data)
      console.log('DEBUG: loadFieldsFromSupabase - Calling service');
      const fields = await supabaseFieldService.getFields();
      console.log('DEBUG: loadFieldsFromSupabase - Service returned:', fields.length);

      // Map crop_type to cropType for frontend consistency if needed
      return fields.map((field: any) => ({
        ...field,
        cropType: field.crop_type || field.cropType
      }));
    } catch (error) {
      console.error("Failed to load fields from Supabase:", error);
      return [];
    }
  };

  const handleMigration = async () => {
    setMigrating(true);
    try {
      const result = await migrateLocalStorageToSupabase();
      if (result.success) {
        alert(`✅ Successfully migrated ${result.migrated} fields to Supabase!`);
        setShowMigrationPrompt(false);
        // Reload dashboard data
        await loadDashboardData();
      } else {
        alert(`❌ Migration failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Migration error:', error);
      alert('❌ Migration failed. Please try again.');
    } finally {
      setMigrating(false);
    }
  };

  const checkForCriticalAlerts = () => {
    const alerts: any[] = [];
    const currentHour = new Date().getHours();

    for (const field of fieldsData) {
      // Quick Win #1: NDVI Drop Alert
      if (field.ndvi && field.ndvi < 0.6) {
        const ndviPercentage = Math.round(field.ndvi * 100);
        const historicalNDVI = 0.75;
        const drop = Math.round(((historicalNDVI - field.ndvi) / historicalNDVI) * 100);
        const potentialLoss = Math.round((historicalNDVI - field.ndvi) * 10000);

        alerts.push({
          id: `ndvi_${field.id}`,
          severity: 'critical',
          field: field.name,
          issue: `Plant health dropped to ${ndviPercentage}% (${drop}% decline)`,
          impact: `Potential yield loss: ₹${potentialLoss}`,
          action: 'Check for nitrogen deficiency. Apply NPK fertilizer (20-20-0) today.',
          timeWindow: 'Next 24 hours',
          confidence: 85
        });
      }

      // Water Stress Alert
      if (field.ndwi && field.ndwi < 0.3 && field.moisture && field.moisture < 30) {
        alerts.push({
          id: `water_${field.id}`,
          severity: 'critical',
          field: field.name,
          issue: 'Severe water stress detected',
          impact: 'Crop stress can reduce yield by 20-30%',
          action: 'Irrigate immediately. Water deeply for 2-3 hours.',
          timeWindow: 'Urgent - Next 6 hours',
          confidence: 90
        });
      }
    }

    // Quick Win #2: Irrigation Timing Alert (Morning 5-10 AM)
    if (currentHour >= 5 && currentHour < 10 && irrigationData) {
      const needsIrrigation = fieldsData.some(f =>
        (f.moisture && f.moisture < 40) || (f.ndwi && f.ndwi < 0.4)
      );

      if (needsIrrigation) {
        alerts.push({
          id: 'irrigation_timing',
          severity: 'warning',
          field: 'All Fields',
          issue: 'Perfect irrigation window NOW',
          impact: 'Save ₹300 by watering now vs afternoon (50% less evaporation)',
          action: 'Irrigate now at 5-10 AM. Best time for water absorption.',
          timeWindow: 'Next 5 hours',
          confidence: 90
        });
      }
    }

    // Quick Win #4: Spray Alert (Morning 5-10 AM, low wind)
    if (currentHour >= 5 && currentHour < 10 && weatherData) {
      const windSpeed = weatherData.current?.wind_speed || 0;
      if (windSpeed < 10) {
        alerts.push({
          id: 'spray_window',
          severity: 'info',
          field: 'All Fields',
          issue: 'Perfect spray window NOW',
          impact: `Low wind (${windSpeed} km/h). Pesticides won't drift. Save ₹200 on wasted spray.`,
          action: 'Apply pesticides/fertilizers now before 10 AM.',
          timeWindow: 'Next 5 hours',
          confidence: 85
        });
      }
    }

    // Quick Win #5: Disease Risk Alert (High humidity + warm temp)
    if (weatherData?.current) {
      const humidity = weatherData.current.humidity || 0;
      const temp = weatherData.current.temp || 0;

      // Fungal disease risk: High humidity (>80%) + Warm temp (25-32°C)
      if (humidity > 80 && temp >= 25 && temp <= 32) {
        const riskLevel = humidity > 90 ? 'Very High' : 'High';
        const potentialLoss = humidity > 90 ? 8000 : 5000;

        alerts.push({
          id: 'disease_risk',
          severity: 'critical',
          field: 'All Fields',
          issue: `${riskLevel} fungal disease risk detected`,
          impact: `Humidity ${humidity}% + Temp ${Math.round(temp)}°C = Perfect conditions for blast, blight. Potential loss: ₹${potentialLoss}`,
          action: 'Apply preventive fungicide (Mancozeb or Copper oxychloride) within 24 hours. Monitor leaves for spots.',
          timeWindow: 'Next 24 hours',
          confidence: 88
        });
      }

      // Bacterial disease risk: Very high humidity (>85%) + High temp (>30°C)
      if (humidity > 85 && temp > 30) {
        alerts.push({
          id: 'bacterial_risk',
          severity: 'warning',
          field: 'All Fields',
          issue: 'Bacterial disease risk elevated',
          impact: `High humidity + heat stress = Bacterial leaf blight risk. Potential loss: ₹3,500`,
          action: 'Avoid overhead irrigation. Apply copper-based bactericide if symptoms appear.',
          timeWindow: 'Next 48 hours',
          confidence: 75
        });
      }
    }

    if (weatherData?.current && weatherData?.daily) {
      const temp = weatherData.current.temp || 0;
      const humidity = weatherData.current.humidity || 0;
      const recentRain = weatherData.daily?.slice(0, 3).some((day: any) =>
        day.weather?.[0]?.main === 'Rain'
      );

      // Stem borer risk: Warm + humid after rain
      if (recentRain && temp >= 25 && temp <= 30 && humidity > 70) {
        for (const field of fieldsData) {
          if (field.cropType === 'rice' || field.cropType === 'sugarcane') {
            alerts.push({
              id: `pest_${field.id}`,
              severity: 'warning',
              field: field.name,
              issue: 'Stem borer activity expected',
              impact: `Post-rain + warm weather = Peak pest activity. Potential damage: ₹4,000`,
              action: `Monitor ${field.cropType} stems for holes. Apply Chlorantraniliprole if damage seen.`,
              timeWindow: 'Next 3-5 days',
              confidence: 80
            });
          }
        }
      }

      // Aphid/Whitefly risk: Hot + dry conditions
      if (temp > 32 && humidity < 60) {
        alerts.push({
          id: 'aphid_risk',
          severity: 'info',
          field: 'All Fields',
          issue: 'Aphid/Whitefly risk increasing',
          impact: `Hot dry weather favors sucking pests. Can spread viral diseases. Potential loss: ₹2,500`,
          action: 'Check leaf undersides daily. Use yellow sticky traps. Apply neem oil or Imidacloprid if infestation seen.',
          timeWindow: 'Next 7 days',
          confidence: 70
        });
      }
    }

    setCriticalAlerts(alerts);
  };

  const checkMarketPrices = async () => {
    try {
      // Get common crops
      const crops = ['rice', 'wheat', 'cotton', 'sugarcane'];

      for (const crop of crops) {
        const prices = await mandiPriceService.getCommodityPrices(crop);

        if (prices.length > 0) {
          const avgPrice = prices.reduce((sum, p) => sum + p.modal_price, 0) / prices.length;
          const highestPrice = Math.max(...prices.map(p => p.modal_price));
          const increase = Math.round(((highestPrice - avgPrice) / avgPrice) * 100);

          if (increase > 5) {
            const bestMarket = prices.find(p => p.modal_price === highestPrice);
            setPriceAlert({
              commodity: crop.charAt(0).toUpperCase() + crop.slice(1),
              price: highestPrice,
              increase,
              market: bestMarket?.market || 'Local market',
              action: 'Prices up! Best selling window: Next 3 days'
            });
            break; // Show only first good opportunity
          }
        }
      }
    } catch (error) {
      console.error('Failed to check prices:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 pb-24 max-w-7xl mx-auto space-y-6">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-background">
      {/* Migration Prompt */}
      {showMigrationPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-3">📦 Migrate Your Fields</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We found fields in your old storage. Would you like to migrate them to the new cloud database?
              This will preserve all your field data and satellite measurements.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleMigration}
                disabled={migrating}
                className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
              >
                {migrating ? "Migrating..." : "✅ Migrate Now"}
              </button>
              <button
                onClick={() => setShowMigrationPrompt(false)}
                disabled={migrating}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 disabled:opacity-50 font-medium transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="space-y-6 p-4 pb-20">
        {/* Header */}
        <DashboardHeader
          weatherData={weatherData}
          irrigationData={irrigationData}
          diseaseOutbreaks={diseaseOutbreaks}
        />

        {/* Critical Alerts */}
        <CriticalAlerts
          weatherData={weatherData}
          irrigationData={irrigationData}
          diseaseOutbreaks={diseaseOutbreaks}
        />

        {/* Weather Card */}
        <WeatherCard weatherData={weatherData} irrigationData={irrigationData} />

        {/* My Crops */}
        <FieldsOverview fields={fieldsData} />

        {/* Tasks for Today */}
        <ActionableInsights
          weatherData={weatherData}
          irrigationData={irrigationData}
          fields={fieldsData}
        />

        {/* Smart Recommendations - NEW POSITION */}
        <MarketplaceRecommendations
          weatherData={weatherData}
          fields={fieldsData}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Educational Videos - NEW POSITION */}
        <EducationalVideos />
      </div>
    </div>
  );
};
