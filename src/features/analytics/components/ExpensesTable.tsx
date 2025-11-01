'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface CostEntry {
  id: number;
  videoId: string;
  model: string;
  duration: number;
  costPerSecond: number;
  totalCost: number;
  includeAudio: boolean;
  resolution: string;
  aspectRatio: string;
  createdAt: string;
  prompt: string | null;
  videoUrl: string | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const MODEL_EMOJIS: Record<string, string> = {
  'veo3': '🎵',
  'veo3-fast': '⚡',
  'hailuo-standard': '💰',
  'hailuo-pro': '✨',
  'kling': '🎬',
  'unknown': '❓'
};

const MODEL_NAMES: Record<string, string> = {
  'veo3': 'Veo 3',
  'veo3-fast': 'Veo 3 Fast',
  'hailuo-standard': 'Hailuo Std',
  'hailuo-pro': 'Hailuo Pro',
  'kling': 'Kling',
  'unknown': 'Unknown'
};

export function ExpensesTable() {
  const [data, setData] = useState<CostEntry[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [filterModel, setFilterModel] = useState<string>('');
  const [filterDays, setFilterDays] = useState<number>(30);

  useEffect(() => {
    fetchCosts();
  }, [pagination.page, filterModel, filterDays]);

  const fetchCosts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (filterModel) {
        params.append('model', filterModel);
      }

      if (filterDays > 0) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - filterDays);
        params.append('startDate', startDate.toISOString());
        params.append('endDate', endDate.toISOString());
      }

      const response = await fetch(`/api/analytics/costs?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch costs');
      }

      const result = await response.json();
      setData(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching costs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncatePrompt = (prompt: string | null, maxLength: number = 50) => {
    if (!prompt) return 'N/A';
    return prompt.length > maxLength
      ? prompt.substring(0, maxLength) + '...'
      : prompt;
  };

  return (
    <div className="bg-secondary border border-gray-700 rounded-lg overflow-hidden">
      {/* Header with filters */}
      <div className="p-4 border-b border-gray-700 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">Cost History</h3>

        <div className="flex items-center gap-3">
          {/* Model filter */}
          <select
            value={filterModel}
            onChange={(e) => {
              setFilterModel(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-3 py-1.5 bg-tertiary border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">All Models</option>
            <option value="hailuo-standard">Hailuo Standard</option>
            <option value="hailuo-pro">Hailuo Pro</option>
            <option value="veo3">Veo 3</option>
            <option value="veo3-fast">Veo 3 Fast</option>
            <option value="kling">Kling</option>
          </select>

          {/* Date filter */}
          <select
            value={filterDays}
            onChange={(e) => {
              setFilterDays(parseInt(e.target.value));
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-3 py-1.5 bg-tertiary border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="0">All time</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-tertiary text-xs text-gray-400 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Model</th>
              <th className="px-4 py-3 text-center">Duration</th>
              <th className="px-4 py-3 text-center">Resolution</th>
              <th className="px-4 py-3 text-right">Cost</th>
              <th className="px-4 py-3 text-left">Prompt</th>
              <th className="px-4 py-3 text-center">Video</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No cost entries found
                </td>
              </tr>
            ) : (
              data.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-tertiary/50 transition-colors text-sm"
                >
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{MODEL_EMOJIS[entry.model] || MODEL_EMOJIS.unknown}</span>
                      <span className="text-white font-medium">
                        {MODEL_NAMES[entry.model] || entry.model}
                      </span>
                      {entry.includeAudio && (
                        <span className="text-xs text-blue-400">+🔊</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-white">
                    {entry.duration}s
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {entry.resolution}
                    <span className="text-xs text-gray-500 ml-1">
                      {entry.aspectRatio}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-accent">
                    ${entry.totalCost.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 text-gray-400 max-w-xs truncate">
                    <span title={entry.prompt || 'N/A'}>
                      {truncatePrompt(entry.prompt)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {entry.videoUrl ? (
                      <a
                        href={entry.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent hover:text-accent-hover transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="p-4 border-t border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Page {pagination.page} of {pagination.totalPages} • {pagination.total} total entries
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="p-2 bg-tertiary hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 bg-tertiary hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
