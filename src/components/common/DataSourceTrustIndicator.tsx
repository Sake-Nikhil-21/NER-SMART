import React, { useState } from 'react';
import { DATA_SOURCES_INFO, DataSourceTrustInfo } from '../../services/apiService';
import { ShieldCheck, Info, Database, Radio, Cpu, CloudRain, CheckCircle2, ExternalLink } from 'lucide-react';

interface DataSourceTrustIndicatorProps {
  compact?: boolean;
}

export const DataSourceTrustIndicator: React.FC<DataSourceTrustIndicatorProps> = ({ compact = false }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const getTypeBadge = (type: DataSourceTrustInfo['type']) => {
    switch (type) {
      case 'LIVE':
        return (
          <span className="inline-flex items-center space-x-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 border border-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>LIVE</span>
          </span>
        );
      case 'API':
        return (
          <span className="inline-flex items-center space-x-1 rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-800 border border-blue-300">
            <Cpu className="w-2.5 h-2.5 text-blue-700" />
            <span>API</span>
          </span>
        );
      case 'DATABASE':
        return (
          <span className="inline-flex items-center space-x-1 rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-800 border border-purple-300">
            <Database className="w-2.5 h-2.5 text-purple-700" />
            <span>DATABASE</span>
          </span>
        );
      case 'SIMULATED':
      default:
        return (
          <span className="inline-flex items-center space-x-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-900 border border-amber-300">
            <Radio className="w-2.5 h-2.5 text-amber-700" />
            <span>SIMULATED DEMO</span>
          </span>
        );
    }
  };

  if (compact) {
    return (
      <>
        <button
          id="btn-trust-sources-compact"
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2.5 py-1 text-[11px] font-bold text-slate-700 transition"
          title="Inspect verified data sources and trust transparency"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Data Sources: <span className="text-emerald-800 font-mono">OpenStreetMap + Demo</span></span>
        </button>

        {showModal && (
          <TrustModal onClose={() => setShowModal(false)} getTypeBadge={getTypeBadge} />
        )}
      </>
    );
  }

  return (
    <div id="data-source-trust-section" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Data Sources & SIH Trust Transparency</h3>
            <p className="text-[11px] text-slate-500">
              Clear attribution distinguishing live telemetry, local databases, and simulated demo telemetry.
            </p>
          </div>
        </div>

        <button
          id="btn-open-trust-modal-full"
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 transition"
        >
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>Audit Source Details</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {DATA_SOURCES_INFO.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-2 text-xs flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.category}</span>
                {getTypeBadge(item.type)}
              </div>
              <div className="font-bold text-slate-900 text-xs line-clamp-1">{item.source}</div>
            </div>
            <div className="text-[10px] text-slate-600 border-t border-slate-200/80 pt-1.5 flex justify-between">
              <span>Status: <strong className="text-slate-800">{item.lastUpdated}</strong></span>
              <span className="text-emerald-700 font-mono font-bold">{item.accuracyConfidence}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <TrustModal onClose={() => setShowModal(false)} getTypeBadge={getTypeBadge} />
      )}
    </div>
  );
};

const TrustModal: React.FC<{
  onClose: () => void;
  getTypeBadge: (type: DataSourceTrustInfo['type']) => React.ReactNode;
}> = ({ onClose, getTypeBadge }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-300 bg-white p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              SIH 2026 Data Source & Trust Transparency Audit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          In strict compliance with Smart India Hackathon integrity standards, every intelligence feed is explicitly categorized to demonstrate real-world deployment readiness alongside safe simulated demo fallback.
        </p>

        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {DATA_SOURCES_INFO.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{item.category}</span>
                {getTypeBadge(item.type)}
              </div>
              <div className="text-blue-900 font-semibold">{item.source}</div>
              <p className="text-slate-600 text-[11px]">{item.notes}</p>
              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-slate-200">
                <span>Telemetry Mode: <strong>{item.lastUpdated}</strong></span>
                <span>Verification Accuracy: <strong className="text-emerald-700 font-mono">{item.accuracyConfidence}</strong></span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
          >
            Close Audit View
          </button>
        </div>
      </div>
    </div>
  );
};
