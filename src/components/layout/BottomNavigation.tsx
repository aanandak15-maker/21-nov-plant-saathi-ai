import { Home, Sprout, ShoppingBag, Camera, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const navItems = [
  { path: "/dashboard", icon: Home, labelKey: "home", emoji: "🏠" },
  { path: "/soilsati", icon: Sprout, labelKey: "my_fields", emoji: "🌱" },
  { path: "/marketplace", icon: ShoppingBag, labelKey: "market", emoji: "🛒" },
  { path: "/disease", icon: Camera, labelKey: "check_health", emoji: "📸" },
  { path: "/profile", icon: BookOpen, labelKey: "learn", emoji: "📚" },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-50 safe-area-bottom shadow-lg">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-1">
        {navItems.map(({ path, icon: Icon, labelKey, emoji }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-all px-1 rounded-lg",
                isActive
                  ? "text-green-600 bg-green-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <span className={cn("text-xl mb-0.5", isActive && "scale-110 transition-transform")}>
                {emoji}
              </span>
              <span className={cn(
                "text-[10px] font-medium leading-tight text-center",
                isActive && "font-bold"
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
