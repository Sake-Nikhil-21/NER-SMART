import React, { useState } from 'react';
import { CITIZEN_HELPLINES } from '../../data/mockData';
import { HelplineContact, LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import {
  PhoneCall,
  X,
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  Truck,
  Building2,
  ExternalLink,
  Search,
  CheckCircle2
} from 'lucide-react';

interface CitizenEmergencyHelplinesProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const CitizenEmergencyHelplines: React.FC<CitizenEmergencyHelplinesProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const STATE_DISASTER_NUMBERS = [
    { state: 'Assam', number: '1070 / 0361-2237221', location: 'Dispur Disaster Control Center' },
    { state: 'Meghalaya', number: '1070 / 0364-2502098', location: 'Shillong SDMA Headquarters' },
    { state: 'Manipur', number: '1070 / 0385-2443441', location: 'Imphal Emergency Operation' },
    { state: 'Nagaland', number: '1070 / 0370-2270050', location: 'Kohima NSDMA Control' },
    { state: 'Mizoram', number: '1070 / 0389-2335842', location: 'Aizawl Disaster Management' },
    { state: 'Tripura', number: '1070 / 0381-2416045', location: 'Agartala Relief Operations' },
    { state: 'Arunachal Pradesh', number: '1070 / 0360-2212222', location: 'Itanagar Disaster Cell' },
    { state: 'Sikkim', number: '1070 / 03592-201145', location: 'Gangtok SSDMA Control Room' },
  ];

  const filteredHelplines = CITIZEN_HELPLINES.filter((h) => {
    const matchesCategory = selectedCategory === 'all' || h.category === selectedCategory;
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.number.includes(searchQuery) ||
      h.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 border border-rose-200">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center space-x-2">
                <span>{t.emergencyHelplines}</span>
              </h2>
              <p className="text-xs text-slate-500">
                Official 24x7 Emergency Assistance for Highway Drivers, Commuters & Families in North East India
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-white border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search helpline e.g. Highway, Ambulance, 1033, Police..."
                className="w-full bg-slate-50 text-xs text-slate-900 pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'highway', 'disaster', 'medical', 'police'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Main Emergency Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredHelplines.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-rose-300 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</span>
                    {item.isTollFree && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-bold">
                        {t.tollFree}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-base font-black text-rose-700 font-mono tracking-wider">
                    📞 {item.number}
                  </span>

                  <a
                    href={`tel:${item.number.replace(/\s+/g, '')}`}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <span>Tap to Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* 8 State Disaster Management Control Rooms */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>North East State Disaster Management Operation Centers (SDMA)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {STATE_DISASTER_NUMBERS.map((s, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left">
                  <div className="font-bold text-xs text-slate-900">{s.state}</div>
                  <div className="text-[10px] text-slate-500 truncate">{s.location}</div>
                  <a
                    href={`tel:${s.number.split('/')[0].trim()}`}
                    className="mt-2 inline-flex items-center space-x-1 text-xs font-mono font-bold text-blue-700 hover:text-blue-800"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>{s.number}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All emergency dispatch services monitored 24x7</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
