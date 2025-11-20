import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, Moon, Leaf, AlertCircle, BarChart3, Calendar } from 'lucide-react';
import { fieldLifecycleService, HarvestCandidate } from '../../lib/fieldLifecycleService';
import { FieldStatusBadge } from './FieldStatusBadge';

export const FieldLifecycleDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalFields: 0,
    activeFields: 0,
    inactiveFields: 0,
    estimatedSavingsPercent: 0
  });
  const [harvestCandidates, setHarvestCandidates] = useState<HarvestCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, candidates] = await Promise.all([
        fieldLifecycleService.getCostSavingsStats(),
        fieldLifecycleService.detectHarvestCandidates()
      ]);
      setStats(statsData);
      setHarvestCandidates(candidates);
    } catch (error) {
      console.error('Error loading lifecycle data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-600" />
          Field Lifecycle Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Fields */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-700 font-medium">Total Fields</span>
              <Leaf className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-900">{stats.totalFields}</div>
          </div>

          {/* Active Fields */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-700 font-medium">Active</span>
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-900">{stats.activeFields}</div>
            <div className="text-xs text-green-600 mt-1">Monitoring daily</div>
          </div>

          {/* Inactive Fields */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700 font-medium">Inactive</span>
              <Moon className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.inactiveFields}</div>
            <div className="text-xs text-gray-600 mt-1">Harvested/Dormant</div>
          </div>

          {/* Cost Savings */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-emerald-700 font-medium">Cost Savings</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-emerald-900">{stats.estimatedSavingsPercent}%</div>
            <div className="text-xs text-emerald-600 mt-1">API cost reduction</div>
          </div>
        </div>
      </div>

      {/* Harvest Candidates */}
      {harvestCandidates.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-600" />
              Harvest Detection Alerts
            </h3>
            <span className="text-sm text-gray-600">
              {harvestCandidates.length} field{harvestCandidates.length !== 1 ? 's' : ''} ready
            </span>
          </div>

          <div className="space-y-3">
            {harvestCandidates.map((candidate) => (
              <div
                key={candidate.fieldId}
                className="border border-amber-200 rounded-lg p-4 bg-amber-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{candidate.fieldName}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Detected {new Date(candidate.detectedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    candidate.confidence === 'high' 
                      ? 'bg-green-100 text-green-700'
                      : candidate.confidence === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {candidate.confidence} confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-gray-600">NDVI Drop</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {candidate.ndviDropPercent.toFixed(0)}%
                    </div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-gray-600">NDRE Drop</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {candidate.ndreDropPercent.toFixed(0)}%
                    </div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-gray-600">Current NDVI</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {candidate.currentNDVI.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-gray-600">Consecutive Days</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {candidate.consecutiveDays}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-amber-700 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    Vegetation indices have dropped below 60% of peak for {candidate.consecutiveDays} consecutive days
                  </span>
                </div>

                <button
                  onClick={() => {
                    // Handle harvest confirmation
                    if (confirm(`Confirm harvest for ${candidate.fieldName}?`)) {
                      fieldLifecycleService.confirmHarvest(candidate.fieldId, {
                        peakNDVI: candidate.peakNDVI,
                        peakNDRE: candidate.peakNDRE,
                        harvestDetectionDate: candidate.detectedDate
                      }).then(() => {
                        loadData(); // Refresh
                      });
                    }
                  }}
                  className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  Confirm Harvest
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          How Field Lifecycle Works
        </h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 rounded-full p-2 mt-0.5">
              <Leaf className="w-4 h-4 text-green-700" />
            </div>
            <div>
              <div className="font-medium text-blue-900">Active Fields</div>
              <div className="text-blue-700">Daily satellite monitoring, health alerts, and recommendations</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 rounded-full p-2 mt-0.5">
              <Package className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <div className="font-medium text-blue-900">Harvest Detection</div>
              <div className="text-blue-700">AI detects when NDVI/NDRE drop below 60% of peak for 5+ days</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-gray-100 rounded-full p-2 mt-0.5">
              <Moon className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <div className="font-medium text-blue-900">Dormant Period</div>
              <div className="text-blue-700">21-day rest period for soil recovery, monitoring paused to save costs</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-100 rounded-full p-2 mt-0.5">
              <TrendingUp className="w-4 h-4 text-green-700" />
            </div>
            <div>
              <div className="font-medium text-blue-900">Reactivation</div>
              <div className="text-blue-700">One-click reactivation with AI-powered crop recommendations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
