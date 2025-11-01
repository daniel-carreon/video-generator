'use client';

import { useState, useEffect } from 'react';
import { BarChart3, PieChart } from 'lucide-react';

interface TimelineEntry {
  date: string;
  dailyCost: number;
  videoCount: number;
}

interface DistributionEntry {
  model: string;
  videoCount: number;
  totalCost: number;
  averageCost: number;
  percentage: number;
}

const MODEL_COLORS: Record<string, string> = {
  'veo3': '#3b82f6',
  'veo3-fast': '#60a5fa',
  'hailuo-standard': '#10b981',
  'hailuo-pro': '#34d399',
  'kling': '#f59e0b',
  'unknown': '#6b7280'
};

export function CostChart() {
  const [timelineData, setTimelineData] = useState<TimelineEntry[]>([]);
  const [distributionData, setDistributionData] = useState<DistributionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'timeline' | 'distribution'>('distribution');

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);

      // Fetch both timeline and distribution
      const [timelineRes, distributionRes] = await Promise.all([
        fetch('/api/analytics/charts?type=timeline&daysBack=30'),
        fetch('/api/analytics/charts?type=distribution&daysBack=30')
      ]);

      if (timelineRes.ok) {
        const timelineResult = await timelineRes.json();
        setTimelineData(timelineResult.data);
      }

      if (distributionRes.ok) {
        const distributionResult = await distributionRes.json();
        setDistributionData(distributionResult.data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-secondary border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Selector */}
      <div className="bg-secondary border border-gray-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveChart('distribution')}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
              activeChart === 'distribution'
                ? 'bg-accent text-white'
                : 'bg-tertiary text-gray-700 hover:text-gray-900'
            }`}
          >
            <PieChart className="w-4 h-4 inline mr-2" />
            Distribution
          </button>
          <button
            onClick={() => setActiveChart('timeline')}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
              activeChart === 'timeline'
                ? 'bg-accent text-white'
                : 'bg-tertiary text-gray-700 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Timeline
          </button>
        </div>

        {activeChart === 'distribution' ? (
          <ModelDistributionChart data={distributionData} />
        ) : (
          <TimelineChart data={timelineData} />
        )}
      </div>

      {/* Top Models Card */}
      <TopModelsCard data={distributionData} />
    </div>
  );
}

function ModelDistributionChart({ data }: { data: DistributionEntry[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No data available
      </div>
    );
  }

  const totalCost = data.reduce((sum, entry) => sum + entry.totalCost, 0);

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">
        Cost by Model (Last 30 Days)
      </h4>

      {data.map((entry) => {
        const percentage = totalCost > 0 ? (entry.totalCost / totalCost) * 100 : 0;

        return (
          <div key={entry.model} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 capitalize">
                {entry.model.replace('-', ' ')}
              </span>
              <span className="text-gray-900 font-semibold">
                ${entry.totalCost.toFixed(2)}
              </span>
            </div>
            <div className="h-2 bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: MODEL_COLORS[entry.model] || MODEL_COLORS.unknown
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{entry.videoCount} videos</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineChart({ data }: { data: TimelineEntry[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No data available
      </div>
    );
  }

  const maxCost = Math.max(...data.map(entry => entry.dailyCost));

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">
        Daily Cost (Last 30 Days)
      </h4>

      <div className="space-y-2">
        {data.slice(0, 10).map((entry) => {
          const percentage = maxCost > 0 ? (entry.dailyCost / maxCost) * 100 : 0;
          const date = new Date(entry.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });

          return (
            <div key={entry.date} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{date}</span>
                <span className="text-gray-900 font-semibold">
                  ${entry.dailyCost.toFixed(2)}
                </span>
              </div>
              <div className="h-1.5 bg-tertiary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopModelsCard({ data }: { data: DistributionEntry[] }) {
  if (data.length === 0) return null;

  const topModel = data[0];

  return (
    <div className="bg-secondary border border-gray-700 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">
        Top Model (30 Days)
      </h4>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-accent capitalize">
            {topModel.model.replace('-', ' ')}
          </p>
          <p className="text-xs text-gray-600">
            {topModel.videoCount} videos • {topModel.percentage.toFixed(1)}% of usage
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Cost</p>
          <p className="text-xl font-bold text-gray-900">
            ${topModel.totalCost.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
