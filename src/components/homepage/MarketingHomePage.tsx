import { HeroSection } from "./HeroSection";
import { FeaturesGrid } from "./FeaturesGrid";
import { TestimonialsSection } from "./TestimonialsSection";
import { SEOHead } from "@/components/seo/SEOHead";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";

export const MarketingHomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-white">
        {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b shadow-sm backdrop-blur-sm bg-white/90" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Plant Saathi AI - Go to top"
            >
              <span className="text-2xl" aria-hidden="true">🌾</span>
              <span className="text-xl font-bold text-green-600">Plant Saathi AI</span>
            </button>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Button 
                variant="ghost"
                onClick={() => navigate('/auth')}
              >
                {t('homepage.nav.login', 'Login')}
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/auth')}
              >
                <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                {t('homepage.nav.signup', 'Start Free Trial')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4" role="contentinfo">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl" aria-hidden="true">🌾</span>
            <span className="text-2xl font-bold">Plant Saathi AI</span>
          </div>
          <p className="text-gray-400">
            {t('homepage.footer.tagline', 'Empowering farmers with AI and satellite technology')}
          </p>
          <nav className="flex justify-center gap-6 text-sm text-gray-400 flex-wrap" aria-label="Footer navigation">
            <Button 
              variant="link"
              onClick={() => navigate('/about')}
              className="hover:text-white transition-colors text-gray-400 p-0 h-auto"
            >
              {t('homepage.footer.about', 'About')}
            </Button>
            <Button 
              variant="link"
              onClick={() => navigate('/faq')}
              className="hover:text-white transition-colors text-gray-400 p-0 h-auto"
            >
              {t('homepage.footer.faq', 'FAQ')}
            </Button>
            <Button 
              variant="link"
              onClick={() => navigate('/contact')}
              className="hover:text-white transition-colors text-gray-400 p-0 h-auto"
            >
              {t('homepage.footer.contact', 'Contact')}
            </Button>
            <Button 
              variant="link"
              onClick={() => navigate('/privacy')}
              className="hover:text-white transition-colors text-gray-400 p-0 h-auto"
            >
              {t('homepage.footer.privacy', 'Privacy')}
            </Button>
            <Button 
              variant="link"
              onClick={() => navigate('/terms')}
              className="hover:text-white transition-colors text-gray-400 p-0 h-auto"
            >
              {t('homepage.footer.terms', 'Terms')}
            </Button>
          </nav>
          <p className="text-gray-500 text-sm pt-4">
            © 2024 Plant Saathi AI. {t('homepage.footer.rights', 'All rights reserved.')}
          </p>
        </div>
      </footer>
      </div>
    </>
  );
};
