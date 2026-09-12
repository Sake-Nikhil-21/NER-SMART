import React, { useState } from 'react';
import { LiveAlert, AlertSeverity, NavigationTab } from '../../types';
import { LIVE_ALERTS_DATA } from '../../data/mockData';
import { RiskBadge } from '../common/RiskBadge';
import { DataSourceTrustIndicator } from '../common/DataSourceTrustIndicator';
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Filter,
  Search,
  Volume2,
  VolumeX,
  Radio,
  ArrowRight,
  ShieldCheck,
  Info,
  CloudRain,
  Mountain,
  Car,
  AlertOctagon,
} from 'lucide-react';

interface LiveAlertsViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const LiveAlertsView: React.FC<LiveAlertsViewProps> = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState<LiveAlert[]>(LIVE_ALERTS_DATA);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false;
    if (selectedState !== 'all' && alert.state !== selectedState) return false;
    if (selectedType !== 'all' && alert.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(q) ||
        alert.location.toLowerCase().includes(q) ||
        alert.description.toLowerCase().includes(q) ||
        alert.affectedRoute.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="live-alerts-view" className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Live Regional Alert System
            </h1>
            <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-800 border border-rose-200 flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse"></span>
              <span>REAL-TIME TELEMETRY</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Categorized multi-hazard alerts across flood, landslide, heavy rainfall, road closure, traffic, accident, and weather warnings.
          </p>
        </div>

        {/* DEMO DATA NOTICE (Requirement #8) */}
        <div className="flex items-center space-x-2">
          <span className="rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-mono font-bold text-amber-900 border border-amber-300 flex items-center space-x-1.5 shadow-2xs">
            <Radio className="w-3.5 h-3.5 text-amber-700" />
            <span>DEMO DATA (SIMULATED TELEMETRY)</span>
          </span>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold border transition ${
              soundEnabled
                ? 'bg-white text-blue-700 border-slate-300 shadow-xs'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-600" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'Live Audio' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alerts, locations or highways..."
              className="w-full rounded-xl bg-slate-50 border border-slate-300 pl-10 pr-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Severity Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600 mr-1">Severity:</span>
            {['all', 'critical', 'high', 'moderate', 'resolved'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold uppercase transition ${
                  selectedSeverity === sev
                    ? sev === 'critical'
                      ? 'bg-rose-600 text-white'
                      : sev === 'high'
                      ? 'bg-orange-600 text-white'
                      : sev === 'moderate'
                      ? 'bg-amber-600 text-white'
                      : sev === 'resolved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* All Required Categories Filter Tabs (Requirement #8) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 text-xs">
          <span className="text-slate-600 font-bold">Category:</span>
          {[
            { id: 'all', label: 'All Hazards' },
            { id: 'landslide', label: 'Landslide' },
            { id: 'flood', label: 'Flood' },
            { id: 'rainfall', label: 'Heavy Rain' },
            { id: 'traffic', label: 'Traffic & Congestion' },
            { id: 'restored', label: 'Road Restored' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedType(cat.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                selectedType === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}

          <div className="ml-auto flex items-center space-x-2">
            <span className="text-slate-600 font-medium">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="rounded-lg bg-slate-50 border border-slate-300 px-2 py-1 text-slate-800 focus:outline-none text-xs font-semibold"
            >
              <option value="all">All 8 States</option>
              <option value="Assam">Assam</option>
              <option value="Manipur">Manipur</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Tripura">Tripura</option>
              <option value="Sikkim">Sikkim</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-base font-bold text-slate-900">No matching alerts found</h4>
            <p className="text-xs mt-1">Try resetting the severity or region filter.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCrit = alert.severity === 'critical';
            const isHigh = alert.severity === 'high';
            const isMod = alert.severity === 'moderate';
            const isRes = alert.severity === 'resolved';

            return (
              <div
                key={alert.id}
                id={`alert-card-${alert.id}`}
                className={`rounded-2xl border p-5 sm:p-6 transition-all duration-200 ${
                  isCrit
                    ? 'border-rose-300 bg-rose-50/60 shadow-xs'
                    : isHigh
                    ? 'border-orange-300 bg-orange-50/60 shadow-xs'
                    : isMod
                    ? 'border-amber-300 bg-amber-50/60 shadow-xs'
                    : 'border-emerald-300 bg-emerald-50/60 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <RiskBadge level={alert.severity} />
                      <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                        {alert.affectedRoute}
                      </span>
                      <span className="text-xs text-slate-500">({alert.state})</span>
                      <span className="text-[10px] font-mono text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                        DEMO TELEMETRY
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {alert.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center space-x-1 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{alert.timeAgo} • {alert.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pt-1">
                      {alert.description}
                    </p>
                  </div>

                  {/* Right Action / Dispatch Note */}
                  <div className="sm:max-w-xs w-full rounded-xl bg-white border border-slate-200 p-3.5 space-y-2 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                      Recommended Action
                    </span>
                    <p className="text-xs font-semibold text-slate-800">
                      {alert.recommendedAction}
                    </p>
                    <button
                      onClick={() => onNavigate('smart-routes')}
                      className="w-full text-center text-xs font-bold text-blue-700 hover:text-blue-800 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition"
                    >
                      Calculate Bypass Route →
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Trust Indicator */}
      <DataSourceTrustIndicator />
    </div>
  );
};
