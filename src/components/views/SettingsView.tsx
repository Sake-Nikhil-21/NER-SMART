import React from 'react';
import { NavigationTab } from '../../types';
import {
  Settings,
  Cpu,
  Layers,
  Database,
  Terminal,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
  Radio,
  ExternalLink,
  Code
} from 'lucide-react';

interface SettingsViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onResetApp: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate, onResetApp }) => {
  return (
    <div id="settings-view" className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              System Architecture & Prototype Settings
            </h1>
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-800 border border-blue-200">
              SIH 2024-2025
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Technical blueprint, data pipelines, and prototype configuration for road_navi.
          </p>
        </div>

        <button
          onClick={onResetApp}
          className="flex items-center space-x-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 px-4 py-2 text-xs font-bold transition shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulation State</span>
        </button>
      </div>

      {/* SIH Hackathon Official Compliance Notice */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 space-y-3 shadow-xs">
        <div className="flex items-center space-x-2 text-blue-900">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider">
            Smart India Hackathon Prototype Scope & Fidelity
          </h3>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          This prototype addresses the problem statement <strong>“AI-Based Smart Logistics and Accessibility Intelligence Platform for North Eastern Region (NER)”</strong>. It demonstrates how multi-modal GIS telemetry, rainfall isobars, geotechnical slope risk, and axle load parameters are synthesized into actionable route recommendations for operators, disaster responders, and government authorities.
        </p>
      </div>

      {/* 4-Tier Architecture Blueprint */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tier 1: Ingestion */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-blue-700">
            <Radio className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase">1. Ingestion Layer</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Connects to IMD Doppler radar feeds, CWC river gauging stations, BRO mountain road advisories, and state police traffic bulletins.
          </p>
          <div className="text-[10px] font-mono text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
            Protocols: GeoJSON / MQTT / REST
          </div>
        </div>

        {/* Tier 2: AI / ML Core */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-indigo-700">
            <Cpu className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase">2. AI Risk Engine</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Probabilistic landslide hazard models, slope gradient penalty weights, rainfall threshold triggers, and Axle-Grade Stress curves.
          </p>
          <div className="text-[10px] font-mono text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
            Models: Spatial Gradient Ensemble
          </div>
        </div>

        {/* Tier 3: Optimization */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-emerald-700">
            <Layers className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase">3. Logistics Solver</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Multi-stop TSP and vehicle routing problem solver with dynamic mountain payload re-distribution and bridge class verification.
          </p>
          <div className="text-[10px] font-mono text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
            Algorithm: Pareto Safety VRP
          </div>
        </div>

        {/* Tier 4: GIS Presentation */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-purple-700">
            <Terminal className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase">4. Command GIS</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Responsive Leaflet WebGIS interface with high-contrast tactical palettes, emergency NDRF mode, and real-time state telemetry.
          </p>
          <div className="text-[10px] font-mono text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
            UI: React + Tailwind + Leaflet
          </div>
        </div>
      </div>

      {/* NER States Matrix Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
          Regional Corridor Integration Coverage
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">ASSAM</span>
            <strong className="text-slate-800 font-bold">Guwahati / Silchar Hubs</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">MANIPUR</span>
            <strong className="text-slate-800 font-bold">Imphal / Jiribam Gateways</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">NAGALAND</span>
            <strong className="text-slate-800 font-bold">Kohima / Dimapur Bypass</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">MEGHALAYA</span>
            <strong className="text-slate-800 font-bold">Shillong / Umiam Corridor</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">ARUNACHAL PRADESH</span>
            <strong className="text-slate-800 font-bold">Itanagar / Bhalukpong Pass</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">MIZORAM</span>
            <strong className="text-slate-800 font-bold">Aizawl / Vairengte Axis</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">TRIPURA</span>
            <strong className="text-slate-800 font-bold">Agartala Transit Corridor</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">SIKKIM</span>
            <strong className="text-slate-800 font-bold">Gangtok / NH-10 Corridor</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
