import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Satellite, 
  Bug, 
  Brain, 
  CloudRain, 
  ShoppingCart, 
  TrendingUp,
  MessageSquare,
  Leaf,
  Sparkles,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    id: 'ai-chatbot',
    icon: MessageSquare,
    title: 'Field-Specific AI Chatbot',
    description: 'Ask anything about YOUR field - get instant answers based on real satellite data, weather, and crop conditions',
    color: 'from-purple-500 to-purple-600',
    route: '/dashboard',
    badge: 'Most Popular',
    badgeColor: 'bg-purple-500'
  },
  {
    id: 'disease-detection',
    icon: Bug,
    title: 'Disease Detection',
    description: 'Snap a photo, get instant diagnosis with sustainable & organic treatment options first',
    color: 'from-red-500 to-red-600',
    route: '/disease',
    badge: 'Sustainable',
    badgeColor: 'bg-green-500'
  },
  {
    id: 'soil-saathi',
    icon: Satellite,
    title: 'Satellite Monitoring',
    description: 'Real-time NDVI, EVI, soil moisture from space - see your field health like never before',
    color: 'from-blue-500 to-blue-600',
    route: '/soilsati',
    badge: 'Real-Time',
    badgeColor: 'bg-blue-500'
  },
  {
    id: 'weather',
    icon: CloudRain,
    title: 'Weather Intelligence',
    description: '16-day forecasts with farming-specific alerts - plan irrigation, spraying, and harvesting',
    color: 'from-cyan-500 to-cyan-600',
    route: '/weather'
  },
  {
    id: 'marketplace',
    icon: ShoppingCart,
    title: 'Smart Marketplace',
    description: 'AI recommends products based on your field needs - organic options prioritized',
    color: 'from-orange-500 to-orange-600',
    route: '/marketplace',
    badge: 'Organic First',
    badgeColor: 'bg-green-600'
  },
  {
    id: 'mandi-prices',
    icon: TrendingUp,
    title: 'Mandi Prices',
    description: 'Live market prices and trends - know the best time to sell for maximum profit',
    color: 'from-green-500 to-green-600',
    route: '/mandi-prices'
  }
];

export const FeaturesGrid = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section id="features" className="py-16 px-4 bg-gradient-to-b from-white to-green-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold mb-4">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
            <span>Sustainable Farming Made Easy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {t('homepage.features.title', 'Everything You Need to Farm Smarter')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('homepage.features.subtitle', 'AI-powered tools that prioritize sustainable solutions and maximize your farm productivity')}
          </p>
        </header>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id}
                className="feature-card p-6 hover:shadow-xl transition-all duration-300 group border-2 hover:border-green-500 relative overflow-hidden animate-card-reveal hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Badge */}
                {feature.badge && (
                  <div className={`absolute top-4 right-4 ${feature.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                    {feature.badge}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg ${feature.id === 'soil-saathi' ? 'animate-satellite-pulse' : ''}`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {t(`homepage.features.${feature.id}.title`, feature.title)}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t(`homepage.features.${feature.id}.description`, feature.description)}
                    </p>
                  </div>

                  {/* Try Free Button */}
                  <div className="pt-2">
                    <Button
                      variant="link"
                      onClick={() => navigate('/auth')}
                      className="text-green-600 text-sm font-medium hover:underline flex items-center gap-1 group/link p-0 h-auto"
                    >
                      {t('homepage.features.learnMore', 'Try it free')}
                      <span className="group-hover/link:translate-x-1 transition-transform" aria-hidden="true">→</span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {t('homepage.features.cta', 'Ready to Transform Your Farming?')}
          </p>
          <p className="text-gray-600 mb-6">
            {t('homepage.features.ctaSubtitle', 'Join thousands of farmers already growing smarter with AI')}
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            {t('homepage.features.startNow', 'Start Your Free Trial Now')}
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            ✓ No credit card required • ✓ Setup in 2 minutes • ✓ Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};
