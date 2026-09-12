import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  accentColor?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'cyan',
  onClick,
}) => {
  const colorMap = {
    cyan: {
      border: 'border-slate-200 hover:border-blue-300',
      bg: 'bg-white',
      iconBg: 'bg-blue-50 text-blue-700 border border-blue-200',
      valueText: 'text-slate-900',
      glow: 'hover:shadow-md',
    },
    emerald: {
      border: 'border-slate-200 hover:border-emerald-300',
      bg: 'bg-white',
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      valueText: 'text-slate-900',
      glow: 'hover:shadow-md',
    },
    amber: {
      border: 'border-slate-200 hover:border-amber-300',
      bg: 'bg-white',
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-200',
      valueText: 'text-slate-900',
      glow: 'hover:shadow-md',
    },
    rose: {
      border: 'border-slate-200 hover:border-rose-300',
      bg: 'bg-white',
      iconBg: 'bg-rose-50 text-rose-700 border border-rose-200',
      valueText: 'text-slate-900',
      glow: 'hover:shadow-md',
    },
    blue: {
      border: 'border-slate-200 hover:border-blue-300',
      bg: 'bg-white',
      iconBg: 'bg-blue-50 text-blue-700 border border-blue-200',
      valueText: 'text-slate-900',
      glow: 'hover:shadow-md',
    },
    purple: {
      border: 'border-slate-200 hover:border-purple-300',
      bg: 'bg-white',
      iconBg: 'bg-purple-50 text-purple-700 border border-purple-200',
      valueText: 'text-slate-900',
      glow: 'hover:shadow-md',
    },
  };

  const scheme = colorMap[accentColor];

  return (
    <div
      id={id || `kpi-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 shadow-sm ${scheme.border} ${scheme.bg} ${scheme.glow} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className={`text-2xl font-black tracking-tight ${scheme.valueText}`}>{value}</h3>
          </div>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={`rounded-lg p-2.5 ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center space-x-1.5 text-xs">
          {trend.isNeutral ? (
            <Minus className="w-3.5 h-3.5 text-slate-400" />
          ) : trend.isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
          )}
          <span
            className={
              trend.isNeutral
                ? 'text-slate-500'
                : trend.isPositive
                ? 'text-emerald-700 font-bold'
                : 'text-rose-700 font-bold'
            }
          >
            {trend.value}
          </span>
          <span className="text-slate-400">vs yesterday</span>
        </div>
      )}
    </div>
  );
};
