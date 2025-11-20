import { useNavigate } from "react-router-dom";
import { BookOpen, Video, Users } from "lucide-react";

export const LearnGrowWidget = () => {
  const navigate = useNavigate();

  const resources = [
    {
      icon: '📹',
      title: 'Farming Videos',
      description: 'Learn new techniques',
      action: () => navigate('/dashboard?tab=videos'),
      color: 'bg-red-50 border-red-200 text-red-900'
    },
    {
      icon: '⭐',
      title: 'Success Stories',
      description: 'Farmer experiences',
      action: () => navigate('/dashboard?tab=stories'),
      color: 'bg-yellow-50 border-yellow-200 text-yellow-900'
    },
    {
      icon: '📸',
      title: 'Community',
      description: 'Share & learn',
      action: () => navigate('/dashboard?tab=gallery'),
      color: 'bg-purple-50 border-purple-200 text-purple-900'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          <div>
            <h2 className="text-lg font-bold">Learn & Grow</h2>
            <p className="text-xs text-purple-50">Knowledge is power</p>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="p-4 grid grid-cols-3 gap-3">
        {resources.map((resource, idx) => (
          <button
            key={idx}
            onClick={resource.action}
            className={`rounded-lg p-3 border-2 ${resource.color} hover:shadow-md transition-all active:scale-95 text-center`}
          >
            <span className="text-2xl block mb-2">{resource.icon}</span>
            <p className="text-xs font-bold mb-1">{resource.title}</p>
            <p className="text-[10px] opacity-75">{resource.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
