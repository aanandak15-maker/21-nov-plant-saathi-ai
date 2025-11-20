import React from 'react';
import { Leaf, Package, Moon, Clock } from 'lucide-react';
import { FieldStatus } from '../../lib/fieldLifecycleService';

interface FieldStatusBadgeProps {
  status: FieldStatus;
  harvestDate?: string;
  dormantUntil?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const FieldStatusBadge: React.FC<FieldStatusBadgeProps> = ({
  status,
  harvestDate,
  dormantUntil,
  size = 'md',
  showLabel = true
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          icon: Leaf,
          color: 'green',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          borderColor: 'border-green-300',
          label: 'Active Crop',
          emoji: '🌱'
        };
      case 'harvested':
        return {
          icon: Package,
          color: 'amber',
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-700',
          borderColor: 'border-amber-300',
          label: 'Recently Harvested',
          emoji: '🌾'
        };
      case 'dormant':
        return {
          icon: Moon,
          color: 'gray',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300',
          label: 'Resting',
          emoji: '🛌'
        };
      default:
        return {
          icon: Leaf,
          color: 'gray',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300',
          label: 'Unknown',
          emoji: '❓'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // Calculate days since harvest or until dormant end
  const getDaysInfo = () => {
    if (status === 'harvested' && harvestDate) {
      const days = Math.floor((Date.now() - new Date(harvestDate).getTime()) / (24 * 60 * 60 * 1000));
      return `${days}d ago`;
    }
    if (status === 'dormant' && dormantUntil) {
      const days = Math.ceil((new Date(dormantUntil).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      if (days > 0) {
        return `${days}d left`;
      }
      return 'Ready';
    }
    return null;
  };

  const daysInfo = getDaysInfo();

  return (
    <div className={`inline-flex items-center gap-2 ${config.bgColor} ${config.borderColor} border rounded-full ${sizeClasses[size]} ${config.textColor} font-medium`}>
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{config.label}</span>}
      {daysInfo && (
        <span className="flex items-center gap-1 opacity-75">
          <Clock className={iconSizes[size]} />
          {daysInfo}
        </span>
      )}
    </div>
  );
};

export const FieldStatusIndicator: React.FC<{
  status: FieldStatus;
  size?: number;
}> = ({ status, size = 12 }) => {
  const colors = {
    active: 'bg-green-500',
    harvested: 'bg-amber-500',
    dormant: 'bg-gray-400'
  };

  return (
    <div 
      className={`rounded-full ${colors[status]} animate-pulse`}
      style={{ width: size, height: size }}
    />
  );
};
