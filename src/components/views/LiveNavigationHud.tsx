import React, { useState, useEffect, useRef } from 'react';
import { RouteOption, RouteQuery, NavigationTab, LanguageCode } from '../../types';
import {
  MOCK_ROUTES_GUWAHATI_TO_IMPHAL,
  CITIZEN_POPULAR_ROUTES,
  DEFAULT_DEMO_QUERY
} from '../../data/mockData';
import { TRANSLATIONS } from '../../data/translations';
import {
  Navigation2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Compass,
  Radio,
  Share2,
  PhoneCall,
  Zap,
  TrendingUp,
  CloudRain,
  Eye,
  Fuel,
  Activity,
  ArrowUpRight,
  ArrowRight,
  CornerUpRight,
  CornerUpLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  Sliders,
  Sparkles,
  Mountain
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveNavigationHudProps {
  route?: RouteOption;
  query?: RouteQuery;
  language: LanguageCode;
  onNavigate: (tab: NavigationTab) => void;
  onOpenHelpline: () => void;
}

interface NavStep {
  id: number;
  instructionEn: string;
  instructionHi: string;
  instructionAs: string;
  instructionBn: string;
  distanceToNext: string;
  turnType: 'straight' | 'right' | 'left' | 'hairpin-right' | 'hairpin-left' | 'bridge' | 'destination';
  targetSpeedKmh: number;
  altitudeMeters: number;
  gradientPct: number;
  hazardNote?: string;
  hazardSeverity?: 'low' | 'warning' | 'critical';
  serviceNote?: string;
  lat: number;
  lng: number;
  locationName: string;
}

const SIMULATED_NAV_STEPS: NavStep[] = [
  {
    id: 1,
    instructionEn: 'Start from Khanapara Junction, Guwahati onto NH-27 4-Lane Highway',
    instructionHi: 'खानापारा जंक्शन, गुवाहाटी से NH-27 4-लेन हाईवे पर यात्रा शुरू करें',
    instructionAs: 'খানাপাৰা জংচন, গুৱাহাটীৰ পৰা NH-27 ৪-লেন ৰাজপথত যাত্ৰা আৰম্ভ কৰক',
    instructionBn: 'খানাপাড়া জংশন, গুয়াহাটি থেকে NH-27 ৪-লেন হাইওয়েতে যাত্রা শুরু করুন',
    distanceToNext: '18 km',
    turnType: 'straight',
    targetSpeedKmh: 65,
    altitudeMeters: 62,
    gradientPct: 0.5,
    serviceNote: '⛽ Indian Oil Petrol Pump & Food Plaza in 4.5 km',
    lat: 26.1445,
    lng: 91.7362,
    locationName: 'Guwahati Outskirts',
  },
  {
    id: 2,
    instructionEn: 'Continue straight through Jagiroad bypass. Pavement smooth and dry.',
    instructionHi: 'जागीरोड बाईपास से सीधे आगे बढ़ें। सड़क समतल और सूखी है।',
    instructionAs: 'জাগীৰোড বাইপাছেৰে পোনপটীয়াভাৱে আগবাঢ়ক। পথ মসৃণ আৰু শুকান।',
    instructionBn: 'জাগিরোড বাইপাস দিয়ে সোজা এগিয়ে যান। রাস্তা মসৃণ ও শুষ্ক।',
    distanceToNext: '42 km',
    turnType: 'straight',
    targetSpeedKmh: 70,
    altitudeMeters: 74,
    gradientPct: 1.0,
    serviceNote: '🚔 Assam Highway Patrol Post Active',
    lat: 26.1820,
    lng: 92.1500,
    locationName: 'Jagiroad Bypass',
  },
  {
    id: 3,
    instructionEn: 'Fork right at Lumding Junction towards Silchar / Haflong Expressway',
    instructionHi: 'लुमडिंग जंक्शन पर सिलचर / हाफलोंग एक्सप्रेसवे की ओर दाएं मुड़ें',
    instructionAs: 'লামডিং জংচনত শিলচৰ / হাফলং এক্সপ্ৰেছৱেৰ ফালে সোঁফালে ঘূৰক',
    instructionBn: 'লামডিং জংশনে শিলচর / হাফলং এক্সপ্রেসওয়ের দিকে ডানদিকে ঘুরুন',
    distanceToNext: '36 km',
    turnType: 'right',
    targetSpeedKmh: 50,
    altitudeMeters: 285,
    gradientPct: 3.5,
    hazardNote: '⚠️ Entering Dima Hasao Foothills — Minor fog layer ahead',
    hazardSeverity: 'warning',
    lat: 25.7500,
    lng: 93.1800,
    locationName: 'Lumding Valley Entry',
  },
  {
    id: 4,
    instructionEn: 'Ascend Dima Hasao ghat section. Reduce speed on steep mountain gradients.',
    instructionHi: 'दीमा हसाओ घाट पर चढ़ाई। पहाड़ी ढलानों पर गति धीमी रखें।',
    instructionAs: 'ডিমা হাচাও ঘাটত আৰোহণ। পাহাৰীয়া ঢালত গতি কম ৰাখক।',
    instructionBn: 'দিমা হাসাও ঘাটে চড়াই। পাহাড়ি ঢালে গতি ধীর রাখুন।',
    distanceToNext: '28 km',
    turnType: 'hairpin-left',
    targetSpeedKmh: 35,
    altitudeMeters: 690,
    gradientPct: 7.2,
    hazardNote: '🌧️ Wet tarmac from mountain mist — Braking distance increased by 30%',
    hazardSeverity: 'warning',
    lat: 25.4200,
    lng: 93.0200,
    locationName: 'Haflong Mountain Ridge',
  },
  {
    id: 5,
    instructionEn: 'Sharp hairpin turn right onto reinforced concrete retaining wall bridge',
    instructionHi: 'मजबूत कंक्रीट ब्रिज पर तीखा हेयरपिन दाहिना मोड़',
    instructionAs: 'দৃঢ় কংক্ৰিট দলঙৰ ওপৰেৰে তীব্ৰ হেয়াৰপিন সোঁ পাক লওক',
    instructionBn: 'শক্তিশালী কংক্রিট ব্রিজের ওপর তীক্ষ্ণ হেয়ারপিন ডান বাঁক নিন',
    distanceToNext: '15 km',
    turnType: 'hairpin-right',
    targetSpeedKmh: 28,
    altitudeMeters: 920,
    gradientPct: 8.8,
    hazardNote: '🚨 Geotechnical InSAR Sensor Sector: Slopes reinforced with Geo-grids',
    hazardSeverity: 'low',
    lat: 25.1800,
    lng: 92.9500,
    locationName: 'Jatinga Pass Ridge',
  },
  {
    id: 6,
    instructionEn: 'Descend carefully towards Silchar Plains. Brake temperature monitoring recommended.',
    instructionHi: 'सिलचर मैदान की ओर सावधानी से उतरें। ब्रेक तापमान की जांच करें।',
    instructionAs: 'শিলচৰ সমতললৈ সাৱধানে নামি আহক। ব্ৰেকৰ উত্তাপ লক্ষ্য ৰাখক।',
    instructionBn: 'শিলচর সমতলের দিকে সাবধানে নামুন। ব্রেকের উত্তাপ খেয়াল রাখুন।',
    distanceToNext: '32 km',
    turnType: 'left',
    targetSpeedKmh: 45,
    altitudeMeters: 210,
    gradientPct: -6.4,
    serviceNote: '⛽ HPCL Fuel Hub & Mechanic Workshop in 2.8 km',
    lat: 24.8333,
    lng: 92.7789,
    locationName: 'Silchar Corridor',
  },
  {
    id: 7,
    instructionEn: 'Cross Barak River Bridge and proceed towards Jiribam Border Checkpost',
    instructionHi: 'बराक नदी पुल पार करें और जिरीबाम सीमा चेकपोस्ट की ओर बढ़ें',
    instructionAs: 'বৰাক নদীৰ দলং পাৰ হৈ জিৰিবাম সীমান্ত চেকপʼষ্টৰ ফালে আগবাঢ়ক',
    instructionBn: 'বরাক নদীর ব্রিজ পার হয়ে জিরিবাম সীমান্ত চেকপোস্টের দিকে এগিয়ে যান',
    distanceToNext: '48 km',
    turnType: 'bridge',
    targetSpeedKmh: 55,
    altitudeMeters: 140,
    gradientPct: 1.5,
    serviceNote: '🛂 Manipur Inter-State Transit Verification Gate',
    lat: 24.8037,
    lng: 93.1278,
    locationName: 'Jiribam Border',
  },
  {
    id: 8,
    instructionEn: 'Enter NH-37 New Hill Highway. Ascend Noney Mountain Viaduct.',
    instructionHi: 'NH-37 नए हिल हाईवे में प्रवेश करें। नोने माउंटेन वायाडक्ट पर चढ़ें।',
    instructionAs: 'NH-37 নতুন পাহাৰীয়া ৰাজপথত প্ৰৱেশ কৰক। ননে পাহাৰীয়া ভায়াডাক্টত উঠক।',
    instructionBn: 'NH-37 নতুন পাহাড়ি হাইওয়েতে প্রবেশ করুন। ননে পাহাড়ি ভায়াডাক্টে উঠুন।',
    distanceToNext: '40 km',
    turnType: 'straight',
    targetSpeedKmh: 40,
    altitudeMeters: 880,
    gradientPct: 6.9,
    hazardNote: '👷 BRO Landslide Quick-Response Team on standby at KM 180',
    hazardSeverity: 'low',
    lat: 24.7892,
    lng: 93.5822,
    locationName: 'Noney Bridge Sector',
  },
  {
    id: 9,
    instructionEn: 'Navigate Tupul valley bypass. Caution: Heavy fog between 17:00 and 07:00 hrs.',
    instructionHi: 'तुपुल घाटी बाईपास से गुजरें। सावधानी: शाम 5 से सुबह 7 बजे तक भारी कोहरा।',
    instructionAs: 'তুপুল উপত্যকা বাইপাছেৰে যাওক। সাৱধান: সন্ধিয়া ৫ বজাৰ পৰা পুৱা ৭ বজালৈ ঘন কুঁৱলী।',
    instructionBn: 'তুপুল উপত্যকা বাইপাস দিয়ে যান। সাবধান: সন্ধ্যা ৫টা থেকে সকাল ৭টা পর্যন্ত ঘন কুয়াশা।',
    distanceToNext: '34 km',
    turnType: 'hairpin-left',
    targetSpeedKmh: 32,
    altitudeMeters: 1120,
    gradientPct: 5.4,
    hazardNote: '☁️ Low visibility zone (40m). Keep low-beam headlights on.',
    hazardSeverity: 'warning',
    lat: 24.8100,
    lng: 93.7400,
    locationName: 'Tupul Valley Pass',
  },
  {
    id: 10,
    instructionEn: 'Begin gentle descent into Imphal Valley via Kangchup Rd junction',
    instructionHi: 'कांगचुप रोड जंक्शन से इंफाल घाटी में सहज ढलान शुरू करें',
    instructionAs: 'কাংচুপ ৰোড জংচনেৰে ইম্ফল উপত্যকালৈ লাহে লাহে নামি যাওক',
    instructionBn: 'কাংচুপ রোড জংশন দিয়ে ইম্ফল উপত্যকায় স্বাভাবিক অবতরণ শুরু করুন',
    distanceToNext: '18 km',
    turnType: 'right',
    targetSpeedKmh: 50,
    altitudeMeters: 840,
    gradientPct: -3.2,
    serviceNote: '🏥 RIMS Imphal Hospital & Trauma Center in 12 km',
    lat: 24.8150,
    lng: 93.8900,
    locationName: 'Imphal Valley Entry',
  },
  {
    id: 11,
    instructionEn: 'Destination Reached: Imphal Logistics Hub & City Center, Manipur',
    instructionHi: 'गंतव्य पर पहुंचे: इंफाल लॉजिस्टिक्स हब और सिटी सेंटर, मणिपुर',
    instructionAs: 'গন্তব্যস্থানত উপনীত: ইম্ফল লজিষ্টিকছ হাব আৰু চিটি চেণ্টাৰ, মণিপুৰ',
    instructionBn: 'গন্তব্যে পৌঁছালেন: ইম্ফল লজিস্টিকস হাব ও সিটি সেন্টার, মণিপুর',
    distanceToNext: '0 km',
    turnType: 'destination',
    targetSpeedKmh: 0,
    altitudeMeters: 780,
    gradientPct: 0,
    serviceNote: '🏁 Safe journey completed via AI Recommended Route B',
    lat: 24.8170,
    lng: 93.9368,
    locationName: 'Imphal Central Terminal',
  },
];

export const LiveNavigationHud: React.FC<LiveNavigationHudProps> = ({
  route = MOCK_ROUTES_GUWAHATI_TO_IMPHAL[1],
  query = DEFAULT_DEMO_QUERY,
  language = 'en',
  onNavigate,
  onOpenHelpline,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hudTheme, setHudTheme] = useState<'cyber' | 'monsoon' | 'night'>('cyber');
  const [simulatedCurrentSpeed, setSimulatedCurrentSpeed] = useState(42);
  const [brakeWearTemp, setBrakeWearTemp] = useState(64);
  const [copiedSos, setCopiedSos] = useState(false);
  const [hasTriggeredArrival, setHasTriggeredArrival] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currentStep = SIMULATED_NAV_STEPS[currentStepIndex] || SIMULATED_NAV_STEPS[0];
  const nextStep = SIMULATED_NAV_STEPS[currentStepIndex + 1];

  // Speech Synthesizer Voice Function
  const speakInstruction = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'bn') utterance.lang = 'bn-IN';
      else utterance.lang = 'en-US';

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis not allowed or supported', e);
    }
  };

  const getLocalizedInstruction = (step: NavStep) => {
    switch (language) {
      case 'hi':
        return step.instructionHi;
      case 'as':
        return step.instructionAs;
      case 'bn':
        return step.instructionBn;
      default:
        return step.instructionEn;
    }
  };

  // Speak when step changes
  useEffect(() => {
    const text = getLocalizedInstruction(currentStep);
    speakInstruction(text);

    // Update simulated speed & brake temperature dynamically
    const baseSpeed = currentStep.targetSpeedKmh;
    const speedVariation = Math.floor(Math.random() * 6) - 2;
    setSimulatedCurrentSpeed(Math.max(15, baseSpeed + speedVariation));

    if (Math.abs(currentStep.gradientPct) > 5) {
      setBrakeWearTemp((prev) => Math.min(185, prev + 12));
    } else {
      setBrakeWearTemp((prev) => Math.max(55, prev - 8));
    }

    if (currentStep.turnType === 'destination' && !hasTriggeredArrival) {
      setHasTriggeredArrival(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#fbbf24'],
        });
      } catch (e) {}
    }
  }, [currentStepIndex, language]);

  // Simulation timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = (4000 / playbackSpeed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < SIMULATED_NAV_STEPS.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  const handleNextStep = () => {
    if (currentStepIndex < SIMULATED_NAV_STEPS.length - 1) {
      setCurrentStepIndex((p) => p + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((p) => p - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setHasTriggeredArrival(false);
  };

  const handleShareSos = () => {
    const sosPayload = `🚨 *ROAD_NAVI SOS MOUNTAIN RESCUE BEACON*\n*Location:* ${currentStep.locationName} (${currentStep.lat.toFixed(4)}°N, ${currentStep.lng.toFixed(4)}°E)\n*Elevation:* ${currentStep.altitudeMeters}m ASL\n*Route:* Guwahati ➔ Imphal (NH-37)\n*Vehicle Speed:* ${simulatedCurrentSpeed} km/h\n*Active Road Hazard:* ${currentStep.hazardNote || 'None reported'}\n\nPlease dispatch assistance or contact BRO/112 Highway Rescue immediately.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(sosPayload);
      setCopiedSos(true);
      setTimeout(() => setCopiedSos(false), 3000);
    }

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(sosPayload)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const getTurnIcon = (turnType: NavStep['turnType']) => {
    switch (turnType) {
      case 'right':
        return <CornerUpRight className="w-10 h-10 text-cyan-400 stroke-[2.5]" />;
      case 'left':
        return <CornerUpLeft className="w-10 h-10 text-cyan-400 stroke-[2.5]" />;
      case 'hairpin-right':
        return <CornerUpRight className="w-10 h-10 text-amber-400 stroke-[3] animate-pulse" />;
      case 'hairpin-left':
        return <CornerUpLeft className="w-10 h-10 text-amber-400 stroke-[3] animate-pulse" />;
      case 'bridge':
        return <TrendingUp className="w-10 h-10 text-emerald-400 stroke-[2.5]" />;
      case 'destination':
        return <CheckCircle2 className="w-10 h-10 text-emerald-400 stroke-[2.5]" />;
      default:
        return <ArrowUpRight className="w-10 h-10 text-cyan-400 stroke-[2.5]" />;
    }
  };

  const completedPct = Math.round(((currentStepIndex + 1) / SIMULATED_NAV_STEPS.length) * 100);

  return (
    <div id="live-navigation-hud" className="space-y-6 pb-20">
      {/* Top Cockpit Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center space-x-3.5">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600/30 via-slate-900 to-emerald-600/30 border border-cyan-500/50 shadow-lg shadow-cyan-950/70">
            <Compass className="h-6 w-6 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-brand tracking-tight flex items-center space-x-1.5">
                <span className="tracking-wider">ROAD</span>
                <span className="text-cyan-400 font-tech font-black px-0.5">_</span>
                <span className="tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">NAVI</span>
                <span className="text-white font-bold ml-1">Live Cockpit</span>
              </h1>
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-tech font-bold uppercase tracking-wider">
                <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                <span>GPS Live Telemetry</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
              <span>{query.from || 'Guwahati'} ➔ {query.to || 'Imphal'}</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-mono">NH-37 Mountain Corridor</span>
            </p>
          </div>
        </div>

        {/* Global Action & Audio Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Mute / Voice Synthesizer Toggle */}
          <button
            id="btn-nav-audio-toggle"
            onClick={() => {
              setIsMuted(!isMuted);
              if (isMuted) speakInstruction(getLocalizedInstruction(currentStep));
            }}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
              isMuted
                ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30 shadow-lg shadow-cyan-950/40'
            }`}
            title="Toggle Spoken Voice Guidance"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />}
            <span>{isMuted ? 'Voice Muted' : 'Spoken Voice On'}</span>
          </button>

          {/* Test Speech Voice Button */}
          <button
            onClick={() => speakInstruction(getLocalizedInstruction(currentStep))}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            title="Test current voice announcement"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Replay Voice</span>
          </button>

          {/* Emergency Helpline Trigger */}
          <button
            onClick={onOpenHelpline}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-bold border border-red-500/40 transition shadow-lg shadow-red-950/50"
          >
            <PhoneCall className="w-3.5 h-3.5 text-red-400 animate-bounce" />
            <span>SOS 112 / 108</span>
          </button>

          {/* Return to Planner */}
          <button
            onClick={() => onNavigate('smart-routes')}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            <span>Exit HUD</span>
          </button>
        </div>
      </div>

      {/* Main Cockpit HUD Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Turn-by-Turn GPS Driving Card & Primary Direction (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Heads-Up Display Direction Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-950/80">
            {/* Top HUD Status Ribbon */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-tech font-bold text-slate-300 tracking-wider">
                  WAYPOINT {currentStep.id} OF {SIMULATED_NAV_STEPS.length}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  {currentStep.locationName}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-400">
                  {completedPct}% Completed
                </span>
              </div>
            </div>

            {/* Turn Icon & Primary Instruction */}
            <div className="flex items-start space-x-5 sm:space-x-6">
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl bg-cyan-950/90 border-2 border-cyan-400/60 shadow-xl shadow-cyan-950/90">
                {getTurnIcon(currentStep.turnType)}
              </div>

              <div className="space-y-2 flex-1">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                  <span>IN {currentStep.distanceToNext}</span>
                </div>

                <h2 className="text-lg sm:text-2xl font-black text-white leading-snug font-brand">
                  {getLocalizedInstruction(currentStep)}
                </h2>

                {language !== 'en' && (
                  <p className="text-xs text-slate-400 italic">
                    {currentStep.instructionEn}
                  </p>
                )}
              </div>
            </div>

            {/* Next Upcoming Instruction Sneak-Peek */}
            {nextStep && (
              <div className="mt-6 pt-4 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2 truncate">
                  <span className="font-tech text-slate-500 uppercase">Then:</span>
                  <span className="text-slate-300 truncate">{getLocalizedInstruction(nextStep)}</span>
                </div>
                <div className="font-mono text-cyan-400 shrink-0 font-bold">
                  {nextStep.distanceToNext}
                </div>
              </div>
            )}

            {/* Real-time Hazard Alert Banner in HUD */}
            {currentStep.hazardNote && (
              <div className={`mt-4 p-3.5 rounded-xl border flex items-center space-x-3 text-xs font-bold ${
                currentStep.hazardSeverity === 'critical'
                  ? 'bg-red-950/90 border-red-500 text-red-200'
                  : 'bg-amber-950/80 border-amber-500/60 text-amber-200'
              }`}>
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 animate-bounce" />
                <div className="flex-1">
                  <span>{currentStep.hazardNote}</span>
                </div>
              </div>
            )}

            {/* Nearby Mountain Services & Fuel Note */}
            {currentStep.serviceNote && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center space-x-2 text-xs text-slate-300 font-medium">
                <span>{currentStep.serviceNote}</span>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mt-6 space-y-1.5">
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500 shadow-md shadow-cyan-500/50"
                  style={{ width: `${completedPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Simulation Transport Controls */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-brand">Simulation Playback & Waypoint Step</h3>
              </div>

              {/* Speed Multiplier */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {([1, 2, 4] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition ${
                      playbackSpeed === s
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="flex items-center justify-center space-x-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold border border-slate-700 transition"
              >
                <span>◀ Previous</span>
              </button>

              <button
                id="btn-play-pause-sim"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-black transition shadow-lg ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/50'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950/50'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
                <span>{isPlaying ? 'Pause Sim' : 'Auto Drive'}</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === SIMULATED_NAV_STEPS.length - 1}
                className="flex items-center justify-center space-x-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold border border-slate-700 transition"
              >
                <span>Next ▶</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center justify-center space-x-1 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-bold border border-slate-700 transition"
                title="Reset simulation to beginning"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Mountain Telemetry, Gauges, Altitude & SOS Beacon (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Real-time Telemetry & Mountain Gauge Matrix */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-brand">Mountain Terrain Telemetry</h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                SENSOR FUSION ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Altitude ASL */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="flex items-center space-x-1">
                    <Mountain className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Altitude ASL</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">GPS Baro</span>
                </div>
                <div className="text-xl sm:text-2xl font-black font-tech text-white">
                  {currentStep.altitudeMeters} <span className="text-xs font-normal text-slate-400">meters</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  {currentStep.altitudeMeters > 800 ? 'High Altitude Mountain Zone' : 'Valley Foothill Sector'}
                </div>
              </div>

              {/* Slope Incline Gradient */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="flex items-center space-x-1">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    <span>Incline Gradient</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">Axle Tilt</span>
                </div>
                <div className={`text-xl sm:text-2xl font-black font-tech ${
                  Math.abs(currentStep.gradientPct) > 6 ? 'text-amber-300' : 'text-emerald-300'
                }`}>
                  {currentStep.gradientPct > 0 ? `+${currentStep.gradientPct}%` : `${currentStep.gradientPct}%`}
                </div>
                <div className="text-[10px] text-slate-500">
                  {currentStep.gradientPct > 6 ? 'Steep Climb — Low Gear' : currentStep.gradientPct < -5 ? 'Steep Descent — Engine Braking' : 'Normal Gradient'}
                </div>
              </div>

              {/* Vehicle Speed vs Mountain Limit */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Current Speed</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Radar</span>
                </div>
                <div className="text-xl sm:text-2xl font-black font-tech text-cyan-300">
                  {simulatedCurrentSpeed} <span className="text-xs font-normal text-slate-400">km/h</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Safe Advisory: <span className="font-mono text-emerald-400 font-bold">{currentStep.targetSpeedKmh} km/h</span>
                </div>
              </div>

              {/* Brake Drum Temperature / Wear Indicator */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="flex items-center space-x-1">
                    <Activity className="w-3.5 h-3.5 text-rose-400" />
                    <span>Brake Temp</span>
                  </span>
                  <span className="text-[10px] text-rose-400 font-mono">Thermal</span>
                </div>
                <div className={`text-xl sm:text-2xl font-black font-tech ${
                  brakeWearTemp > 120 ? 'text-rose-400' : 'text-slate-200'
                }`}>
                  {brakeWearTemp}°C
                </div>
                <div className="text-[10px] text-slate-500">
                  {brakeWearTemp > 120 ? 'Hot — Rest in Layby' : 'Optimal Thermal Zone'}
                </div>
              </div>
            </div>

            {/* GPS Precise Coordinates Display */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>LAT: {currentStep.lat.toFixed(4)}° N, LNG: {currentStep.lng.toFixed(4)}° E</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">3D Fix OK</span>
            </div>
          </div>

          {/* Emergency SOS Beacon & Mountain Rescue Dispatcher */}
          <div className="bg-gradient-to-b from-red-950/60 via-slate-900 to-slate-950 border-2 border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-red-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white font-brand">Emergency Location Beacon</h3>
              </div>
              <span className="text-[10px] font-bold text-red-300 bg-red-900/60 px-2 py-0.5 rounded border border-red-500/40 uppercase">
                1-Tap Hill Dispatch
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              If stranded in a landslide, vehicle breakdown, or medical emergency, instantly broadcast your exact mountain coordinates to family & NDRF.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                id="btn-share-sos-whatsapp"
                onClick={handleShareSos}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg transition active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedSos ? 'Coordinates Copied!' : 'Share SOS via WhatsApp / SMS'}</span>
              </button>

              <button
                onClick={onOpenHelpline}
                className="flex items-center justify-center space-x-1.5 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-950/60 transition active:scale-95"
              >
                <span>Call 112 / 108</span>
              </button>
            </div>
          </div>

          {/* Waypoint Fast-Jump Quick List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-300 font-brand flex items-center justify-between">
              <span>All Corridor Waypoints</span>
              <span className="text-[10px] text-slate-500 font-normal">Click to jump HUD</span>
            </h4>

            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {SIMULATED_NAV_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                    idx === currentStepIndex
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="font-mono text-[10px] text-slate-500 w-4">{step.id}</span>
                    <span className="truncate">{step.locationName}</span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 text-[10px] font-mono">
                    <span className="text-slate-500">{step.altitudeMeters}m</span>
                    {idx === currentStepIndex && (
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
