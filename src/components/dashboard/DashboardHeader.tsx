import { useTranslation } from "react-i18next";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

interface DashboardHeaderProps {
  weatherData?: any;
  irrigationData?: any;
  diseaseOutbreaks?: any[];
}

export const DashboardHeader = ({ weatherData, irrigationData, diseaseOutbreaks }: DashboardHeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentHour = new Date().getHours();

  const getGreeting = () => {
    if (currentHour < 12) return t("good_morning") || "Good Morning";
    if (currentHour < 17) return t("good_afternoon") || "Good Afternoon";
    return t("good_evening") || "Good Evening";
  };

  const getFarmerName = () => {
    // Get from localStorage or default
    const profile = JSON.parse(localStorage.getItem("user_profile") || "{}");
    return profile.name || t("farmer") || "Farmer";
  };

  // Calculate notification count
  const notificationCount = useMemo(() => {
    let count = 0;

    if (weatherData) {
      const { current, forecast } = weatherData;

      // Critical weather alerts
      if (current.temp > 40) count++;
      if (current.temp < 10) count++;
      if (current.humidity > 85) count++;

      // Rain alerts
      const heavyRain = forecast?.find((d: any) => d.precipitation > 70);
      if (heavyRain) count++;
    }

    // Irrigation alerts
    if (irrigationData?.alerts && irrigationData.alerts.length > 0) {
      const criticalAlerts = irrigationData.alerts.filter((alert: string) =>
        alert.includes("ALERT") || alert.includes("URGENT")
      );
      count += criticalAlerts.length;
    }

    // Disease outbreaks
    if (diseaseOutbreaks && diseaseOutbreaks.length > 0) {
      const recentOutbreaks = diseaseOutbreaks.flatMap(f => f.outbreaks).filter((outbreak: any) => {
        const detectedDate = new Date(outbreak.detected_at);
        const daysAgo = Math.floor((Date.now() - detectedDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysAgo <= 7; // Last 7 days
      });
      count += recentOutbreaks.length;
    }

    return count;
  }, [weatherData, irrigationData, diseaseOutbreaks]);

  const getLocation = () => {
    const profile = JSON.parse(localStorage.getItem("user_profile") || "{}");
    return profile.location || "Punjab, India";
  };

  return (
    <div className="flex items-center justify-between mb-6 px-1">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {getGreeting()}, {getFarmerName()}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {getLocation()}
        </p>
      </div>
      <div className="flex gap-3 items-center">
        <div className="relative w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center cursor-pointer" onClick={() => navigate("/profile")}>
          <span className="text-lg font-semibold text-orange-800">
            {getFarmerName().charAt(0).toUpperCase()}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full"></div>
          )}
        </Button>
      </div>
    </div>
  );
};
