import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Info, TrendingUp, Package, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { smartRecommendationsService } from "@/lib/recommendations/SmartRecommendationsService";

interface SmartRecommendationsWidgetProps {
  fields: any[];
  weather: any;
  diseases: any[];
}

export const SmartRecommendationsWidget = ({ fields, weather, diseases }: SmartRecommendationsWidgetProps) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [fields, weather, diseases]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const recs = await smartRecommendationsService.generateRecommendations({
        fields,
        weather,
        diseases
      });
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (product: any) => {
    smartRecommendationsService.trackRecommendationClick(product.productId, 'buy');
    // Navigate to marketplace with product pre-selected
    navigate(`/marketplace?product=${product.productId}`);
  };

  const handleLearnMore = (product: any) => {
    smartRecommendationsService.trackRecommendationClick(product.productId, 'learn_more');
    // Show product details modal or navigate to product page
    navigate(`/marketplace?product=${product.productId}&view=details`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '💡';
      default: return 'ℹ️';
    }
  };

  if (loading) {
    return (
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">🛒 Smart Recommendations</h3>
        </div>
        <p className="text-sm text-gray-600">Analyzing your fields...</p>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">🛒 Smart Recommendations</h3>
        </div>
        <p className="text-sm text-gray-600">No recommendations at this time. Your fields are looking good! 🌾</p>
      </Card>
    );
  }

  const urgentRecs = recommendations.filter(r => r.priority === 'urgent').slice(0, 2);
  const highRecs = recommendations.filter(r => r.priority === 'high').slice(0, 3);

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">🛒 Smart Recommendations</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {recommendations.length} products
        </Badge>
      </div>

      <p className="text-xs text-gray-600 mb-4">Based on your field conditions</p>

      {/* Urgent Recommendations */}
      {urgentRecs.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <h4 className="text-sm font-semibold text-red-700">URGENT ({urgentRecs.length})</h4>
          </div>
          
          <div className="space-y-3">
            {urgentRecs.map((rec) => (
              <ProductCard
                key={rec.productId}
                product={rec}
                onBuyNow={handleBuyNow}
                onLearnMore={handleLearnMore}
                getPriorityColor={getPriorityColor}
                getPriorityIcon={getPriorityIcon}
              />
            ))}
          </div>
        </div>
      )}

      {/* High Priority Recommendations */}
      {highRecs.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <h4 className="text-sm font-semibold text-orange-700">RECOMMENDED ({highRecs.length})</h4>
          </div>
          
          <div className="space-y-3">
            {highRecs.map((rec) => (
              <ProductCard
                key={rec.productId}
                product={rec}
                onBuyNow={handleBuyNow}
                onLearnMore={handleLearnMore}
                getPriorityColor={getPriorityColor}
                getPriorityIcon={getPriorityIcon}
              />
            ))}
          </div>
        </div>
      )}

      {/* View All Button */}
      {recommendations.length > 5 && (
        <Button
          variant="outline"
          className="w-full mt-2 text-purple-700 border-purple-300 hover:bg-purple-100"
          onClick={() => navigate('/marketplace?view=recommendations')}
        >
          View All {recommendations.length} Recommendations →
        </Button>
      )}
    </Card>
  );
};

// Product Card Component
interface ProductCardProps {
  product: any;
  onBuyNow: (product: any) => void;
  onLearnMore: (product: any) => void;
  getPriorityColor: (priority: string) => string;
  getPriorityIcon: (priority: string) => string;
}

const ProductCard = ({ product, onBuyNow, onLearnMore, getPriorityColor, getPriorityIcon }: ProductCardProps) => {
  return (
    <div className={`p-3 rounded-lg border-2 ${getPriorityColor(product.priority)} bg-white/80`}>
      {/* Product Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getPriorityIcon(product.priority)}</span>
            <h5 className="font-semibold text-sm text-gray-900">{product.name}</h5>
          </div>
          
          {/* Field/Disease Context */}
          {product.fieldName && (
            <p className="text-xs text-gray-600 mb-1">
              For: <span className="font-medium">{product.fieldName}</span>
            </p>
          )}
          
          {/* Reason */}
          <p className="text-xs text-gray-700 mb-2">{product.reason}</p>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-green-700">₹{product.price}</span>
          <span className="text-xs text-gray-600">{product.unit}</span>
        </div>
        
        {product.savings && (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
            {product.savings}
          </Badge>
        )}
      </div>

      {/* Combo Pack Contents */}
      {product.category === 'combo' && product.contains && (
        <div className="mb-2 p-2 bg-purple-50 rounded border border-purple-200">
          <div className="flex items-center gap-1 mb-1">
            <Package className="w-3 h-3 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">Combo Pack Contains:</span>
          </div>
          <ul className="text-xs text-purple-600 space-y-0.5">
            {product.contains.map((item: string, idx: number) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Dosage & Application */}
      {product.dosage && (
        <p className="text-xs text-gray-600 mb-2">
          <span className="font-medium">Dosage:</span> {product.dosage}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => onBuyNow(product)}
        >
          <ShoppingCart className="w-3 h-3 mr-1" />
          Buy Now
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onLearnMore(product)}
        >
          <Info className="w-3 h-3 mr-1" />
          Details
        </Button>
      </div>
    </div>
  );
};
