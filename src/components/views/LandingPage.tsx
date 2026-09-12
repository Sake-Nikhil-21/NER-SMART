import React, { useState, useEffect } from 'react';
import {
  NavigationTab,
  UserExperienceMode,
  LanguageCode,
  RouteOption,
  RouteQuery,
  LiveAlert,
  EmergencyAsset,
} from '../../types';
import { CitizenQuickChecker } from '../citizen/CitizenQuickChecker';
import { NerLeafletMap } from '../map/NerLeafletMap';
import { NerLocationSelect } from '../common/NerLocationSelect';
import { TRANSLATIONS } from '../../data/translations';
import {
  MOCK_ROUTES_GUWAHATI_TO_IMPHAL,
  DEFAULT_DEMO_QUERY,
  LIVE_ALERTS_DATA,
  EMERGENCY_ASSETS,
  NER_STATES,
} from '../../data/mockData';
import {
  Route,
  ShieldAlert,
  ShieldCheck,
  Truck,
  MapPin,
  Bot,
  BellRing,
  ArrowRight,
  Sparkles,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Layers,
  CloudRain,
  Radio,
  BarChart3,
  Zap,
  Users,
  PhoneCall,
  Info,
  Navigation2,
  Crosshair,
  Search,
  Wifi,
  WifiOff,
  Clock,
  Car,
  AlertOctagon,
  FileDown,
  RefreshCw,
  Eye,
  Check,
  Building2,
  Phone,
  Droplets,
  Mountain,
  Volume2,
  HelpCircle,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: NavigationTab) => void;
  onStartDemoWorkflow: () => void;
  userMode: UserExperienceMode;
  onToggleUserMode: (mode: UserExperienceMode) => void;
  language: LanguageCode;
  onOpenHelplines: () => void;
  onOpenVoice?: () => void;
  onSelectRouteForProMode?: (from: string, to: string, vehicle: string) => void;
  onAddToast: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  isEmergencyMode?: boolean;
  onToggleEmergencyMode?: () => void;
  currentQuery?: RouteQuery;
  onUpdateQuery?: (query: RouteQuery) => void;
  selectedRoute?: RouteOption;
  onSelectRoute?: (route: RouteOption) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onStartDemoWorkflow,
  userMode,
  onToggleUserMode,
  language,
  onOpenHelplines,
  onOpenVoice,
  onSelectRouteForProMode,
  onAddToast,
  isEmergencyMode = false,
  onToggleEmergencyMode,
  currentQuery,
  onUpdateQuery,
  selectedRoute,
  onSelectRoute,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Search & Routing State
  const [startLocation, setStartLocation] = useState<string>(
    currentQuery?.from || 'Guwahati, Assam'
  );
  const [destination, setDestination] = useState<string>(
    currentQuery?.to || 'Imphal, Manipur'
  );
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [activeRouteId, setActiveRouteId] = useState<string>(
    selectedRoute?.id || 'route-b-recommended'
  );
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [routesCalculated, setRoutesCalculated] = useState<boolean>(true);
  const [showHighRiskWarning, setShowHighRiskWarning] = useState<boolean>(false);
  const [showWhyThisRoute, setShowWhyThisRoute] = useState<boolean>(false);
  const [showEmergencyDetails, setShowEmergencyDetails] = useState<boolean>(false);

  // Sync with external query changes (e.g., demo click, voice command)
  useEffect(() => {
    if (currentQuery?.from) {
      setStartLocation(currentQuery.from);
    }
    if (currentQuery?.to) {
      setDestination(currentQuery.to);
    }
  }, [currentQuery?.from, currentQuery?.to]);

  // Connectivity State: 'online' | 'limited' | 'offline'
  const [connectivityStatus, setConnectivityStatus] = useState<
    'online' | 'limited' | 'offline'
  >('online');

  // Logistics Options State
  const [isLogisticsMode, setIsLogisticsMode] = useState<boolean>(
    userMode === 'pro'
  );
  const [vehicleType, setVehicleType] = useState<string>(
    currentQuery?.vehicleType || 'Heavy Truck (Multi-Axle 16-Wheeler)'
  );
  const [deliveryPriority, setDeliveryPriority] = useState<
    'Normal' | 'High' | 'Emergency Medical'
  >(currentQuery?.priority || 'High');
  const [cargoWeight, setCargoWeight] = useState<number>(
    currentQuery?.cargoWeightTons || 10
  );

  // Map Layer Controls
  const [mapLayers, setMapLayers] = useState({
    routes: true,
    hubs: true,
    alerts: true,
    weather: true,
    emergency: isEmergencyMode,
  });

  // Keep emergency layer in sync with emergency mode
  useEffect(() => {
    setMapLayers((prev) => ({ ...prev, emergency: isEmergencyMode }));
  }, [isEmergencyMode]);

  // Derive active route
  const routes = MOCK_ROUTES_GUWAHATI_TO_IMPHAL;
  const activeRoute =
    routes.find((r) => r.id === activeRouteId) || routes[1];

  // Location suggestions for NER
  const suggestions = [
    'Guwahati, Assam',
    'Shillong, Meghalaya',
    'Imphal, Manipur',
    'Kohima, Nagaland',
    'Aizawl, Mizoram',
    'Agartala, Tripura',
    'Dimapur, Nagaland',
    'Silchar, Assam',
    'Itanagar, Arunachal Pradesh',
    'Gangtok, Sikkim',
    'RIMS Hospital, Imphal',
    'Gauhati Medical College, Guwahati',
    'LGBI Airport, Guwahati',
    'Tulihal Airport, Imphal',
  ];

  // Geolocation Handler
  const handleUseMyLocation = () => {
    setIsLocating(true);
    onAddToast(
      'Acquiring Location...',
      'Requesting GPS coordinates from your device.',
      'info'
    );

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          const locName = `Guwahati Transit Node (${lat}°N, ${lng}°E)`;
          setStartLocation(locName);
          setIsLocating(false);
          onAddToast(
            'GPS Location Locked',
            `Accurately centered at ${locName}.`,
            'success'
          );
        },
        (error) => {
          // Graceful fallback if permission denied or sandboxed
          const fallback = 'Guwahati Airport (LGBI), Assam';
          setStartLocation(fallback);
          setIsLocating(false);
          onAddToast(
            'Location Set (Guwahati Hub)',
            'Using regional gateway node: ' + fallback,
            'info'
          );
        },
        { timeout: 8000 }
      );
    } else {
      setStartLocation('Guwahati, Assam');
      setIsLocating(false);
      onAddToast('Location Set', 'Using Guwahati, Assam regional hub.', 'info');
    }
  };

  // Find Safe Route Trigger
  const handleFindSafeRoute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsCalculating(true);

    const updatedQuery: RouteQuery = {
      from: startLocation,
      to: destination,
      vehicleType,
      cargoWeightTons: cargoWeight,
      cargoType: 'Essential Goods & Passengers',
      priority: isEmergencyMode ? 'Emergency Medical' : deliveryPriority,
      departureTime: 'Immediate (Live)',
    };

    if (onUpdateQuery) {
      onUpdateQuery(updatedQuery);
    }

    setTimeout(() => {
      setIsCalculating(false);
      setRoutesCalculated(true);
      setActiveRouteId('route-b-recommended');
      if (onSelectRoute) {
        onSelectRoute(routes[1]);
      }
      onAddToast(
        'AI Route Intelligence Ready',
        'Analyzed terrain, precipitation, and flood hazards. Route B (NH-37 Jiribam) recommended for safety.',
        'success'
      );

      // Smooth scroll to route comparison section
      const target = document.getElementById('route-options-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  };

  // Route Selection Handler
  const handleSelectRouteCard = (route: RouteOption) => {
    setActiveRouteId(route.id);
    if (onSelectRoute) {
      onSelectRoute(route);
    }

    if (route.code === 'ROUTE_A') {
      setShowHighRiskWarning(true);
      onAddToast(
        '⚠️ High-Risk Route Selected',
        'Route A has active landslide alerts and 78mm heavy rain forecast.',
        'warning'
      );
    } else {
      setShowHighRiskWarning(false);
      onAddToast(
        'Route Updated',
        `${route.title} selected (${route.statusText}).`,
        'info'
      );
    }
  };

  // Switch to safer alternative
  const handleSwitchToSaferAlternative = () => {
    setActiveRouteId('route-b-recommended');
    setShowHighRiskWarning(false);
    if (onSelectRoute) {
      onSelectRoute(routes[1]);
    }
    onAddToast(
      'Switched to Safest Route',
      'Route B (NH-37 Jiribam) selected with 92/100 safety score and reinforced retaining walls.',
      'success'
    );
  };

  // Cached Offline Packs
  const cachedPacks = [
    {
      id: 'pack-nh37',
      name: 'NH-37 Jiribam-Silchar Valley Corridor',
      size: '14.2 MB',
      updated: 'Cached 2h ago',
      status: 'Ready Offline',
      color: 'emerald',
    },
    {
      id: 'pack-nh2',
      name: 'NH-2 Kohima-Senapati Mountain Ridge',
      size: '9.8 MB',
      updated: 'Cached 4h ago',
      status: 'Ready Offline',
      color: 'amber',
    },
    {
      id: 'pack-gs',
      name: 'Guwahati-Shillong (NH-106) Expressway',
      size: '11.5 MB',
      updated: 'Cached Yesterday',
      status: 'Ready Offline',
      color: 'blue',
    },
  ];

  // Feature Cards for Navigation
  const featureCards = [
    {
      id: 'feature-smart-routing',
      title: 'Smart Routing Engine',
      desc: 'Multi-criteria corridor optimization balancing gradient physics, bridge capacities, and slope slip risks.',
      icon: Route,
      tab: 'smart-routes' as NavigationTab,
    },
    {
      id: 'feature-risk-prediction',
      title: 'Landslide & Flood AI',
      desc: 'Probabilistic geospatial machine learning predicting monsoon soil saturation and roadwash risks.',
      icon: ShieldAlert,
      tab: 'risk-intelligence' as NavigationTab,
    },
    {
      id: 'feature-logistics-optimization',
      title: 'Logistics Pro Planner',
      desc: 'Multi-stop delivery sequences, fuel consumption calculations, and multi-axle freight clearance.',
      icon: Truck,
      tab: 'logistics-planner' as NavigationTab,
    },
    {
      id: 'feature-accessibility-intelligence',
      title: 'Accessibility Index',
      desc: 'Real-time accessibility scores across all 8 North Eastern states with 7-day predictive horizons.',
      icon: MapPin,
      tab: 'accessibility' as NavigationTab,
    },
    {
      id: 'feature-ai-assistant',
      title: 'AI Mobility Assistant',
      desc: 'Ask conversational questions in English, Hindi, Assamese, or Bengali regarding highway clearances.',
      icon: Bot,
      tab: 'ai-assistant' as NavigationTab,
    },
    {
      id: 'feature-real-time-alerts',
      title: 'Live Telemetry Radar',
      desc: 'Live verified alerts from Border Roads Organisation (BRO), SDMA, traffic police, and weather stations.',
      icon: BellRing,
      tab: 'live-alerts' as NavigationTab,
    },
  ];

  return (
    <div id="landing-page" className="space-y-8 pb-16">
      {/* 1. TOP SYSTEM & CONNECTIVITY CONTROL BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 text-xs shadow-sm">
        {/* Left: NER Regional Focus & Connectivity Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 font-bold">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>NORTH EASTERN REGION (NER)</span>
            <span className="text-blue-400">•</span>
            <span className="font-mono text-blue-700">8 States Active</span>
          </div>

          {/* Connectivity Status Selector (Section 11) */}
          <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                setConnectivityStatus('online');
                onAddToast('Online Mode', 'Connected to real-time satellite telemetry and GIS feeds.', 'success');
              }}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-bold transition ${
                connectivityStatus === 'online'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Full real-time online satellite GIS feed"
            >
              <Wifi className="w-3 h-3" />
              <span>📡 Online</span>
            </button>
            <button
              onClick={() => {
                setConnectivityStatus('limited');
                onAddToast('Limited Connectivity Mode', 'Degraded 2G/EDGE network simulation. Low-bandwidth vector mode enabled.', 'warning');
              }}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-bold transition ${
                connectivityStatus === 'limited'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Simulates intermittent mountain valley connectivity"
            >
              <span>📡 Limited</span>
            </button>
            <button
              onClick={() => {
                setConnectivityStatus('offline');
                onAddToast('Offline Mode Active', 'Operating 100% on locally cached topographical vector packs. No data used.', 'info');
              }}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-bold transition ${
                connectivityStatus === 'offline'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Use cached offline route packs for remote areas"
            >
              <WifiOff className="w-3 h-3" />
              <span>📴 Offline</span>
            </button>
          </div>
        </div>

        {/* Right: Quick Action Modes */}
        <div className="flex items-center gap-2">
          {/* Emergency Mode Toggle (Section 10) */}
          {onToggleEmergencyMode && (
            <button
              id="btn-home-emergency-toggle"
              onClick={onToggleEmergencyMode}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                isEmergencyMode
                  ? 'bg-red-600 text-white border-red-700 animate-pulse shadow-sm'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
              title="Prioritize disaster rescue corridors, hospitals, and NDRF access"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>{isEmergencyMode ? 'EMERGENCY MODE ACTIVE' : 'Emergency Mode'}</span>
            </button>
          )}

          {/* Picture Guide Button */}
          <button
            onClick={() => onNavigate('picture-mode')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold transition"
            title="Simplified visual guide with voice audio for all citizens"
          >
            <span>🖼️ {t.pictureMode}</span>
          </button>

          {/* Citizen / Logistics Mode Toggle */}
          <button
            onClick={() => {
              const nextMode = userMode === 'citizen' ? 'pro' : 'citizen';
              onToggleUserMode(nextMode);
              setIsLogisticsMode(nextMode === 'pro');
            }}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 font-bold transition"
          >
            {userMode === 'citizen' ? (
              <>
                <Truck className="w-3.5 h-3.5 text-slate-600" />
                <span>Logistics Mode</span>
              </>
            ) : (
              <>
                <Users className="w-3.5 h-3.5 text-slate-600" />
                <span>Citizen Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Emergency Mode Alert Banner */}
      {isEmergencyMode && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-red-600 text-white shadow-md animate-in fade-in">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/20">
              <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base tracking-wide">
                EMERGENCY DISASTER RESPONSE MODE ACTIVE
              </h4>
              <p className="text-xs text-red-100 font-medium">
                Emergency route optimized for safety and accessibility. Prioritizing trauma centers, NDRF camps, and clear medical corridors.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenHelplines}
            className="px-4 py-2 rounded-xl bg-white text-red-700 font-bold text-xs hover:bg-red-50 transition shadow"
          >
            Call 1033 / 112
          </button>
        </div>
      )}

      {/* Offline Mode Alert Banner */}
      {connectivityStatus === 'offline' && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-800 text-xs shadow-sm">
          <div className="flex items-center space-x-2.5">
            <WifiOff className="w-4 h-4 text-amber-400" />
            <div>
              <span className="font-bold text-white">
                Offline Mode Active: Using Cached Topographical Vector Data
              </span>
              <p className="text-slate-400 text-[11px]">
                Pre-downloaded NH-37 Jiribam & NH-2 elevation maps active. Real-time radar refresh will resume when connectivity returns.
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] bg-slate-800 px-2 py-1 rounded text-amber-300 font-bold">
            CACHED VECTORS
          </span>
        </div>
      )}

      {/* 2. HERO CORE PURPOSE & TAGLINE (Section 1) */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
        <div className="max-w-4xl space-y-3">
          {/* Brand & Purpose Eyebrow */}
          <div className="inline-flex items-center space-x-2.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
            <div className="flex items-baseline font-brand tracking-wider">
              <span className="font-black text-slate-900">ROAD</span>
              <span className="font-tech text-blue-600 font-black brand-dot-pulse px-0.5">_</span>
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">NAVI</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-blue-700 font-bold font-tech uppercase tracking-wider">
              AI LOGISTICS & ACCESSIBILITY INTELLIGENCE
            </span>
          </div>

          {/* Main Requested Purpose Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Find the Safest, Fastest & Most Accessible Route{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-600 block sm:inline">
              — Not Just the Shortest Route.
            </span>
          </h1>

          {/* Core Philosophy Transformation Message */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            Our platform changes{' '}
            <strong className="text-slate-900 font-bold">
              “Where can I go?”
            </strong>{' '}
            into{' '}
            <strong className="text-emerald-700 font-bold">
              “Where can I safely go?”
            </strong>{' '}
            Engineered for the steep mountain passes, monsoon cloudbursts, and landslide-prone highways of North East India.
          </p>

          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-500 tracking-wider">
            <span className="text-blue-600">TAGLINE:</span>
            <span className="text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              MOVE SMART. MOVE SAFE. REACH EVERYWHERE.
            </span>
          </div>
        </div>

        {/* 3. CURRENT LOCATION & DESTINATION SEARCH CARD (Section 1) */}
        <div className="rounded-2xl border-2 border-blue-500/30 bg-blue-50/40 p-4 sm:p-6 shadow-sm">
          <form onSubmit={handleFindSafeRoute} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              {/* Starting / Current Location (FROM) with Dropdown & Search */}
              <div className="lg:col-span-5">
                <NerLocationSelect
                  id="input-start-location"
                  label={`📍 ${t.startingLocation || 'FROM: Starting Location'}`}
                  value={startLocation}
                  onChange={(val) => setStartLocation(val)}
                  placeholder="Select starting location or type... (e.g. Guwahati)"
                  icon="mapPin"
                  required
                  helperAction={
                    <button
                      type="button"
                      onClick={handleUseMyLocation}
                      disabled={isLocating}
                      className="flex items-center space-x-1 text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-white px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-50 transition shadow-2xs"
                    >
                      <Crosshair className={`w-3 h-3 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
                      <span>{isLocating ? 'Locating...' : `📍 ${t.useMyLocation || 'Use My Location'}`}</span>
                    </button>
                  }
                />
              </div>

              {/* Destination Search Box (TO) with Dropdown & Search */}
              <div className="lg:col-span-5">
                <NerLocationSelect
                  id="input-destination"
                  label={`🏁 ${t.destination || 'TO: Destination'}`}
                  value={destination}
                  onChange={(val) => setDestination(val)}
                  placeholder="Select destination or type... (e.g. Imphal, Kohima)"
                  icon="search"
                  required
                  onVoiceClick={onOpenVoice}
                  voiceLabel={t.voice || 'VOICE'}
                />
              </div>

              {/* Main Action Button (Section 1) */}
              <div className="lg:col-span-2">
                <button
                  id="btn-home-find-safe-route"
                  type="submit"
                  disabled={isCalculating}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3.5 text-sm font-black text-white shadow-md hover:scale-[1.02] transition active:scale-95 disabled:opacity-75"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>ANALYZING...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-200" />
                      <span>🛡️ FIND SAFE ROUTE</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Destination Suggestions Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-slate-500 font-medium">Quick Destinations:</span>
              {suggestions.slice(0, 7).map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => {
                    setDestination(sug);
                    onAddToast('Destination Selected', sug, 'info');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 font-semibold transition text-[11px]"
                >
                  {sug.split(',')[0]}
                </button>
              ))}
            </div>

            {/* Logistics Customizer Accordion (Section 15) */}
            {isLogisticsMode && (
              <div className="pt-3 border-t border-blue-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Vehicle Type (Logistics Mode)
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-800"
                  >
                    <option>Heavy Truck (Multi-Axle 16-Wheeler)</option>
                    <option>Medium Commercial Vehicle (6-Wheeler)</option>
                    <option>Light Commercial Vehicle (Pickup)</option>
                    <option>Heavy Fuel / Chemical Tanker</option>
                    <option>Emergency Disaster Relief Convoy</option>
                    <option>Passenger Bus / Sumo Taxi</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Cargo Weight (Tons)
                  </label>
                  <input
                    type="number"
                    value={cargoWeight}
                    onChange={(e) => setCargoWeight(Number(e.target.value))}
                    min={0.5}
                    max={50}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Transit Priority
                  </label>
                  <select
                    value={deliveryPriority}
                    onChange={(e) => setDeliveryPriority(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-800"
                  >
                    <option>Normal Commercial</option>
                    <option>High Priority Cargo</option>
                    <option>Emergency Medical / Relief</option>
                  </select>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* 4. BELOW MAIN INPUT: 3 SIMPLE ROUTE CARDS (Requested Section 5 & 8) */}
        <div id="route-options-section" className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <span>🛡️ Choose Your Route</span>
                <span className="text-xs font-normal text-slate-500 font-sans">
                  ({startLocation.split(',')[0]} ➔ {destination.split(',')[0]})
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Notice: The shortest route is not always the best. Review the 3 options below.
              </p>
            </div>

            {/* Why This Route Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowWhyThisRoute(!showWhyThisRoute)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold transition shadow-2xs"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>❓ WHY THIS ROUTE?</span>
              </button>
            </div>
          </div>

          {/* "Why This Route?" Explanation Dropdown Panel (Requested Section 9) */}
          {showWhyThisRoute && (
            <div className="p-4 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 text-emerald-950 space-y-2.5 shadow-sm animate-in fade-in">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Why the AI Recommends Route B (Safest Route):</span>
                </strong>
                <button
                  type="button"
                  onClick={() => setShowWhyThisRoute(false)}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
                >
                  ✕ Close
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center space-x-2 bg-white/80 p-2 rounded-xl border border-emerald-200">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="font-semibold text-slate-800">Lower flood risk</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 p-2 rounded-xl border border-emerald-200">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="font-semibold text-slate-800">Better road condition</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 p-2 rounded-xl border border-emerald-200">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="font-semibold text-slate-800">Safe bridges</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 p-2 rounded-xl border border-emerald-200">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="font-semibold text-slate-800">Lower landslide chance</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 p-2 rounded-xl border border-emerald-200">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="font-semibold text-slate-800">Travel time is reasonable</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 p-2 rounded-xl border border-emerald-200">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="font-semibold text-slate-800">All-weather bypass route</span>
                </div>
              </div>
            </div>
          )}

          {/* 3 Prominent Route Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Card 1: 🟢 SAFE ROUTE (Always Recommended) */}
            <div
              onClick={() => handleSelectRouteCard(routes.find((r) => r.code === 'ROUTE_B') || routes[1])}
              className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 shadow-md flex flex-col justify-between ${
                activeRouteId === 'route-b-recommended'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/30'
                  : 'border-emerald-300 bg-white hover:border-emerald-400'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black tracking-wide bg-emerald-600 text-white shadow-xs">
                    <span>🟢 SAFE ROUTE (RECOMMENDED)</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    🟢 SAFE TO GO
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    NH-37 / NH-27 Bypass
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Always recommended • Low hazard vulnerability
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs py-2 border-y border-slate-200/80">
                  <div className="bg-white/80 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">Estimated Time</span>
                    <strong className="text-slate-900 font-mono text-sm">⏱️ 11h 20m</strong>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">Distance</span>
                    <strong className="text-slate-900 font-mono text-sm">📏 505 km</strong>
                  </div>
                </div>

                {/* Clear Indicators */}
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">🚧 Road Condition:</span>
                    <strong className="text-emerald-800 font-bold">Good (Engineered 4-lane)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">🌧️ Weather:</span>
                    <strong className="text-emerald-800 font-bold">Good (14mm Drizzle)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">🌊 Flood Risk:</span>
                    <strong className="text-emerald-800 font-bold">Low (Elevated viaducts)</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500">♿ Road Access:</span>
                    <span className="font-bold text-emerald-700">🟢 EASY (Open for all vehicles)</span>
                  </div>
                </div>
              </div>

              {/* Start Journey Button */}
              <div className="pt-4 mt-3 border-t border-emerald-200">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('live-navigation');
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition active:scale-95"
                >
                  <span>▶️ START JOURNEY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: ⚡ FASTEST ROUTE (May Have Some Risk) */}
            <div
              onClick={() => handleSelectRouteCard(routes.find((r) => r.code === 'ROUTE_C') || routes[2])}
              className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 shadow-sm flex flex-col justify-between ${
                activeRouteId === 'route-c-fastest'
                  ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black tracking-wide bg-amber-500 text-white shadow-xs">
                    <span>⚡ FASTEST ROUTE</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    🟡 CAUTION: RAIN
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Kaziranga - Dimapur Corridor
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    May have some risk • Rain reported ahead
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs py-2 border-y border-slate-200/80">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">Estimated Time</span>
                    <strong className="text-slate-900 font-mono text-sm">⏱️ 10h 15m</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">Distance</span>
                    <strong className="text-slate-900 font-mono text-sm">📏 470 km</strong>
                  </div>
                </div>

                {/* Indicators */}
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">🚧 Road Condition:</span>
                    <strong className="text-amber-800 font-bold">Fair (Occasional waterlogging)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">🌧️ Weather:</span>
                    <strong className="text-amber-800 font-bold">Heavy Rain Ahead (32mm)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">🌊 Flood Risk:</span>
                    <strong className="text-amber-800 font-bold">Moderate (River basins)</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500">♿ Road Access:</span>
                    <span className="font-bold text-amber-700">🟡 DIFFICULT (Heavy rain / bad road)</span>
                  </div>
                </div>
              </div>

              {/* Selection indicator */}
              <div className="pt-4 mt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">
                  {activeRouteId === 'route-c-fastest' ? '✓ Currently Selected' : 'Click to preview'}
                </span>
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeRouteId === 'route-c-fastest' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {activeRouteId === 'route-c-fastest' ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>

            {/* Card 3: 📏 SHORTEST ROUTE (Check Road Conditions First) */}
            <div
              onClick={() => handleSelectRouteCard(routes.find((r) => r.code === 'ROUTE_A') || routes[0])}
              className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 shadow-sm flex flex-col justify-between ${
                activeRouteId === 'route-a-shortest'
                  ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black tracking-wide bg-rose-600 text-white shadow-xs">
                    <span>📏 SHORTEST ROUTE</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                    🔴 HIGH RISK
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Direct Mountain Highway
                  </h3>
                  <p className="text-xs text-rose-600 font-semibold mt-0.5">
                    Check road conditions first • Landslide warning
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs py-2 border-y border-slate-200/80">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">Estimated Time</span>
                    <strong className="text-slate-900 font-mono text-sm">⏱️ 9h 50m</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">Distance</span>
                    <strong className="text-slate-900 font-mono text-sm">📏 430 km</strong>
                  </div>
                </div>

                {/* Indicators */}
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">🚧 Road Condition:</span>
                    <strong className="text-rose-800 font-bold">Poor (Narrow mountain cuts)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">🌧️ Weather:</span>
                    <strong className="text-rose-800 font-bold">Torrential Rain (78mm)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">⛰️ Landslide Risk:</span>
                    <strong className="text-rose-800 font-bold">🔴 High (Active Mudslips)</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500">♿ Road Access:</span>
                    <span className="font-bold text-rose-700">🔴 NOT ACCESSIBLE (Blocked / Flooded)</span>
                  </div>
                </div>
              </div>

              {/* Selection / Warning indicator */}
              <div className="pt-4 mt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-600">
                  {activeRouteId === 'route-a-shortest' ? '⚠️ High-Risk Selected' : 'Avoid if possible'}
                </span>
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeRouteId === 'route-a-shortest' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {activeRouteId === 'route-a-shortest' ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          </div>

          {/* Dangerous Route Warning & Safer Route Switcher (Requested Section 8) */}
          {(showHighRiskWarning || activeRouteId === 'route-a-shortest') && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-950 space-y-2.5 shadow-md animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <AlertOctagon className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <strong className="text-sm font-black text-rose-900 block">
                      🚨 ROAD MAY BE UNSAFE: Landslide and heavy flooding reported on this corridor.
                    </strong>
                    <p className="text-xs text-rose-800 mt-0.5">
                      🔄 SAFER ROUTE FOUND: Route B bypasses the active slide zone with reinforced bridges and all-weather viaducts.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSwitchToSaferAlternative}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-md whitespace-nowrap active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>[ TAKE SAFER ROUTE ]</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. INTERACTIVE MAP SECTION (Section 2 & 5) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                🗺️ Interactive Corridor Map
              </h2>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 border border-emerald-200">
                100% FREE OSM TILES • NO API KEY
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Showing starting point (📍 {startLocation.split(',')[0]}), destination (📍 {destination.split(',')[0]}), recommended safe route (🟢), alternative routes, and dangerous areas (🔴).
            </p>
          </div>

          {/* Layer toggles */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setMapLayers((p) => ({ ...p, weather: !p.weather }))}
              className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                mapLayers.weather
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-white text-slate-600 border-slate-300'
              }`}
            >
              🌧️ Rain Radar
            </button>
            <button
              type="button"
              onClick={() => setMapLayers((p) => ({ ...p, alerts: !p.alerts }))}
              className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                mapLayers.alerts
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-white text-slate-600 border-slate-300'
              }`}
            >
              ⚠️ Hazards
            </button>
            <button
              type="button"
              onClick={() => setMapLayers((p) => ({ ...p, emergency: !p.emergency }))}
              className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                mapLayers.emergency
                  ? 'bg-red-100 text-red-800 border-red-300'
                  : 'bg-white text-slate-600 border-slate-300'
              }`}
            >
              🏥 Emergency Points
            </button>
          </div>
        </div>

        {/* The Live Interactive Leaflet Map */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <NerLeafletMap
            selectedRoute={activeRoute}
            onSelectRoute={handleSelectRouteCard}
            originName={startLocation}
            destinationName={destination}
            activeLayers={mapLayers}
            isEmergencyMode={isEmergencyMode}
            heightClass="h-[460px] sm:h-[520px]"
          />
        </div>
      </section>

      {/* 6. HOW TO USE (VERY SIMPLE - 3 STEPS WITH LARGE ICONS) */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
            SIMPLE 3-STEP GUIDE
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            How to Use (Easy for Everyone)
          </h3>
          <p className="text-xs text-slate-500">
            No technical knowledge needed. Follow the 3 simple steps below:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col items-center text-center space-y-2">
            <span className="text-3xl">1️⃣</span>
            <strong className="text-sm font-black text-slate-900">Select Your Location</strong>
            <p className="text-xs text-slate-600">
              Click &ldquo;Use My Location&rdquo; or type where you are starting from.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 flex flex-col items-center text-center space-y-2">
            <span className="text-3xl">2️⃣</span>
            <strong className="text-sm font-black text-slate-900">Select Destination</strong>
            <p className="text-xs text-slate-600">
              Type where you want to go, choose a quick city, or click 🔊 Voice to speak.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col items-center text-center space-y-2">
            <span className="text-3xl">3️⃣</span>
            <strong className="text-sm font-black text-slate-900">Follow Safest Route</strong>
            <p className="text-xs text-slate-600">
              Choose the green 🟢 Safe Route and travel with peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* 7. EMERGENCY BUTTON (VERY VISIBLE) (Requested Section 5 & 10) */}
      <section className="rounded-3xl border-2 border-red-400 bg-red-50/80 p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-md bg-red-600 text-white animate-pulse">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-red-950">
                🚨 NEED EMERGENCY HELP?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-red-900 font-medium">
              Immediate access to hospitals, police, disaster control rooms, and emergency evacuation corridors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEmergencyDetails(!showEmergencyDetails)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-red-100 border border-red-300 text-red-900 font-bold text-xs shadow-xs transition"
            >
              {showEmergencyDetails ? 'Hide Emergency Directory' : 'View Emergency Help'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (onToggleEmergencyMode) onToggleEmergencyMode();
                handleSelectRouteCard(routes.find((r) => r.code === 'ROUTE_B') || routes[1]);
                onAddToast('Emergency Mode Activated', 'Safest evacuation corridor locked for all-weather medical transit.', 'warning');
              }}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition active:scale-95"
            >
              <ShieldAlert className="w-4 h-4 text-red-200" />
              <span>🛡️ FIND SAFEST EMERGENCY ROUTE</span>
            </button>
          </div>
        </div>

        {/* Emergency Help Expanded Panel */}
        {showEmergencyDetails && (
          <div className="pt-4 border-t border-red-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in">
            <div className="p-3.5 rounded-2xl bg-white border border-red-200 space-y-1 text-xs">
              <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                <span>🏥</span>
                <span>Nearest Hospital</span>
              </span>
              <p className="text-slate-700 font-semibold">RIMS Trauma Hospital</p>
              <p className="text-[11px] text-slate-500">Imphal West • 24x7 Emergency</p>
              <a href="tel:03852414629" className="text-blue-700 font-mono font-bold block pt-1 hover:underline">
                📞 0385-2414629
              </a>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-red-200 space-y-1 text-xs">
              <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                <span>🚓</span>
                <span>Police Highway Patrol</span>
              </span>
              <p className="text-slate-700 font-semibold">State Highway Control Room</p>
              <p className="text-[11px] text-slate-500">24x7 Escort & Rescue</p>
              <a href="tel:112" className="text-blue-700 font-mono font-bold block pt-1 hover:underline">
                📞 Dial 112
              </a>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-red-200 space-y-1 text-xs">
              <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                <span>🛡️</span>
                <span>Disaster Control Room</span>
              </span>
              <p className="text-slate-700 font-semibold">SDMA / NDRF 12th Bn</p>
              <p className="text-[11px] text-slate-500">Flood & Landslide Relief</p>
              <a href="tel:1070" className="text-blue-700 font-mono font-bold block pt-1 hover:underline">
                📞 Dial 1070
              </a>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-red-200 space-y-1 text-xs">
              <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                <span>🛣️</span>
                <span>Safe Exit Corridor</span>
              </span>
              <p className="text-slate-700 font-semibold">NH-37 Jiribam Bypass</p>
              <p className="text-[11px] text-slate-500">All-weather bypass route</p>
              <span className="text-emerald-700 font-bold block pt-1">
                🟢 100% Passable
              </span>
            </div>
          </div>
        )}
      </section>

      {/* 8. WEATHER & HAZARD ALERTS (NO LONG PARAGRAPHS - 3 SIMPLE CARDS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
              <BellRing className="w-4 h-4" />
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Weather & Hazard Alerts
            </h3>
          </div>
          <button
            onClick={() => onNavigate('live-alerts')}
            className="text-xs font-bold text-blue-700 hover:text-blue-800"
          >
            View All Alerts ➔
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌧️</span>
              <strong className="text-sm font-black text-amber-950">HEAVY RAIN</strong>
            </div>
            <p className="text-xs font-bold text-amber-900">
              🟡 Be careful while driving
            </p>
            <p className="text-[11px] text-amber-800">
              Kohima-Maram ghats receiving 78mm downpour. Low visibility.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌊</span>
              <strong className="text-sm font-black text-rose-950">FLOOD AHEAD</strong>
            </div>
            <p className="text-xs font-bold text-rose-900">
              🔴 Do not take this road
            </p>
            <p className="text-[11px] text-rose-800">
              Barak Valley low-lying sector submerged. Use Route B viaduct.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-xl">⛰️</span>
              <strong className="text-sm font-black text-rose-950">LANDSLIDE RISK</strong>
            </div>
            <p className="text-xs font-bold text-rose-900">
              🔴 Avoid this area
            </p>
            <p className="text-[11px] text-rose-800">
              NH-2 Paglapahar Sector loose rocks falling. BRO clearance underway.
            </p>
          </div>
        </div>
      </section>

      {/* 7. SAFETY DASHBOARD FOR SELECTED JOURNEY (Section 12) */}
      <section className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
                Safety Summary Dashboard
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              YOUR JOURNEY: {startLocation.split(',')[0]} ➔ {destination.split(',')[0]}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-dashboard-start-navigation"
              onClick={() => onNavigate('live-navigation')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition active:scale-95"
            >
              <Navigation2 className="w-4 h-4 fill-white" />
              <span>🧭 START LIVE GPS NAVIGATION</span>
            </button>
            <button
              onClick={() => onNavigate('route-analysis')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition"
            >
              Deep AI Scoring Matrix ➔
            </button>
          </div>
        </div>

        {/* Dashboard Grid (Section 12) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold block">🛡️ Safety Score</span>
            <strong className="text-base font-black text-emerald-700 font-mono">
              {100 - activeRoute.riskScore}/100
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold block">♿ Accessibility</span>
            <strong className="text-base font-black text-blue-700 font-mono">
              {activeRoute.code === 'ROUTE_B' ? '88/100' : '45/100'}
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold block">🌧️ Weather Impact</span>
            <strong className="text-xs font-bold text-slate-800">
              {activeRoute.rainfallForecastMm > 50 ? 'HIGH (78mm)' : 'LOW (14mm)'}
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold block">🌊 Flood Risk</span>
            <strong className="text-xs font-bold text-slate-800">
              {activeRoute.code === 'ROUTE_B' ? 'Low' : 'Moderate-High'}
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold block">🚧 Road Condition</span>
            <strong className="text-xs font-bold text-slate-800">
              {activeRoute.code === 'ROUTE_B' ? 'Good (4-Lane)' : 'Poor'}
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold block">🚗 Traffic Flow</span>
            <strong className="text-xs font-bold text-slate-800">Moderate</strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold block">Overall Risk</span>
            <strong
              className={`text-xs font-black ${
                activeRoute.riskLevel === 'low'
                  ? 'text-emerald-700'
                  : activeRoute.riskLevel === 'moderate'
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {activeRoute.riskLevel === 'low'
                ? '🟢 LOW'
                : activeRoute.riskLevel === 'moderate'
                ? '🟡 MEDIUM'
                : '🔴 HIGH'}
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold block">Recommended</span>
            <strong
              className={`text-xs font-black ${
                activeRoute.isAiRecommended ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              {activeRoute.isAiRecommended ? 'YES (★)' : 'NO'}
            </strong>
          </div>
        </div>
      </section>

      {/* 8. SAFETY ALERTS & NATURAL HAZARD INFORMATION (Sections 6 & 9) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Visible Safety Alerts (Section 9) */}
        <div className="lg:col-span-7 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                <BellRing className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Active Corridor Safety Alerts
              </h3>
            </div>
            <button
              onClick={() => onNavigate('live-alerts')}
              className="text-xs font-bold text-blue-700 hover:text-blue-800"
            >
              View All 24 Alerts ➔
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs flex items-start space-x-2.5">
              <span className="text-rose-600 font-bold text-sm">🚨</span>
              <div>
                <strong className="text-rose-950 block font-bold">Flood Risk Alert: Barak Valley Basin</strong>
                <p className="text-rose-800 text-[11px] mt-0.5">
                  River water elevation near Silchar lowlands. Route B elevated viaduct is unaffected and clear.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-start space-x-2.5">
              <span className="text-amber-600 font-bold text-sm">⚠️</span>
              <div>
                <strong className="text-amber-950 block font-bold">Heavy Rainfall Advisory: Kohima-Maram Ghats</strong>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  78mm precipitation forecast within 24h. Avoid Route A mountain passes if driving commercial trucks.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs flex items-start space-x-2.5">
              <span className="text-rose-600 font-bold text-sm">⛰️</span>
              <div>
                <strong className="text-rose-950 block font-bold">Landslide Risk: NH-2 Paglapahar Sector</strong>
                <p className="text-rose-800 text-[11px] mt-0.5">
                  Loose shale and mud movement on 3 road cuts. BRO clearance teams deployed with heavy bulldozers.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs flex items-start space-x-2.5">
              <span className="text-blue-600 font-bold text-sm">🔄</span>
              <div>
                <strong className="text-blue-950 block font-bold">Safer Alternative Available: NH-37 Jiribam Highway</strong>
                <p className="text-blue-800 text-[11px] mt-0.5">
                  Southern low-elevation highway open 24x7 with all-weather drainage and reinforced geotextile walls.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Weather & Natural Hazard Information (Section 6) */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <CloudRain className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Weather & Natural Hazard Telemetry
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              IMD SATELLITE
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 flex items-center space-x-2">
                <span>🌧️ Monsoon Rainfall Rate</span>
              </span>
              <span className="font-mono font-bold text-slate-900">
                {activeRoute.rainfallForecastMm} mm / 24h ({activeRoute.rainfallForecastMm > 50 ? 'Heavy' : 'Low'})
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 flex items-center space-x-2">
                <span>🌊 Regional Flood Hazard</span>
              </span>
              <span className="font-bold text-emerald-700">
                {activeRoute.code === 'ROUTE_B' ? 'Low Vulnerability' : 'Moderate-High'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 flex items-center space-x-2">
                <span>⛰️ Slope Landslide Hazard</span>
              </span>
              <span
                className={`font-bold ${
                  activeRoute.code === 'ROUTE_A' ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {activeRoute.code === 'ROUTE_A' ? 'Active Slips (High)' : 'Stabilized Geonets'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 flex items-center space-x-2">
                <span>🌡️ Temperature & Humidity</span>
              </span>
              <span className="font-mono font-bold text-slate-900">22°C • 84% RH</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-600 leading-relaxed">
              <strong>Weather Impact Summary:</strong>{' '}
              {activeRoute.rainfallForecastMm > 50
                ? 'High weather impact expected along mountain ridge lines with fog and slippery clay. Reduced speed required.'
                : 'Low weather impact on Route B. Drainage culverts operating within normal engineering thresholds.'}
            </div>
          </div>
        </div>
      </section>

      {/* 9. EMERGENCY FACILITIES & OFFLINE CACHE (Sections 10 & 11) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Nearby Emergency Facilities (Section 10) */}
        <div className="lg:col-span-7 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-red-100 text-red-700">
                <Building2 className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Emergency & Trauma Assets Along Corridor
              </h3>
            </div>
            <button
              onClick={onOpenHelplines}
              className="text-xs font-bold text-rose-700 hover:text-rose-800"
            >
              Emergency Directory ➔
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EMERGENCY_ASSETS.slice(0, 4).map((asset) => (
              <div
                key={asset.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <span>{asset.type === 'Hospital' ? '🏥' : asset.type === 'NDRF Camp' ? '🛡️' : '🚓'}</span>
                    <span>{asset.name}</span>
                  </span>
                  <span className="text-[10px] font-mono text-blue-700 font-bold">
                    {asset.distanceFromCorridorKm} km
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] line-clamp-1">{asset.location}, {asset.state}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                  <span className="text-emerald-700 font-semibold">{asset.capacityStatus}</span>
                  <a
                    href={`tel:${asset.contact}`}
                    className="font-mono font-bold text-blue-700 hover:underline flex items-center space-x-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{asset.contact}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offline Cache & Remote Mountain Pack (Section 11) */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                <FileDown className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Offline Route Packs for Remote NER
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
              LOCAL STORAGE
            </span>
          </div>

          <div className="space-y-2.5">
            {cachedPacks.map((pack) => (
              <div
                key={pack.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
              >
                <div>
                  <strong className="text-slate-900 block font-bold">{pack.name}</strong>
                  <span className="text-slate-500 text-[11px]">
                    {pack.size} • {pack.updated}
                  </span>
                </div>
                <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  <Check className="w-3 h-3" />
                  <span>{pack.status}</span>
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 italic">
            * Cached packs allow continuous navigation and emergency waypoint access through high-altitude tunnels and dark mountain valleys without cellular reception.
          </p>
        </div>
      </section>

      {/* 10. SIX TECHNOLOGICAL PILLARS (Original Working Features Intact) */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">
            North East Regional Intelligence Matrix
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Explore Dedicated Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Comprehensive platform tools designed for citizens, commercial logistics operators, and state disaster management authorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                id={feat.id}
                onClick={() => onNavigate(feat.tab)}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-500 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-blue-50 p-2.5 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition">
                    <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. REGIONAL STATE COVERAGE FOOTER */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-center space-y-4 shadow-sm">
        <div className="max-w-2xl mx-auto space-y-1">
          <h3 className="text-lg font-black text-slate-900">
            Active Geospatial Telemetry Across North East India
          </h3>
          <p className="text-xs text-slate-500">
            Real-time highway condition modeling covering all 8 states:
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {NER_STATES.map((state) => (
            <div
              key={state.id}
              className="flex items-center space-x-1.5 rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>{state.name}</span>
              <span className="text-[10px] font-mono text-slate-400">({state.accessibilityPct}%)</span>
            </div>
          ))}
        </div>

        {/* Final Tagline Manifesto & Project Footer */}
        <div className="pt-6 border-t border-slate-200/80 max-w-2xl mx-auto space-y-3 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm font-black text-slate-900 tracking-wider">ROAD_NAVI</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-600 font-semibold">
              Safe logistics and accessibility intelligence for North Eastern Region
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition"
            >
              <span>ℹ️ About This Project / How It Works</span>
            </button>
            <span className="text-slate-300">•</span>
            <a href="tel:1033" className="text-slate-700 hover:text-blue-700">
              📞 1033 (NHAI Road Help)
            </a>
            <span className="text-slate-300">•</span>
            <a href="tel:112" className="text-slate-700 hover:text-blue-700">
              🚨 112 (National Emergency)
            </a>
            <span className="text-slate-300">•</span>
            <a href="tel:1070" className="text-slate-700 hover:text-blue-700">
              🌊 1070 (State Disaster)
            </a>
          </div>

          <p className="text-xs font-mono font-bold text-blue-700 pt-1">
            MOVE SMART. MOVE SAFE. REACH EVERYWHERE.
          </p>
        </div>
      </section>
    </div>
  );
};
