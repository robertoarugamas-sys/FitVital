import React from 'react';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  current: number;
  target: number;
  unit: string;
  trend?: number; // Positive means increased since last time
  inverse?: boolean; // If true, lower is better (e.g. fat)
  icon: React.ReactNode;
  colorClass: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  current,
  target,
  unit,
  trend,
  inverse = false,
  icon,
  colorClass
}) => {
  const isGoalMet = inverse ? current <= target : current >= target;
  const progress = Math.min(100, Math.max(0, (current / target) * 100));
  
  // Determine trend color
  let trendIcon = <Minus className="w-4 h-4 text-gray-400" />;
  let trendColor = "text-gray-500";
  
  if (trend !== undefined && trend !== 0) {
    const isGoodTrend = inverse ? trend < 0 : trend > 0;
    trendColor = isGoodTrend ? "text-emerald-600" : "text-rose-500";
    trendIcon = trend > 0 
      ? <ArrowUp className={`w-4 h-4 ${trendColor}`} /> 
      : <ArrowDown className={`w-4 h-4 ${trendColor}`} />;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
      <div className={`absolute top-0 right-0 p-4 opacity-10 ${colorClass}`}>
        {icon}
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
          {React.cloneElement(icon as React.ReactElement, { className: `w-5 h-5 ${colorClass}` })}
        </div>
        <h3 className="text-slate-500 font-medium text-sm">{title}</h3>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-slate-900">{current}</span>
          <span className="text-sm text-slate-400 ml-1">{unit}</span>
        </div>
        <div className="flex items-center gap-1 mb-1 bg-slate-50 px-2 py-1 rounded-full">
          {trendIcon}
          <span className={`text-xs font-semibold ${trendColor}`}>
            {trend && Math.abs(trend).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Progreso</span>
          <span>Meta: {target} {unit}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${isGoalMet ? 'bg-emerald-500' : 'bg-blue-500'}`}
            style={{ width: `${inverse ? Math.min(100, (target / current) * 100) : progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};