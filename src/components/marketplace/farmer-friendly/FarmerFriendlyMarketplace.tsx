import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, TrendingUp, Search, Star } from "lucide-react";
import { mandiPriceService } from "@/lib/mandiPriceService";

interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  path: string;
}

interface PriceAlert {
  commodity: string;
  price: number;
  change: number;
  trend: 'up' | 'down';
}

export const FarmerFriendlyMarketplace = () => {
  const navigate = useNavigate();
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const categories: Category[] = [
    {
      id: 'seeds',
      name: 'Seeds',
      emoji: '🌱',
      description: 'Quality seeds for all crops',
      path: '/marketplace/seeds'
    },
    {
      id: 'fertilizers',
      name: 'Fertilizers',
      emoji: '🧪',
      description: 'Organic & chemical fertilizers',
      path: '/marketplace/fertilizers'
    },
    {
      id: 'pesticides',
      name: 'Pesticides',
      emoji: '🦟',
      description: 'Protect your crops',
      path: '/marketplace/pesticides'
    },
    {
      id: 'equipment',
      name: 'Equipment',
      emoji: '🚜',
      description: 'Farming tools & machinery',
      path: '/marketplace/equipment'
    },
    {
      id: 'irrigation',
      name: 'Irrigation',
      emoji: '💧',
      description: 'Drip, sprinkler systems',
      path: '/marketplace/irrigation'
    },
    {
      id: 'organic',
      name: 'Organic',
      emoji: '🌿',
      description: 'Natural farming products',
      path: '/marketplace/organic'
    }
  ];

  useEffect(() => {
    loadPriceAlerts();
  }, []);

  const loadPriceAlerts = async () => {
    try {
      setLoading(true);
      const crops = ['rice', 'wheat', 'cotton'];
      const alerts: PriceAlert[] = [];

      for (const crop of crops) {
        try {
          const prices = await mandiPriceService.getCommodityPrices(crop);
          if (prices.length > 0) {
            const avgPrice = prices.reduce((sum, p) => sum + p.modal_price, 0) / prices.length;
            const highestPrice = Math.max(...prices.map(p => p.modal_price));
            const change = Math.round(((highestPrice - avgPrice) / avgPrice) * 100);

            if (Math.abs(change) > 5) {
              alerts.push({
                commodity: crop.charAt(0).toUpperCase() + crop.slice(1),
                price: highestPrice,
                change: change,
                trend: change > 0 ? 'up' : 'down'
              });
            }
          }
        } catch (error) {
          console.error(`Failed to load prices for ${crop}:`, error);
        }
      }

      setPriceAlerts(alerts);
    } catch (error) {
      console.error("Failed to load price alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/30 to-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-1">🛒 Market</h1>
        <p className="text-sm text-purple-50">Shop farming essentials & check prices</p>
      </header>

      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 outline-none text-sm"
            onClick={() => navigate('/marketplace/search')}
            readOnly
          />
        </div>

        {/* Mandi Prices */}
        {!loading && priceAlerts.length > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold">📊 Mandi Prices</h2>
                <p className="text-xs text-green-50">Live market rates</p>
              </div>
              <button
                onClick={() => navigate('/mandi-prices')}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2">
              {priceAlerts.slice(0, 2).map((alert, idx) => (
                <div key={idx} className="bg-white/15 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{alert.commodity}</p>
                      <p className="text-sm text-green-50">₹{alert.price}/quintal</p>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                      alert.trend === 'up' ? 'bg-green-400/30' : 'bg-red-400/30'
                    }`}>
                      <TrendingUp className={`w-4 h-4 ${
                        alert.trend === 'down' ? 'rotate-180' : ''
                      }`} />
                      <span className="text-sm font-bold">{Math.abs(alert.change)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🛍️ Shop by Category</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate(category.path)}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all active:scale-98 text-left"
              >
                <span className="text-3xl mb-2 block">{category.emoji}</span>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{category.name}</h3>
                <p className="text-xs text-gray-600">{category.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Products */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">⭐ Recommended for You</h2>
              <p className="text-xs text-gray-600">Based on your fields</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Sample Product 1 */}
            <div
              onClick={() => navigate('/marketplace/product/npk-fertilizer')}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-2xl">
                🧪
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm">NPK 20-20-0 Fertilizer</h3>
                <p className="text-xs text-gray-600">50kg bag</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-green-600">₹850</span>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>4.5 (120)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Product 2 */}
            <div
              onClick={() => navigate('/marketplace/product/rice-seeds')}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-2xl">
                🌾
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm">Premium Rice Seeds</h3>
                <p className="text-xs text-gray-600">10kg pack</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-green-600">₹1,200</span>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>4.7 (85)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Product 3 */}
            <div
              onClick={() => navigate('/marketplace/product/pesticide')}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
                🦟
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm">Organic Pesticide</h3>
                <p className="text-xs text-gray-600">1 liter bottle</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-green-600">₹450</span>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>4.6 (95)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/marketplace')}
            className="w-full mt-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all active:scale-98"
          >
            Browse All Products
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/cart')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all active:scale-98"
          >
            <ShoppingBag className="w-8 h-8 text-purple-600 mb-2" />
            <p className="font-bold text-gray-900 text-sm">My Cart</p>
            <p className="text-xs text-gray-600">View items</p>
          </button>

          <button
            onClick={() => navigate('/orders')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all active:scale-98"
          >
            <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
            <p className="font-bold text-gray-900 text-sm">My Orders</p>
            <p className="text-xs text-gray-600">Track orders</p>
          </button>
        </div>
      </div>
    </div>
  );
};
