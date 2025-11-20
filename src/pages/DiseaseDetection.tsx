import { FarmerFriendlyDiseaseDetection } from "@/components/disease/farmer-friendly/FarmerFriendlyDiseaseDetection";
import { AIAdvisorFAB } from "@/components/layout/AIAdvisorFAB";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

const DiseaseDetection = () => {
  return (
    <>
      <FarmerFriendlyDiseaseDetection />
      <AIAdvisorFAB />
      <BottomNavigation />
    </>
  );
};

export default DiseaseDetection;
