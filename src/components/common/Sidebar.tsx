import React from 'react';
import { NavigationTab, UserExperienceMode, LanguageCode } from '../../types';
import {
  LayoutDashboard,
  Route,
  Sparkles,
  Truck,
  MapPin,
  ShieldAlert,
  BellRing,
  Bot,
  Settings,
  Flame,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  X,
  PhoneCall,
  Users,
  Image as ImageIcon,
  Navigation2,
  Info
} from 'lucide-react';
import { NER_STATES } from '../../data/mockData';
import { TRANSLATIONS } from '../../data/translations';

interface SidebarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  isEmergencyMode: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  activeAlertCount?: number;
  userMode?: UserExperienceMode;
  onToggleUserMode?: (mode: UserExperienceMode) => void;
  language?: LanguageCode;
  onOpenHelplines?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  isEmergencyMode,
  isOpenMobile,
  onCloseMobile,
  isOpen,
  onClose,
  activeAlertCount = 24,
  userMode = 'citizen',
  onToggleUserMode,
  language = 'en',
  onOpenHelplines,
}) => {
  const isDrawerOpen = isOpenMobile ?? isOpen ?? false;
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleClose = () => {
    if (typeof onCloseMobile === 'function') {
      onCloseMobile();
    }
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }[] = [
    { id: 'landing', label: 'Overview & Quick Check', icon: Users, badge: 'Public', badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200' },
    { id: 'picture-mode', label: '🖼️ Picture Guide (चित्र मार्गदर्शक)', icon: ImageIcon, badge: 'Easy/সহজ', badgeColor: 'bg-blue-50 text-blue-800 border border-blue-200' },
    { id: 'live-navigation', label: '🧭 Live GPS Cockpit (HUD)', icon: Navigation2, badge: 'Active GPS', badgeColor: 'bg-blue-600 text-white font-bold' },
    { id: 'dashboard', label: 'Regional Command Intel', icon: LayoutDashboard },
    { id: 'smart-routes', label: 'Route Safety & Planner', icon: Route, badge: 'AI Plan', badgeColor: 'bg-blue-50 text-blue-800 border border-blue-200' },
    { id: 'route-analysis', label: 'AI Route Reasoning', icon: Sparkles, badge: 'Compare', badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200' },
    { id: 'logistics-planner', label: 'Logistics Multi-Stop', icon: Truck, badge: 'Multi-Stop', badgeColor: 'bg-indigo-50 text-indigo-800 border border-indigo-200' },
    { id: 'accessibility', label: 'State Road Access', icon: MapPin },
    { id: 'risk-intelligence', label: 'Landslide & Rain Risk', icon: ShieldAlert },
    { id: 'live-alerts', label: 'Live Disruption Alerts', icon: BellRing, badge: `${activeAlertCount} Alerts`, badgeColor: 'bg-rose-50 text-rose-800 border border-rose-200' },
    { id: 'ai-assistant', label: 'AI Travel Assistant', icon: Bot, badge: 'Online', badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200' },
    { id: 'about', label: 'About & How It Works', icon: Info, badge: 'Overview', badgeColor: 'bg-blue-50 text-blue-800 border border-blue-200' },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const handleItemClick = (tabId: NavigationTab) => {
    onNavigate(tabId);
    handleClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        id="road-navi-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-50 flex w-72 sm:w-80 flex-col justify-between border-r bg-white p-4 transition-transform duration-300 shadow-xl ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isEmergencyMode ? 'border-red-300 bg-red-50/95' : 'border-slate-200'}`}
      >
        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Header with Title and Prominent Wrong Mark (✕) Close Button */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <div className="flex items-baseline font-brand">
                <span className="text-xs font-black tracking-wider text-slate-900">ROAD</span>
                <span className="text-xs font-tech font-black text-blue-600 px-0.5">_</span>
                <span className="text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">NAVI</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                • GIS Tools
              </span>
            </div>

            {/* Close Button */}
            <button
              id="btn-close-sidebar-tools"
              onClick={handleClose}
              className="flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition active:scale-95 shadow-sm"
              title="Close Tools & Navigation (✕)"
              aria-label="Close Navigation"
            >
              <span className="text-[11px]">Close</span>
              <X className="w-4 h-4 text-slate-600 stroke-[2.5]" />
            </button>
          </div>

          {/* Quick Mode Toggle in Sidebar */}
          {onToggleUserMode && (
            <div className="p-1 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-between text-xs">
              <button
                onClick={() => onToggleUserMode('citizen')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition ${
                  userMode === 'citizen' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                👨‍👩‍👧 Public
              </button>
              <button
                onClick={() => onToggleUserMode('pro')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition ${
                  userMode === 'pro' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🚚 Pro
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigation & Tools
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? isEmergencyMode
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? (isEmergencyMode ? 'text-white' : 'text-blue-600') : 'text-slate-500 group-hover:text-blue-600'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-bold ${
                          isActive && isEmergencyMode ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Quick 24x7 SOS Helpline Card */}
          {onOpenHelplines && (
            <button
              onClick={() => {
                handleClose();
                onOpenHelplines();
              }}
              className="w-full text-left p-3 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition group"
            >
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs">
                <PhoneCall className="w-4 h-4 text-rose-600 group-hover:animate-bounce" />
                <span>24x7 Emergency Helplines</span>
              </div>
              <p className="text-[10px] text-rose-600/90 mt-1">
                Highway SOS 1033 • National Emergency 112
              </p>
            </button>
          )}

          {/* Quick Regional State Health Widget */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Regional Accessibility
              </span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">82% Avg</span>
            </div>

            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 text-[11px]">
              {NER_STATES.slice(0, 5).map((state) => (
                <div key={state.id} className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-800 truncate max-w-[90px] font-medium">{state.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          state.accessibilityPct >= 80
                            ? 'bg-emerald-500'
                            : state.accessibilityPct >= 70
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${state.accessibilityPct}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-700 w-6 text-right font-medium">
                      {state.accessibilityPct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dismiss / Close Navigation Button at End of Tools */}
          <button
            id="btn-dismiss-tools-bottom"
            onClick={handleClose}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold transition shadow-sm group active:scale-98"
            title="Close Tools & Return to Full Screen (✕)"
          >
            <X className="w-4 h-4 text-slate-500 group-hover:scale-110 transition-transform" />
            <span>✕ Close Tools & View Full Screen</span>
          </button>
        </div>

        {/* Mission Statement Bottom Banner */}
        <div className="border-t border-slate-200 pt-3 text-center">
          <p className="text-[10px] text-slate-500 italic leading-snug">
            “Safe navigation, disaster intelligence, and accessible routes across North East India.”
          </p>
          <div className="mt-1 flex items-center justify-center space-x-1 text-[10px] font-brand font-bold text-slate-700">
            <span>road</span>
            <span className="font-tech text-blue-600 font-extrabold brand-dot-pulse">_</span>
            <span className="italic text-blue-700">navi</span>
            <span className="text-[9px] font-tech text-slate-400">• v2.4</span>
          </div>
        </div>
      </aside>
    </>
  );
};
