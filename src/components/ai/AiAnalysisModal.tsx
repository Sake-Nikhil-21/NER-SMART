import React, { useEffect, useState } from 'react';
import { AI_SIMULATION_STEPS } from '../../data/mockData';
import { RouteQuery } from '../../types';
import { Sparkles, CheckCircle, Cpu, Loader2, ShieldCheck, Activity, Map, CloudRain, Truck } from 'lucide-react';

interface AiAnalysisModalProps {
  isOpen: boolean;
  query?: RouteQuery;
  onComplete: () => void;
  onClose?: () => void;
  fromCity?: string;
  toCity?: string;
  vehicleType?: string;
  cargoWeightTons?: number;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  query,
  onComplete,
  onClose,
  fromCity,
  toCity,
  vehicleType,
  cargoWeightTons,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPct, setProgressPct] = useState(0);

  const activeVehicle = query?.vehicleType || vehicleType || 'Heavy Truck (Multi-Axle 16-Wheeler)';
  const activeFrom = query?.from || fromCity || 'Guwahati, Assam';
  const activeTo = query?.to || toCity || 'Imphal, Manipur';
  const activeWeight = query?.cargoWeightTons ?? cargoWeightTons ?? 10;

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgressPct(0);
      return;
    }

    let isCancelled = false;
    let step = 0;

    const runStep = (idx: number) => {
      if (idx >= AI_SIMULATION_STEPS.length) {
        setTimeout(() => {
          if (!isCancelled) onComplete();
        }, 500);
        return;
      }

      setCurrentStepIndex(idx);
      const targetPct = Math.round(((idx + 1) / AI_SIMULATION_STEPS.length) * 100);
      setProgressPct(targetPct);

      const delay = AI_SIMULATION_STEPS[idx].duration || 500;
      setTimeout(() => {
        if (!isCancelled) {
          runStep(idx + 1);
        }
      }, delay);
    };

    runStep(0);

    return () => {
      isCancelled = true;
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-ai-route-analysis-progress"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>

        {/* AI Radar Core */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 shadow-xs">
              <Cpu className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 border border-blue-200">
              <Sparkles className="w-3 h-3 text-blue-600 animate-spin" />
              <span>road_navi AI INFERENCE ENGINE</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Analyzing Multi-Hazard Route Safety
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Simulating road stability for <strong className="text-slate-900">{activeVehicle}</strong> transporting <strong className="text-blue-700">{activeWeight} Tons</strong> from <span className="text-slate-800 font-semibold">{activeFrom}</span> to <span className="text-slate-800 font-semibold">{activeTo}</span>.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-500 font-semibold">AI Deep Verification</span>
              <span className="font-bold text-blue-700">{progressPct}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
              <div
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
          </div>

          {/* Steps List */}
          <div className="w-full space-y-2.5 pt-3 text-left">
            {AI_SIMULATION_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.step}
                  className={`flex items-center space-x-3 rounded-xl px-3.5 py-2.5 text-xs transition-all duration-300 ${
                    isCurrent
                      ? 'bg-blue-50 border border-blue-200 text-blue-900 shadow-2xs font-semibold'
                      : isPast
                      ? 'bg-slate-50 border border-slate-200 text-slate-700'
                      : 'opacity-40 text-slate-400 border border-transparent'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isPast ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-500">
                        {step.step}
                      </div>
                    )}
                  </div>
                  <span className="font-medium">
                    {step.text}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 italic pt-1">
            Evaluating historical slope shifts, rainfall isobars, and 70R bridge safety...
          </div>
        </div>
      </div>
    </div>
  );
};
