import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActionableInsightsProps {
  weatherData: any;
  irrigationData: any;
  fields: any[];
}

export const ActionableInsights = ({ weatherData, irrigationData, fields }: ActionableInsightsProps) => {
  const { t } = useTranslation();
  const insights: any[] = [];

  // Generate TODAY's actionable insights
  const today = new Date();
  const currentHour = today.getHours();

  // Morning tasks (5 AM - 10 AM)
  if (currentHour >= 5 && currentHour < 10) {
    // Check if irrigation is scheduled
    const todayIrrigation = irrigationData?.schedule?.find((s: any) => {
      const scheduleDate = new Date(s.date);
      return scheduleDate.toDateString() === today.toDateString() && !s.isSkipped;
    });

    if (todayIrrigation) {
      insights.push({
        priority: "high",
        time: todayIrrigation.time,
        action: t("irrigate_now") || "Irrigate Now",
        description: `${todayIrrigation.duration}h irrigation needed. ${todayIrrigation.reason}`,
        icon: "💧",
        status: "pending"
      });
    }

    // Morning spray window
    if (weatherData?.current.wind_speed < 10) {
      insights.push({
        priority: "medium",
        time: "Before 10 AM",
        action: t("spray_window") || "Perfect Spray Window",
        description: "Low wind, good temperature. Apply pesticides/fertilizers now.",
        icon: "🌾",
        status: "pending"
      });
    }
  }

  // Afternoon tasks (10 AM - 4 PM)
  if (currentHour >= 10 && currentHour < 16) {
    insights.push({
      priority: "low",
      time: "Afternoon",
      action: t("field_inspection") || "Field Inspection",
      description: "Check for pests, diseases, and water stress. Take photos if needed.",
      icon: "👀",
      status: "pending"
    });

    // Hot weather warning
    if (weatherData?.current.temp > 35) {
      insights.push({
        priority: "high",
        time: "Now",
        action: t("avoid_irrigation") || "Don't Irrigate Now!",
        description: `Too hot (${weatherData.current.temp}°C). 50% water will evaporate. Wait until evening.`,
        icon: "🔥",
        status: "warning"
      });
    }
  }

  // Evening tasks (4 PM - 8 PM)
  if (currentHour >= 16 && currentHour < 20) {
    const todayIrrigation = irrigationData?.schedule?.find((s: any) => {
      const scheduleDate = new Date(s.date);
      return scheduleDate.toDateString() === today.toDateString() && !s.isSkipped;
    });

    if (todayIrrigation && todayIrrigation.time.includes("PM")) {
      insights.push({
        priority: "high",
        time: todayIrrigation.time,
        action: t("evening_irrigation") || "Evening Irrigation",
        description: `${todayIrrigation.duration}h irrigation. Best time to water in hot weather.`,
        icon: "💧",
        status: "pending"
      });
    }

    // Evening spray option
    if (weatherData?.current.wind_speed < 15) {
      insights.push({
        priority: "medium",
        time: "6-8 PM",
        action: t("evening_spray") || "Evening Spray Option",
        description: "Good for pesticides. But risk of fungal disease if humidity is high.",
        icon: "🌾",
        status: "pending"
      });
    }
  }

  // Weather-based insights
  if (weatherData) {
    const { current, daily } = weatherData;

    // Rain coming - harvest alert
    const rainTomorrow = daily[1]?.precipitation > 50;
    if (rainTomorrow) {
      insights.push({
        priority: "high",
        time: "Today",
        action: t("harvest_before_rain") || "Harvest Ripe Crops",
        description: `Rain expected tomorrow (${daily[1].precipitation}%). Harvest ready crops today!`,
        icon: "🌾",
        status: "urgent"
      });
    }

    // Perfect farming day
    if (current.temp >= 25 && current.temp <= 32 && current.wind_speed < 10 && daily[0].precipitation < 20) {
      insights.push({
        priority: "medium",
        time: "All Day",
        action: t("perfect_day") || "Perfect Farming Day!",
        description: "Ideal conditions. Do fertilizer application, transplanting, or any farm work.",
        icon: "✅",
        status: "success"
      });
    }
  }

  // Irrigation savings insight
  if (irrigationData?.weeklyWaterSavings > 0) {
    const skippedToday = irrigationData.schedule?.find((s: any) => {
      const scheduleDate = new Date(s.date);
      return scheduleDate.toDateString() === today.toDateString() && s.isSkipped;
    });

    if (skippedToday) {
      insights.push({
        priority: "low",
        time: "Today",
        action: t("skip_irrigation") || "Skip Irrigation Today",
        description: skippedToday.skipReason || "Save water and money!",
        icon: "💰",
        status: "success"
      });
    }
  }

  // Disease monitoring
  if (fields.some(f => f.disease_outbreaks && f.disease_outbreaks.length > 0)) {
    insights.push({
      priority: "high",
      time: "Daily",
      action: t("monitor_disease") || "Monitor Disease Spread",
      description: "Check infected fields daily. Remove affected parts. Apply treatments.",
      icon: "🐛",
      status: "warning"
    });
  }

  // Sort by priority
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  insights.sort((a, b) => priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]);

  if (insights.length === 0) {
    return (
      <Card className="p-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-2">
          {t("all_good") || "All Good! 🎉"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("no_urgent_tasks") || "No urgent tasks for today. Keep monitoring your fields."}
        </p>
      </Card>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold text-gray-900 mb-3 px-1">
        Tasks for Today
      </h2>

      <div className="space-y-3">
        {insights.slice(0, 3).map((insight, index) => {
          const getPriorityLabel = () => {
            if (insight.priority === "high" || insight.priority === "urgent") return "High Priority";
            if (insight.priority === "medium") return "Medium Priority";
            return "Low Priority";
          };

          const getPriorityColor = () => {
            if (insight.priority === "high" || insight.priority === "urgent") return "text-red-600";
            if (insight.priority === "medium") return "text-orange-600";
            return "text-blue-600";
          };

          return (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="mb-2">
                <h3 className="font-semibold text-sm text-gray-900 mb-1">
                  {insight.action}
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {insight.description}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold ${getPriorityColor()}`}>
                  Plot B - {getPriorityLabel()} due to {insight.description.split('.')[0].toLowerCase()}
                </span>
                <span className="text-gray-500">{insight.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
