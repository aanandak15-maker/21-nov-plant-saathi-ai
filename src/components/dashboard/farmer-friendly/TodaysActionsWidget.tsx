import { useNavigate } from "react-router-dom";
import { AlertCircle, Clock } from "lucide-react";

interface Action {
  id: string;
  priority: 'urgent' | 'today' | 'week';
  icon: string;
  title: string;
  description: string;
  action: string;
  timeWindow: string;
  field?: string;
}

interface Props {
  actions: Action[];
}

export const TodaysActionsWidget = ({ actions }: Props) => {
  const navigate = useNavigate();

  if (actions.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-bold text-gray-900">All Good!</h3>
              <p className="text-xs text-gray-600">No urgent actions today</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const urgentActions = actions.filter(a => a.priority === 'urgent');
  const todayActions = actions.filter(a => a.priority === 'today');
  const topAction = actions[0]; // Most urgent action

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-orange-200 overflow-hidden">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-sm">Priority Action</h3>
              <p className="text-xs text-orange-100">
                {urgentActions.length} urgent • {todayActions.length} today
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
          >
            View All
          </button>
        </div>
      </div>

      {/* Top Action Only */}
      <div className="p-4">
        <div
          className={`rounded-lg p-3 border-l-4 ${
            topAction.priority === 'urgent'
              ? 'bg-red-50 border-red-500'
              : topAction.priority === 'today'
              ? 'bg-orange-50 border-orange-500'
              : 'bg-blue-50 border-blue-500'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{topAction.icon}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-sm mb-1">
                {topAction.title}
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                {topAction.action}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {topAction.timeWindow}
              </div>
            </div>
          </div>
        </div>

        {/* Show count of remaining actions */}
        {actions.length > 1 && (
          <button
            onClick={() => navigate('/notifications')}
            className="w-full mt-3 py-2 text-sm text-green-700 hover:text-green-800 font-medium hover:bg-green-50 rounded-lg transition-colors"
          >
            + {actions.length - 1} more action{actions.length > 2 ? 's' : ''} →
          </button>
        )}
      </div>
    </div>
  );
};
