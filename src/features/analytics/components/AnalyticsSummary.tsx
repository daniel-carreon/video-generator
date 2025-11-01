'use client';

import { DollarSign, Video, TrendingUp, Clock, Zap } from 'lucide-react';

interface MonthlySummary {
  year: number;
  month: number;
  totalCost: number;
  videoCount: number;
  averageCost: number;
  totalDuration: number;
  mostUsedModel: string | null;
}

interface Props {
  summary: MonthlySummary;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MODEL_DISPLAY_NAMES: Record<string, string> = {
  'veo3': 'Veo 3',
  'veo3-fast': 'Veo 3 Fast',
  'hailuo-standard': 'Hailuo Standard',
  'hailuo-pro': 'Hailuo Pro',
  'kling': 'Kling',
};

function formatModelName(model: string | null): string {
  if (!model) return 'N/A';
  return MODEL_DISPLAY_NAMES[model] || model.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

export function AnalyticsSummary({ summary }: Props) {
  const monthName = MONTH_NAMES[summary.month - 1];

  return (
    <div className="space-y-4">
      {/* Current Month Header */}
      <div className="bg-secondary border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {monthName} {summary.year}
            </h2>
            <p className="text-gray-600 mt-1">
              {summary.videoCount} videos generated
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-4xl font-bold text-accent">
              ${summary.totalCost.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Cost per Video */}
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Average per Video"
          value={`$${summary.averageCost.toFixed(4)}`}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
        />

        {/* Total Videos */}
        <MetricCard
          icon={<Video className="w-5 h-5" />}
          label="Videos Generated"
          value={summary.videoCount.toString()}
          color="text-purple-400"
          bgColor="bg-purple-500/10"
        />

        {/* Total Duration */}
        <MetricCard
          icon={<Clock className="w-5 h-5" />}
          label="Total Duration"
          value={`${summary.totalDuration}s`}
          secondaryValue={`${Math.floor(summary.totalDuration / 60)}m ${summary.totalDuration % 60}s`}
          color="text-green-400"
          bgColor="bg-green-500/10"
        />

        {/* Most Used Model */}
        <MetricCard
          icon={<Zap className="w-5 h-5" />}
          label="Most Used Model"
          value={formatModelName(summary.mostUsedModel)}
          valueClass="text-sm"
          color="text-yellow-400"
          bgColor="bg-yellow-500/10"
        />
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondaryValue?: string;
  valueClass?: string;
  color: string;
  bgColor: string;
}

function MetricCard({
  icon,
  label,
  value,
  secondaryValue,
  valueClass = 'text-2xl',
  color,
  bgColor
}: MetricCardProps) {
  return (
    <div className="bg-secondary border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`${bgColor} ${color} p-2 rounded-lg`}>
          {icon}
        </div>
        <p className="text-sm text-gray-700">{label}</p>
      </div>
      <p className={`${valueClass} font-bold text-gray-900`}>{value}</p>
      {secondaryValue && (
        <p className="text-xs text-gray-500 mt-1">{secondaryValue}</p>
      )}
    </div>
  );
}
