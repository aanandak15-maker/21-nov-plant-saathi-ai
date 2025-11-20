import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { AIAdvisorFAB } from "@/components/layout/AIAdvisorFAB";
import { FarmerFriendlyMarketplace } from "@/components/marketplace/farmer-friendly/FarmerFriendlyMarketplace";

const Marketplace = () => {
  return (
    <>
      <FarmerFriendlyMarketplace />
      <AIAdvisorFAB />
      <BottomNavigation />
    </>
  );
};

export default Marketplace;
