import React, { useState, useEffect } from 'react';
import { RouteOption, RouteQuery, NavigationTab } from '../../types';
import { MOCK_ROUTES_GUWAHATI_TO_IMPHAL, DEFAULT_DEMO_QUERY } from '../../data/mockData';
import { RiskBadge } from '../common/RiskBadge';
import { NerLeafletMap } from '../map/NerLeafletMap';
import { ElevationProfileVisualizer } from './ElevationProfileVisualizer';
import { WhatIfSimulationPanel } from './WhatIfSimulationPanel';
import { DataSourceTrustIndicator } from '../common/DataSourceTrustIndicator';
import {
  calculateRouteScores,
  scoreAllRoutes,
  SimulationConditions,
  DEFAULT_SIMULATION_CONDITIONS,
  DEFAULT_SCORING_WEIGHTS,
  RouteDetailedScores,
  ScoringWeights,
} from '../../utils/scoringEngine';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Route,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  Truck,
  Weight,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  ChevronRight,
  ChevronDown,
  Info,
  Layers,
  CloudRain,
  Mountain,
  Gauge,
  ThumbsUp,
  Maximize2,
  Navigation2,
  FileText,
  Sliders,
  AlertOctagon,
  ShieldAlert,
} from 'lucide-react';

interface AiRouteAnalysisViewProps {
  query?: RouteQuery;
  onNavigate: (tab: NavigationTab) => void;
  onSelectRouteForLogistics: (route: RouteOption) => void;
}

