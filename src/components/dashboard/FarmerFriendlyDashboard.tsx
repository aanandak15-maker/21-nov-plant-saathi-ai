import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DashboardHeader } from "./DashboardHeader";
import { TodaysActionsWidget } from "./farmer-friendly/TodaysActionsWidget";
import { FieldStatusWidget } from "./farmer-friendly/FieldStatusWidget";
import { SmartRecommendationsWidget } from "./farmer-friendly/SmartRecommendationsWidget";
import { MarketOpportunitiesWidget } from "./farmer-friendly/MarketOpportunitiesWidget";
import { WeatherWaterWidget } from "./farmer-friendly/WeatherWaterWidget";
import { LearnGrowWidget } from "./farmer-friendly/LearnGrowWidget";
import { ModuleAccessButtons } from "./farmer-friendly/ModuleAccessButtons";
import { weatherService } from "@/lib/weatherService";
import { jalSaathiService } from "@/lib/jalSaathiService";
import { supabaseFieldService } from "@/lib/supabaseFieldService";
import { mandiPriceService } from "@/lib/mandiPriceService";
import { diseaseDetectionService } from "@/lib/diseaseDetectionService";
import { Brain } from "lucide-react";

export const FarmerFriendlyDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>({
    weather: null,
    fields: [],
    irrigation: null,
    marketAlerts: [],
    todaysActions: [],
    diseaseOutbreaks: []
  });

  useEffect(() => {
    loadDashboardData();
    
    // Failsafe: Force stop loading after 30 seconds
    const failsafeTimeout = setTimeout(() => {
      console.warn("Dashboard loading timeout - forcing display");
      setLoading(false);
    }, 30000);
    
    return () => clearTimeout(failsafeTimeout);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Helper function to add timeout to promises
      const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
        return Promise.race([
          promise,
          new Promise<T>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeoutMs)
          )
        ]);
      };

      // Load weather with timeout
      let weather = null;
      try {
        const location = await withTimeout(weatherService.getCurrentLocation(), 5000);
        weather = await withTimeout(weatherService.getWeatherByCoords(location.lat, location.lon), 8000);
      } catch (error) {
        console.log("Weather load failed, using fallback:", error);
        try {
          weather = await withTimeout(weatherService.getWeatherByCity("Delhi"), 8000);
        } catch {
          console.log("Fallback weather also failed, continuing without weather");
        }
      }

      // Load fields with timeout
      const fields = await withTimeout(loadFieldsData(), 10000).catch(error => {
        console.error("Fields load failed:", error);
        return [];
      });

      // Load irrigation for first field with timeout
      let irrigation = null;
      if (fields.length > 0) {
        try {
          const field = fields[0];
          const cropStage = jalSaathiService.getCropStage(
            new Date(field.sowingDate || Date.now() - 60 * 24 * 60 * 60 * 1000),
            field.cropType || "rice"
          );
          const soilType = jalSaathiService.determineSoilType(field.soilData);
          irrigation = await withTimeout(
            jalSaathiService.generateIrrigationSchedule(
              field.id,
              field.cropType || "rice",
              cropStage,
              soilType,
              field.location || "Delhi"
            ),
            8000
          );
        } catch (error) {
          console.error("Irrigation load failed:", error);
        }
      }

      // Generate today's actions
      const actions = generateTodaysActions(weather, fields, irrigation);

      // Check market opportunities with timeout
      const marketAlerts = await withTimeout(checkMarketOpportunities(fields), 8000).catch(error => {
        console.error("Market alerts failed:", error);
        return [];
      });

      // Load disease outbreaks
      const diseaseOutbreaks = diseaseDetectionService.getAllFieldsWithDiseases();

      setDashboardData({
        weather,
        fields,
        irrigation,
        marketAlerts,
        todaysActions: actions,
        diseaseOutbreaks
      });

    } catch (error) {
      console.error("Dashboard load failed:", error);
      // Show dashboard anyway with whatever data we have
      setDashboardData({
        weather: null,
        fields: [],
        irrigation: null,
        marketAlerts: [],
        todaysActions: [],
        diseaseOutbreaks: []
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFieldsData = async () => {
    try {
      const allFields = await supabaseFieldService.getFields();
      // Filter out archived fields (check multiple possible status field names and values)
      const activeFields = allFields.filter((field: any) => {
        const status = field.status || field.field_status || field.lifecycle_status || 'active';
        return status.toLowerCase() !== 'archived' && status.toLowerCase() !== 'inactive';
      });
      
      const enrichedFields = await Promise.all(
        activeFields.map(async (field: any) => {
          try {
            const latestData = await supabaseFieldService.getLatestFieldData(field.id);
            if (latestData) {
              return {
                ...field,
                cropType: field.crop_type,
                ndvi: latestData.ndvi,
                evi: latestData.evi,
                ndwi: latestData.ndwi,
                moisture: latestData.soil_moisture,
                temperature: latestData.temperature,
                healthScore: latestData.health_score || (latestData.ndvi * 100),
                healthStatus: getHealthStatus(latestData.health_score || latestData.ndvi),
                timestamp: latestData.timestamp
              };
            }
          } catch (error) {
            console.error(`Field ${field.id} data load failed:`, error);
          }
          return {
            ...field,
            cropType: field.crop_type,
            healthScore: null, // No data yet
            healthStatus: 'unknown'
          };
        })
      );
      return enrichedFields;
    } catch (error) {
      console.error("Fields load failed:", error);
      return [];
    }
  };

  const getHealthStatus = (score: number) => {
    if (score > 0.7) return 'healthy';
    if (score > 0.5) return 'monitor';
    if (score > 0.3) return 'attention';
    return 'critical';
  };

  const generateTodaysActions = (weather: any, fields: any[], irrigation: any) => {
    const actions: any[] = [];
    const currentHour = new Date().getHours();

    // Critical field health issues (only for fields with actual data)
    fields.forEach(field => {
      // Only show health alerts if we have real data (healthScore exists and is < 60)
      if (field.healthScore != null && field.healthScore > 0 && field.healthScore < 60) {
        actions.push({
          id: `health_${field.id}`,
          priority: 'urgent',
          icon: '🌱',
          title: `${field.name} needs attention`,
          description: `Field health is ${Math.round(field.healthScore)}%`,
          action: 'Check for nutrient deficiency',
          timeWindow: 'Today',
          field: field.name
        });
      }

      // Water stress (only if we have moisture data)
      if (field.moisture && field.moisture > 0 && field.moisture < 30) {
        actions.push({
          id: `water_${field.id}`,
          priority: 'urgent',
          icon: '💧',
          title: 'Water your field',
          description: `${field.name} soil moisture is low`,
          action: 'Irrigate for 2-3 hours',
          timeWindow: 'Next 6 hours',
          field: field.name
        });
      }
    });

    // Morning irrigation window (5-10 AM)
    if (currentHour >= 5 && currentHour < 10) {
      const needsWater = fields.some(f => f.moisture && f.moisture < 40);
      if (needsWater) {
        actions.push({
          id: 'irrigation_window',
          priority: 'today',
          icon: '💧',
          title: 'Perfect time to water',
          description: 'Morning watering saves ₹300',
          action: 'Water now (50% less evaporation)',
          timeWindow: 'Next 5 hours'
        });
      }
    }

    // Morning spray window (5-10 AM, low wind)
    if (currentHour >= 5 && currentHour < 10 && weather?.current) {
      const windSpeed = weather.current.wind_speed || 0;
      if (windSpeed < 10) {
        actions.push({
          id: 'spray_window',
          priority: 'today',
          icon: '🧪',
          title: 'Good time for spraying',
          description: `Low wind (${windSpeed} km/h)`,
          action: 'Apply pesticides/fertilizers now',
          timeWindow: 'Next 5 hours'
        });
      }
    }

    // Disease risk alert
    if (weather?.current) {
      const humidity = weather.current.humidity || 0;
      const temp = weather.current.temp || 0;
      
      if (humidity > 80 && temp >= 25 && temp <= 32) {
        actions.push({
          id: 'disease_risk',
          priority: 'urgent',
          icon: '🦠',
          title: 'High disease risk',
          description: `Humidity ${humidity}% + Temp ${Math.round(temp)}°C`,
          action: 'Apply preventive fungicide',
          timeWindow: 'Next 24 hours'
        });
      }
    }

    // Deduplicate actions based on unique combination of title + description
    const uniqueActions = actions.filter((action, index, self) => {
      const key = `${action.title}-${action.description}`;
      return index === self.findIndex(a => `${a.title}-${a.description}` === key);
    });

    // Sort by priority
    const priorityOrder = { urgent: 0, today: 1, week: 2 };
    return uniqueActions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  const checkMarketOpportunities = async (fields: any[]) => {
    const alerts: any[] = [];
    
    try {
      const cropTypes = [...new Set(fields.map(f => f.cropType).filter(Boolean))];
      
      for (const crop of cropTypes) {
        const prices = await mandiPriceService.getCommodityPrices(crop);
        
        if (prices.length > 0) {
          const avgPrice = prices.reduce((sum, p) => sum + p.modal_price, 0) / prices.length;
          const highestPrice = Math.max(...prices.map(p => p.modal_price));
          const increase = Math.round(((highestPrice - avgPrice) / avgPrice) * 100);
          
          if (increase > 5) {
            const bestMarket = prices.find(p => p.modal_price === highestPrice);
            alerts.push({
              commodity: crop.charAt(0).toUpperCase() + crop.slice(1),
              price: highestPrice,
              increase,
              market: bestMarket?.market || 'Local market',
              action: 'Best time to sell!'
            });
          }
        }
      }
    } catch (error) {
      console.error('Market check failed:', error);
    }
    
    return alerts;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50/30 to-background">
        <div className="text-center space-y-4 p-4">
          <Brain className="w-12 h-12 mx-auto text-green-600 animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading your farm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-background pb-24">
      {/* Welcome Header with Notifications */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold">🌾 Plant Saathi</h1>
            <p className="text-green-50 text-sm">Your smart farming assistant</p>
          </div>
          <DashboardHeader 
            weatherData={dashboardData.weather}
            irrigationData={dashboardData.irrigation}
            diseaseOutbreaks={dashboardData.diseaseOutbreaks}
          />
        </div>
      </div>

      <div className="space-y-4 p-4">
        {/* 1. Today's Priority Actions */}
        <TodaysActionsWidget actions={dashboardData.todaysActions} />

        {/* 2. Field Status Overview */}
        <FieldStatusWidget fields={dashboardData.fields} />

        {/* 3. Smart Product Recommendations */}
        <SmartRecommendationsWidget 
          fields={dashboardData.fields}
          weather={dashboardData.weather}
          diseases={dashboardData.diseaseOutbreaks}
        />

        {/* 4. Market Opportunities */}
        {dashboardData.marketAlerts.length > 0 && (
          <MarketOpportunitiesWidget alerts={dashboardData.marketAlerts} />
        )}

        {/* 5. Weather & Water */}
        <WeatherWaterWidget 
          weather={dashboardData.weather}
          irrigation={dashboardData.irrigation}
        />

        {/* 6. Learn & Grow */}
        <LearnGrowWidget />

        {/* Module Access Buttons */}
        <ModuleAccessButtons />
      </div>
    </div>
  );
};
