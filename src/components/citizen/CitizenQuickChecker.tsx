import React, { useState, useEffect } from 'react';
import { CitizenPopularRoute, CitizenVehicleType, LanguageCode, NavigationTab } from '../../types';
import { CITIZEN_POPULAR_ROUTES } from '../../data/mockData';
import { TRANSLATIONS } from '../../data/translations';
import { speakText, stopSpeaking } from '../../utils/speech';
import {
  Car,
  Bike,
  Bus,
  Truck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Fuel,
  Share2,
  Printer,
  Compass,
  ArrowRight,
  PhoneCall,
  Sparkles,
  Info,
  ChevronRight,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Image as ImageIcon
} from 'lucide-react';

interface CitizenQuickCheckerProps {
  language: LanguageCode;
  onNavigate: (tab: NavigationTab) => void;
  onOpenHelplineModal: () => void;
  onSelectRouteForProMode?: (from: string, to: string, vehicle: string) => void;
  onAddToast: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export const CitizenQuickChecker: React.FC<CitizenQuickCheckerProps> = ({
  language,
  onNavigate,
  onOpenHelplineModal,
  onSelectRouteForProMode,
  onAddToast,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [selectedVehicle, setSelectedVehicle] = useState<CitizenVehicleType>('car');
  const [selectedRoute, setSelectedRoute] = useState<CitizenPopularRoute>(CITIZEN_POPULAR_ROUTES[0]);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speakText(text, language, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const getRouteSpokenText = (route: CitizenPopularRoute) => {
    if (language === 'hi') return route.voiceHindi || route.plainAdvice;
    if (language === 'as') return route.voiceAssamese || route.voiceHindi || route.plainAdvice;
    if (language === 'bn') return route.voiceBengali || route.voiceHindi || route.plainAdvice;
    return route.voiceEnglish || route.plainAdvice;
  };

  const vehicleOptions: { id: CitizenVehicleType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'car', label: t.car, icon: Car },
    { id: 'bike', label: t.bike, icon: Bike },
    { id: 'bus', label: t.bus, icon: Bus },
    { id: 'truck', label: t.truck, icon: Truck },
  ];

  const handleSelectPopularRoute = (route: CitizenPopularRoute) => {
    setSelectedRoute(route);
  };

  const getTravelTime = () => {
    if (selectedVehicle === 'bus' || selectedVehicle === 'truck') {
      return selectedRoute.driveTimeBus;
    }
    if (selectedVehicle === 'bike') {
      return selectedRoute.driveTimeCar; // approximate
    }
    return selectedRoute.driveTimeCar;
  };

  const handleShareWhatsApp = () => {
    const text = `🚗 *road_navi Mountain Road Travel Update*\n*Route:* ${selectedRoute.from} ➔ ${selectedRoute.to}\n*Status:* ${selectedRoute.statusLabel} (${selectedRoute.status.toUpperCase()})\n*Travel Time:* ~${getTravelTime()}\n*Highway:* ${selectedRoute.highway}\n*Weather:* ${selectedRoute.weatherSummary}\n*Advice:* ${selectedRoute.plainAdvice}\n\nChecked live on road_navi North East Mountain Navigation Portal.`;
    
    // Copy to clipboard and open WhatsApp web if supported
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
      onAddToast('Copied Travel Summary', 'Route advisory text copied! Ready to share with family or WhatsApp.', 'success');
    }

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <section id="citizen-quick-checker" className="space-y-6">
      {/* Friendly Citizen Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/60 border border-emerald-200 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>{t.citizenMode} • Public Road Safety Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {t.checkRoadTitle}
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              {t.checkRoadSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-switch-to-picture-mode"
              onClick={() => onNavigate('picture-mode')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
            >
              <ImageIcon className="w-4 h-4 text-white" />
              <span>{t.pictureMode}</span>
            </button>

            <button
              onClick={onOpenHelplineModal}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Emergency 1033 / 112</span>
            </button>
            
            <button
              onClick={() => onNavigate('smart-routes')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 shadow-sm transition"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Full Route Planner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 1: Vehicle Selector (Large & Touch-Friendly) */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Step 1: {t.vehicleLabel}
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {vehicleOptions.map((v) => {
            const Icon = v.icon;
            const isSelected = selectedVehicle === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVehicle(v.id)}
                className={`flex items-center space-x-3 p-3.5 rounded-xl border transition-all text-left shadow-sm ${
                  isSelected
                    ? 'bg-blue-50 border-blue-500 text-slate-900 ring-2 ring-blue-300'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{v.label}</div>
                  <div className="text-[10px] text-slate-500">
                    {v.id === 'car' ? 'Family & Taxi' : v.id === 'bike' ? 'Two Wheeler' : v.id === 'bus' ? 'Shared Transit' : 'Local Freight'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Popular Everyday Routes (1-Tap Selection) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Step 2: {t.popularRoutes}
          </label>
          <span className="text-[11px] text-slate-500">Click any route for live status</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {CITIZEN_POPULAR_ROUTES.map((route) => {
            const isSelected = selectedRoute.id === route.id;
            const isSafe = route.status === 'safe';
            const isCaution = route.status === 'caution';
            const isDanger = route.status === 'danger';

            return (
              <div
                key={route.id}
                onClick={() => handleSelectPopularRoute(route)}
                className={`group cursor-pointer rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col shadow-sm ${
                  isSelected
                    ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-400'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Photo Thumbnail */}
                <div className="relative h-24 w-full overflow-hidden bg-slate-100">
                  <img
                    src={route.imageUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'}
                    alt={route.to}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  {/* Status Pill on Photo */}
                  <span className={`absolute top-2 left-2 inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md ${
                    isSafe
                      ? 'bg-emerald-600 text-white'
                      : isCaution
                      ? 'bg-amber-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}>
                    {isSafe && <CheckCircle2 className="w-3 h-3" />}
                    {isCaution && <AlertTriangle className="w-3 h-3" />}
                    {isDanger && <XCircle className="w-3 h-3" />}
                    <span>{route.statusLabel}</span>
                  </span>

                  {/* Voice Button on Photo */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(getRouteSpokenText(route));
                    }}
                    className="absolute top-2 right-2 rounded-full bg-white/90 p-1 text-slate-700 hover:text-blue-600 shadow-sm transition hover:bg-white"
                    title="Listen"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-1 right-2 text-[10px] font-mono font-bold text-white bg-slate-900/80 px-1.5 py-0.5 rounded">
                    {route.distanceKm} km
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                  <div className="font-bold text-xs text-slate-900 flex items-center space-x-1.5 truncate">
                    <span>{route.from.split(',')[0]}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="text-blue-700">{route.to.split(',')[0]}</span>
                  </div>

                  <div className="text-[10px] text-slate-500 truncate">
                    {route.highway}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 3: Big Clear Road Advisory Result Card */}
      {selectedRoute && (
        <div className="rounded-2xl border bg-white p-5 sm:p-7 border-slate-200 space-y-6 shadow-sm">
          {/* Header Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-semibold text-slate-500">Selected Trip:</span>
                <span className="text-base font-bold text-slate-900">
                  {selectedRoute.from} ➔ {selectedRoute.to}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {selectedRoute.highway} • {selectedRoute.distanceKm} km
              </p>
            </div>

            {/* Huge Unambiguous Status Pill */}
            <div>
              {selectedRoute.status === 'safe' && (
                <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-black tracking-wide uppercase">{t.safeToGo}</div>
                    <div className="text-[10px] text-emerald-700 font-medium">Safe for all standard vehicles</div>
                  </div>
                </div>
              )}

              {selectedRoute.status === 'caution' && (
                <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 shadow-sm">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <div className="text-xs font-black tracking-wide uppercase">{t.driveCarefully}</div>
                    <div className="text-[10px] text-amber-700 font-medium">Drive with caution • Rain / Mist</div>
                  </div>
                </div>
              )}

              {selectedRoute.status === 'danger' && (
                <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-800 border border-rose-300 shadow-sm">
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  <div>
                    <div className="text-xs font-black tracking-wide uppercase">{t.avoidRoad}</div>
                    <div className="text-[10px] text-rose-700 font-medium">Landslide / Blockage Reported</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Visual Route Photos: Landmark & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
              <img
                src={selectedRoute.imageUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'}
                alt={selectedRoute.to}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg font-bold border border-slate-700">
                  🏙️ {selectedRoute.to}
                </span>
                <span className="text-[11px] text-slate-200 bg-slate-900/70 px-2 py-0.5 rounded">
                  {language === 'hi' ? 'गंतव्य' : 'Destination'}
                </span>
              </div>
            </div>

            <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
              <img
                src={selectedRoute.conditionImageUrl || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'}
                alt="Road Condition"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className={`px-2.5 py-1 rounded-lg font-bold ${
                  selectedRoute.status === 'safe'
                    ? 'bg-emerald-600 text-white'
                    : selectedRoute.status === 'caution'
                    ? 'bg-amber-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}>
                  📸 {selectedRoute.status === 'safe' ? (language === 'hi' ? 'खुला रास्ता' : 'Clear Road') : selectedRoute.status === 'caution' ? (language === 'hi' ? 'बारिश/धुंध' : 'Wet/Foggy') : (language === 'hi' ? 'रुकावट' : 'Blockage')}
                </span>
                <span className="text-[11px] text-slate-200 bg-slate-900/70 px-2 py-0.5 rounded">
                  {language === 'hi' ? 'वर्तमान स्थिति' : 'Live Camera'}
                </span>
              </div>
            </div>
          </div>

          {/* Audio Broadcast Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{t.speakRoadStatus}</span>
                  <span className="text-[10px] text-blue-700 font-semibold">({language === 'hi' ? 'आवाज़ में सुनें' : 'Audio Readout'})</span>
                </div>
                <div className="text-[11px] text-slate-600 line-clamp-1">
                  {getRouteSpokenText(selectedRoute)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => handleSpeak(getRouteSpokenText(selectedRoute))}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 shadow-sm ${
                  isSpeaking
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>{language === 'hi' ? 'आवाज़ बंद' : 'Stop'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{language === 'hi' ? '🔊 बोलकर सुनें' : language === 'as' ? '🔊 শুনক' : '🔊 Listen Out Loud'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onNavigate('picture-mode')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{t.pictureMode}</span>
              </button>
            </div>
          </div>

          {/* Key Simple Metrics in Big Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Estimated Time</span>
              </span>
              <div className="text-lg font-black text-slate-900 font-mono">
                {getTravelTime()}
              </div>
              <span className="text-[10px] text-slate-500">
                By {selectedVehicle === 'car' ? 'Car/Taxi' : selectedVehicle === 'bike' ? 'Two-Wheeler' : selectedVehicle === 'bus' ? 'Bus/Sumo' : 'Truck'}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Landslide Risk</span>
              </span>
              <div className={`text-lg font-black font-mono ${
                selectedRoute.landslideRisk === 'None' ? 'text-emerald-700' : selectedRoute.landslideRisk === 'Low' ? 'text-blue-700' : selectedRoute.landslideRisk === 'Moderate' ? 'text-amber-700' : 'text-rose-700'
              }`}>
                {selectedRoute.landslideRisk}
              </div>
              <span className="text-[10px] text-slate-500">Live slope radar check</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                <Fuel className="w-3.5 h-3.5 text-amber-600" />
                <span>Fuel & Services</span>
              </span>
              <div className="text-lg font-bold text-slate-900">
                {selectedRoute.petrolPumpsOpen ? 'Open & Ready' : 'Limited Fuel'}
              </div>
              <span className="text-[10px] text-slate-500">Dhabas & repairs open</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Weather</span>
              </span>
              <div className="text-xs font-bold text-slate-800 line-clamp-1">
                {selectedRoute.weatherSummary.split('•')[0]}
              </div>
              <span className="text-[10px] text-slate-500">Live IMD satellite</span>
            </div>
          </div>

          {/* Plain Everyday Advice Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-blue-800 text-xs font-bold">
              <Info className="w-4 h-4 text-blue-600" />
              <span>{t.simpleAdvice}:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {selectedRoute.plainAdvice}
            </p>
            
            <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2">
              {selectedRoute.tips.map((tip, idx) => (
                <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 shadow-xs">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{tip}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Actions: Share with Family on WhatsApp, Call Helpline, Pro Mode Bridge */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedShare ? 'Copied to Clipboard!' : t.shareWhatsApp}</span>
              </button>

              <button
                onClick={handlePrintCard}
                className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>{t.printAdvisory}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenHelplineModal}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                <span>Highway Help (1033)</span>
              </button>

              <button
                onClick={() => {
                  if (onSelectRouteForProMode) {
                    onSelectRouteForProMode(selectedRoute.from, selectedRoute.to, selectedVehicle);
                  }
                  onNavigate('smart-routes');
                }}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition"
              >
                <span>View Full GIS Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
