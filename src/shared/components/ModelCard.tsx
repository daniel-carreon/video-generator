'use client';

interface ModelCardProps {
  name: string;
  description: string;
  costPerSecond: number;
  maxDuration: number;
  resolutions: string[];
  badge?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ModelCard({
  name,
  description,
  costPerSecond,
  maxDuration,
  resolutions,
  badge,
  isSelected = false,
  onClick,
}: ModelCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left p-5 rounded-xl border-2 transition-all duration-200 group ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-slate-300 bg-white hover:border-blue-400 hover:shadow-md'
      }`}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-400 text-white">
            {badge}
          </span>
        </div>
      )}

      {/* Title & Description */}
      <div className="mb-4 pr-16">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
      </div>

      {/* Pricing & Duration Row */}
      <div className="flex gap-4 mb-4 text-sm font-semibold">
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">💰</span>
          <span className="text-slate-900">${costPerSecond.toFixed(2)}/seg</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-orange-500">⏱️</span>
          <span className="text-slate-900">Hasta {maxDuration}s</span>
        </div>
      </div>

      {/* Resolutions */}
      <div className="flex gap-2 flex-wrap">
        {resolutions.map((res) => (
          <span
            key={res}
            className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded"
          >
            {res}
          </span>
        ))}
      </div>

      {/* Selection Checkmark */}
      {isSelected && (
        <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white font-bold">✓</span>
        </div>
      )}
    </button>
  );
}
