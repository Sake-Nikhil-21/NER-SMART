import React, { useState } from 'react';
import { NavigationTab, LanguageCode, UserExperienceMode } from '../../types';
import {
  ShieldCheck,
  Compass,
  Cpu,
  Layers,
  CloudRain,
  Mountain,
  AlertTriangle,
  FileText,
  PhoneCall,
  CheckCircle2,
  Users,
  Truck,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Info
} from 'lucide-react';
import { NER_STATES } from '../../data/mockData';

interface AboutViewProps {
  onNavigate: (tab: NavigationTab) => void;
  language: LanguageCode;
  onOpenHelplines: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigate,
  language,
  onOpenHelplines,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'how-it-works' | 'ai-gis' | 'ner-context'>('overview');

  return (
    <div id="about-view" className="space-y-8 pb-16 animate-in fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-brand">
                  ROAD_NAVI
                </h1>
                <span className="rounded-md bg-blue-100 text-blue-800 text-[11px] font-mono font-bold px-2 py-0.5 border border-blue-200">
                  NER INTELLIGENCE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                AI-Based Smart Logistics & Accessibility Intelligence Platform for the North Eastern Region
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('landing')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
            >
              ← Back to Safe Route Finder
            </button>
          </div>
        </div>

        {/* Section Navigation Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            📋 Project Overview & Mission
          </button>
          <button
            onClick={() => setActiveTab('how-it-works')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'how-it-works'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ⚙️ How It Works (Step-by-Step)
          </button>
          <button
            onClick={() => setActiveTab('ai-gis')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'ai-gis'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🧠 AI & GIS Background Architecture
          </button>
          <button
            onClick={() => setActiveTab('ner-context')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'ner-context'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🏔️ North East Regional Challenges
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & MISSION */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block">
                CORE PHILOSOPHY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                “Find the Safest, Fastest & Most Accessible Route — Not Just the Shortest Route.”
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                In plain terrain, standard map applications recommend routes based purely on distance or simple traffic congestion. In the steep mountains, fragile valleys, and monsoonal terrain of North East India (Assam, Meghalaya, Manipur, Nagaland, Mizoram, Tripura, Arunachal Pradesh, and Sikkim), <strong>the shortest road is often the most dangerous road</strong>.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                ROAD_NAVI changes the fundamental travel question from <span className="font-bold text-slate-900">“Where can I go?”</span> into <span className="font-bold text-emerald-800">“Where can I safely go?”</span>.
              </p>
            </div>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  🛡️
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Safety-First Routing</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Evaluates active landslide warnings, geotechnical slope stability, and bridge damage before calculating travel corridors.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  ♿
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Accessibility Intelligence</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clear road access index: 🟢 Easy, 🟡 Difficult, 🔴 Blocked, with specialized clearance for heavy logistics and emergency ambulances.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  🔊
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Usable By Everyone</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Big buttons, color indicators (🟢/🟡/🔴), voice assistance in 5 regional languages, and visual picture guidance for first-time smartphone users.
                </p>
              </div>
            </div>
          </div>

          {/* User Modes Callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold">👤</span>
                <h3 className="text-lg font-black text-slate-900">Simple Mode (Default)</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Crafted for common citizens, elderly family members, bus drivers, and rural travelers. Zero confusing technical jargon. Communicates route safety with simple cards, voice reading, and instant safe-route alternatives.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('landing')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs hover:bg-emerald-100 transition"
                >
                  Open Simple Mode
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-slate-800 text-white font-bold">👨‍💼</span>
                <h3 className="text-lg font-black text-slate-900">Advanced / Logistics Mode</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                For commercial logistics fleets, Border Roads Organisation (BRO), and State Disaster Management Authorities. Includes axle-load constraints, Pareto optimization, and 8-step AI reasoning.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('smart-routes')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
                >
                  Open Advanced Logistics Planner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOW IT WORKS */}
      {activeTab === 'how-it-works' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              How ROAD_NAVI Works in 3 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Designed so anyone can find a safe route in less than 5 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-3xl font-black text-blue-600">1️⃣</span>
              <h3 className="text-base font-extrabold text-slate-900">Select Your Location</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tap <strong>“Use My Location”</strong> or speak your starting point into the microphone. You can also pick from popular transport hubs like Guwahati, Shillong, or Imphal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-3xl font-black text-blue-600">2️⃣</span>
              <h3 className="text-base font-extrabold text-slate-900">Choose Where to Go</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Type or speak your destination. Tap the large <strong>“🛡️ FIND SAFE ROUTE”</strong> button. The system scans all highways, bridges, and mountain passes instantly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-3xl font-black text-emerald-600">3️⃣</span>
              <h3 className="text-base font-extrabold text-slate-900">Follow the Safest Route</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The top green card <strong>(🟢 SAFEST ROUTE)</strong> is always recommended. Tap <strong>“Start Journey”</strong> for turn-by-turn guidance and voice alerts.
              </p>
            </div>
          </div>

          {/* Simple Explanation of Why This Route */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3">
            <h4 className="font-extrabold text-emerald-950 text-sm flex items-center space-x-2">
              <span>❓ Why should you take the recommended route?</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lower flood and river overflow risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Reinforced retaining walls against landslides</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Safe multi-lane bridges and culverts open</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Acceptable travel time without high danger</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI & GIS BACKGROUND */}
      {activeTab === 'ai-gis' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 inline-block">
              TECHNICAL ARCHITECTURE
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              How the AI Works in the Background
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Technical explanation for researchers, evaluators, and logistics engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">Geotechnical & Slope Slip Physics</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The platform ingests SRTM digital elevation models to compute slope gradient matrices. Slopes exceeding 32° in sedimentary shale formations during continuous precipitation are assigned dynamic risk multipliers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center space-x-2">
                <CloudRain className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">Monsoon Soil Saturation Index</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Combines IMD radar precipitation feeds with Antecedent Moisture Condition (AMC-III) soil saturation metrics to forecast roadwash and culvert overflow before physical blockage occurs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">Multi-Criteria Pareto Optimization</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rather than minimizing distance alone (Dijkstra/A* shortest path), our optimization engine simultaneously penalizes slope risk, elevation climb, vehicle axle wear, and bridge load restrictions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">Offline Topographical Vector Caching</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                In high mountain valleys where 4G cellular signals fade, pre-cached client-side vector packs preserve full navigation, gradient elevation profiles, and emergency coordinates without network reliance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NER CONTEXT */}
      {activeTab === 'ner-context' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 inline-block">
              GEOGRAPHIC REALITY
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Why North East India Needs Accessibility Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              The North Eastern Region faces unique logistical constraints unlike any other region in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <strong className="text-slate-900 block font-bold text-sm">🌧️ Extreme Monsoon Rainfall</strong>
              <p className="text-slate-600">
                Mawsynram and Cherrapunji receive the world’s highest rainfall. Over 1,500mm of monsoon rainfall causes rapid soil saturation and flash floods in Barak and Brahmaputra valleys.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <strong className="text-slate-900 block font-bold text-sm">⛰️ Active Tectonic Mountain Passes</strong>
              <p className="text-slate-600">
                The Eastern Himalayas and Indo-Burma ranges are geologically young and prone to sudden slope slips, rockfalls, and mudslides during heavy precipitation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <strong className="text-slate-900 block font-bold text-sm">🌉 Critical Lifeline Bridges</strong>
              <p className="text-slate-600">
                Many states depend on single highway corridors (such as NH-29 and NH-37). If a single Bailey bridge or culvert fails, entire districts can be cut off for days.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <strong className="text-slate-900 block font-bold text-sm">🚑 Urgent Medical Transit Access</strong>
              <p className="text-slate-600">
                Reaching tertiary hospitals (such as RIMS Imphal or GMCH Guwahati) requires absolute certainty that roads will remain open throughout the 10-14 hour journey.
              </p>
            </div>
          </div>

          {/* 8 State Coverage */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Coverage Across All 8 North Eastern States:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {NER_STATES.map((st) => (
                <div key={st.id} className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 font-semibold text-slate-800 flex items-center justify-between">
                  <span>{st.name}</span>
                  <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {st.accessibilityPct}% Open
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contacts Callout */}
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-red-700 font-black text-sm">🚨 24x7 DISASTER & HIGHWAY HELPLINES</span>
          </div>
          <p className="text-xs text-red-800">
            NHAI Highway Helpline: <strong>1033</strong> • National Emergency Number: <strong>112</strong> • Ambulance: <strong>108</strong>
          </p>
        </div>
        <button
          onClick={onOpenHelplines}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm whitespace-nowrap"
        >
          View Full Emergency Directory
        </button>
      </div>
    </div>
  );
};
