import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const modules = [
    {
      icon: "🌾",
      title: "Soil Saathi",
      gradient: "from-green-400 to-green-600",
      path: "/soilsaathi",
    },
    {
      icon: "📸",
      title: "Disease Scan",
      gradient: "from-red-400 to-red-600",
      path: "/disease",
    },
    {
      icon: "☁️",
      title: "Weather",
      gradient: "from-blue-400 to-cyan-500",
      path: "/weather",
    },
    {
      icon: "💰",
      title: "Mandi Prices",
      gradient: "from-yellow-400 to-orange-500",
      path: "/mandi-prices",
    },
    {
      icon: "🛒",
      title: "Marketplace",
      gradient: "from-purple-400 to-purple-600",
      path: "/marketplace",
    },
    {
      icon: "🔄",
      title: "Crop Rotation",
      gradient: "from-teal-400 to-teal-600",
      path: "/crop-rotation/new",
    },
    {
      icon: "💧",
      title: "Irrigation",
      gradient: "from-cyan-400 to-blue-500",
      path: "/weather",
    },
    {
      icon: "🎯",
      title: "Schemes",
      gradient: "from-indigo-400 to-indigo-600",
      path: "/schemes",
    },
    {
      icon: "🛍️",
      title: "Cart",
      gradient: "from-pink-400 to-pink-600",
      path: "/cart",
    },
    {
      icon: "📍",
      title: "Add Field",
      gradient: "from-emerald-400 to-emerald-600",
      path: "/new-field",
    },
    {
      icon: "🔔",
      title: "Alerts",
      gradient: "from-rose-400 to-rose-600",
      path: "/notifications",
    },
    {
      icon: "⚙️",
      title: "Settings",
      gradient: "from-gray-400 to-gray-600",
      path: "/profile",
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold text-gray-900 mb-3 px-1">
        Quick Actions
      </h2>

      <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2">
        {modules.map((module, index) => (
          <button
            key={index}
            onClick={() => navigate(module.path)}
            className={`bg-gradient-to-br ${module.gradient} text-white rounded-xl p-3 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex flex-col items-center justify-center gap-1.5 h-[90px]`}
            aria-label={module.title}
          >
            <div className="text-3xl">{module.icon}</div>
            <div className="font-semibold text-xs text-center leading-tight truncate w-full px-1">
              {module.title}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
