import React, { useState } from 'react';
import { RouteOption } from '../../types';
import {
  SimulationConditions,
  ScoringWeights,
  DEFAULT_SIMULATION_CONDITIONS,
  DEFAULT_SCORING_WEIGHTS,
  RouteDetailedScores,
  scoreAllRoutes,
} from '../../utils/scoringEngine';
import {
  Sparkles,
  Sliders,
  CloudRain,
  Car,
  Route,
  Mountain,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Settings,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface WhatIfSimulationPanelProps {
  routes: RouteOption[];
  onSimulationChange?: (scores: RouteDetailedScores[], conditions: SimulationConditions) => void;
  cargoWeightTons?: number;
  vehicleType?: string;
}

export const WhatIfSimulationPanel: React.FC<WhatIfSimulationPanelProps> = ({
  routes,
  onSimulationChange,
  cargoWeightTons = 10,
  vehicleType = 'Heavy Truck',
}) => {
  const [conditions, setConditions] = useState<SimulationConditions>(DEFAULT_SIMULATION_CONDITIONS);
  const [previousConditions, setPreviousConditions] = useState<SimulationConditions>(DEFAULT_SIMULATION_CONDITIONS);
  const [weights, setWeights] = useState<ScoringWeights>(DEFAULT_SCORING_WEIGHTS);
  const [showWeightsConfig, setShowWeightsConfig] = useState<boolean>(false);

  // Compute current scored routes
  const currentScores = scoreAllRoutes(routes, conditions, weights, 'general', cargoWeightTons, vehicleType);
  const previousScores = scoreAllRoutes(routes, previousConditions, weights, 'general', cargoWeightTons, vehicleType);

  const currentWinner = currentScores.find((s) => s.isRecommended) || currentScores[0];
  const previousWinner = previousScores.find((s) => s.isRecommended) || previousScores[0];
  const winnerChanged = currentWinner.routeId !== previousWinner.routeId;

  const updateCondition = <K extends keyof SimulationConditions>(key: K, value: SimulationConditions[K]) => {
    setPreviousConditions(conditions);
    const newConds = { ...conditions, [key]: value };
    setConditions(newConds);

    if (onSimulationChange) {
      const updatedScores = scoreAllRoutes(routes, newConds, weights, 'general', cargoWeightTons, vehicleType);
      onSimulationChange(updatedScores, newConds);
    }
  };

  const handleReset = () => {
    setPreviousConditions(conditions);
    setConditions(DEFAULT_SIMULATION_CONDITIONS);
    setWeights(DEFAULT_SCORING_WEIGHTS);
    if (onSimulationChange) {
      const updatedScores = scoreAllRoutes(
        routes,
        DEFAULT_SIMULATION_CONDITIONS,
        DEFAULT_SCORING_WEIGHTS,
        'general',
        cargoWeightTons,
        vehicleType
      );
      onSimulationChange(updatedScores, DEFAULT_SIMULATION_CONDITIONS);
    }
  };

  // Quick Preset Scenarios
  const applyPreset = (preset: 'monsoon' | 'dry' | 'landslide_surge' | 'clear') => {
    setPreviousConditions(conditions);
    let newConds: SimulationConditions;

    switch (preset) {
      case 'monsoon':
        newConds = { rainfall: 'heavy', traffic: 'high', roadCondition: 'poor', landslideRisk: 'high' };
        break;
      case 'landslide_surge':
        newConds = { rainfall: 'extreme', traffic: 'high', roadCondition: 'poor', landslideRisk: 'high' };
        break;
      case 'dry':
        newConds = { rainfall: 'normal', traffic: 'low', roadCondition: 'good', landslideRisk: 'low' };
        break;
      case 'clear':
      default:
        newConds = DEFAULT_SIMULATION_CONDITIONS;
        break;
    }

    setConditions(newConds);
    if (onSimulationChange) {
      const updatedScores = scoreAllRoutes(routes, newConds, weights, 'general', cargoWeightTons, vehicleType);
      onSimulationChange(updatedScores, newConds);
    }
  };

  return (
    <div
      id="what-if-simulation-panel"
      className="rounded-3xl border-2 border-blue-200 bg-white p-6 sm:p-8 shadow-md space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-ping"></span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 border border-blue-200 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>WHAT-IF RISK SIMULATION ENGINE</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Dynamic Weather & Terrain Risk Simulation
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Simulate adverse monsoon weather, traffic surges, and landslide probabilities to witness how our AI recalculates route rankings in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          <button
            id="btn-configure-scoring-weights"
            onClick={() => setShowWeightsConfig(!showWeightsConfig)}
            className="flex items-center space-x-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition"
            title="Configure weighted scoring formula"
          >
            <Settings className="w-3.5 h-3.5 text-slate-600" />
            <span>Config Formula ({Math.round(weights.safetyWeight * 100)}% Safety)</span>
          </button>

          <button
            id="btn-reset-simulation"
            onClick={handleReset}
            className="flex items-center space-x-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Normal</span>
          </button>
        </div>
      </div>

      {/* Quick 1-Click Simulation Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Test Scenarios:</span>
        <button
          onClick={() => applyPreset('monsoon')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
            conditions.rainfall === 'heavy' && conditions.landslideRisk === 'high'
              ? 'bg-rose-100 text-rose-900 border-rose-400 shadow-2xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          🌧️ Heavy Monsoon Cloudburst (78mm)
        </button>
        <button
          onClick={() => applyPreset('landslide_surge')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
            conditions.rainfall === 'extreme'
              ? 'bg-rose-600 text-white border-rose-700 shadow-2xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          ⚡ Extreme Flash Flood & Slope Failure
        </button>
        <button
          onClick={() => applyPreset('dry')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
            conditions.rainfall === 'normal' && conditions.traffic === 'low'
              ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          ☀️ Clear Dry Weather & Low Traffic
        </button>
      </div>

      {/* Interactive Condition Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rainfall Selector */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <CloudRain className="w-4 h-4 text-blue-600" />
              <span>Precipitation / Rainfall</span>
            </span>
            <span className="font-mono text-[11px] font-bold text-blue-700 uppercase">{conditions.rainfall}</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['normal', 'heavy', 'extreme'] as const).map((r) => (
              <button
                key={r}
                onClick={() => updateCondition('rainfall', r)}
                className={`py-2 text-xs font-bold rounded-xl capitalize transition ${
                  conditions.rainfall === r
                    ? r === 'extreme'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : r === 'heavy'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Traffic Level */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Car className="w-4 h-4 text-purple-600" />
              <span>Traffic & Congestion</span>
            </span>
            <span className="font-mono text-[11px] font-bold text-purple-700 uppercase">{conditions.traffic}</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['low', 'medium', 'high'] as const).map((t) => (
              <button
                key={t}
                onClick={() => updateCondition('traffic', t)}
                className={`py-2 text-xs font-bold rounded-xl capitalize transition ${
                  conditions.traffic === t
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Road Infrastructure Condition */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Route className="w-4 h-4 text-emerald-600" />
              <span>Road Condition</span>
            </span>
            <span className="font-mono text-[11px] font-bold text-emerald-700 uppercase">
              {conditions.roadCondition}
            </span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['good', 'moderate', 'poor'] as const).map((rc) => (
              <button
                key={rc}
                onClick={() => updateCondition('roadCondition', rc)}
                className={`py-2 text-xs font-bold rounded-xl capitalize transition ${
                  conditions.roadCondition === rc
                    ? rc === 'poor'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : rc === 'moderate'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {rc}
              </button>
            ))}
          </div>
        </div>

        {/* Landslide Risk */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Mountain className="w-4 h-4 text-amber-600" />
              <span>Landslide Probability</span>
            </span>
            <span className="font-mono text-[11px] font-bold text-amber-700 uppercase">
              {conditions.landslideRisk}
            </span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['low', 'medium', 'high'] as const).map((lr) => (
              <button
                key={lr}
                onClick={() => updateCondition('landslideRisk', lr)}
                className={`py-2 text-xs font-bold rounded-xl capitalize transition ${
                  conditions.landslideRisk === lr
                    ? lr === 'high'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : lr === 'medium'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DYNAMIC SIH RECOMMENDATION CHANGE BANNER */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border transition-all ${
          conditions.rainfall === 'heavy' || conditions.rainfall === 'extreme' || conditions.landslideRisk === 'high'
            ? 'bg-emerald-50 border-emerald-300 shadow-sm'
            : 'bg-blue-50 border-blue-200'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-white shadow-xs flex-shrink-0">
            {winnerChanged ? (
              <Zap className="w-5 h-5 text-emerald-600" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <span>
                {winnerChanged
                  ? '⚡ AI ROUTE ADAPTATION TRIGGERED'
                  : 'AI OPTIMAL CORRIDOR CONFIRMATION'}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200">
                Current Best: {currentWinner.code.replace('_', ' ')} ({currentWinner.overallScore}/100)
              </span>
            </h4>
            <p className="text-xs font-medium text-slate-700 leading-relaxed">
              {conditions.rainfall === 'heavy' || conditions.rainfall === 'extreme' || conditions.landslideRisk === 'high' ? (
                <>
                  <strong className="text-emerald-800 font-bold">
                    Recommended route changed from Route A (NH-2 Direct) to Route B (NH-37 Jiribam)
                  </strong>{' '}
                  because {conditions.rainfall} rainfall and high landslide risk severely degrade slope stability on Route A. Route B has reinforced retaining walls and low flood exposure.
                </>
              ) : (
                <>
                  <strong className="text-blue-900 font-bold">Route B is recommended</strong> because although it is 25 km longer, it maintains optimal road conditions, lower landslide exposure, and 24/7 recovery crane coverage.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Recalculated Score Cards Grid for All 3 Routes */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
          <span>Real-Time Recalculated Score Matrix</span>
          <span className="text-[11px] text-slate-500 font-normal">
            Formula: 30% Safety • 15% Time • 10% Dist • 15% Weather • 10% Hazard • 10% Road • 5% Access • 5% Logistics
          </span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentScores.map((score) => {
            const isTop = score.isRecommended;

            return (
              <div
                key={score.routeId}
                className={`rounded-2xl p-4 border transition-all ${
                  isTop
                    ? 'bg-white border-2 border-emerald-500 shadow-md ring-1 ring-emerald-300'
                    : score.code === 'ROUTE_A'
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-900">{score.title}</span>
                  </div>
                  {isTop ? (
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 border border-emerald-300">
                      ★ TOP RECOMMENDED
                    </span>
                  ) : (
                    <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-700">
                      ALTERNATE
                    </span>
                  )}
                </div>

                {/* Score Big Display */}
                <div className="my-3 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-bold uppercase">Overall Score:</span>
                  <span
                    className={`font-mono text-2xl font-black ${
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

                {/* Component Breakdown Table */}
                <div className="space-y-1 text-[11px] pt-1 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Safety Score:</span>
                    <span className="font-mono font-bold text-slate-800">{score.safetyScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time Score:</span>
                    <span className="font-mono font-bold text-blue-700">{score.timeScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Weather Risk:</span>
                    <span className={`font-semibold ${score.weatherLevel === 'High' || score.weatherLevel === 'Extreme' ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {score.weatherLevel} ({score.weatherRiskScore})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Landslide Risk:</span>
                    <span className={`font-semibold ${score.landslideLevel === 'High' ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {score.landslideLevel} ({score.landslideRiskScore})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Road Condition:</span>
                    <span className="font-medium text-slate-800">{score.roadConditionText}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Accessibility:</span>
                    <span className="font-medium text-slate-800">{score.accessibilityText}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configurable Formula Modal */}
      {showWeightsConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-300 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Settings className="w-4 h-4 text-blue-600" />
                <span>Configurable Route Scoring Formula Weights</span>
              </h3>
              <button
                onClick={() => setShowWeightsConfig(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Adjust the algorithmic importance weights according to SIH evaluation criteria. Total equals 100%.
            </p>

            <div className="space-y-3 text-xs max-h-[50vh] overflow-y-auto pr-1">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Safety Weight:</span>
                  <span className="font-mono text-blue-700">{Math.round(weights.safetyWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.6"
                  step="0.05"
                  value={weights.safetyWeight}
                  onChange={(e) => setWeights({ ...weights, safetyWeight: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Travel Time Weight:</span>
                  <span className="font-mono text-blue-700">{Math.round(weights.timeWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.4"
                  step="0.05"
                  value={weights.timeWeight}
                  onChange={(e) => setWeights({ ...weights, timeWeight: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Weather Risk Weight:</span>
                  <span className="font-mono text-blue-700">{Math.round(weights.weatherWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.05"
                  value={weights.weatherWeight}
                  onChange={(e) => setWeights({ ...weights, weatherWeight: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Landslide/Flood Hazard Weight:</span>
                  <span className="font-mono text-blue-700">{Math.round(weights.hazardWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.05"
                  value={weights.hazardWeight}
                  onChange={(e) => setWeights({ ...weights, hazardWeight: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-between">
              <button
                onClick={() => setWeights(DEFAULT_SCORING_WEIGHTS)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Reset Default Weights
              </button>
              <button
                onClick={() => setShowWeightsConfig(false)}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
