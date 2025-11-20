import { useNavigate } from "react-router-dom";
import { 
  Sprout, 
  Camera, 
  ShoppingBag, 
  CloudSun, 
  TrendingUp, 
  Droplets,
  Bot,
  RotateCcw,
  FileText,
  Gift,
  ShoppingCart
} from "lucide-react";

export const ModuleAccessButtons = () => {
  const navigate = useNavigate();

  const modules = [
    {
      icon: Sprout,
      emoji: '🌱',
      title: 'Soil Saathi',
      description: 'Soil & satellite analysis',
      path: '/soilsati',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Camera,
      emoji: '📸',
      title: 'Disease Detection',
      description: 'AI-powered diagnosis',
      path: '/disease',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: CloudSun,
      emoji: '🌦️',
      title: 'Weather Intelligence',
      description: '16-day smart forecast',
      path: '/weather',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Droplets,
      emoji: '💧',
      title: 'Jal Saathi',
      description: 'Smart irrigation guide',
      path: '/jal-saathi',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: ShoppingBag,
      emoji: '🛒',
      title: 'Marketplace',
      description: 'Smart product recommendations',
      path: '/marketplace',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      emoji: '📊',
      title: 'Mandi Prices',
      description: 'Live market rates & trends',
      path: '/mandi-prices',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Bot,
      emoji: '🤖',
      title: 'AI Advisor',
      description: 'Ask farming questions',
      path: '/ai-advisor',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: RotateCcw,
      emoji: '🔄',
      title: 'Crop Rotation',
      description: 'Plan your next crop',
      path: '/crop-rotation',
      color: 'from-teal-500 to-green-500'
    },
    {
      icon: FileText,
      emoji: '📋',
      title: 'Yield Prediction',
      description: 'Estimate your harvest',
      path: '/yield-prediction',
      color: 'from-amber-500 to-yellow-500'
    },
    {
      icon: Gift,
      emoji: '🎁',
      title: 'Schemes',
      description: 'Government benefits',
      path: '/schemes',
      color: 'from-rose-500 to-pink-500'
    },
    {
      icon: ShoppingCart,
      emoji: '🛍️',
      title: 'My Cart',
      description: 'View your orders',
      path: '/cart',
      color: 'from-violet-500 to-purple-500'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900">Quick Access</h2>
        <p className="text-xs text-gray-600">Tap to explore features</p>
      </div>

      {/* Module Buttons */}
      <div className="p-4 space-y-3">
        {modules.map((module, idx) => {
          const Icon = module.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(module.path)}
              className={`w-full bg-gradient-to-r ${module.color} text-white rounded-xl p-4 hover:shadow-lg transition-all active:scale-98 flex items-center gap-4`}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <span>{module.emoji}</span>
                  {module.title}
                </h3>
                <p className="text-xs text-white/90">{module.description}</p>
              </div>
              <span className="text-2xl">→</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
