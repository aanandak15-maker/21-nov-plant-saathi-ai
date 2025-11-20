import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sprout, Target, Users, Award } from "lucide-react";

export const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sprout className="w-12 h-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">About Plant Saathi AI</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Empowering farmers with AI and satellite technology for smarter, more sustainable farming
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                Plant Saathi AI is dedicated to transforming agriculture through cutting-edge technology. 
                We combine satellite imagery, artificial intelligence, and real-time data to provide farmers 
                with actionable insights that increase yields, reduce costs, and promote sustainable farming practices.
              </p>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🛰️ Satellite Monitoring</h3>
              <p className="text-gray-600 text-sm">
                Real-time field monitoring using NASA and ESA satellite data to track vegetation health, 
                soil moisture, and crop conditions.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🤖 AI-Powered Insights</h3>
              <p className="text-gray-600 text-sm">
                Advanced machine learning models provide personalized recommendations for irrigation, 
                fertilization, and pest management.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🌡️ Weather Intelligence</h3>
              <p className="text-gray-600 text-sm">
                16-day weather forecasts with farming-specific alerts to help you plan operations 
                and protect your crops.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Market Intelligence</h3>
              <p className="text-gray-600 text-sm">
                Live mandi prices, market trends, and smart marketplace recommendations to maximize 
                your profits.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-8 text-white">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-green-100 text-sm">Active Farmers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-green-100 text-sm">Fields Monitored</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">25%</div>
              <div className="text-green-100 text-sm">Avg. Yield Increase</div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Our Team</h2>
              <p className="text-gray-600 leading-relaxed">
                We're a passionate team of agronomists, data scientists, and software engineers 
                committed to making precision agriculture accessible to every farmer. Our diverse 
                expertise spans satellite remote sensing, machine learning, and agricultural science.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-gray-900">Ready to Get Started?</h2>
          <p className="text-gray-600">Join thousands of farmers already using Plant Saathi AI</p>
          <Button 
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => navigate('/auth')}
          >
            Sign Up Free
          </Button>
        </div>
      </div>
    </div>
  );
};
