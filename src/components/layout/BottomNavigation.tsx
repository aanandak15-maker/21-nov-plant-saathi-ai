import { Home, Sprout, Camera, ShoppingBag, CloudSun, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const navItems = [
  { path: "/dashboard", icon: Home, labelKey: "dashboard", color: "text-green-600" },
  { path: "/soilsaathi", icon: Sprout, labelKey: "soilsati", color: "text-emerald-600" },
  { path: "/disease", icon: Camera, labelKey: "disease_detection", color: "text-red-600" },
  { path: "/marketplace", icon: ShoppingBag, labelKey: "marketplace", color: "text-purple-600" },
  { path: "/weather", icon: CloudSun, labelKey: "weather", color: "text-blue-600" },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-50 safe-area-bottom shadow-lg">
      <div className="flex justify-around items-center h-18 max-w-lg mx-auto px-1">
        {navItems.map(({ path, icon: Icon, labelKey, color }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 px-1 py-2 rounded-lg active:scale-95",
                isActive
                  ? `${color} bg-gradient-to-b from-green-50 to-transparent`
                  : "text-gray-500 hover:text-gray-700 active:bg-gray-100"
              )}
            >
              <div className={cn(
                "relative transition-transform duration-200",
                isActive && "scale-110"
              )}>
                <Icon className="w-7 h-7" strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full"></div>
                )}
              </div>
              <span className={cn(
                "text-xs font-medium leading-tight text-center mt-1",
                isActive ? "font-semibold" : "font-normal"
              )}>
                {t(labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
