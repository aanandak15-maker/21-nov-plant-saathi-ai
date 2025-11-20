import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Search, Satellite, Brain, Leaf, Shield, Smartphone, Users } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

const faqData: FAQItem[] = [
  {
    id: "satellite-farming",
    question: "How does satellite farming work?",
    answer: "Satellite farming uses real-time satellite imagery to monitor crop health without visiting fields. Plant Saathi AI analyzes NDVI, EVI, and soil moisture data from space to detect issues early. Farmers get instant alerts about irrigation needs, disease risks, and yield predictions - all from their smartphone. This precision agriculture approach can increase yields by 20-30% while reducing water usage by 40%.",
    category: "Technology",
    keywords: ["satellite", "NDVI", "precision agriculture", "monitoring"]
  },
  {
    id: "ndvi-agriculture",
    question: "What is NDVI in agriculture and how does it help farmers?",
    answer: "NDVI (Normalized Difference Vegetation Index) measures plant health from space using light reflection. Healthy plants reflect more near-infrared light (high NDVI: 0.6-0.9), stressed plants show lower values (0.2-0.5). Plant Saathi AI uses NDVI to identify water stress before visible wilting, nutrient deficiencies, disease onset, and optimal harvest timing. Farmers receive color-coded field maps showing problem areas instantly.",
    category: "Technology",
    keywords: ["NDVI", "vegetation index", "crop health", "satellite data"]
  },
  {
    id: "disease-detection-accuracy",
    question: "How accurate is AI crop disease detection?",
    answer: "Plant Saathi AI achieves 94% accuracy in detecting crop diseases through machine learning trained on millions of plant images. The system identifies rice blast, bacterial blight, wheat rust, powdery mildew, maize stalk rot, and leaf blight. Users upload photos via smartphone for instant diagnosis with treatment recommendations. False positives are minimized through multi-algorithm verification, and all recommendations prioritize organic, sustainable solutions first.",
    category: "Features",
    keywords: ["disease detection", "AI", "accuracy", "crop diseases"]
  },
  {
    id: "yield-prediction",
    question: "Can satellites predict crop yields accurately?",
    answer: "Yes, satellite-based yield prediction is 85-92% accurate when combined with weather data and field history. Plant Saathi AI uses historical yield data from 10+ years, real-time vegetation indices, weather forecasts and soil moisture, and crop variety characteristics. Predictions are most accurate (90%+) for rice, wheat, and maize in North India, with confidence intervals provided for each forecast.",
    category: "Features",
    keywords: ["yield prediction", "accuracy", "forecasting", "harvest"]
  },
  {
    id: "pricing",
    question: "How much does Plant Saathi AI cost?",
    answer: "Plant Saathi AI offers flexible pricing for Indian farmers: Free Trial (14 days full access, no credit card required), Basic Plan (₹499/month - satellite monitoring for 5 fields), Pro Plan (₹999/month - unlimited fields + AI chatbot), and Enterprise (custom pricing for cooperatives). All plans include core features: satellite monitoring, disease detection, weather alerts, and mandi price tracking. Farmers can cancel anytime, and we offer special rates for small farmers and agricultural cooperatives.",
    category: "Pricing",
    keywords: ["cost", "pricing", "subscription", "free trial"]
  },
  {
    id: "offline-capability",
    question: "Do I need internet to use satellite farming?",
    answer: "No, Plant Saathi AI works offline for core features. The app downloads satellite data when connected, stores field data locally on your device, provides offline analysis and recommendations, and syncs automatically when internet is available. Perfect for farmers in rural areas with intermittent connectivity. Only real-time weather updates and new satellite imagery require internet access.",
    category: "Technical",
    keywords: ["offline", "internet", "connectivity", "rural"]
  },
  {
    id: "supported-crops",
    question: "What crops does Plant Saathi AI support?",
    answer: "Plant Saathi AI supports major North Indian crops: Rice (all varieties including Basmati, IR-64, PR-126 with kharif/rabi season optimization), Wheat (HD-3086, PBW-725 varieties with rust resistance monitoring), Maize (DHM-117, HQPM-1 hybrids with yield prediction), and Cotton, Sugarcane, Mustard (coming soon). The AI learns regional farming patterns and provides location-specific recommendations for Punjab, Haryana, UP, Bihar, and MP.",
    category: "Features",
    keywords: ["crops", "rice", "wheat", "maize", "varieties"]
  },
  {
    id: "data-security",
    question: "Is my farming data secure and private?",
    answer: "Absolutely. Plant Saathi AI uses bank-level security with end-to-end encryption for all data, data stored on secure Indian servers (compliant with local laws), no data sharing with third parties, and farmers control data access and can delete anytime. We prioritize farmer privacy - your field locations and farming data never leave your control. All processing happens on-device when possible.",
    category: "Security",
    keywords: ["security", "privacy", "data protection", "encryption"]
  },
  {
    id: "getting-started",
    question: "How do I get started with Plant Saathi AI?",
    answer: "Getting started takes just 3 minutes: 1) Download the app (Android/iOS), 2) Create account with phone number, 3) Add your first field using GPS or manual coordinates, 4) Upload crop details (variety, sowing date, expected yield). The AI chatbot guides you through setup. Free trial includes full access to all features for 14 days.",
    category: "Getting Started",
    keywords: ["setup", "onboarding", "start", "registration"]
  },
  {
    id: "traditional-farming",
    question: "Can Plant Saathi AI work with my existing farming methods?",
    answer: "Yes! Plant Saathi AI enhances traditional farming, it doesn't replace it. The app works with any irrigation method (drip, flood, sprinkler), is compatible with organic and chemical farming, supports traditional and hybrid seed varieties, and integrates with existing equipment and practices. Think of it as a smart farming assistant that makes your current methods more efficient and profitable.",
    category: "Getting Started",
    keywords: ["traditional", "compatibility", "integration", "methods"]
  },
  {
    id: "differentiation",
    question: "What makes Plant Saathi AI different from other farming apps?",
    answer: "Plant Saathi AI stands out with real satellite data (not just weather forecasts, actual field imagery), farmer-first AI (prioritizes sustainable, affordable solutions), offline capability (works in rural areas with poor connectivity), local expertise (trained on North Indian farming conditions), and complete ecosystem (monitoring + disease detection + market intelligence). Unlike generic apps, we understand Indian agriculture challenges and provide practical, actionable insights.",
    category: "About",
    keywords: ["difference", "unique", "comparison", "features"]
  },
  {
    id: "weather-intelligence",
    question: "How does weather intelligence help with farming decisions?",
    answer: "Plant Saathi AI provides 16-day weather forecasts with farming-specific insights: irrigation timing (when to water based on evaporation rates), spraying windows (optimal times to avoid rain wash-off), harvest planning (weather windows for harvesting), and disease alerts (humidity/temperature conditions that favor diseases). All recommendations include confidence levels and alternative plans for weather changes.",
    category: "Features",
    keywords: ["weather", "forecast", "irrigation", "planning"]
  },
  {
    id: "multiple-fields",
    question: "Can I monitor multiple fields with Plant Saathi AI?",
    answer: "Yes, farmers can monitor unlimited fields depending on their plan. The dashboard shows all fields on interactive map, health status overview for each field, individual field alerts and recommendations, comparative yield predictions, and bulk actions for similar crops. Perfect for farmers with multiple plots or agricultural cooperatives managing large areas.",
    category: "Features",
    keywords: ["multiple fields", "dashboard", "management", "cooperatives"]
  },
  {
    id: "ai-chatbot",
    question: "How does the AI chatbot work for farming questions?",
    answer: "The AI chatbot is trained on extensive agricultural knowledge and your specific field data. Ask questions like 'When should I irrigate my rice field?', 'What causes yellowing in wheat leaves?', or 'How much fertilizer does my maize need?' It provides personalized answers based on your field's satellite data, weather conditions, crop variety, and growth stage. Available in Hindi, English, and Bengali.",
    category: "Features",
    keywords: ["chatbot", "AI assistant", "questions", "support"]
  },
  {
    id: "tech-savvy",
    question: "What if I'm not tech-savvy? Can I still use Plant Saathi AI?",
    answer: "Absolutely! Plant Saathi AI is designed for all farmers regardless of tech experience with voice commands (ask questions naturally), visual interface (color-coded maps and simple icons), step-by-step guidance (AI assistant explains everything), local language support (Hindi, Bengali interfaces), and community support (farmer-to-farmer help forum). Most farmers learn to use it within 30 minutes, and our support team is always available.",
    category: "Getting Started",
    keywords: ["easy", "simple", "beginner", "user-friendly"]
  }
];

