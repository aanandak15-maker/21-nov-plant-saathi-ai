import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { FarmerFriendlyDashboard } from "@/components/dashboard/FarmerFriendlyDashboard";
import { blackBoxService } from "@/lib/blackBoxService";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Log dashboard view
    blackBoxService.logUserInteraction('page_view', 'dashboard', undefined, {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20">
      <FarmerFriendlyDashboard />
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
