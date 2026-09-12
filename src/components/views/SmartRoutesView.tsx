import React, { useState } from 'react';
import { RouteQuery } from '../../types';
import { DEFAULT_DEMO_QUERY, CITIZEN_POPULAR_ROUTES } from '../../data/mockData';
import {
  Route,
  Sparkles,
  Truck,
  Weight,
  Clock,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Zap,
  MapPin,
  HelpCircle,
  Cpu,
  Layers,
  ChevronDown,
  Car,
  Bike,
  Bus,
  CheckCircle2,
  Users,
  Info
} from 'lucide-react';

interface SmartRoutesViewProps {
  onAnalyzeRoute: (query: RouteQuery) => void;
  currentQuery: RouteQuery;
  onUpdateQuery: (query: RouteQuery) => void;
}

export const SmartRoutesView: React.FC<SmartRoutesViewProps> = ({
  onAnalyzeRoute,
  currentQuery,
  onUpdateQuery,
}) => {
  const [formData, setFormData] = useState<RouteQuery>(currentQuery || DEFAULT_DEMO_QUERY);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'citizen' | 'commercial'>('citizen');

  const vehicleOptions = [
    'Car / Taxi / Passenger SUV',
    'Two-Wheeler / Motorcycle',
    'Passenger Bus / Shared Sumo',
    'Light Commercial Vehicle (Pickup / Van)',
    'Medium Commercial Vehicle (6-Wheeler)',
    'Heavy Truck (Multi-Axle 16-Wheeler)',
    'Heavy Tanker / Fuel Carrier',
    'Emergency Relief Convoy',
  ];

  const priorityOptions: ('Normal' | 'High' | 'Emergency Medical')[] = [
    'Normal',
    'High',
    'Emergency Medical',
  ];

  const cityOptions = [
    'Guwahati, Assam',
    'Shillong, Meghalaya',
    'Silchar, Assam',
    'Imphal, Manipur',
    'Kohima, Nagaland',
    'Dimapur, Nagaland',
    'Tezpur, Assam',
    'Kaziranga, Assam',
    'Aizawl, Mizoram',
    'Agartala, Tripura',
    'Dharmanagar, Tripura',
    'Itanagar, Arunachal Pradesh',
    'Gangtok, Sikkim',
    'Siliguri, West Bengal',
  ];

  const handleSelectQuickPreset = (from: string, to: string, vehicle: string, tons: number, cargo: string) => {
    const updated: RouteQuery = {
      ...formData,
      from,
      to,
      vehicleType: vehicle,
      cargoWeightTons: tons,
      cargoType: cargo,
    };
    setFormData(updated);
    onUpdateQuery(updated);
  };

  const handleResetToDemo = () => {
    setFormData(DEFAULT_DEMO_QUERY);
    onUpdateQuery(DEFAULT_DEMO_QUERY);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateQuery(formData);
    onAnalyzeRoute(formData);
  };

  return (
    <div id="smart-routes-view" className="space-y-6 pb-12">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Smart Route Planner & Safety Checker
            </h1>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 border border-emerald-200">
              ALL VEHICLES
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Check safe corridors, landslide avoidance, travel time, and road conditions for cars, buses, and commercial trucks.
          </p>
        </div>

        {/* Quick Demo Scenario Preset Button */}
        <button
          id="btn-load-sih-scenario-preset"
          type="button"
          onClick={handleResetToDemo}
          className="flex items-center space-x-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 border border-emerald-300 hover:bg-emerald-100 shadow-xs transition active:scale-95"
        >
          <Zap className="w-4 h-4 text-emerald-600" />
          <span>⚡ Load SIH Hackathon Scenario (10T Truck)</span>
        </button>
      </div>

      {/* 1-Tap Popular Travel Presets for Common People */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Popular North East Trips (1-Tap Fill)</span>
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Click to instantly populate route</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => handleSelectQuickPreset('Guwahati, Assam', 'Shillong, Meghalaya', 'Car / Taxi / Passenger SUV', 0.5, 'Family Luggage')}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition"
          >
            <div className="text-xs font-bold text-slate-900 truncate">Guwahati ➔ Shillong</div>
            <div className="text-[10px] text-emerald-700 font-medium">🚗 Car • 2h 15m • NH-6</div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectQuickPreset('Guwahati, Assam', 'Imphal, Manipur', 'Heavy Truck (Multi-Axle 16-Wheeler)', 10, 'Essential FMCG Goods')}
            className="p-2 rounded-xl bg-blue-50/70 border border-blue-300 hover:border-blue-500 text-left transition"
          >
            <div className="text-xs font-bold text-blue-900 truncate">Guwahati ➔ Imphal</div>
            <div className="text-[10px] text-blue-700 font-medium">🚚 10T Freight • NH-37</div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectQuickPreset('Silchar, Assam', 'Imphal, Manipur', 'Passenger Bus / Shared Sumo', 2, 'Passengers & Parcels')}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition"
          >
            <div className="text-xs font-bold text-slate-900 truncate">Silchar ➔ Imphal</div>
            <div className="text-[10px] text-emerald-700 font-medium">🚌 Bus/Sumo • NH-37</div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectQuickPreset('Dimapur, Nagaland', 'Kohima, Nagaland', 'Car / Taxi / Passenger SUV', 0.5, 'Personal Baggage')}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition"
          >
            <div className="text-xs font-bold text-slate-900 truncate">Dimapur ➔ Kohima</div>
            <div className="text-[10px] text-amber-700 font-medium">🚗 Car • 74 km • NH-29</div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectQuickPreset('Gangtok, Sikkim', 'Siliguri, West Bengal', 'Car / Taxi / Passenger SUV', 0.5, 'Travel Gear')}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition"
          >
            <div className="text-xs font-bold text-slate-900 truncate">Gangtok ➔ Siliguri</div>
            <div className="text-[10px] text-amber-700 font-medium">🚗 Car • 114 km • NH-10</div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectQuickPreset('Agartala, Tripura', 'Dharmanagar, Tripura', 'Car / Taxi / Passenger SUV', 0.5, 'Personal')}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition"
          >
            <div className="text-xs font-bold text-slate-900 truncate">Agartala ➔ Dharmanagar</div>
            <div className="text-[10px] text-emerald-700 font-medium">🚗 Car • 168 km • NH-8</div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Input Form */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center space-x-2">
                <Route className="w-4 h-4" />
                <span>Trip & Vehicle Configuration</span>
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">STEP 1 OF 3</span>
            </div>

            {/* Origin & Destination Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Starting From (Origin Hub)</span>
                </label>
                <div className="relative">
                  <select
                    id="input-route-from"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none appearance-none"
                  >
                    {cityOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Going To (Destination Hub)</span>
                </label>
                <div className="relative">
                  <select
                    id="input-route-to"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none appearance-none"
                  >
                    {cityOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Vehicle & Cargo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Vehicle Type</span>
                </label>
                <div className="relative">
                  <select
                    id="input-vehicle-type"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none appearance-none"
                  >
                    {vehicleOptions.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Weight className="w-3.5 h-3.5 text-amber-600" />
                  <span>Weight / Payload</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    id="input-cargo-weight"
                    type="number"
                    min="0.1"
                    max="60"
                    step="0.5"
                    value={formData.cargoWeightTons}
                    onChange={(e) =>
                      setFormData({ ...formData, cargoWeightTons: Number(e.target.value) || 1 })
                    }
                    className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs font-bold font-mono text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-500">Tons</span>
                </div>
              </div>
            </div>

            {/* Cargo Type, Priority & Departure */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Luggage / Cargo Details</label>
                <input
                  id="input-cargo-type"
                  type="text"
                  value={formData.cargoType}
                  onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                  placeholder="e.g. Personal Travel, FMCG, Medicine"
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Priority Level</label>
                <div className="relative">
                  <select
                    id="input-priority"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as 'Normal' | 'High' | 'Emergency Medical',
                      })
                    }
                    className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none appearance-none"
                  >
                    {priorityOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Departure Time</span>
                </label>
                <input
                  id="input-departure-time"
                  type="text"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Analysis Trigger CTA */}
            <div className="pt-3">
              <button
                id="btn-analyze-route-with-ai"
                type="submit"
                className="group relative flex w-full items-center justify-center space-x-3 rounded-2xl bg-blue-600 hover:bg-blue-700 p-4 text-base sm:text-lg font-bold text-white shadow-sm transition-all duration-200 active:scale-98"
              >
                <Sparkles className="w-5 h-5 text-blue-100" />
                <span>Check Road Safety & Analyze Route</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Box: Multi-Hazard AI Engine & Citizen Safety Check */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Citizen & Logistics Safety Engine</h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Standard GPS apps suggest short mountain roads that often get blocked by landslides. Our AI cross-checks live rainfall, slope sensors, and bridge clearances to give you 100% safe guidance.
            </p>
            <div className="space-y-1.5 pt-1 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                <span>Live IMD weather & cloudburst alerts</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                <span>Active landslide clearance tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                <span>Suitable for family cars, buses, and freight</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                <span>Verified petrol pumps & emergency stops</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Current Query Summary
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Route Corridor:</span>
                <span className="text-slate-800 font-semibold">{formData.from.split(',')[0]} ➔ {formData.to.split(',')[0]}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Vehicle Type:</span>
                <span className="text-blue-700 font-semibold truncate max-w-[180px]">{formData.vehicleType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payload / Weight:</span>
                <span className="text-amber-800 font-mono font-bold">{formData.cargoWeightTons} Tons</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Priority:</span>
                <span className="text-emerald-700 font-semibold">{formData.priority}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
