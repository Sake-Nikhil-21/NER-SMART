import React, { useState } from 'react';
import { NavigationTab, LiveAlert, UserExperienceMode, LanguageCode } from '../../types';
import { LIVE_ALERTS_DATA } from '../../data/mockData';
import { TRANSLATIONS } from '../../data/translations';
import {
  Compass,
  AlertTriangle,
  Bell,
  Play,
  User,
  Menu,
  X,
  Radio,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Globe,
  PhoneCall,
  Users,
  Truck,
  HelpCircle,
  Image as ImageIcon,
  Navigation2,
  Volume2,
  Mic,
  Info
} from 'lucide-react';
import { RiskBadge } from './RiskBadge';

interface HeaderProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  isEmergencyMode: boolean;
  onToggleEmergencyMode: () => void;
  onStartDemoWorkflow: () => void;
  onOpenMobileMenu: () => void;
  isSidebarOpen?: boolean;
  unreadAlertCount: number;
  userMode: UserExperienceMode;
  onToggleUserMode: (mode: UserExperienceMode) => void;
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  onOpenHelplines: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  isEmergencyMode,
  onToggleEmergencyMode,
  onStartDemoWorkflow,
  onOpenMobileMenu,
  isSidebarOpen = false,
  unreadAlertCount,
  userMode,
  onToggleUserMode,
  language,
  onChangeLanguage,
  onOpenHelplines,
  onOpenVoiceAssistant,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'as', label: 'Assamese', native: 'অসমীয়া' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'ne', label: 'Nepali', native: 'नेपाली' },
  ];

  return (
    <header
      id="road-navi-header"
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-300 ${
        isEmergencyMode
          ? 'bg-red-50/95 border-red-300 shadow-md'
          : 'bg-white/95 border-slate-200 shadow-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Left: Menu Toggle + Brand / Logo */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          {/* Navigation & Tools Drawer Toggle Button */}
          <button
            id="btn-header-toggle-tools"
            onClick={onOpenMobileMenu}
            className={`flex items-center space-x-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold border transition ${
              isSidebarOpen
                ? 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 hover:text-slate-900'
            }`}
            aria-label="Toggle Navigation & Tools Menu"
            title={isSidebarOpen ? "Close Tools & Navigation (✕)" : "Open Navigation & Tools"}
          >
            {isSidebarOpen ? (
              <>
                <X className="h-4 w-4 text-rose-600 stroke-[2.5]" />
                <span className="hidden sm:inline font-mono">Close</span>
              </>
            ) : (
              <>
                <Menu className="h-4 w-4 text-slate-700" />
                <span className="hidden sm:inline">Tools & Menu</span>
              </>
            )}
          </button>

          {/* Main Logo & Identity with Unique ROAD_NAVI Styling */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-2.5 sm:space-x-3 text-left group"
            title="ROAD_NAVI — North East Smart Logistics & Accessibility Intelligence"
          >
            {/* Custom High-Tech Emblem */}
            <div className={`relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 shadow-sm ${
              isEmergencyMode
                ? 'bg-red-100 border-red-400 text-red-700'
                : 'bg-gradient-to-br from-blue-50 via-indigo-50/50 to-cyan-50 border-blue-200 text-blue-700 group-hover:border-blue-400 group-hover:shadow-md'
            }`}>
              <Compass className={`h-5 w-5 sm:h-6 sm:w-6 transition-all duration-500 ${
                isEmergencyMode ? 'text-red-600 animate-pulse' : 'text-blue-600 group-hover:rotate-90 group-hover:text-blue-700'
              }`} />
              
              {/* Telemetry Live Beacon Dot */}
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 ring-2 ring-white"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                {/* Stylized ROAD_NAVI Capital Logotype */}
                <div className="flex items-baseline font-brand select-none">
                  <span className="text-base sm:text-xl font-black tracking-wider text-slate-900 group-hover:text-blue-900 transition-colors">
                    ROAD
                  </span>
                  <span className="text-base sm:text-xl font-tech font-black text-blue-600 brand-dot-pulse px-0.5">
                    _
                  </span>
                  <span className="text-base sm:text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600">
                    NAVI
                  </span>
                </div>

                {/* Unique GIS Tag Badge */}
                <span className="hidden xs:inline-flex items-center space-x-1 rounded-md bg-blue-50 px-1.5 py-0.5 text-[9px] font-tech font-bold text-blue-700 border border-blue-200 tracking-wider">
                  <span>NER GIS</span>
                </span>

                <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-tech font-bold text-emerald-800 border border-emerald-300 tracking-wider">
                  {userMode === 'citizen' ? 'CITIZEN' : 'PRO'}
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 hidden md:block truncate max-w-[240px] lg:max-w-none">
                {t.appSubtitle}
              </p>
            </div>
          </button>
        </div>

        {/* Center Simple Navigation & Mode Selector */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {/* Simple Navigation: Home | Map | Emergency | Alerts | About */}
          <nav className="flex items-center space-x-1 text-xs font-bold text-slate-700">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-lg transition ${
                currentTab === 'landing'
                  ? 'bg-blue-50 text-blue-700 font-extrabold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('smart-routes')}
              className={`px-3 py-1.5 rounded-lg transition ${
                currentTab === 'smart-routes'
                  ? 'bg-blue-50 text-blue-700 font-extrabold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Map
            </button>
            <button
              onClick={onOpenHelplines}
              className="px-3 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 transition font-bold"
            >
              Emergency
            </button>
            <button
              onClick={() => onNavigate('live-alerts')}
              className={`px-3 py-1.5 rounded-lg transition ${
                currentTab === 'live-alerts'
                  ? 'bg-blue-50 text-blue-700 font-extrabold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Alerts
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`px-3 py-1.5 rounded-lg transition ${
                currentTab === 'about'
                  ? 'bg-blue-50 text-blue-700 font-extrabold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              About
            </button>
          </nav>

          {/* Simple vs Pro Mode Selector */}
          <div className="hidden xl:flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-300 shadow-inner space-x-1">
            <button
              onClick={() => onToggleUserMode('citizen')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                userMode === 'citizen' && currentTab !== 'picture-mode'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Simple road status, large icons, voice and plain language for everyone"
            >
              <Users className="w-3 h-3" />
              <span>Simple</span>
            </button>

            <button
              onClick={() => onToggleUserMode('pro')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                userMode === 'pro'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Advanced route scores, telemetry matrices and logistics"
            >
              <Truck className="w-3 h-3" />
              <span>Advanced</span>
            </button>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Prominent Voice Assistance Button (Top Header) */}
          {onOpenVoiceAssistant && (
            <button
              id="btn-header-voice-assistant"
              onClick={onOpenVoiceAssistant}
              className="flex items-center space-x-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-extrabold shadow-sm transition active:scale-95 animate-pulse"
              title="Speak or listen to safe route directions"
            >
              <Volume2 className="w-4 h-4" />
              <span>🔊 VOICE</span>
            </button>
          )}
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-300 transition"
              title="Change Language (English, Hindi, Assamese, Bengali)"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">{languages.find(l => l.code === language)?.native}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onChangeLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                      language === l.code
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{l.native}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Helplines Button (24x7 SOS) */}
          <button
            onClick={onOpenHelplines}
            className="flex items-center space-x-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-2.5 py-1.5 text-xs font-bold transition shadow-sm"
            title="24x7 Highway & Disaster Emergency Helplines (1033 / 112)"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span className="hidden sm:inline">Help 1033</span>
          </button>

          {/* Quick 2-Minute SIH Demo Workflow Button */}
          <button
            id="btn-quick-demo-walkthrough"
            onClick={onStartDemoWorkflow}
            className="flex items-center space-x-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white shadow-sm transition active:scale-95"
            title="Start 2-Minute SIH Presentation Workflow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">2-Min Demo</span>
            <span className="md:hidden">Demo</span>
          </button>

          {/* Emergency Mode Toggle */}
          <button
            id="btn-emergency-mode-toggle"
            onClick={onToggleEmergencyMode}
            className={`flex items-center space-x-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-bold transition duration-200 border ${
              isEmergencyMode
                ? 'bg-red-600 text-white border-red-700 shadow-sm animate-pulse'
                : 'bg-slate-100 text-rose-700 border-rose-300 hover:bg-rose-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden xl:inline">
              {isEmergencyMode ? 'EMERGENCY ACTIVE' : 'Emergency Mode'}
            </span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              id="btn-notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-300 transition"
              aria-label="View Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Drawer */}
            {showNotifications && (
              <div
                id="notifications-dropdown"
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Live Disruption Feeds</h4>
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-300">
                      {LIVE_ALERTS_DATA.length} Active
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('live-alerts');
                    }}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {LIVE_ALERTS_DATA.slice(0, 4).map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate('live-alerts');
                      }}
                      className="cursor-pointer rounded-lg bg-slate-50 p-2.5 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <RiskBadge level={alert.severity} size="sm" />
                        <span className="text-[10px] text-slate-500">{alert.timeAgo}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 line-clamp-1">{alert.title}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">{alert.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Mode Switch */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-1.5 sm:space-x-2 rounded-lg bg-slate-100 px-2 sm:px-2.5 py-1.5 border border-slate-300 hover:bg-slate-200 text-left transition"
            >
              <div className="h-6 w-6 rounded-md bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs">
                {userMode === 'citizen' ? '👤' : '🚚'}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-slate-900">
                  {userMode === 'citizen' ? 'Citizen Traveler' : 'Logistics Officer'}
                </p>
                <p className="text-[10px] text-slate-500">Guwahati Sector</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-200 text-slate-600">
                  <p className="font-bold text-slate-900">User Experience Mode</p>
                  <p className="text-[10px]">Switch interface simplicity</p>
                </div>
                
                <div className="p-1 space-y-1">
                  <button
                    onClick={() => {
                      onToggleUserMode('citizen');
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                      userMode === 'citizen' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>👨‍👩‍👧 Citizen / Public Mode</span>
                    {userMode === 'citizen' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => {
                      onToggleUserMode('pro');
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                      userMode === 'pro' ? 'bg-blue-50 text-blue-800 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>🚚 Logistics Pro Mode</span>
                    {userMode === 'pro' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenHelplines();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-50 text-rose-700 flex items-center space-x-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Emergency Helplines</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('settings');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                  >
                    System Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
