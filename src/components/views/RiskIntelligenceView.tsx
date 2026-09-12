import React from 'react';
import { NavigationTab } from '../../types';
import { KpiCard } from '../common/KpiCard';
import {
  ShieldAlert,
  CloudRain,
  Mountain,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface RiskIntelligenceViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const RiskIntelligenceView: React.FC<RiskIntelligenceViewProps> = ({ onNavigate }) => {
  // 7-day trend mock data
  const trend7DaysData = [
    { day: 'Mon', accessibility: 86, landslideRisk: 52, floodRisk: 30 },
    { day: 'Tue', accessibility: 84, landslideRisk: 58, floodRisk: 34 },
    { day: 'Wed', accessibility: 79, landslideRisk: 65, floodRisk: 40 },
    { day: 'Thu (Today)', accessibility: 82, landslideRisk: 68, floodRisk: 42 },
    { day: 'Fri', accessibility: 80, landslideRisk: 70, floodRisk: 45 },
    { day: 'Sat', accessibility: 85, landslideRisk: 55, floodRisk: 38 },
    { day: 'Sun', accessibility: 88, landslideRisk: 48, floodRisk: 28 },
  ];

  const regionalRiskDistribution = [
    { region: 'Guwahati Corridor', riskScore: 22, color: '#10b981' },
    { region: 'Shillong Bypass', riskScore: 48, color: '#f59e0b' },
    { region: 'Dimapur Lowlands', riskScore: 38, color: '#f59e0b' },
    { region: 'Kohima Highland', riskScore: 78, color: '#ef4444' },
    { region: 'Senapati Ghats', riskScore: 84, color: '#ef4444' },
    { region: 'Silchar-Jiribam', riskScore: 28, color: '#10b981' },
    { region: 'Imphal Valley', riskScore: 35, color: '#10b981' },
  ];

  return (
    <div id="risk-intelligence-view" className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Risk Intelligence
            </h1>
            <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-800 border border-rose-200">
              PREDICTIVE DISRUPTION MODELS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hazard indices, geotechnical slope vulnerability, and weather telemetry.
          </p>
        </div>

        <button
          onClick={() => onNavigate('smart-routes')}
          className="flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-bold transition shadow-xs"
        >
          <span>Run Route Risk Analysis →</span>
        </button>
      </div>

      {/* 5 Core Required KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard
          id="kpi-landslide-risk"
          title="Landslide Risk"
          value="68%"
          subtitle="Slope failure index"
          icon={Mountain}
          accentColor="rose"
          trend={{ value: '+6%', isPositive: false }}
        />

        <KpiCard
          id="kpi-flood-risk"
          title="Flood Risk"
          value="42%"
          subtitle="River basin overflow"
          icon={CloudRain}
          accentColor="blue"
          trend={{ value: '+2%', isPositive: false }}
        />

        <KpiCard
          id="kpi-road-disruption"
          title="Road Disruption Risk"
          value="74%"
          subtitle="Corridor delay probability"
          icon={AlertTriangle}
          accentColor="amber"
          trend={{ value: '+4%', isPositive: false }}
        />

        <KpiCard
          id="kpi-expected-delay"
          title="Expected Delay"
          value="2h 15m"
          subtitle="Average bottleneck hold"
          icon={Clock}
          accentColor="purple"
          trend={{ value: '+20m', isPositive: false }}
        />

        <KpiCard
          id="kpi-prediction-confidence"
          title="Prediction Confidence"
          value="91%"
          subtitle="Ensemble model accuracy"
          icon={Sparkles}
          accentColor="emerald"
          trend={{ value: '+1.2%', isPositive: true }}
        />
      </div>

      {/* Mandatory Philosophical Quote Section */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 shadow-xs">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
              The road_navi Multi-Hazard Philosophy
            </h4>
            <p className="text-sm font-semibold text-slate-800 italic mt-1 leading-relaxed">
              “Risk intelligence combines weather, terrain, historical disruption patterns, road accessibility and transportation conditions to estimate potential route disruptions.”
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Trend Line Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                7-Day Accessibility & Hazard Trend
              </h3>
              <p className="text-xs text-slate-500">Historical vs 3-Day Lookahead</p>
            </div>
            <span className="text-[11px] font-mono text-blue-700 font-semibold">MONSOON TELEMETRY</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend7DaysData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[20, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '12px',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="accessibility"
                  name="Accessibility %"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="landslideRisk"
                  name="Landslide Risk %"
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="floodRisk"
                  name="Flood Risk %"
                  stroke="#2563eb"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Risk Distribution Bar Chart */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Corridor Risk Distribution
              </h3>
              <p className="text-xs text-slate-500">Hazard score by highway sector (0-100)</p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {regionalRiskDistribution.map((item) => (
              <div key={item.region} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.region}</span>
                  <span
                    className="font-mono font-bold"
                    style={{ color: item.color }}
                  >
                    {item.riskScore}/100
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.riskScore}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
