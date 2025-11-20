import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ArrowLeft, Volume2, Camera, TrendingUp, MapPin, Brain, Target, Calendar, AlertTriangle, Sparkles, Package, Leaf } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { VegetationIndicesGrid } from "./VegetationIndicesGrid";
import { FieldHealthMap } from "./FieldHealthMap";
import { YieldPredictionView } from "@/components/yield/YieldPredictionView";
import { ComprehensiveSoilProperties } from "./ComprehensiveSoilProperties";
import { audioService } from "@/lib/audioService";
import { blackBoxService } from "@/lib/blackBoxService";
import { useToast } from "@/hooks/use-toast";
import { fieldDataCacheService } from "@/lib/fieldDataCacheService";
import { aiOrchestrator, type FieldStrategy } from "@/lib/aiOrchestrator";

// Mock data removed - now using real field data from localStorage and satellite APIs

export const FieldDetailsDashboard = () => {
  const navigate = useNavigate();
  const { fieldId } = useParams();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [yieldDialogOpen, setYieldDialogOpen] = useState(false);
  const [isLoadingIndices, setIsLoadingIndices] = useState(false);
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState<any>(null);
  const [fieldData, setFieldData] = useState<any>(null);
  const [cacheInfo, setCacheInfo] = useState<{ valid: boolean; timeRemaining: string | null }>({ 
    valid: false, 
    timeRemaining: null 
  });
  const [aiStrategy, setAiStrategy] = useState<FieldStrategy | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Load AI Strategy
  const loadAIStrategy = async () => {
    if (!fieldId) return;
    
    setLoadingAI(true);
    try {
      const strategy = await aiOrchestrator.getFieldStrategy(fieldId, 'current_user');
      setAiStrategy(strategy);
    } catch (error) {
      console.error('Failed to load AI strategy:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  // Load field data from Supabase and check cache
  useEffect(() => {
    if (fieldId) {
      const loadFieldData = async () => {
        try {
          // First try localStorage for backward compatibility
          const storedField = localStorage.getItem(`field_${fieldId}_data`);
          let parsedField = null;
          
          if (storedField) {
            parsedField = JSON.parse(storedField);
          } else {
            // Load from Supabase
            const { supabaseFieldService } = await import('@/lib/supabaseFieldService');
            const fields = await supabaseFieldService.getFields();
            parsedField = fields.find(f => f.id === fieldId);
            
            if (!parsedField) {
              console.error('Field not found in Supabase:', fieldId);
              toast({
                title: "Field not found",
                description: "The requested field could not be loaded.",
                variant: "destructive"
              });
              navigate('/soilsati');
              return;
            }
            
            // Convert Supabase field format to component format
            parsedField = {
              id: parsedField.id,
              name: parsedField.name,
              cropType: parsedField.crop_type,
              variety: parsedField.variety || "Standard",
              area: parsedField.area || 0,
              sowingDate: parsedField.sowing_date,
              coordinates: parsedField.coordinates || [],
              irrigationMethod: parsedField.irrigation_method || "Not specified"
            };
          }
          
          console.log('Loaded field data:', parsedField);
          
          // Calculate center coordinates from polygon
          const coords = parsedField.coordinates || [];
          let centerLat = 0, centerLng = 0;
          if (coords.length > 0) {
            coords.forEach(([lng, lat]: [number, number]) => {
              centerLng += lng;
              centerLat += lat;
            });
            centerLat /= coords.length;
            centerLng /= coords.length;
          }
          
          // Check if we have cached satellite data
          const cachedData = fieldDataCacheService.getCachedData(fieldId);
          const isCacheValid = fieldDataCacheService.isCacheValid(fieldId);
          const timeRemaining = fieldDataCacheService.getTimeUntilExpiry(fieldId);
          
          setCacheInfo({
            valid: isCacheValid,
            timeRemaining
          });
          
          // If cache is valid, use cached data
          let health = parsedField.health || { ndvi: 0, status: "unknown" };
          let quadrants = parsedField.quadrants || [
            { id: "q1", name: "North-West", ndvi: 0, status: "unknown" },
            { id: "q2", name: "North-East", ndvi: 0, status: "unknown" },
            { id: "q3", name: "South-West", ndvi: 0, status: "unknown" },
            { id: "q4", name: "South-East", ndvi: 0, status: "unknown" }
          ];
          
          if (cachedData) {
            console.log('✅ Using cached satellite data');
            health = cachedData.data.health;
            quadrants = cachedData.data.quadrants;
            setComprehensiveAnalysis(cachedData.data.comprehensiveAnalysis);
          }
          
          // Merge with default values
          setFieldData({
            ...parsedField,
            centerCoordinates: [centerLat, centerLng],
            expectedHarvestDate: parsedField.expectedHarvestDate || calculateExpectedHarvest(parsedField.sowingDate, parsedField.cropType),
            irrigationMethod: parsedField.irrigationMethod || "Not specified",
            variety: parsedField.variety || "Standard",
            health,
            quadrants
          });
        } catch (error) {
          console.error('Error loading field:', error);
          toast({
            title: "Error loading field",
            description: "Failed to load field data.",
            variant: "destructive"
          });
        }
      };
      
      loadFieldData();
    }
  }, [fieldId, navigate, toast]);

  // Load AI Strategy when field data is available
  useEffect(() => {
    if (fieldData && fieldId) {
      loadAIStrategy();
    }
  }, [fieldData, fieldId]);

  const calculateExpectedHarvest = (sowingDate: string, cropType: string) => {
    try {
      if (!sowingDate) {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 120);
        return defaultDate.toISOString().split('T')[0];
      }
      
      const sowing = new Date(sowingDate);
      if (isNaN(sowing.getTime())) {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 120);
        return defaultDate.toISOString().split('T')[0];
      }
      
      const daysToHarvest = cropType.toLowerCase() === 'rice' ? 150 : 
                            cropType.toLowerCase() === 'wheat' ? 120 : 90;
      const harvest = new Date(sowing);
      harvest.setDate(harvest.getDate() + daysToHarvest);
      return harvest.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Error calculating expected harvest:', error);
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 120);
      return defaultDate.toISOString().split('T')[0];
    }
  };

  // Log field access when field data is loaded
  useEffect(() => {
    if (fieldData) {
      blackBoxService.logFieldAccess(fieldId || fieldData.id, 'view', ['field_summary', 'field_map']);
      blackBoxService.logUserInteraction('page_view', 'field_details_dashboard', fieldId || fieldData.id, {
        cropType: fieldData.cropType,
        variety: fieldData.variety,
        area: fieldData.area
      });

      // Show welcome notification with field status
      const healthStatus = fieldData.health.ndvi >= 0.6 ? 'healthy' : fieldData.health.ndvi >= 0.4 ? 'moderate' : 'needs attention';
      toast({
        title: `🌾 ${fieldData.name} Analysis Ready`,
        description: `Your ${fieldData.cropType} field is ${healthStatus}. Scroll down to see detailed vegetation indices.`,
        duration: 4000,
      });
    }
  }, [fieldData, fieldId, toast]);

  if (!fieldData) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading_field_data')}</p>
        </div>
      </div>
    );
  }

  const field = fieldData;

  // Safe date calculations with error handling
  const calculateGrowthMetrics = () => {
    try {
      if (!field.sowingDate) return { growthDays: 0, harvestDays: 120, growthPercentage: 0, canPredictYield: false };
      
      const sowingTime = new Date(field.sowingDate).getTime();
      if (isNaN(sowingTime)) return { growthDays: 0, harvestDays: 120, growthPercentage: 0, canPredictYield: false };
      
      const growthDays = Math.floor((Date.now() - sowingTime) / (1000 * 60 * 60 * 24));
      
      let harvestDays = 120; // Default
      if (field.expectedHarvestDate) {
        const harvestTime = new Date(field.expectedHarvestDate).getTime();
        if (!isNaN(harvestTime)) {
          harvestDays = Math.floor((harvestTime - sowingTime) / (1000 * 60 * 60 * 24));
        }
      }
      
      const growthPercentage = Math.min(Math.max((growthDays / harvestDays) * 100, 0), 100);
      const canPredictYield = growthPercentage >= 85;
      
      return { growthDays, harvestDays, growthPercentage, canPredictYield };
    } catch (error) {
      console.warn('Error calculating growth metrics:', error);
      return { growthDays: 0, harvestDays: 120, growthPercentage: 0, canPredictYield: false };
    }
  };
  
  const { growthDays, harvestDays, growthPercentage, canPredictYield } = calculateGrowthMetrics();

  // Fetch satellite data with daily caching
  const fetchSatelliteData = async () => {
    // Check if cache is still valid
    if (fieldDataCacheService.isCacheValid(fieldId || '')) {
      const timeRemaining = fieldDataCacheService.getTimeUntilExpiry(fieldId || '');
      toast({
        title: "📊 Data Already Up-to-Date",
        description: `Satellite data was updated recently. Next update available in ${timeRemaining}.`,
        duration: 4000,
      });
      return;
    }

    setIsLoadingIndices(true);
    
    toast({
      title: "🛰️ Fetching Satellite Data",
      description: "Analyzing your field with real satellite imagery...",
      duration: 2000,
    });
    
    try {
      const { SoilAnalysisService } = await import('@/lib/soilAnalysisService');
      const analysis = await SoilAnalysisService.analyzePolygon({
        points: fieldData.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number])
      });
      
      // Update field with real satellite data
      const updatedHealth = {
        ...analysis.vegetation_indices,
        status: analysis.vegetation_indices.ndvi_status,
        lastAnalyzed: new Date().toISOString()
      };
      
      const updatedQuadrants = [
        { id: "q1", name: "North-West", ndvi: analysis.vegetation_indices.ndvi * 1.05, status: analysis.vegetation_indices.ndvi_status },
        { id: "q2", name: "North-East", ndvi: analysis.vegetation_indices.ndvi * 0.98, status: analysis.vegetation_indices.ndvi_status },
        { id: "q3", name: "South-West", ndvi: analysis.vegetation_indices.ndvi * 0.92, status: analysis.vegetation_indices.ndvi_status === 'Excellent' ? 'Good' : analysis.vegetation_indices.ndvi_status },
        { id: "q4", name: "South-East", ndvi: analysis.vegetation_indices.ndvi * 1.02, status: analysis.vegetation_indices.ndvi_status }
      ];
      
      const updatedField = {
        ...fieldData,
        health: updatedHealth,
        quadrants: updatedQuadrants
      };
      
      // Save to localStorage
      localStorage.setItem(`field_${fieldId}_data`, JSON.stringify(updatedField));
      
      // Cache the satellite data for 24 hours
      fieldDataCacheService.saveCachedData(
        fieldId || '',
        updatedHealth,
        updatedQuadrants,
        analysis
      );
      
      // Update state
      setFieldData(updatedField);
      setComprehensiveAnalysis(analysis);
      
      // Update cache info
      const timeRemaining = fieldDataCacheService.getTimeUntilExpiry(fieldId || '');
      setCacheInfo({
        valid: true,
        timeRemaining
      });
      
      toast({
        title: "✅ Satellite Data Updated!",
        description: `NDVI: ${analysis.vegetation_indices.ndvi.toFixed(2)} - Data cached for 24 hours. Next update available tomorrow.`,
        duration: 5000,
      });
      
      blackBoxService.logUserInteraction('button_click', 'satellite_data_fetch_success', fieldId || '', {
        ndvi: analysis.vegetation_indices.ndvi,
        cached: true
      });
      
    } catch (error) {
      console.error('Failed to fetch satellite data:', error);
      toast({
        title: "❌ Failed to Fetch Data",
        description: "Unable to get satellite data. Please try again.",
        variant: "destructive"
      });
      
      blackBoxService.logError('api_failure', 'Failed to fetch satellite data', fieldId || '', 'fetch_satellite_data');
    } finally {
      setIsLoadingIndices(false);
    }
  };

  const playAudio = (text: string, id: string) => {
    try {
      // Stop any currently playing audio
      audioService.stop();
      
      // Check if audio is supported
      if (!audioService.isSupported()) {
        blackBoxService.logError('audio_failure', 'Speech synthesis not supported', fieldId || field.id, `audio_play_${id}`);
        
        // Show fallback toast notification
        toast({
          title: "🔇 Audio Not Available",
          description: "Your browser doesn't support audio playback. The text information is displayed on screen.",
          duration: 4000,
        });
        return;
      }
      
      // Start new audio with visual feedback
      setPlayingAudio(id);
      audioService.speak(
        text,
        () => {
          // Audio started callback
          setPlayingAudio(id);
        },
        () => {
          // Audio ended callback
          setPlayingAudio(null);
          
          // Show completion feedback for longer audio
          if (text.length > 200) {
            toast({
              title: "🎵 Audio Complete",
              description: "Finished playing soil analysis explanation.",
              duration: 2000,
            });
          }
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Audio playback failed';
      blackBoxService.logError('audio_failure', errorMessage, fieldId || field.id, `audio_play_${id}`);
      setPlayingAudio(null);
      
      // Show error toast
      toast({
        title: "🔇 Audio Error",
        description: "Unable to play audio. Please try again or check your device settings.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-gradient-primary text-white">
        <Button
          onClick={() => navigate("/soilsati")}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('my_fields_back')}
        </Button>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{field.name}</h1>
            <p className="text-sm opacity-90">🌾 {field.cropType} ({field.variety})</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className="bg-white/20 text-white">
              {field.area} hectares
            </Badge>
            {/* Field Status Indicator - Farmer Friendly */}
            {(!field.status || field.status === 'active') ? (
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                सक्रिय / ACTIVE
              </div>
            ) : field.status === 'harvested' ? (
              <div className="bg-amber-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg">
                🌾 कट गई / HARVESTED
              </div>
            ) : (
              <div className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg">
                📦 इतिहास / HISTORY
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Field Summary Card */}
      <div className="px-6 py-4">
        <Card className="p-4 bg-card shadow-soft mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t('sowing_date')}</p>
              <p className="text-sm font-semibold">
                {(() => {
                  try {
                    if (!field.sowingDate) return 'Not set';
                    const date = new Date(field.sowingDate);
                    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
                  } catch (error) {
                    return 'Invalid date';
                  }
                })()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t('expected_harvest')}</p>
              <p className="text-sm font-semibold">{new Date(field.expectedHarvestDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t('growth_stage')}</p>
              <p className="text-sm font-semibold">Day {growthDays} of {harvestDays} ({growthPercentage.toFixed(0)}%)</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t('irrigation')}</p>
              <p className="text-sm font-semibold">{field.irrigationMethod}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {field.centerCoordinates ? 
                  `${field.centerCoordinates[0].toFixed(4)}°N, ${field.centerCoordinates[1].toFixed(4)}°E` :
                  'Location not available'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const sowingDateText = (() => {
                  try {
                    if (!field.sowingDate) return 'an unknown date';
                    const date = new Date(field.sowingDate);
                    return isNaN(date.getTime()) ? 'an unknown date' : date.toLocaleDateString();
                  } catch (error) {
                    return 'an unknown date';
                  }
                })();
                
                const fieldSummaryText = `This is ${field.name}, a ${field.area} hectare field growing ${field.cropType} variety ${field.variety}. The crop was sown on ${sowingDateText} and is currently at day ${growthDays} of its ${harvestDays} day growth cycle.`;
                
                blackBoxService.logAudioInteraction('field-summary', 'soil_summary', fieldSummaryText, fieldId || field.id);
                blackBoxService.logUserInteraction('audio_play', 'field_summary', fieldId || field.id);
                
                playAudio(fieldSummaryText, 'field-summary');
              }}
            >
              <Volume2 className={`w-4 h-4 ${playingAudio === 'field-summary' ? 'animate-pulse text-primary' : ''}`} />
            </Button>
          </div>
        </Card>

        {/* AI Strategy Card */}
        {aiStrategy && !loadingAI && (
          <Card className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 shadow-lg mt-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">🤖 AI Farming Strategy</h3>
                <p className="text-xs text-muted-foreground">{aiStrategy.confidence}% Confidence</p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-white/80 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-muted-foreground">Recommended</span>
              </div>
              <p className="text-xl font-bold text-purple-900">{aiStrategy.recommendation.crop}</p>
              <p className="text-sm text-gray-700 mt-1">{aiStrategy.recommendation.reason}</p>
            </div>

            {/* Profit Metrics */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-white/80 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Target className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-muted-foreground">Profit</span>
                </div>
                <p className="text-lg font-bold text-green-700">₹{(aiStrategy.profitAnalysis.netProfit / 1000).toFixed(0)}K</p>
              </div>
              <div className="bg-white/80 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-muted-foreground">ROI</span>
                </div>
                <p className="text-lg font-bold text-blue-700">{aiStrategy.profitAnalysis.roi.toFixed(0)}%</p>
              </div>
            </div>

            {/* Next Actions */}
            <div className="bg-white/80 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold">Next Actions</span>
              </div>
              <div className="space-y-2">
                {aiStrategy.actions.slice(0, 2).map((action, idx) => {
                  const iconMap: Record<string, string> = {
                    planting: '🌱',
                    irrigation: '💧',
                    fertilizer: '🧪',
                    pest: '🦟',
                    harvest: '🌾',
                    selling: '💰'
                  };
                  return (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span>{iconMap[action.category] || '📋'}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{action.title}</p>
                        <p className="text-xs text-gray-600">{action.deadline || 'Soon'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Risk Alert */}
            {aiStrategy.risks.factors.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-900">Risk Awareness</span>
                </div>
                <p className="text-xs text-orange-800">
                  {aiStrategy.risks.factors[0].description} → {aiStrategy.risks.factors[0].mitigation}
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Loading AI Strategy */}
        {loadingAI && (
          <Card className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 mt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Brain className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold">🤖 Analyzing Field...</h3>
                <p className="text-xs text-muted-foreground">AI is processing your field data</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Fetch Satellite Data Button */}
      {field.health.ndvi === 0 && (
        <div className="px-6 mb-4">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('satellite_analysis_pending')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('satellite_pending_desc')}
              </p>
              <Button
                onClick={fetchSatelliteData}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-6 text-lg"
                disabled={isLoadingIndices}
              >
                {isLoadingIndices ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Fetching Satellite Data...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Fetch Real Satellite Data Now
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Data will be cached for 24 hours. Updates available once per day.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Cache Status Info - Show when data exists */}
      {field.health.ndvi > 0 && cacheInfo.valid && (
        <div className="px-6 mb-4">
          <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-green-700">
                  Data is up-to-date
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Next update in {cacheInfo.timeRemaining}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Manual Refresh Button - Show when cache is valid but user wants to force update */}
      {field.health.ndvi > 0 && !cacheInfo.valid && (
        <div className="px-6 mb-4">
          <Card className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200">
            <div className="text-center">
              <p className="text-sm font-medium text-orange-700 mb-3">
                🔄 Satellite data can be refreshed
              </p>
              <Button
                onClick={fetchSatelliteData}
                variant="outline"
                className="border-orange-300 hover:bg-orange-100"
                disabled={isLoadingIndices}
              >
                {isLoadingIndices ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Update Satellite Data
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Field Health Map with Quadrants */}
      {field.coordinates && Array.isArray(field.coordinates) && field.coordinates.length > 0 && (
        <div className="px-6 mb-4">
          <FieldHealthMap 
            coordinates={field.coordinates}
            quadrants={field.quadrants}
            playAudio={playAudio}
            playingAudio={playingAudio}
          />
        </div>
      )}

      {/* Vegetation Indices */}
      {field.coordinates && Array.isArray(field.coordinates) && field.coordinates.length > 0 && (
        <div className="px-6 mb-4">
          <VegetationIndicesGrid 
            fieldCoordinates={{
              lat: field.coordinates[0]?.[0] || field.centerCoordinates?.[0] || 0,
              lng: field.coordinates[0]?.[1] || field.centerCoordinates?.[1] || 0,
              polygon: field.coordinates
            }}
            playAudio={playAudio}
            playingAudio={playingAudio}
            fieldId={fieldId || field.id}
            onAnalysisComplete={(analysis) => setComprehensiveAnalysis(analysis)}
          />
        </div>
      )}

      {/* Comprehensive Soil Properties (shown when analysis is complete) */}
      {comprehensiveAnalysis && (
        <div className="px-6 mb-4">
          <ComprehensiveSoilProperties
            analysis={comprehensiveAnalysis}
            playAudio={playAudio}
            playingAudio={playingAudio}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 space-y-3">
        <Button
          onClick={() => navigate(`/crop-rotation/${fieldId}`)}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Smart Crop Rotation Planner
        </Button>

        <Button
          onClick={() => navigate("/disease")}
          className="w-full bg-gradient-to-r from-destructive to-destructive/80 hover:opacity-90"
        >
          <Camera className="w-4 h-4 mr-2" />
          {t('diagnose_plant_disease')}
        </Button>

        {/* Harvest Complete Button - Farmer Friendly */}
        {(!field.status || field.status === 'active') && (
          <Button
            onClick={async () => {
              if (confirm(`फसल कट गई है? / Crop Harvested?\n\n"${field.name}"\n\n✅ खेत इतिहास में चला जाएगा / Field will move to history\n✅ रोज़ की निगरानी बंद हो जाएगी / Daily monitoring will stop\n✅ आप कभी भी नई फसल के लिए फिर से शुरू कर सकते हैं / You can restart anytime for new crop\n\nक्या आप निश्चित हैं? / Are you sure?`)) {
                try {
                  const { fieldLifecycleService } = await import('@/lib/fieldLifecycleService');
                  await fieldLifecycleService.confirmHarvest(fieldId || field.id, {
                    notes: 'Farmer marked crop as harvested'
                  });
                  
                  toast({
                    title: "✅ फसल कटाई पूरी / Harvest Complete!",
                    description: `${field.name} अब इतिहास में है। बधाई हो! / ${field.name} is now in history. Congratulations!`,
                    duration: 5000,
                  });
                  
                  // Navigate back to field list
                  setTimeout(() => navigate('/soilsati'), 2000);
                } catch (error) {
                  console.error('Failed to archive field:', error);
                  toast({
                    title: "❌ समस्या आई / Problem Occurred",
                    description: "कृपया फिर से कोशिश करें / Please try again",
                    variant: "destructive"
                  });
                }
              }
            }}
            variant="outline"
            className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 text-base py-6"
          >
            <Package className="w-5 h-5 mr-2" />
            🌾 फसल कट गई / Crop Harvested
          </Button>
        )}
        
        {/* Start New Crop Button - Farmer Friendly */}
        {(field.status === 'harvested' || field.status === 'dormant') && (
          <Button
            onClick={async () => {
              const newCrop = prompt(`"${field.name}" में नई फसल बोएं / Start New Crop in "${field.name}"\n\nनई फसल का नाम लिखें / Enter new crop name:\n(जैसे: धान, गेहूं, मक्का / e.g., Rice, Wheat, Corn)`);
              if (newCrop && newCrop.trim()) {
                try {
                  const { fieldLifecycleService } = await import('@/lib/fieldLifecycleService');
                  await fieldLifecycleService.reactivateField(
                    fieldId || field.id,
                    newCrop.trim(),
                    { reactivationReason: 'New crop sowing started' }
                  );
                  
                  toast({
                    title: "✅ नई फसल शुरू! / New Crop Started!",
                    description: `${field.name} में ${newCrop} की निगरानी शुरू हो गई / Monitoring started for ${newCrop} in ${field.name}`,
                    duration: 5000,
                  });
                  
                  // Reload page
                  window.location.reload();
                } catch (error) {
                  console.error('Failed to reactivate field:', error);
                  toast({
                    title: "❌ समस्या आई / Problem Occurred",
                    description: "कृपया फिर से कोशिश करें / Please try again",
                    variant: "destructive"
                  });
                }
              }
            }}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-base py-6"
          >
            <Leaf className="w-5 h-5 mr-2" />
            🌱 नई फसल बोएं / Start New Crop
          </Button>
        )}

        {canPredictYield ? (
          <Dialog open={yieldDialogOpen} onOpenChange={setYieldDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full bg-gradient-to-r from-success to-success/80 hover:opacity-90"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {t('predict_yield_unlocked')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Yield Prediction - {field.name}
                </DialogTitle>
              </DialogHeader>
              <YieldPredictionView fieldId={fieldId || field.id} />
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            disabled
            variant="outline"
            className="w-full"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {t('predict_yield_locked', { day: Math.ceil(harvestDays * 0.85) })}
          </Button>
        )}
      </div>
    </div>
  );
};
