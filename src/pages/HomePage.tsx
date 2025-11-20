import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseAuthService } from "@/lib/supabaseAuthService";
import { MarketingHomePage } from "@/components/homepage/MarketingHomePage";
import { FarmerFriendlyDashboard } from "@/components/dashboard/FarmerFriendlyDashboard";
import { Brain } from "lucide-react";

export const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await supabaseAuthService.getCurrentUser();
      
      if (user) {
        setIsAuthenticated(true);
        
        // Check if onboarding is complete
        const isComplete = await supabaseAuthService.isOnboardingComplete();
        setOnboardingComplete(isComplete);
        
        // If not complete, redirect to onboarding
        if (!isComplete) {
          navigate('/onboarding');
          return;
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50/30 to-background">
        <div className="text-center space-y-4 p-4">
          <Brain className="w-12 h-12 mx-auto text-green-600 animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show farmer dashboard if authenticated and onboarding complete
  if (isAuthenticated && onboardingComplete) {
    return <FarmerFriendlyDashboard />;
  }

  // Show marketing homepage for anonymous users
  return <MarketingHomePage />;
};
