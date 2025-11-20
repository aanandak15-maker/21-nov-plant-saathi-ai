import { useNavigate } from "react-router-dom";
import { TrendingUp, MapPin } from "lucide-react";

interface MarketAlert {
  commodity: string;
  price: number;
  increase: number;
  market: string;
  action: string;
}

interface Props {
  alerts: MarketAlert[];
}

export const MarketOpportunitiesWidget = ({ alerts }: Props) => {
  const navigate = useNavigate();

  if (alerts.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg overflow-hidden text-white">
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Market Opportunities</h2>
              <p className="text-xs text-green-50">Best prices right now</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/mandi-prices')}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            View Prices →
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="p-4 space-y-3">
        {alerts.slice(0, 3).map((alert, idx) => (
          <div
            key={idx}
            onClick={() => navigate('/mandi-prices')}
            className="bg-white/15 backdrop-blur-sm rounded-lg p-4 hover:bg-white/25 transition-all cursor-pointer active:scale-98"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg mb-1">
                  📈 {alert.commodity}
                </h3>
                <p className="text-sm text-green-50">
                  ₹{alert.price}/quintal
                </p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-sm font-bold">↑ {alert.increase}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-green-50 mb-2">
              <MapPin className="w-3 h-3" />
              <span>{alert.market}</span>
            </div>

            <div className="bg-white/20 rounded-lg px-3 py-2">
              <p className="text-sm font-medium">
                💰 {alert.action}
              </p>
            </div>
          </div>
        ))}

        {alerts.length > 3 && (
          <button
            onClick={() => navigate('/mandi-prices')}
            className="w-full py-2 text-sm text-white/90 hover:text-white font-medium"
          >
            View all {alerts.length} opportunities →
          </button>
        )}
      </div>
    </div>
  );
};
