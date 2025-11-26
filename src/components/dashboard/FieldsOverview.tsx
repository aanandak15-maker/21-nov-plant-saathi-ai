import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { MapPin, Sprout, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FieldsOverviewProps {
  fields: any[];
}

export const FieldsOverview = ({ fields }: FieldsOverviewProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (fields.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-2">
          {t("no_fields") || "No Fields Added"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t("add_first_field") || "Add your first field to start monitoring"}
        </p>
        <Button onClick={() => navigate("/soilsaathi/map-field")}>
          {t("add_field") || "Add Field"}
        </Button>
      </Card>
    );
  }

  const getFieldHealth = (field: any) => {
    // Get NDVI from health object or direct property
    const ndvi = field.health?.ndvi || field.ndvi || 0.5;

    // Map health status to display
    if (field.health?.status) {
      const statusMap: any = {
        "healthy": { status: "Healthy", color: "bg-green-500", textColor: "text-green-700", borderColor: "border-green-300", bgColor: "bg-green-50" },
        "monitor": { status: "Monitoring", color: "bg-blue-500", textColor: "text-blue-700", borderColor: "border-blue-300", bgColor: "bg-blue-50" },
        "stress": { status: "Needs Attention", color: "bg-orange-500", textColor: "text-orange-700", borderColor: "border-orange-300", bgColor: "bg-orange-50" },
        "unknown": { status: "Analyzing Data", color: "bg-yellow-500", textColor: "text-yellow-700", borderColor: "border-yellow-300", bgColor: "bg-yellow-50" }
      };
      return statusMap[field.health.status] || statusMap["unknown"];
    }

    // Fallback to NDVI-based calculation
    if (ndvi > 0.7) return { status: "Healthy", color: "bg-green-500", textColor: "text-green-700", borderColor: "border-green-300", bgColor: "bg-green-50" };
    if (ndvi > 0.5) return { status: "Good", color: "bg-blue-500", textColor: "text-blue-700", borderColor: "border-blue-300", bgColor: "bg-blue-50" };
    if (ndvi > 0.3) return { status: "Fair", color: "bg-yellow-500", textColor: "text-yellow-700", borderColor: "border-yellow-300", bgColor: "bg-yellow-50" };
    if (ndvi > 0) return { status: "Needs Care", color: "bg-orange-500", textColor: "text-orange-700", borderColor: "border-orange-300", bgColor: "bg-orange-50" };
    return { status: "Analyzing Data", color: "bg-gray-400", textColor: "text-gray-700", borderColor: "border-gray-300", bgColor: "bg-gray-50" };
  };

  const getCropImage = (cropType: string) => {
    const images: Record<string, string> = {
      wheat: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop",
      rice: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=300&fit=crop",
      paddy: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=300&fit=crop",
      cotton: "https://images.unsplash.com/photo-1615485500834-bc10199bc48c?w=400&h=300&fit=crop",
      sugarcane: "https://images.unsplash.com/photo-1618477460859-8989e1f3f0b7?w=400&h=300&fit=crop",
    };
    return images[cropType?.toLowerCase()] || images.wheat;
  };

  const getDaysToHarvest = (field: any) => {
    // Calculate based on growth stage
    return Math.floor(Math.random() * 100) + 20; // Mock for now
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base font-semibold text-gray-900">
          My Crops
        </h2>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {fields.slice(0, 4).map((field) => {
          const health = getFieldHealth(field);
          const daysToHarvest = getDaysToHarvest(field);
          const progress = Math.min((daysToHarvest / 120) * 100, 100);

          return (
            <div
              key={field.id}
              className="flex-shrink-0 w-[160px] bg-white rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all snap-start"
              onClick={() => navigate(`/soilsaathi/field/${field.id}`)}
            >
              {/* Crop Image */}
              <div className="h-[100px] overflow-hidden">
                <img
                  src={getCropImage(field.cropType)}
                  alt={field.cropType}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Field Info */}
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-900 mb-1">
                  {field.cropType || "Rice"} - {field.name?.split(' ')[0] || "Plot A"}
                </h3>

                {/* Health Status */}
                <div className="flex items-center gap-1 mb-3">
                  <div className={`w-2 h-2 rounded-full ${health.color === 'bg-green-500' ? 'bg-green-500' : health.color === 'bg-blue-500' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                  <span className="text-xs text-gray-600">Health: {health.status}</span>
                </div>

                {/* Days to Harvest */}
                <div className="mb-2">
                  <p className="text-xs text-gray-600 mb-1">{daysToHarvest} Days to Harvest</p>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
