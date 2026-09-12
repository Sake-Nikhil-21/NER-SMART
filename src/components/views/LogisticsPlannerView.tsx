import React, { useState } from 'react';
import { LogisticsPlan, LogisticsStop, NavigationTab } from '../../types';
import { MOCK_MULTI_STOP_LOGISTICS } from '../../data/mockData';
import { apiService, LogisticsOptimizationResult } from '../../services/apiService';
import {
  Truck,
  MapPin,
  Sparkles,
  Fuel,
  Clock,
  ShieldCheck,
  Plus,
  Trash2,
  ArrowUpDown,
  CheckCircle2,
  Loader2,
  TrendingDown,
  Layers,
  Leaf,
  Info,
  HeartPulse,
  AlertTriangle,
  ArrowRight,
  Package,
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface LogisticsPlannerViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const LogisticsPlannerView: React.FC<LogisticsPlannerViewProps> = ({ onNavigate }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Form states matching SIH Requirement #5
  const [origin, setOrigin] = useState('Guwahati Central Hub, Assam');
  const [destination, setDestination] = useState('Imphal Logistics Center, Manipur');
  const [vehicleType, setVehicleType] = useState<'Truck' | 'Mini Truck' | 'Van' | 'Emergency Vehicle'>('Truck');
  const [cargoType, setCargoType] = useState<'Medicine' | 'Food' | 'Relief Materials' | 'General Goods'>('Medicine');
  const [cargoWeightTons, setCargoWeightTons] = useState(10);
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Emergency Medical'>('Emergency Medical');
  const [deadlineHours, setDeadlineHours] = useState(24);

  // Stops list
  const [stops, setStops] = useState<string[]>([
    'Kohima Bypass Depot, Nagaland',
    'Imphal Mantripukhri Hub, Manipur',
    'Aizawl Bawngkawn Complex, Mizoram',
  ]);
  const [newStopInput, setNewStopInput] = useState('');

  // AI Optimization Result
  const [optimizationResult, setOptimizationResult] = useState<LogisticsOptimizationResult>({
    bestRoute: {
      id: 'route-b-recommended',
      code: 'ROUTE_B',
      title: 'Route B — NH-37 Jiribam-Silchar Corridor',
      subtitle: 'Via Haflong → Silchar Southern Depot → Jiribam → Noney → Imphal',
      tag: 'AI RECOMMENDED FOR FREIGHT',
      isAiRecommended: true,
      distanceKm: 505,
      eta: '10h 15m',
      durationMinutes: 615,
      riskScore: 28,
      riskLevel: 'low',
      statusText: 'ALL-WEATHER REINFORCED',
      summary: 'Optimal corridor for multi-axle freight with reinforced slope protection and gentle gradients.',
      highwayNumbers: ['NH-27', 'NH-54E', 'NH-37'],
      keyWaypoints: ['Guwahati', 'Haflong', 'Silchar', 'Jiribam Border', 'Noney Bridge', 'Imphal'],
      riskFactors: [],
      suitableVehicles: ['Truck', 'Emergency Vehicle'],
      color: '#10b981',
      mapCoordinates: [],
      pros: ['Engineered slope retaining walls', '24/7 NDRF coverage'],
      cons: ['+25 km longer'],
      elevationPeakMeters: 790,
      rainfallForecastMm: 14,
    },
    estimatedTravelTime: '9h 45m',
    estimatedDistanceKm: 505,
    riskLevel: 'LOW',
    deliveryPriority: 'Emergency Medical',
    vehicleSuitability: {
      score: 98,
      isSuitable: true,
      reason: 'Vehicle conforms to all NH-37 bridge load limits with optimal suspension clearance for mountain passes.',
    },
    recommendedStopSequence: [
      {
        sequenceNumber: 1,
        locationName: 'Guwahati Central Hub, Assam',
        action: 'Origin Loading & Thermal Check',
        eta: 'Day 1, 08:00 AM',
        cumulativeDistanceKm: 0,
        cargoChange: '+10 Tons Loaded',
      },
      {
        sequenceNumber: 2,
        locationName: 'Kohima Bypass Depot, Nagaland',
        action: 'Immediate Urgent Medicine Discharge',
        eta: 'Day 1, 01:30 PM',
        cumulativeDistanceKm: 340,
        cargoChange: '-3 Tons',
      },
      {
        sequenceNumber: 3,
        locationName: 'Imphal Mantripukhri Hub, Manipur',
        action: 'Hospital Critical Care Restock',
        eta: 'Day 1, 05:30 PM',
        cumulativeDistanceKm: 480,
        cargoChange: '-4 Tons',
      },
      {
        sequenceNumber: 4,
        locationName: 'Aizawl Bawngkawn Complex, Mizoram',
        action: 'Final Depot Handover',
        eta: 'Day 1, 09:45 PM',
        cumulativeDistanceKm: 620,
        cargoChange: '-3 Tons',
      },
    ],
    sequenceExplanation:
      'Perishable Medical Sequencing: Stops are dynamically ordered to discharge temperature-sensitive pharmaceuticals and emergency trauma kits at high-priority valley hospitals first before ascending higher-altitude mountain ridges.',
    efficiencyScore: 96.2,
    fuelEstimateInr: 7850,
  });

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await apiService.optimizeLogistics({
        origin,
        destination,
        vehicleType,
        cargoType,
        cargoWeightTons,
        priority,
        deliveryDeadlineHours: deadlineHours,
        stops,
      });
      setOptimizationResult(result);
    } catch (e) {
      // handled inside service
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAddStop = () => {
    if (!newStopInput.trim()) return;
    setStops([...stops, newStopInput.trim()]);
    setNewStopInput('');
  };

  const handleRemoveStop = (index: number) => {
    if (stops.length <= 1) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  return (
    <div id="logistics-planner-view" className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Smart Logistics Optimization Engine
            </h1>
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-800 border border-blue-200">
              MULTI-STOP TSP & CARGO OPTIMIZER
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Optimize fleet sequences, cargo priority, vehicle axle suitability, and mountain transit safety across North East corridors.
          </p>
        </div>

        <button
          id="btn-optimize-logistics-ai"
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3 text-xs font-bold text-white shadow-sm transition active:scale-95 disabled:opacity-50"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Calculating Optimal Sequence & Suitability...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Optimize Logistics Plan</span>
            </>
          )}
        </button>
      </div>

      {/* Grid: Config Form Left & AI Optimization Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form (Requirement #5) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center space-x-2">
              <Truck className="w-4 h-4" />
              <span>Fleet, Cargo & Route Inputs</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">SIH PARAMETER SET</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Origin & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Origin</span>
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>Destination</span>
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Vehicle Type & Cargo Type */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Truck">Heavy Truck</option>
                  <option value="Mini Truck">Mini Truck</option>
                  <option value="Van">Delivery Van</option>
                  <option value="Emergency Vehicle">Emergency Vehicle</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Cargo Type</label>
                <select
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Medicine">Medicine & Vaccines</option>
                  <option value="Food">Perishable Food Supplies</option>
                  <option value="Relief Materials">Disaster Relief Materials</option>
                  <option value="General Goods">General FMCG Goods</option>
                </select>
              </div>
            </div>

            {/* Cargo Weight, Priority, Deadline */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Weight (Tons)</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={cargoWeightTons}
                  onChange={(e) => setCargoWeightTons(Number(e.target.value) || 10)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-2 py-2 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 focus:outline-none text-[11px]"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Emergency Medical">Emergency Medical</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Deadline (Hrs)</label>
                <input
                  type="number"
                  min="4"
                  max="120"
                  value={deadlineHours}
                  onChange={(e) => setDeadlineHours(Number(e.target.value) || 24)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Multi-Stop Input List */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800">Intermediate Delivery Stops ({stops.length})</label>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {stops.map((st, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs text-slate-800"
                  >
                    <span className="font-medium truncate">
                      {idx + 1}. {st}
                    </span>
                    <button
                      onClick={() => handleRemoveStop(idx)}
                      className="text-slate-400 hover:text-rose-600 transition ml-2"
                      title="Remove stop"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Stop Input */}
              <div className="flex space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Add another delivery node (e.g. Silchar Depot)"
                  value={newStopInput}
                  onChange={(e) => setNewStopInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddStop()}
                  className="flex-1 rounded-xl bg-slate-50 border border-slate-300 px-3 py-1.5 text-xs focus:bg-white focus:outline-none"
                />
                <button
                  onClick={handleAddStop}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-800 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Optimized Delivery Plan & Sequence (Requirement #5 Outputs) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Outputs Summary Card */}
          <div className="rounded-2xl border-2 border-emerald-300 bg-white p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                  OPTIMAL CORRIDOR: {optimizationResult.bestRoute.code.replace('_', ' ')}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {optimizationResult.bestRoute.title}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  Priority: {optimizationResult.deliveryPriority}
                </span>
              </div>
            </div>

            {/* 4 Key Output Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Est. Travel Time</span>
                <span className="text-lg font-black text-blue-700 font-mono">{optimizationResult.estimatedTravelTime}</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Est. Distance</span>
                <span className="text-lg font-black text-slate-900 font-mono">{optimizationResult.estimatedDistanceKm} km</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Risk Level</span>
                <div className="mt-0.5">
                  <RiskBadge level={optimizationResult.riskLevel.toLowerCase() as any} text={`${optimizationResult.riskLevel} RISK`} size="sm" />
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Vehicle Suitability</span>
                <span className="text-lg font-black text-emerald-700 font-mono">
                  {optimizationResult.vehicleSuitability.score}/100
                </span>
              </div>
            </div>

            {/* Vehicle Suitability Note */}
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs text-slate-700 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Vehicle Suitability Assessment:</strong> {optimizationResult.vehicleSuitability.reason}
              </span>
            </div>
          </div>

          {/* Recommended Stop Sequence & Explanation (Requirement #5) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Recommended Stop Sequence
                </h3>
                <p className="text-xs text-slate-500">
                  Topologically sorted for mountain safety & emergency priority
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                ★ {optimizationResult.efficiencyScore}% Efficiency
              </span>
            </div>

            {/* Stop Sequence List */}
            <div className="space-y-3">
              {optimizationResult.recommendedStopSequence.map((stop, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-200 hover:border-slate-300 transition"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100 border border-blue-200 text-blue-800 font-bold font-mono text-xs">
                      {stop.sequenceNumber}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{stop.locationName}</h4>
                      <span className="text-[11px] text-blue-700 font-medium">{stop.action}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px]">ETA</span>
                      <span className="text-slate-800 font-semibold">{stop.eta}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px]">PAYLOAD</span>
                      <span className="font-bold text-amber-800">{stop.cargoChange}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Why this sequence was chosen (Explanation) */}
            <div className="rounded-xl bg-blue-50/70 p-4 border border-blue-200 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-blue-900 font-bold text-xs">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Why was this stop sequence chosen?</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {optimizationResult.sequenceExplanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
