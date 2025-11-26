import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Droplets, Thermometer, Bug, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CriticalAlertsProps {
  weatherData: any;
  irrigationData: any;
  diseaseOutbreaks: any[];
}

export const CriticalAlerts = ({ weatherData, irrigationData, diseaseOutbreaks }: CriticalAlertsProps) => {
  const { t } = useTranslation();
  const alerts: any[] = [];

  // Weather-based critical alerts
  if (weatherData) {
    const { current, forecast } = weatherData;

    // Extreme heat
    if (current.temp > 40) {
      alerts.push({
        type: "critical",
        icon: Thermometer,
        title: t("extreme_heat") || "🔥 EXTREME HEAT ALERT",
        message: `Temperature ${current.temp}°C! Irrigate NOW at 5 AM. Cover young plants.`,
        color: "border-red-500 bg-red-50"
      });
    }


    // Heavy rain
    const heavyRain = forecast?.find?.((d: any) => d.precipitation > 70);
    if (heavyRain) {
      alerts.push({
        type: "warning",
        icon: Droplets,
        title: t("heavy_rain") || "🌧️ HEAVY RAIN ALERT",
        message: `${heavyRain.precipitation}% rain chance ${heavyRain.day}. Clear drainage NOW! Skip irrigation.`,
        color: "border-blue-500 bg-blue-50"
      });
    }


    // Cold alert
    if (current.temp < 10) {
      alerts.push({
        type: "critical",
        icon: AlertTriangle,
        title: t("frost_risk") || "❄️ FROST RISK",
        message: `Temperature ${current.temp}°C! Cover crops before sunset. Light smoke at 5 AM.`,
        color: "border-purple-500 bg-purple-50"
      });
    }

    // High humidity + disease risk
    if (current.humidity > 85) {
      alerts.push({
        type: "warning",
        icon: Bug,
        title: t("disease_risk") || "🦠 HIGH DISEASE RISK",
        message: `Humidity ${current.humidity}%! Spray Mancozeb (2g/L) preventively. Remove infected leaves.`,
        color: "border-orange-500 bg-orange-50"
      });
    }
  }

  // Irrigation alerts
  if (irrigationData?.alerts && irrigationData.alerts.length > 0) {
    const criticalIrrigationAlert = irrigationData.alerts[0];
    if (criticalIrrigationAlert.includes("ALERT") || criticalIrrigationAlert.includes("URGENT")) {
      alerts.push({
        type: "info",
        icon: Droplets,
        title: t("irrigation_alert") || "💧 IRRIGATION ALERT",
        message: criticalIrrigationAlert.replace(/[🌧️🔥❄️💧☀️🌦️]/g, "").trim(),
        color: "border-cyan-500 bg-cyan-50"
      });
    }
  }

  // Disease outbreak alerts
  if (diseaseOutbreaks.length > 0) {
    const recentOutbreaks = diseaseOutbreaks.flatMap(f => f.outbreaks).slice(0, 2);
    recentOutbreaks.forEach(outbreak => {
      alerts.push({
        type: "critical",
        icon: Bug,
        title: t("disease_detected") || "🐛 DISEASE DETECTED",
        message: `${outbreak.disease_name} in ${outbreak.fieldName}. ${outbreak.confidence}% confidence. Check treatments!`,
        color: "border-red-500 bg-red-50"
      });
    });
  }

  // Water savings alert
  if (irrigationData?.weeklyWaterSavings > 20) {
    alerts.push({
      type: "success",
      icon: TrendingUp,
      title: t("water_savings") || "💰 SAVINGS ALERT",
      message: `Save ${irrigationData.weeklyWaterSavings}% water this week! That's ₹${irrigationData.costSavings} saved on diesel!`,
      color: "border-green-500 bg-green-50"
    });
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      <h2 className="text-base font-semibold text-gray-900 px-1">Critical Alerts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {alerts.slice(0, 2).map((alert, index) => {
          const Icon = alert.icon;
          const solidBg = alert.type === "critical" ? "bg-red-500" : alert.type === "warning" ? "bg-orange-500" : "bg-blue-500";

          return (
            <div key={index} className={`${solidBg} text-white rounded-xl p-4 shadow-md`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-1">{alert.title}</h3>
                  <p className="text-xs opacity-90 leading-relaxed">{alert.message}</p>
                </div>
              </div>
              <button className="text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
