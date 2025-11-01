'use client';

import { useState, useEffect } from 'react';
import { AnalyticsSummary } from './AnalyticsSummary';
import { ExpensesTable } from './ExpensesTable';
import { CostChart } from './CostChart';

interface MonthlySummary {
  year: number;
  month: number;
  totalCost: number;
  videoCount: number;
  averageCost: number;
  totalDuration: number;
  mostUsedModel: string | null;
}

export function MonthlyExpenses() {
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch monthly summary on mount
  useEffect(() => {
    fetchMonthlySummary();
  }, []);

  const fetchMonthlySummary = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const response = await fetch(
        `/api/analytics/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch monthly summary');
      }

      const data = await response.json();
      setMonthlySummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-400">
          <p className="text-lg font-semibold mb-2">Error loading analytics</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monthly Expenses</h1>
          <p className="text-gray-600 mt-1">
            Track your video generation costs and analytics
          </p>
        </div>
        <button
          onClick={fetchMonthlySummary}
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Analytics Summary Cards */}
      {monthlySummary && <AnalyticsSummary summary={monthlySummary} />}

      {/* Layout: 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Table (70% on desktop) */}
        <div className="lg:col-span-2">
          <ExpensesTable />
        </div>

        {/* Right: Charts (30% on desktop) */}
        <div className="lg:col-span-1">
          <CostChart />
        </div>
      </div>
    </div>
  );
}
