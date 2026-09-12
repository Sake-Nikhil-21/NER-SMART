import React, { useState } from 'react';
import { RouteOption } from '../../types';
import { Mountain, CloudRain, AlertTriangle, ShieldCheck, TrendingUp, Info } from 'lucide-react';

interface ElevationProfileVisualizerProps {
  route?: RouteOption;
}

interface ElevationPoint {
  km: number;
  altitudeMeters: number;
  name: string;
  gradientPct: number;
  riskStatus: 'safe' | 'caution' | 'high_risk';
  weather: 'Sunny' | 'Light Rain' | 'Heavy Monsoon' | 'Thick Fog';
  landslideIndex: number; // 0 - 100
}

const SAMPLE_ELEVATION_PROFILE: ElevationPoint[] = [
  { km: 0, altitudeMeters: 55, name: 'Guwahati (Plains)', gradientPct: 0.2, riskStatus: 'safe', weather: 'Sunny', landslideIndex: 5 },
  { km: 45, altitudeMeters: 78, name: 'Jagiroad Bypass', gradientPct: 0.8, riskStatus: 'safe', weather: 'Sunny', landslideIndex: 8 },
  { km: 110, altitudeMeters: 140, name: 'Nagaon / Lumding', gradientPct: 1.5, riskStatus: 'safe', weather: 'Light Rain', landslideIndex: 14 },
  { km: 180, altitudeMeters: 480, name: 'Dima Hasao Incline', gradientPct: 6.2, riskStatus: 'caution', weather: 'Light Rain', landslideIndex: 38 },
  { km: 240, altitudeMeters: 920, name: 'Jatinga Pass Ridge', gradientPct: 8.5, riskStatus: 'caution', weather: 'Thick Fog', landslideIndex: 44 },
  { km: 295, altitudeMeters: 220, name: 'Silchar Valley', gradientPct: -5.8, riskStatus: 'safe', weather: 'Light Rain', landslideIndex: 12 },
  { km: 340, altitudeMeters: 160, name: 'Jiribam Border', gradientPct: 1.2, riskStatus: 'safe', weather: 'Sunny', landslideIndex: 10 },
  { km: 395, altitudeMeters: 890, name: 'Noney Bridge Viaduct', gradientPct: 7.1, riskStatus: 'caution', weather: 'Light Rain', landslideIndex: 28 },
  { km: 440, altitudeMeters: 1380, name: 'Tupul Mountain Pass', gradientPct: 6.4, riskStatus: 'high_risk', weather: 'Heavy Monsoon', landslideIndex: 72 },
  { km: 480, altitudeMeters: 1120, name: 'Kangchup Descent', gradientPct: -4.5, riskStatus: 'caution', weather: 'Light Rain', landslideIndex: 32 },
  { km: 505, altitudeMeters: 780, name: 'Imphal Valley Terminal', gradientPct: 0.5, riskStatus: 'safe', weather: 'Light Rain', landslideIndex: 15 },
];

export const ElevationProfileVisualizer: React.FC<ElevationProfileVisualizerProps> = () => {
  const [hoveredPoint, setHoveredPoint] = useState<ElevationPoint | null>(SAMPLE_ELEVATION_PROFILE[4]);

  const maxAlt = 1500;
  const maxKm = 505;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Mountain className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 font-brand">
              Corridor Elevation & Geotechnical Cross-Section
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive mountain gradient, cloud base & landslide vulnerability mapping along NH-37
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-slate-600 font-medium">Safe Plain</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-600 font-medium">Moderate Ghat</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600"></span>
            <span className="text-slate-600 font-medium">High Risk Pass</span>
          </div>
        </div>
      </div>

      {/* SVG Mountain Chart Profile */}
      <div className="relative w-full h-56 bg-slate-50 rounded-2xl border border-slate-200 p-4 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-x-4 top-8 border-b border-slate-200/80 flex justify-between text-[9px] font-mono text-slate-400">
          <span>1,200m ASL</span>
          <span>Alpine Ridge</span>
        </div>
        <div className="absolute inset-x-4 top-24 border-b border-slate-200/80 flex justify-between text-[9px] font-mono text-slate-400">
          <span>800m ASL</span>
          <span>Cloud Base Fog Level</span>
        </div>
        <div className="absolute inset-x-4 top-40 border-b border-slate-200/80 flex justify-between text-[9px] font-mono text-slate-400">
          <span>400m ASL</span>
          <span>Foothills</span>
        </div>

        {/* SVG Path */}
        <svg className="w-full h-full overflow-visible" viewBox="0 0 505 180" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill under the mountain line */}
          <path
            d={`M 0 180 L 0 ${180 - (SAMPLE_ELEVATION_PROFILE[0].altitudeMeters / maxAlt) * 160} ${SAMPLE_ELEVATION_PROFILE.map(
              (p) => `L ${p.km} ${180 - (p.altitudeMeters / maxAlt) * 160}`
            ).join(' ')} L 505 180 Z`}
            fill="url(#mountainGradient)"
          />

          {/* Main Top Stroke Line */}
          <path
            d={`M 0 ${180 - (SAMPLE_ELEVATION_PROFILE[0].altitudeMeters / maxAlt) * 160} ${SAMPLE_ELEVATION_PROFILE.map(
              (p) => `L ${p.km} ${180 - (p.altitudeMeters / maxAlt) * 160}`
            ).join(' ')}`}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Waypoint Dots */}
          {SAMPLE_ELEVATION_PROFILE.map((p, i) => {
            const x = p.km;
            const y = 180 - (p.altitudeMeters / maxAlt) * 160;
            const isSelected = hoveredPoint?.km === p.km;
            const color = p.riskStatus === 'high_risk' ? '#e11d48' : p.riskStatus === 'caution' ? '#d97706' : '#059669';

            return (
              <g key={i} className="cursor-pointer" onClick={() => setHoveredPoint(p)} onMouseEnter={() => setHoveredPoint(p)}>
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 6 : 4}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
                {isSelected && (
                  <circle cx={x} cy={y} r="10" fill="none" stroke={color} strokeWidth="1.5" className="animate-ping" />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Point Detail Callout on Hover */}
      {hoveredPoint && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <div className="text-[10px] text-slate-500 font-mono uppercase">Selected Waypoint</div>
            <div className="text-sm font-bold text-slate-900 font-brand mt-0.5">{hoveredPoint.name}</div>
            <div className="text-xs text-blue-700 font-mono font-semibold">KM {hoveredPoint.km} of 505 km</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 font-mono uppercase">Altitude ASL</div>
            <div className="text-base font-black text-slate-900 font-tech mt-0.5">{hoveredPoint.altitudeMeters} m</div>
            <div className="text-xs text-slate-600">Slope: {hoveredPoint.gradientPct > 0 ? `+${hoveredPoint.gradientPct}%` : `${hoveredPoint.gradientPct}%`}</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 font-mono uppercase">Weather Radar</div>
            <div className="text-sm font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
              <CloudRain className="w-3.5 h-3.5 text-blue-600" />
              <span>{hoveredPoint.weather}</span>
            </div>
            <div className="text-xs text-slate-600">Rain risk: {hoveredPoint.landslideIndex}%</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 font-mono uppercase">Corridor Status</div>
            <div className="mt-0.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                hoveredPoint.riskStatus === 'high_risk'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : hoveredPoint.riskStatus === 'caution'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {hoveredPoint.riskStatus.toUpperCase().replace('_', ' ')}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Real-time Telemetry</div>
          </div>
        </div>
      )}
    </div>
  );
};
