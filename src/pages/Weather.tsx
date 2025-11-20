import { FarmerFriendlyWeather } from "@/components/weather/farmer-friendly/FarmerFriendlyWeather";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function Weather() {
  return (
    <>
      <FarmerFriendlyWeather />
      <BottomNavigation />
    </>
  );
}