const categories = ["All", "Technology", "Features", "Pricing", "Security", "Getting Started", "About", "Technical"];

export const FAQ = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <SEOHead 
        title="FAQ - Frequently Asked Questions | Plant Saathi AI"
        description="Get answers to common questions about satellite farming, AI crop disease detection, NDVI monitoring, and precision agriculture. Learn how Plant Saathi AI helps Indian farmers."
        keywords={[
          "farming FAQ",
          "satellite farming questions",
          "NDVI explained",
          "AI agriculture help",
          "precision farming guide",
          "Indian farming technology"
        ]}
        schema={faqSchema}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-white pb-20">
        {/* Header */}
        <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-green-50">
              Everything you need to know about Plant Saathi AI
            </p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 -mt-8">
          {/* Search Bar */}
          <Card className="p-4 shadow-lg mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </Card>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-green-50 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card 
                key={faq.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                  className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {faq.category}
                    </span>
                  </div>
                  {expandedId === faq.id ? (
                    <ChevronUp className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {expandedId === faq.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-gray-500 text-lg">
                No questions found matching "{searchQuery}"
              </p>
              <Button
                onClick={() => setSearchQuery("")}
                className="mt-4"
                variant="outline"
              >
                Clear Search
              </Button>
            </Card>
          )}

          {/* CTA Section */}
          <Card className="mt-12 p-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-green-50 mb-6">
              Our support team is here to help you get started with Plant Saathi AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-green-50"
                onClick={() => navigate('/contact')}
              >
                Contact Support
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial
              </Button>
            </div>
          </Card>

          {/* Quick Links */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/about')}>
              <Users className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">About Us</h3>
              <p className="text-sm text-gray-600">Learn more about our mission</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/auth')}>
              <Smartphone className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Get Started</h3>
              <p className="text-sm text-gray-600">Start your free trial today</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/contact')}>
              <Shield className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-sm text-gray-600">Get help from our team</p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
