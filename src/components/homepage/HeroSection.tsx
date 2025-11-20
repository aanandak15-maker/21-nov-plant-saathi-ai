import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sprout, Satellite, Brain, TrendingUp, Play, MessageSquare, Leaf, Shield, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { DemoVideoModal } from "./DemoVideoModal";

export const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <section className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Main Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Logo & Title */}
            <header className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <Sprout className="w-12 h-12 sm:w-16 sm:h-16 animate-pulse" aria-hidden="true" />
                <h1 className="text-4xl sm:text-6xl font-bold">
                  Plant Saathi AI
                </h1>
              </div>
              <p className="text-xl sm:text-3xl font-semibold text-white">
                {t('homepage.hero.tagline', 'Your Personal AI Farming Expert')}
              </p>
              <p className="text-lg text-green-50">
                {t('homepage.hero.subtitle', 'Field-specific insights, disease detection, and sustainable solutions - all powered by satellite data and AI')}
              </p>
            </header>

            {/* Key Differentiators */}
            <ul className="space-y-3 list-none">
              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm" aria-hidden="true">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-base font-medium">Field-Specific AI Chatbot for Every Question</span>
              </li>
              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm" aria-hidden="true">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="text-base font-medium">Sustainable & Organic Solutions First</span>
              </li>
              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm" aria-hidden="true">
                  <Satellite className="w-5 h-5" />
                </div>
                <span className="text-base font-medium">Real-Time Satellite Monitoring</span>
              </li>
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg"
                className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-6 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 font-semibold"
                onClick={() => navigate('/auth')}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                {t('homepage.hero.getStarted', 'Start Free Trial')}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 backdrop-blur-sm"
                onClick={() => setShowDemoModal(true)}
              >
                <Play className="mr-2 h-5 w-5" />
                {t('homepage.hero.watchDemo', 'Watch Demo')}
              </Button>
            </div>

            {/* Free Trial Badge */}
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-green-900 px-6 py-3 rounded-full font-semibold shadow-lg">
              <Shield className="w-5 h-5" />
              <span>{t('homepage.hero.freeTrial', 'Free Trial Period • No Credit Card Required')}</span>
            </div>
          </div>

          {/* Right: Video Thumbnail + Stats */}
          <aside className="space-y-6">
            {/* Video Thumbnail */}
            <button 
              onClick={() => setShowDemoModal(true)}
              className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer group border-4 border-white/20 hover:border-white/40 transition-all w-full"
              aria-label="Watch demo video"
            >
              {/* Thumbnail Image Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-green-800 to-green-900 flex items-center justify-center relative">
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <div className="bg-white rounded-full p-6 group-hover:scale-110 transition-transform shadow-2xl">
                    <Play className="w-12 h-12 text-green-600 fill-green-600" aria-hidden="true" />
                  </div>
                </div>
                
                {/* Mock Screenshot Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between" aria-hidden="true">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-fit">
                    <p className="text-sm font-medium">🌾 Field Dashboard</p>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 w-3/4">
                      <p className="text-xs">NDVI: 0.72 (Healthy)</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 w-2/3">
                      <p className="text-xs">AI Recommendation Ready</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Duration Badge */}
              <span className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                2:30
              </span>
            </button>

            {/* Trust Stats Grid */}
            <div className="grid grid-cols-3 gap-4" role="region" aria-label="Platform statistics">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 animate-count-up hover-lift" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl font-bold" aria-label="12,500 plus active farmers">12,500+</div>
                <div className="text-sm text-green-100 mt-1">Active Farmers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 animate-count-up hover-lift" style={{ animationDelay: '0.4s' }}>
                <div className="text-3xl font-bold" aria-label="45,000 plus fields monitored">45,000+</div>
                <div className="text-sm text-green-100 mt-1">Fields Monitored</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 animate-count-up hover-lift" style={{ animationDelay: '0.6s' }}>
                <div className="text-3xl font-bold" aria-label="98 percent satisfaction">98%</div>
                <div className="text-sm text-green-100 mt-1">Satisfaction</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Demo Video Modal */}
      <DemoVideoModal 
        isOpen={showDemoModal} 
        onClose={() => setShowDemoModal(false)} 
      />
    </section>
  );
};
