import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sprout, Plus, TrendingUp, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabaseFieldService } from "@/lib/supabaseFieldService";
import { FieldStatusBadge } from "./FieldStatusBadge";

interface Field {
  id: string;
  name: string;
  cropType: string;
  area: number;
  sowingDate: string;
  health: {
    ndvi: number;
    status: "healthy" | "monitor" | "stress" | "unknown";
  };
}

export const MyFieldsList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [fields, setFields] = useState<Field[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load fields from Supabase
  useEffect(() => {
    // 🔥 LOG PAGE VIEW
    import('@/lib/blackBoxService').then(({ blackBoxService }) => {
      blackBoxService.logUserInteraction('page_view', 'fields_list', undefined, {
        timestamp: new Date().toISOString()
      });
    });
    
    const loadFields = async () => {
      try {
        // Load fields from Supabase
        const fieldsList = await supabaseFieldService.getFields();
        
        // Update each field with latest health data from field_data
        const updatedFields = await Promise.all(
          fieldsList.map(async (field: any) => {
            try {
              const latestData = await supabaseFieldService.getLatestFieldData(field.id);
              if (latestData) {
                // Calculate health status from health_score
                let healthStatus: "healthy" | "monitor" | "stress" | "unknown" = "unknown";
                const healthScore = latestData.health_score || 0;
                if (healthScore > 0.7) healthStatus = "healthy";
                else if (healthScore > 0.5) healthStatus = "monitor";
                else if (healthScore > 0.3) healthStatus = "stress";
                
                return {
                  ...field,
                  cropType: field.crop_type || 'Unknown',
                  sowingDate: field.created_at || new Date().toISOString(),
                  health: {
                    ndvi: latestData.ndvi || 0,
                    status: healthStatus
                  }
                };
              }
            } catch (error) {
              // Silently handle errors, show cached/default data
              console.warn(`Using cached data for field ${field.id}`);
            }
            return {
              ...field,
              cropType: field.crop_type || 'Unknown',
              sowingDate: field.created_at || new Date().toISOString(),
              health: {
                ndvi: 0,
                status: "unknown" as const
              }
            };
          })
        );
        
        console.log('Loaded fields from Supabase:', updatedFields);
        setFields(updatedFields);
        
        // 🔥 LOG FIELDS LOADED (silently, don't break on error)
        try {
          import('@/lib/blackBoxService').then(({ blackBoxService }) => {
            try {
              blackBoxService.logUserInteraction('page_view', 'fields_list_loaded', undefined, {
                fieldCount: updatedFields.length,
                timestamp: new Date().toISOString()
              });
            } catch (e) {
              // Silently ignore blackbox errors
            }
          }).catch(() => {}); // Silently ignore import errors
        } catch (error) {
          // Silently ignore any logging errors
        }
      } catch (error) {
        console.warn('Failed to load fields, showing cached data:', error);
        // Don't clear fields, keep showing whatever was there
      }
    };

    loadFields();
    
    // Reload fields when navigating back to this page
    const handleFocus = () => loadFields();
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadFields();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const getHealthColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-success text-success-foreground";
      case "monitor": return "bg-warning text-warning-foreground";
      case "stress": return "bg-destructive text-destructive-foreground";
      case "unknown": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getHealthLabel = (status: string) => {
    switch (status) {
      case "healthy": return `🟢 ${t('healthy')}`;
      case "monitor": return `🟡 ${t('monitor')}`;
      case "stress": return `🔴 ${t('stress')}`;
      case "unknown": return `⚪ ${t('pending')}`;
      default: return `⚪ ${t('pending')}`;
    }
  };

  // Filter fields based on showHistory toggle
  const filteredFields = showHistory 
    ? fields.filter((f: any) => f.status === 'harvested' || f.status === 'dormant')
    : fields.filter((f: any) => !f.status || f.status === 'active');

  const activeCount = fields.filter((f: any) => !f.status || f.status === 'active').length;
  const historyCount = fields.filter((f: any) => f.status === 'harvested' || f.status === 'dormant').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{t('my_fields')}</h2>
        <Button
          onClick={() => navigate("/soilsati/map-field")}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('add_field')}
        </Button>
      </div>

      {/* Toggle between Active and History */}
      <div className="flex gap-2">
        <Button
          variant={!showHistory ? "default" : "outline"}
          size="sm"
          onClick={() => setShowHistory(false)}
          className={!showHistory ? "bg-green-600 hover:bg-green-700" : ""}
        >
          🌱 Active ({activeCount})
        </Button>
        <Button
          variant={showHistory ? "default" : "outline"}
          size="sm"
          onClick={() => setShowHistory(true)}
          className={showHistory ? "bg-amber-600 hover:bg-amber-700" : ""}
        >
          📦 History ({historyCount})
        </Button>
      </div>

      {filteredFields.length === 0 ? (
        <Card className="p-8 text-center bg-card/50">
          <Sprout className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            {showHistory ? 'No fields in history' : t('no_fields_yet')}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {showHistory 
              ? 'Archived fields will appear here' 
              : t('start_mapping_first_field')}
          </p>
          {!showHistory && (
            <Button
              onClick={() => navigate("/soilsati/map-field")}
              className="bg-gradient-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('map_first_field')}
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredFields.map((field) => (
            <Card 
              key={field.id}
              className="p-4 bg-card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                // 🔥 LOG FIELD CLICK (silently, don't break navigation)
                try {
                  import('@/lib/blackBoxService').then(({ blackBoxService }) => {
                    try {
                      blackBoxService.logUserInteraction('button_click', 'field_card_click', field.id, {
                        fieldName: field.name,
                        cropType: field.cropType,
                        healthStatus: field.health?.status,
                        timestamp: new Date().toISOString()
                      });
                    } catch (e) {
                      // Silently ignore errors
                    }
                  }).catch(() => {}); // Silently ignore import errors
                } catch (error) {
                  // Silently ignore any logging errors
                }
                navigate(`/soilsati/field/${field.id}`);
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{field.name}</h3>
                  <p className="text-sm text-muted-foreground">🌾 {field.cropType}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <FieldStatusBadge status={(field as any).status || 'active'} size="sm" />
                  <Badge className={getHealthColor(field.health?.status || "unknown")}>
                    {getHealthLabel(field.health?.status || "unknown")}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center p-2 bg-muted/30 rounded">
                  <p className="text-xs text-muted-foreground mb-1">Area</p>
                  <p className="text-sm font-semibold">
                    {isNaN(field.area) || field.area === null ? '0.00' : Number(field.area).toFixed(2)} ha
                  </p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-3 h-3 text-success" />
                    <p className="text-xs text-muted-foreground">NDVI</p>
                  </div>
                  <p className="text-sm font-semibold">
                    {isNaN(field.health?.ndvi) ? '0.00' : (field.health?.ndvi || 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Droplets className="w-3 h-3 text-info" />
                    <p className="text-xs text-muted-foreground">Days</p>
                  </div>
                  <p className="text-sm font-semibold">
                    {(() => {
                      try {
                        if (!field.sowingDate) return '0';
                        const sowingTime = new Date(field.sowingDate).getTime();
                        if (isNaN(sowingTime)) return '0';
                        const days = Math.floor((Date.now() - sowingTime) / (1000 * 60 * 60 * 24));
                        return isNaN(days) || days < 0 ? '0' : days;
                      } catch (error) {
                        return '0';
                      }
                    })()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/soilsati/field/${field.id}`);
                }}>
                  View Details →
                </Button>
                {((field as any).status === 'active' || !(field as any).status) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-300 font-medium"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (confirm(`फसल कट गई? / Crop Harvested?\n\n"${field.name}"\n\n✅ इतिहास में जाएगा / Will move to history\n✅ निगरानी बंद होगी / Monitoring will stop\n✅ नई फसल के लिए फिर शुरू कर सकते हैं / Can restart for new crop\n\nहाँ? / Yes?`)) {
                        try {
                          const { fieldLifecycleService } = await import('@/lib/fieldLifecycleService');
                          await fieldLifecycleService.confirmHarvest(field.id, {
                            notes: 'Farmer marked as harvested from field list'
                          });
                          // Reload fields
                          const updatedFields = await supabaseFieldService.getFields();
                          setFields(updatedFields.map((f: any) => ({
                            ...f,
                            cropType: f.crop_type || 'Unknown',
                            sowingDate: f.created_at || new Date().toISOString(),
                            health: { ndvi: 0, status: "unknown" as const }
                          })));
                        } catch (error) {
                          console.error('Failed to archive field:', error);
                          alert('समस्या आई। फिर कोशिश करें। / Problem occurred. Try again.');
                        }
                      }
                    }}
                  >
                    🌾 कट गई / Harvested
                  </Button>
                )}
                {((field as any).status === 'harvested' || (field as any).status === 'dormant') && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-300 font-medium"
                    onClick={async (e) => {
                      e.stopPropagation();
                      const newCrop = prompt(`"${field.name}" में नई फसल बोएं\nStart New Crop in "${field.name}"\n\nनई फसल का नाम / New crop name:\n(धान, गेहूं, मक्का / Rice, Wheat, Corn)`);
                      if (newCrop && newCrop.trim()) {
                        try {
                          const { fieldLifecycleService } = await import('@/lib/fieldLifecycleService');
                          await fieldLifecycleService.reactivateField(field.id, newCrop.trim(), {
                            reactivationReason: 'New crop sowing started'
                          });
                          // Reload fields
                          const updatedFields = await supabaseFieldService.getFields();
                          setFields(updatedFields.map((f: any) => ({
                            ...f,
                            cropType: f.crop_type || 'Unknown',
                            sowingDate: f.created_at || new Date().toISOString(),
                            health: { ndvi: 0, status: "unknown" as const }
                          })));
                        } catch (error) {
                          console.error('Failed to reactivate field:', error);
                          alert('Failed to reactivate field. Please try again.');
                        }
                      }
                    }}
                  >
                    🌱 Reactivate
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
