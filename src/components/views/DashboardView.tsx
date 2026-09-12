import React, { useState } from 'react';
import { NavigationTab, RouteOption } from '../../types';
import { KpiCard } from '../common/KpiCard';
import { NerLeafletMap } from '../map/NerLeafletMap';
import { RiskBadge } from '../common/RiskBadge';
import { DataSourceTrustIndicator } from '../common/DataSourceTrustIndicator';
import {
  Route,
  ShieldAlert,
  BellRing,
  Truck,
  Activity,
  Sparkles,
  CloudRain,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
  Radio,
  Layers,
  Filter,
  PhoneCall,
  Shield,
  LifeBuoy,
  Navigation,
} from 'lucide-react';
import { NER_STATES, LIVE_ALERTS_DATA, REGIONAL_HUBS } from '../../data/mockData';

interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
  isEmergencyMode: boolean;
  onToggleEmergencyMode: () => void;
  onSelectRouteForAnalysis: (route: RouteOption) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  isEmergencyMode,
  onToggleEmergencyMode,
  onSelectRouteForAnalysis,
}) => {
  const [selectedStateCode, setSelectedStateCode] = useState<string>('ALL');
  const [mapLayers, setMapLayers] = useState({
    routes: true,
    hubs: true,
    alerts: true,
    weather: true,
    emergency: isEmergencyMode,
  });

  // State-filtered metrics calculation
  const currentStateData =
    selectedStateCode === 'ALL'
      ? null
      : NER_STATES.find((s) => s.code === selectedStateCode) || NER_STATES[0];

  const totalAccessibleRoutes = currentStateData ? Math.round(currentStateData.roadNetworkKm * 0.82) : 1284;
  const highRiskCount = currentStateData ? Math.round(currentStateData.activeAlerts * 1.5) : 87;
  const activeAlertsCount = currentStateData ? currentStateData.activeAlerts : 24;
  const activeShipmentsCount = currentStateData ? Math.round(346 * (currentStateData.roadNetworkKm / 35000)) : 346;
  const accessibilityIndex = currentStateData ? `${currentStateData.accessibilityPct}%` : '82%';

  return (
    <div id="dashboard-view" className="space-y-6 pb-12">
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-brand flex items-center space-x-1.5">
              <span className="tracking-wider">ROAD</span>
              <span className="text-blue-600 font-tech font-black px-0.5">_</span>
              <span className="tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">NAVI</span>
              <span className="text-slate-800 font-bold ml-1">Regional Intelligence</span>
            </h1>
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-800 border border-blue-200">
              LIVE GIS • 8 NER STATES
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time multi-modal logistics, disaster resilience, and corridor intelligence for North Eastern Region
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-dash-plan-smart-route"
            onClick={() => onNavigate('smart-routes')}
            className="flex items-center space-x-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95"
          >
            <Route className="w-3.5 h-3.5" />
            <span>Plan Route with AI</span>
          </button>

          <button
            id="btn-dash-emergency-toggle"
            onClick={onToggleEmergencyMode}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2.5 text-xs font-bold border transition active:scale-95 ${
              isEmergencyMode
                ? 'bg-rose-600 text-white border-rose-700 shadow-md animate-pulse'
                : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-50 shadow-xs'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isEmergencyMode ? 'Exit Emergency Mode' : 'Activate Emergency Mode'}</span>
          </button>
        </div>
      </div>

      {/* EMERGENCY MODE ACTIVE BANNER (Requirement #6) */}
      {isEmergencyMode && (
        <div className="rounded-2xl border-2 border-rose-500 bg-rose-50 p-5 text-rose-950 shadow-md space-y-3.5 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-xs">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[11px] font-black text-white font-mono tracking-wider">
                    EMERGENCY MODE ACTIVE
                  </span>
                  <span className="rounded-md bg-rose-200/80 px-2 py-0.5 text-[11px] font-bold text-rose-900 border border-rose-300">
                    ⚠ High Landslide Risk
                  </span>
                  <span className="rounded-md bg-blue-200/80 px-2 py-0.5 text-[11px] font-bold text-blue-900 border border-blue-300">
                    ⚠ Heavy Rainfall Alert
                  </span>
                  <span className="rounded-md bg-emerald-200/80 px-2 py-0.5 text-[11px] font-bold text-emerald-900 border border-emerald-300">
                    ✓ Emergency Route Available
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-rose-950 mt-1">
                  Disaster & Emergency Protocol: Recommended Route B (NH-37 Jiribam Corridor)
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate('smart-routes')}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition"
              >
                Inspect Safe Evacuation Route →
              </button>
            </div>
          </div>

          {/* Emergency Helplines & Disaster Facilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-rose-200/80 text-xs">
            <div className="bg-white/80 rounded-xl p-2.5 border border-rose-200 flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">NDRF NER HQ</span>
                <strong className="text-slate-900 font-mono">0361-2899014 / 1078</strong>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-2.5 border border-rose-200 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">Disaster Authority (SDMA)</span>
                <strong className="text-slate-900 font-mono">1070 / 1077</strong>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-2.5 border border-rose-200 flex items-center space-x-2">
              <LifeBuoy className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">Highway Police / Patrol</span>
                <strong className="text-slate-900 font-mono">112 (Toll Free)</strong>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-2.5 border border-rose-200 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">Medical Emergency Ambulance</span>
                <strong className="text-slate-900 font-mono">108 (24/7 Dispatch)</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regional State Selector Tabs (Requirement #10) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            State Intelligence Filter:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedStateCode('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedStateCode === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All 8 NER States
          </button>

          {NER_STATES.map((st) => (
            <button
              key={st.code}
              onClick={() => setSelectedStateCode(st.code)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedStateCode === st.code
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Key Performance Indicators (Dynamically Updated by Regional Selector) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <KpiCard
          id="kpi-accessible-routes"
          title="Accessible Routes"
          value={totalAccessibleRoutes.toLocaleString()}
          subtitle={currentStateData ? `Active road links in ${currentStateData.name}` : 'Monitored road links'}
          icon={Route}
          accentColor="emerald"
          trend={{ value: '+12', isPositive: true }}
          onClick={() => onNavigate('accessibility')}
        />

        <KpiCard
          id="kpi-high-risk-routes"
          title="High Risk Corridors"
          value={highRiskCount.toString()}
          subtitle="Rainfall/Landslide prone"
          icon={ShieldAlert}
          accentColor="rose"
          trend={{ value: '+4', isPositive: false }}
          onClick={() => onNavigate('risk-intelligence')}
        />

        <KpiCard
          id="kpi-active-alerts"
          title="Active Alerts"
          value={activeAlertsCount.toString()}
          subtitle="Critical & moderate"
          icon={BellRing}
          accentColor="amber"
          trend={{ value: '-3', isPositive: true }}
          onClick={() => onNavigate('live-alerts')}
        />

        <KpiCard
          id="kpi-active-shipments"
          title="Logistics Activity"
          value={activeShipmentsCount.toString()}
          subtitle="Active freight units"
          icon={Truck}
          accentColor="blue"
          trend={{ value: '+28', isPositive: true }}
          onClick={() => onNavigate('logistics-planner')}
        />

        <KpiCard
          id="kpi-regional-accessibility"
          title="Accessibility Score"
          value={accessibilityIndex}
          subtitle={currentStateData ? `${currentStateData.name} openness` : 'NER state average'}
          icon={Activity}
          accentColor="cyan"
          trend={{ value: '+1.4%', isPositive: true }}
          onClick={() => onNavigate('accessibility')}
        />

        <KpiCard
          id="kpi-ai-confidence"
          title="AI Confidence"
          value="95.2%"
          subtitle="Route model accuracy"
          icon={Sparkles}
          accentColor="purple"
          trend={{ value: '+0.8%', isPositive: true }}
          onClick={() => onNavigate('smart-routes')}
        />
      </div>

      {/* Large NER Interactive Map Container (Leaflet + OSM) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span>Interactive North East Logistics GIS Command Center</span>
            </h3>
            <span className="text-xs text-slate-500">
              (Leaflet + OpenStreetMap • 100% Free Tile Source)
            </span>
          </div>

          {/* Map Layer Toggles */}
          <div className="flex items-center space-x-1.5 bg-white rounded-xl p-1 border border-slate-200 text-[11px] shadow-sm">
            <button
              onClick={() => setMapLayers((p) => ({ ...p, routes: !p.routes }))}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                mapLayers.routes ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Corridors
            </button>
            <button
              onClick={() => setMapLayers((p) => ({ ...p, hubs: !p.hubs }))}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                mapLayers.hubs ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Logistics Hubs
            </button>
            <button
              onClick={() => setMapLayers((p) => ({ ...p, alerts: !p.alerts }))}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                mapLayers.alerts ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hazard Alerts
            </button>
            <button
              onClick={() => setMapLayers((p) => ({ ...p, weather: !p.weather }))}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                mapLayers.weather ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weather Radar
            </button>
          </div>
        </div>

        {/* The Leaflet Map Component */}
        <NerLeafletMap
          activeLayers={mapLayers}
          isEmergencyMode={isEmergencyMode}
          heightClass="h-[480px] sm:h-[560px]"
          onSelectRoute={(route) => {
            onSelectRouteForAnalysis(route);
            onNavigate('route-analysis');
          }}
        />
      </div>

      {/* Dashboard Intelligence Panel (4 Core Intelligence Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Weather */}
        <div className="rounded-2xl border border-blue-200 bg-white p-5 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Weather Intelligence</span>
            <CloudRain className="w-4 h-4 text-blue-600" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            {currentStateData ? `${currentStateData.name} Micro-Climate Forecast` : 'Heavy Rainfall Expected in High Altitudes'}
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentStateData
              ? `Current flood vulnerability index at ${currentStateData.floodRiskPct}% with landslide risk calculated at ${currentStateData.landslideRiskPct}%.`
              : 'Kohima-Senapati ridge (NH-2) experiencing persistent precipitation (78mm/24h). Southern Jiribam valley (NH-37) remains under low rain index (14mm).'}
          </p>
          <div className="pt-1 flex items-center justify-between text-[11px] text-blue-800 font-medium">
            <span>Guwahati: 26°C • Partly Cloudy</span>
            <span>Imphal: 22°C • Light Showers</span>
          </div>
        </div>

        {/* Card 2: Accessibility */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-5 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Accessibility Index</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            {accessibilityIndex} of Monitored Roads Open
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentStateData
              ? `${currentStateData.roadNetworkKm.toLocaleString()} km of highway network currently audited for inclusive barrier-free transit.`
              : 'Assam (91%) and Tripura (88%) lead regional accessibility. Arunachal Pradesh (64%) and Manipur (69%) face temporary hill slope restrictions.'}
          </p>
          <button
            onClick={() => onNavigate('accessibility')}
            className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center space-x-1"
          >
            <span>Explore State Breakdown</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 3: Risk */}
        <div className="rounded-2xl border border-rose-200 bg-white p-5 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Hazard Detection</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            {activeAlertsCount} Active Hazard Advisories
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Active mud slip locations near Paglapahar & Senapati ghats. Pre-emptive traffic holding deployed at Dimapur parking yard.
          </p>
          <button
            onClick={() => onNavigate('risk-intelligence')}
            className="text-[11px] font-semibold text-rose-700 hover:underline flex items-center space-x-1"
          >
            <span>View Risk Vulnerability Matrices</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 4: AI Recommendation */}
        <div className="rounded-2xl border border-purple-200 bg-white p-5 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">AI Recommendation</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            Optimal Corridor: Route B (NH-37)
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Multi-factor composite scoring engine recommends <strong>Route B (NH-37 Jiribam-Silchar)</strong> with 94.6 score vs 48.2 on Route A due to active landslide hazards.
          </p>
          <button
            onClick={() => onNavigate('smart-routes')}
            className="text-[11px] font-semibold text-purple-700 hover:underline flex items-center space-x-1"
          >
            <span>Launch AI Route Comparison</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Transparency & Data Source Indicator */}
      <DataSourceTrustIndicator />
    </div>
  );
};
