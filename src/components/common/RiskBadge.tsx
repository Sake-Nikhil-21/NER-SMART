import React from 'react';
import { RiskLevel, AlertSeverity } from '../../types';
import { AlertTriangle, CheckCircle2, AlertOctagon, Info, ShieldCheck, Sparkles } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel | AlertSeverity | 'ai-recommended' | 'safe';
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  text,
  size = 'md',
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  if (level === 'ai-recommended') {
    return (
      <span
        id="badge-ai-recommended"
        className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm font-semibold whitespace-nowrap ${sizeClasses[size]}`}
      >
        {showIcon && <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />}
        {text || '★ AI RECOMMENDED'}
      </span>
    );
  }

  if (level === 'low' || level === 'resolved' || level === 'safe') {
    return (
      <span
        id={`badge-risk-${level}`}
        className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 whitespace-nowrap ${sizeClasses[size]}`}
      >
        {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
        {text || (level === 'resolved' ? 'RESOLVED' : 'LOW RISK')}
      </span>
    );
  }

  if (level === 'moderate') {
    return (
      <span
        id="badge-risk-moderate"
        className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-300 whitespace-nowrap ${sizeClasses[size]}`}
      >
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
        {text || 'MODERATE RISK'}
      </span>
    );
  }

  if (level === 'high') {
    return (
      <span
        id="badge-risk-high"
        className={`inline-flex items-center rounded-full bg-rose-50 text-rose-800 border border-rose-300 whitespace-nowrap ${sizeClasses[size]}`}
      >
        {showIcon && <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />}
        {text || 'HIGH RISK'}
      </span>
    );
  }

  if (level === 'critical' || level === 'blocked') {
    return (
      <span
        id="badge-risk-critical"
        className={`inline-flex items-center rounded-full bg-red-100 text-red-900 border border-red-300 shadow-sm animate-pulse whitespace-nowrap font-bold ${sizeClasses[size]}`}
      >
        {showIcon && <AlertOctagon className="w-3.5 h-3.5 text-red-600" />}
        {text || (level === 'blocked' ? 'ROAD BLOCKED' : 'CRITICAL ALERT')}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-300 whitespace-nowrap ${sizeClasses[size]}`}>
      {showIcon && <Info className="w-3.5 h-3.5 text-slate-500" />}
      {text || 'INFO'}
    </span>
  );
};