export const AiRouteAnalysisView: React.FC<AiRouteAnalysisViewProps> = ({
  query,
  onNavigate,
  onSelectRouteForLogistics,
}) => {
  const safeQuery = query || DEFAULT_DEMO_QUERY;
  const routes = MOCK_ROUTES_GUWAHATI_TO_IMPHAL;
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-b-recommended');
  const [showDeepWhyModal, setShowDeepWhyModal] = useState<boolean>(false);
  const [confirmedSelection, setConfirmedSelection] = useState<RouteOption | null>(null);

  // Dynamic Multi-Factor Scores State
  const [simulationConditions, setSimulationConditions] = useState<SimulationConditions>(DEFAULT_SIMULATION_CONDITIONS);
  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>(DEFAULT_SCORING_WEIGHTS);
  const [calculatedScores, setCalculatedScores] = useState<RouteDetailedScores[]>(() =>
    scoreAllRoutes(
      routes,
      DEFAULT_SIMULATION_CONDITIONS,
      DEFAULT_SCORING_WEIGHTS,
      'general',
      safeQuery.cargoWeightTons || 10,
      safeQuery.vehicleType || 'Heavy Truck'
    )
  );

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[1];
  const activeRouteScore = calculatedScores.find((s) => s.routeId === activeRoute.id) || calculatedScores[1];

  const handleSelectRoute = (route: RouteOption) => {
    setSelectedRouteId(route.id);
    setConfirmedSelection(route);

    if (route.code === 'ROUTE_B') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#10b981', '#06b6d4', '#3b82f6'],
        });
      } catch (e) {
        // ignore if not available
      }
    }
  };

  const handleSimulationUpdate = (updatedScores: RouteDetailedScores[], newConds: SimulationConditions) => {
    setCalculatedScores(updatedScores);
    setSimulationConditions(newConds);

    // Auto-select the top recommended route when simulation conditions change
    const topScored = updatedScores.find((s) => s.isRecommended);
    if (topScored) {
      setSelectedRouteId(topScored.routeId);
    }
  };

  return (
    <div id="ai-route-analysis-view" className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Route Analysis & Multi-Factor Scoring
            </h1>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 border border-emerald-200">
              PARETO SAFETY OPTIMIZER
            </span>
          </div>

          {/* Core Query Details Bar */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
            <div className="flex items-center space-x-1.5 font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{safeQuery.from || 'Guwahati, Assam'} ➔ {safeQuery.to || 'Imphal, Manipur'}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
              <Truck className="w-3.5 h-3.5 text-slate-500" />
              <span>{safeQuery.vehicleType || 'Heavy Truck'}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
              <Weight className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-mono font-bold text-slate-900">{safeQuery.cargoWeightTons || 10} Tons</span>
            </div>
            <div className="flex items-center space-x-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Weights: 30% Safety • 15% Time • 15% Weather</span>
            </div>
          </div>
        </div>

        <button
          id="btn-back-to-smart-routes"
          onClick={() => onNavigate('smart-routes')}
          className="self-start sm:self-center flex items-center space-x-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs hover:bg-slate-50 transition"
        >
          <span>Modify Query</span>
        </button>
      </div>

      {/* Real Smart Route Scoring - The 3 Route Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {routes.map((route) => {
          const score = calculatedScores.find((s) => s.routeId === route.id) || calculateRouteScores(route);
          const isRecommended = score.isRecommended;
          const isSelected = selectedRouteId === route.id;

          return (
            <div
              key={route.id}
              id={`route-card-${route.code.toLowerCase()}`}
              className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 ${
                isRecommended
                  ? 'border-2 border-emerald-500 bg-white shadow-md ring-1 ring-emerald-300'
                  : route.code === 'ROUTE_A'
                  ? 'border-rose-300 bg-white shadow-sm'
                  : 'border-slate-200 bg-white shadow-sm'
              } ${isSelected ? 'ring-2 ring-blue-500 scale-[1.01]' : ''}`}
            >
              {/* Top Badges */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {route.title}
                  </span>
                  {isRecommended ? (
                    <RiskBadge level="ai-recommended" text="★ AI RECOMMENDED" size="sm" />
                  ) : (
                    <RiskBadge level={route.riskLevel} text={route.statusText} size="sm" />
                  )}
                </div>

                <p className="text-[11px] text-slate-500 leading-snug">{route.subtitle}</p>

                {/* Overall Score + Distance/Time */}
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
                  <div>
                    <span className="block text-[10px] text-slate-500">DISTANCE</span>
                    <span className="font-mono text-base font-black text-slate-900">
                      {route.distanceKm} <span className="text-xs font-normal text-slate-500">km</span>
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500">EST. TIME</span>
                    <span className="font-mono text-base font-black text-blue-700">
                      {route.eta}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500">OVERALL SCORE</span>
                    <span
                      className={`font-mono text-base font-black ${
                        score.overallScore > 75
                          ? 'text-emerald-700'
                          : score.overallScore > 50
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {score.overallScore}
                      <span className="text-xs font-normal text-slate-400">/100</span>
                    </span>
                  </div>
                </div>

                {/* Real Multi-Factor Scoring Metrics Matrix */}
                <div className="rounded-xl bg-slate-50/70 p-3 border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-600 font-medium">Safety Score:</span>
                    <span className="font-mono font-bold text-slate-900">{score.safetyScore}/100</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-600 font-medium">Weather Risk:</span>
                    <span className={`font-semibold ${score.weatherLevel === 'High' || score.weatherLevel === 'Extreme' ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {score.weatherLevel} ({score.weatherRiskScore})
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-600 font-medium">Landslide Probability:</span>
                    <span className={`font-semibold ${score.landslideLevel === 'High' ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {score.landslideLevel} ({score.landslideRiskScore})
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-600 font-medium">Road Condition:</span>
                    <span className="font-medium text-slate-800">{score.roadConditionText} ({score.roadConditionScore}/100)</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-600 font-medium">Accessibility:</span>
                    <span className="font-medium text-slate-800">{score.accessibilityText} ({score.accessibilityScore}/100)</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-600 font-medium">Logistics Suitability:</span>
                    <span className="font-medium text-slate-800">{score.logisticsSuitabilityScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="pt-4 mt-3 border-t border-slate-200">
                {isRecommended ? (
                  <button
                    id="btn-select-route-b"
                    onClick={() => handleSelectRoute(route)}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Select {route.code.replace('_', ' ')} (AI Recommended)</span>
                  </button>
                ) : (
                  <button
                    id={`btn-select-route-${route.code.toLowerCase()}`}
                    onClick={() => handleSelectRoute(route)}
                    className="w-full flex items-center justify-center space-x-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 text-xs font-semibold border border-slate-300 transition"
                  >
                    <span>View & Select {route.code.replace('_', ' ')}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI ROUTE EXPLANATION SECTION (5 Core Points) */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI ROUTE EXPLANATION & DECISION AUDIT</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              Explainable AI Analysis for {activeRoute.title}
            </h2>
          </div>

          <button
            id="btn-why-this-recommendation-modal"
            onClick={() => setShowDeepWhyModal(true)}
            className="flex items-center space-x-2 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Audit Calculation Weights</span>
          </button>
        </div>

        {/* 5-Point Structured Explanation Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Why this route? */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2 lg:col-span-2">
            <div className="flex items-center space-x-2 text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider">1. Why this route is recommended</h4>
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-relaxed">
              {activeRouteScore.whyExplanation}
            </p>
          </div>

          {/* 2. Recommended Action */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-blue-900">
              <Navigation2 className="w-4 h-4 text-blue-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider">2. Recommended Action</h4>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {activeRouteScore.recommendedAction}
            </p>
          </div>

          {/* 3. Advantages */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">3. Route Advantages</h4>
            </div>
            <ul className="space-y-1 text-xs text-slate-700">
              {activeRouteScore.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Main Risks */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-slate-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">4. Main Route Risks</h4>
            </div>
            <ul className="space-y-1 text-xs text-slate-700">
              {activeRouteScore.mainRisks.map((r, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-amber-600 font-bold">⚠</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Possible Delays */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-slate-900">
              <Clock className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">5. Possible Transit Delays</h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {activeRouteScore.possibleDelays}
            </p>
          </div>
        </div>
      </section>

      {/* WHAT-IF RISK SIMULATION PANEL EMBEDDED */}
      <WhatIfSimulationPanel
        routes={routes}
        onSimulationChange={handleSimulationUpdate}
        cargoWeightTons={safeQuery.cargoWeightTons}
        vehicleType={safeQuery.vehicleType}
      />

      {/* Selected Route Visual GIS Map Verification (Leaflet + OpenStreetMap) */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <span>Corridor GIS Map Verification</span>
          <span className="text-xs text-slate-500 font-normal">
            (Displaying active route: {activeRoute.title})
          </span>
        </h3>
        <NerLeafletMap
          selectedRoute={activeRoute}
          heightClass="h-[400px]"
        />
      </div>

      {/* Elevation Profile Visualizer */}
      <ElevationProfileVisualizer route={activeRoute} />

      {/* Data Source & Trust Indicator */}
      <DataSourceTrustIndicator />

      {/* Route Selection Confirmation & Next Steps */}
      {confirmedSelection && (
        <div
          id="panel-route-selected-confirmation"
          className="rounded-3xl border-2 border-emerald-400 bg-emerald-50/80 p-6 sm:p-8 shadow-md"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <span className="flex h-3 w-3 rounded-full bg-emerald-600 animate-ping"></span>
                <h3 className="text-xl font-extrabold text-slate-900">Route Selected & Verified</h3>
                <RiskBadge level={confirmedSelection.riskLevel} text={confirmedSelection.statusText} />
              </div>
              <p className="text-sm font-semibold text-emerald-900">
                {confirmedSelection.title} ({safeQuery.from || 'Guwahati, Assam'} ➔ {safeQuery.to || 'Imphal, Manipur'})
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">DISTANCE</span>
                  <span className="font-mono font-bold text-slate-900">{confirmedSelection.distanceKm} km</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">ESTIMATED TIME</span>
                  <span className="font-mono font-bold text-blue-700">{confirmedSelection.eta}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">SCORE</span>
                  <span className="font-mono font-bold text-emerald-700">{activeRouteScore.overallScore}/100</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">VEHICLE</span>
                  <span className="font-medium text-slate-800">{safeQuery.vehicleType || 'Heavy Truck'}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">CARGO</span>
                  <span className="font-mono font-bold text-amber-800">{safeQuery.cargoWeightTons || 10} Tons</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button
                id="btn-launch-live-gps-cockpit"
                onClick={() => onNavigate('live-navigation')}
                className="flex items-center justify-center space-x-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-5 py-4 text-sm font-bold text-white shadow-sm transition"
              >
                <Navigation2 className="w-4 h-4 fill-white" />
                <span>Start Live GPS Cockpit</span>
              </button>

              <button
                id="btn-continue-to-logistics-planner"
                onClick={() => {
                  onSelectRouteForLogistics(confirmedSelection);
                  onNavigate('logistics-planner');
                }}
                className="flex items-center justify-center space-x-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 px-5 py-4 text-sm font-semibold text-slate-800 shadow-xs transition"
              >
                <span>Logistics Multi-Stop</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Modal */}
      {showDeepWhyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-300 bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  SIH AI Route Scoring & Weight Formulas
                </h3>
              </div>
              <button
                onClick={() => setShowDeepWhyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm px-1.5 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
                <span className="font-bold text-blue-800">Scoring Weight Distribution:</span>
                <p>• Safety Score: <strong>30%</strong> (Retaining walls, gradient stability, accident history)</p>
                <p>• Travel Time: <strong>15%</strong> (Congestion, hold queues, checkposts)</p>
                <p>• Distance: <strong>10%</strong> (Kilometer efficiency)</p>
                <p>• Weather Risk: <strong>15%</strong> (Doppler rainfall isobars, cloudburst)</p>
                <p>• Hazard Probability: <strong>10%</strong> (Landslide & flood sensors)</p>
                <p>• Road Condition: <strong>10%</strong> (Surface quality, potholes, shoulder width)</p>
                <p>• Accessibility & Logistics: <strong>10%</strong> (Axle limits, bridge load ratings)</p>
              </div>
            </div>

            <button
              onClick={() => setShowDeepWhyModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
            >
              Close Weight Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
