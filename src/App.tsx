import React, { useState, useEffect } from 'react';
import {
  NavigationTab,
  RouteQuery,
  RouteOption,
  ToastMessage,
  UserExperienceMode,
  LanguageCode
} from './types';
import { DEFAULT_DEMO_QUERY, MOCK_ROUTES_GUWAHATI_TO_IMPHAL } from './data/mockData';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/Toast';
import { AiAnalysisModal } from './components/ai/AiAnalysisModal';
import { AiAssistantFloating } from './components/ai/AiAssistantFloating';
import { CitizenEmergencyHelplines } from './components/citizen/CitizenEmergencyHelplines';
import { EasyPictureView } from './components/citizen/EasyPictureView';
import { LiveNavigationHud } from './components/views/LiveNavigationHud';
import { VoiceAssistantModal } from './components/common/VoiceAssistantModal';

// Views
import { LandingPage } from './components/views/LandingPage';
import { DashboardView } from './components/views/DashboardView';
import { SmartRoutesView } from './components/views/SmartRoutesView';
import { AiRouteAnalysisView } from './components/views/AiRouteAnalysisView';
import { LogisticsPlannerView } from './components/views/LogisticsPlannerView';
import { AccessibilityView } from './components/views/AccessibilityView';
import { RiskIntelligenceView } from './components/views/RiskIntelligenceView';
import { LiveAlertsView } from './components/views/LiveAlertsView';
import { AiAssistantView } from './components/views/AiAssistantView';
import { SettingsView } from './components/views/SettingsView';
import { AboutView } from './components/views/AboutView';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // User Experience & Multi-Language State
  const [userMode, setUserMode] = useState<UserExperienceMode>(() => {
    return (
      (localStorage.getItem('road_navi_user_mode') as UserExperienceMode) ||
      (localStorage.getItem('ner_smart_user_mode') as UserExperienceMode) ||
      'citizen'
    );
  });
  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (
      (localStorage.getItem('road_navi_language') as LanguageCode) ||
      (localStorage.getItem('ner_smart_language') as LanguageCode) ||
      'en'
    );
  });
  const [showHelplineModal, setShowHelplineModal] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('road_navi_user_mode', userMode);
  }, [userMode]);

  useEffect(() => {
    localStorage.setItem('road_navi_language', language);
  }, [language]);

  // Route Analysis State
  const [routeQuery, setRouteQuery] = useState<RouteQuery>(DEFAULT_DEMO_QUERY);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(
    MOCK_ROUTES_GUWAHATI_TO_IMPHAL[1] // Default to Route B
  );

  const addToast = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      message,
      type,
      durationMs: 4500,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleUserMode = (mode: UserExperienceMode) => {
    setUserMode(mode);
    if (mode === 'citizen') {
      addToast(
        'Citizen Mode Activated 👨‍👩‍👧',
        'Simplified road safety status, plain-language advice, and family-friendly travel alerts.',
        'success'
      );
    } else {
      addToast(
        'Logistics Pro Mode Activated 🚚',
        'Multi-axle bridge physics, multi-stop fleet optimizer, and GIS telemetry matrices enabled.',
        'info'
      );
    }
  };

  const handleChangeLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    const langNames = {
      en: 'English',
      hi: 'हिन्दी (Hindi)',
      as: 'অসমীয়া (Assamese)',
      bn: 'বাংলা (Bengali)',
      ne: 'नेपाली (Nepali)',
    };
    addToast('Language Changed', `Interface localized to ${langNames[lang]}.`, 'info');
  };

  const handleToggleEmergencyMode = () => {
    const nextMode = !isEmergencyMode;
    setIsEmergencyMode(nextMode);
    if (nextMode) {
      addToast(
        'DISASTER RESPONSE MODE ACTIVATED',
        'Prioritizing fastest accessible relief corridors, trauma hubs, and NDRF staging assets.',
        'error'
      );
    } else {
      addToast(
        'Standard Logistics Mode',
        'Returned to standard commercial freight and route optimization.',
        'info'
      );
    }
  };

  // Start AI Route Analysis Modal and then transition to Route Analysis view
  const handleStartRouteAnalysis = (query: RouteQuery) => {
    setRouteQuery(query);
    setIsAnalyzingAi(true);
  };

  const handleAiAnalysisComplete = () => {
    setIsAnalyzingAi(false);
    setCurrentTab('route-analysis');
    addToast(
      'AI Route Analysis Ready',
      'Evaluated candidate corridors. Route B (NH-37 Jiribam) recommended for safety.',
      'success'
    );
  };

  // Automated 2-Minute SIH Demo Workflow Handler
  const handleStartDemoWorkflow = () => {
    setCurrentTab('smart-routes');
    setRouteQuery(DEFAULT_DEMO_QUERY);
    addToast(
      'SIH Demo Workflow Initiated',
      'Step 1: Loaded Guwahati ➔ Imphal 10-Ton Heavy Axle Transport scenario.',
      'info'
    );
  };

  const handleSelectRouteFromCitizen = (from: string, to: string, vehicle: string) => {
    const updated: RouteQuery = {
      ...DEFAULT_DEMO_QUERY,
      from,
      to,
      vehicleType: vehicle,
      cargoWeightTons: vehicle.includes('Car') ? 0.5 : 10,
      cargoType: 'Passenger / Goods',
    };
    setRouteQuery(updated);
    handleStartRouteAnalysis(updated);
  };

  const handleResetSimulationState = () => {
    setRouteQuery(DEFAULT_DEMO_QUERY);
    setSelectedRoute(MOCK_ROUTES_GUWAHATI_TO_IMPHAL[1]);
    setIsEmergencyMode(false);
    setUserMode('citizen');
    setLanguage('en');
    setCurrentTab('landing');
    addToast(
      'Simulation Reset',
      'Reset all simulation states, route selections, and preferences.',
      'info'
    );
  };

  return (
    <div className={`min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white ${isEmergencyMode ? 'ring-2 ring-red-600' : ''}`}>
      {/* Persistent Top Navigation Bar */}
      <Header
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        isEmergencyMode={isEmergencyMode}
        onToggleEmergencyMode={handleToggleEmergencyMode}
        onStartDemoWorkflow={handleStartDemoWorkflow}
        onOpenMobileMenu={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        unreadAlertCount={24}
        userMode={userMode}
        onToggleUserMode={handleToggleUserMode}
        language={language}
        onChangeLanguage={handleChangeLanguage}
        onOpenHelplines={() => setShowHelplineModal(true)}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Persistent / Responsive Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={setCurrentTab}
          isOpen={isSidebarOpen}
          isOpenMobile={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCloseMobile={() => setIsSidebarOpen(false)}
          isEmergencyMode={isEmergencyMode}
          activeAlertCount={24}
          userMode={userMode}
          onToggleUserMode={handleToggleUserMode}
          language={language}
          onOpenHelplines={() => setShowHelplineModal(true)}
        />

        {/* Dynamic Center Stage Content View */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 lg:py-8 max-w-7xl mx-auto w-full">
          {currentTab === 'landing' && (
            <LandingPage
              onNavigate={setCurrentTab}
              onStartDemoWorkflow={handleStartDemoWorkflow}
              userMode={userMode}
              onToggleUserMode={handleToggleUserMode}
              language={language}
              onOpenHelplines={() => setShowHelplineModal(true)}
              onOpenVoice={() => setIsVoiceAssistantOpen(true)}
              onSelectRouteForProMode={handleSelectRouteFromCitizen}
              onAddToast={addToast}
              isEmergencyMode={isEmergencyMode}
              onToggleEmergencyMode={handleToggleEmergencyMode}
              currentQuery={routeQuery}
              onUpdateQuery={setRouteQuery}
              selectedRoute={selectedRoute}
              onSelectRoute={setSelectedRoute}
            />
          )}

          {currentTab === 'picture-mode' && (
            <EasyPictureView
              language={language}
              onChangeLanguage={handleChangeLanguage}
              onNavigateToPro={() => setCurrentTab('smart-routes')}
              onStartLiveNav={() => setCurrentTab('live-navigation')}
              onOpenHelplines={() => setShowHelplineModal(true)}
            />
          )}

          {currentTab === 'live-navigation' && (
            <LiveNavigationHud
              route={selectedRoute}
              query={routeQuery}
              language={language}
              onNavigate={setCurrentTab}
              onOpenHelpline={() => setShowHelplineModal(true)}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigate={setCurrentTab}
              isEmergencyMode={isEmergencyMode}
              onToggleEmergencyMode={handleToggleEmergencyMode}
              onSelectRouteForAnalysis={(route) => {
                setSelectedRoute(route);
                setCurrentTab('route-analysis');
              }}
            />
          )}

          {currentTab === 'smart-routes' && (
            <SmartRoutesView
              onAnalyzeRoute={handleStartRouteAnalysis}
              currentQuery={routeQuery}
              onUpdateQuery={setRouteQuery}
            />
          )}

          {currentTab === 'route-analysis' && (
            <AiRouteAnalysisView
              query={routeQuery}
              onNavigate={setCurrentTab}
              onSelectRouteForLogistics={(route) => {
                setSelectedRoute(route);
                addToast(
                  'Route Locked in Planner',
                  `${route.title} successfully transferred to Multi-Stop Logistics Optimizer.`,
                  'success'
                );
              }}
            />
          )}

          {currentTab === 'logistics-planner' && (
            <LogisticsPlannerView onNavigate={setCurrentTab} />
          )}

          {currentTab === 'accessibility' && (
            <AccessibilityView onNavigate={setCurrentTab} />
          )}

          {currentTab === 'risk-intelligence' && (
            <RiskIntelligenceView onNavigate={setCurrentTab} />
          )}

          {currentTab === 'live-alerts' && (
            <LiveAlertsView onNavigate={setCurrentTab} />
          )}

          {currentTab === 'ai-assistant' && (
            <AiAssistantView onNavigate={setCurrentTab} />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              onNavigate={setCurrentTab}
              onResetApp={handleResetSimulationState}
            />
          )}

          {currentTab === 'about' && (
            <AboutView
              onNavigate={setCurrentTab}
              language={language}
              onOpenHelplines={() => setShowHelplineModal(true)}
            />
          )}
        </main>
      </div>

      {/* 8-Step Simulated AI Reasoning Animation Modal */}
      <AiAnalysisModal
        isOpen={isAnalyzingAi}
        query={routeQuery}
        onClose={() => setIsAnalyzingAi(false)}
        onComplete={handleAiAnalysisComplete}
        fromCity={routeQuery?.from}
        toCity={routeQuery?.to}
        vehicleType={routeQuery?.vehicleType}
        cargoWeightTons={routeQuery?.cargoWeightTons}
      />

      {/* Emergency Helplines Modal */}
      <CitizenEmergencyHelplines
        isOpen={showHelplineModal}
        onClose={() => setShowHelplineModal(false)}
        language={language}
      />

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        onSelectDestination={(dest) => {
          setRouteQuery((prev) => ({ ...prev, to: dest }));
          addToast('Voice Input Accepted', `Destination updated to ${dest}.`, 'success');
        }}
        onTriggerFindRoute={(dest) => {
          const updated = { ...routeQuery, to: dest || routeQuery.to };
          setRouteQuery(updated);
          handleStartRouteAnalysis(updated);
        }}
        language={language}
        currentDestination={routeQuery.to}
      />

      {/* Floating Interactive Quick AI Assistant Widget (available on all views) */}
      <AiAssistantFloating onNavigate={setCurrentTab} />

      {/* Notification Toast Stack */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
