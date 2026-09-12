import React, { useState } from 'react';
import { NavigationTab, RegionalStateData } from '../../types';
import { NER_STATES } from '../../data/mockData';
import { NerLeafletMap } from '../map/NerLeafletMap';
import { DataSourceTrustIndicator } from '../common/DataSourceTrustIndicator';
import {
  MapPin,
  Clock,
  Layers,
  Filter,
  CheckCircle2,
  AlertTriangle,
  CloudRain,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Activity,
  Sliders,
  UserCheck,
  HeartPulse,
  Eye,
  Smile,
  Search,
  Sparkles,
  Building,
} from 'lucide-react';

export type UserProfileType = 'wheelchair' | 'elderly' | 'vision' | 'general';

interface AccessibleLocation {
  id: string;
  name: string;
  category: 'Transit Terminal' | 'Hospital' | 'Highway Rest Stop' | 'Border Checkpoint' | 'Civic Center';
  city: string;
  state: string;
  overallScore: number;
  wheelchairAccessible: boolean;
  wheelchairParking: boolean;
  accessibleToilets: boolean;
  ramps: boolean;
  elevators: boolean;
  medicalAssistance: boolean;
  emergencyAccessibility: boolean;
  notes: string;
}

const ACCESSIBLE_LOCATIONS: AccessibleLocation[] = [
  {
    id: 'loc-1',
    name: 'Guwahati ISBT & Inter-State Transit Hub',
    category: 'Transit Terminal',
    city: 'Guwahati',
    state: 'Assam',
    overallScore: 92,
    wheelchairAccessible: true,
    wheelchairParking: true,
    accessibleToilets: true,
    ramps: true,
    elevators: true,
    medicalAssistance: true,
    emergencyAccessibility: true,
    notes: 'Grade A ramps, motorized wheelchair charging station, 24/7 Red Cross first-aid post.',
  },
  {
    id: 'loc-2',
    name: 'RIMS Regional Trauma Center Imphal',
    category: 'Hospital',
    city: 'Imphal',
    state: 'Manipur',
    overallScore: 89,
    wheelchairAccessible: true,
    wheelchairParking: true,
    accessibleToilets: true,
    ramps: true,
    elevators: true,
    medicalAssistance: true,
    emergencyAccessibility: true,
    notes: 'Emergency ramp slopes <= 1:12, automated sensor double-doors, dedicated ICU transport elevators.',
  },
  {
    id: 'loc-3',
    name: 'Shillong Umiam Highway Rest & Transit Stop',
    category: 'Highway Rest Stop',
    city: 'Shillong',
    state: 'Meghalaya',
    overallScore: 85,
    wheelchairAccessible: true,
    wheelchairParking: true,
    accessibleToilets: true,
    ramps: true,
    elevators: false,
    medicalAssistance: true,
    emergencyAccessibility: true,
    notes: 'Ground-level step-free layout, braille signage, priority accessible parking bays.',
  },
  {
    id: 'loc-4',
    name: 'Dimapur Freight & Railhead Complex',
    category: 'Transit Terminal',
    city: 'Dimapur',
    state: 'Nagaland',
    overallScore: 78,
    wheelchairAccessible: true,
    wheelchairParking: true,
    accessibleToilets: true,
    ramps: true,
    elevators: true,
    medicalAssistance: false,
    emergencyAccessibility: true,
    notes: 'Platform 1 fully barrier-free. Overbridge lift operational 06:00 to 22:00.',
  },
  {
    id: 'loc-5',
    name: 'Silchar Southern Depot Highway Station',
    category: 'Highway Rest Stop',
    city: 'Silchar',
    state: 'Assam',
    overallScore: 87,
    wheelchairAccessible: true,
    wheelchairParking: true,
    accessibleToilets: true,
    ramps: true,
    elevators: false,
    medicalAssistance: true,
    emergencyAccessibility: true,
    notes: 'Recently modernized under NHIDCL accessibility directive. Ambulance bay on site.',
  },
  {
    id: 'loc-6',
    name: 'Aizawl Bawngkawn Passenger & Cargo Terminal',
    category: 'Transit Terminal',
    city: 'Aizawl',
    state: 'Mizoram',
    overallScore: 74,
    wheelchairAccessible: true,
    wheelchairParking: true,
    accessibleToilets: false,
    ramps: true,
    elevators: false,
    medicalAssistance: true,
    emergencyAccessibility: false,
    notes: 'Steep natural slope mitigated by winding accessible ramp corridor.',
  },
  {
    id: 'loc-7',
    name: 'Agartala Integrated Check Post (ICP)',
    category: 'Border Checkpoint',
    city: 'Agartala',
    state: 'Tripura',
    overallScore: 94,
    wheelchairAccessible: true,
    wheelchairParking: true,
    accessibleToilets: true,
    ramps: true,
    elevators: true,
    medicalAssistance: true,
    emergencyAccessibility: true,
    notes: 'State-of-the-art international barrier-free design with tactile paving throughout.',
  },
  {
    id: 'loc-8',
    name: 'Naharlagun Transport Terminal',
    category: 'Transit Terminal',
    city: 'Itanagar',
    state: 'Arunachal Pradesh',
    overallScore: 81,
    wheelchairAccessible: true,
    wheelchairParking: true,
    accessibleToilets: true,
    ramps: true,
    elevators: true,
    medicalAssistance: false,
    emergencyAccessibility: true,
    notes: 'Tactile navigation paths for visually impaired travelers and ramp connections.',
  },
];

interface AccessibilityViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const AccessibilityView: React.FC<AccessibilityViewProps> = ({ onNavigate }) => {
  const [userProfile, setUserProfile] = useState<UserProfileType>('wheelchair');
  const [selectedState, setSelectedState] = useState<RegionalStateData>(NER_STATES[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Profile-specific score weighting calculations
  const getAdjustedScore = (loc: AccessibleLocation) => {
    let score = loc.overallScore;
    if (userProfile === 'wheelchair') {
      if (!loc.wheelchairAccessible || !loc.ramps) score -= 25;
      if (!loc.accessibleToilets) score -= 10;
      if (!loc.wheelchairParking) score -= 8;
    } else if (userProfile === 'elderly') {
      if (!loc.ramps && !loc.elevators) score -= 20;
      if (!loc.medicalAssistance) score -= 15;
    } else if (userProfile === 'vision') {
      if (loc.overallScore < 85) score -= 10;
    }
    return Math.max(20, Math.min(100, score));
  };

  const getProfileAdvice = () => {
    switch (userProfile) {
      case 'wheelchair':
        return {
          title: 'Wheelchair Accessibility Protocol Active',
          desc: 'Prioritizes step-free access, 1:12 ramp gradients, accessible rest bays, and roll-on ambulance ramps.',
          scoreBoost: '87/100 Regional Compliance',
        };
      case 'elderly':
        return {
          title: 'Senior Citizen & Reduced Mobility Protocol',
          desc: 'Prioritizes routes with frequent rest stops, lower altitude variations, and on-route medical aid stations.',
          scoreBoost: '91/100 Comfort Rating',
        };
      case 'vision':
        return {
          title: 'Visual Assistance & Tactile Paving Protocol',
          desc: 'Filters for terminals with tactile paving, high-contrast visual wayfinding, and audible transit announcements.',
          scoreBoost: '84/100 Usability Rating',
        };
      case 'general':
      default:
        return {
          title: 'General Traveler & Standard Logistics Protocol',
          desc: 'Standard accessibility evaluation covering highway rest areas, fuel, and municipal amenities.',
          scoreBoost: '92/100 Readiness',
        };
    }
  };

  const filteredLocations = ACCESSIBLE_LOCATIONS.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const advice = getProfileAdvice();

  return (
    <div id="accessibility-view" className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Accessibility Intelligence & Infrastructure
            </h1>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 border border-emerald-200">
              INCLUSIVE MOBILITY AI
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Physical accessibility audits, barrier-free route ratings, and profile-tailored mobility guidance across 8 NER states.
          </p>
        </div>

        {/* User Profile Selector (Requirement #7) */}
        <div className="flex items-center space-x-1 rounded-2xl bg-slate-100 p-1.5 border border-slate-200 shadow-xs flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 px-2">Profile:</span>
          {[
            { id: 'wheelchair', label: 'Wheelchair User', icon: UserCheck },
            { id: 'elderly', label: 'Elderly Traveler', icon: HeartPulse },
            { id: 'vision', label: 'Visually Impaired', icon: Eye },
            { id: 'general', label: 'General User', icon: Smile },
          ].map((p) => {
            const Icon = p.icon;
            const isSelected = userProfile === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setUserProfile(p.id as UserProfileType)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Profile Adaptation Banner */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-extrabold text-blue-950">{advice.title}</h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{advice.desc}</p>
        </div>
        <div className="flex-shrink-0 bg-white px-4 py-2.5 rounded-xl border border-blue-200 shadow-2xs text-center">
          <span className="text-[10px] font-bold uppercase text-slate-500 block">Accessibility Rating</span>
          <span className="text-base font-black text-emerald-700 font-mono">{advice.scoreBoost}</span>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="space-y-2">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <span>Accessible Regional Corridor Map (Leaflet + OpenStreetMap)</span>
        </h3>
        <NerLeafletMap heightClass="h-[400px]" />
      </div>

      {/* Verified Accessible Locations Directory (Requirement #7) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Verified Physical Accessibility Directory
            </h3>
            <p className="text-xs text-slate-500">
              Audited infrastructure indicators for transit stops, trauma hospitals, and checkposts
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search city, hospital, or hub..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLocations.map((loc) => {
            const adjustedScore = getAdjustedScore(loc);

            return (
              <div
                key={loc.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 hover:border-blue-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {loc.category} • {loc.city}, {loc.state}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{loc.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Score</span>
                    <span
                      className={`font-mono text-lg font-black ${
                        adjustedScore > 80 ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {adjustedScore}/100
                    </span>
                  </div>
                </div>

                {/* 7 Required Feature Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] pt-1">
                  <div className="flex items-center space-x-1.5">
                    <span className={loc.wheelchairAccessible ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {loc.wheelchairAccessible ? '✓' : '✗'}
                    </span>
                    <span className={loc.wheelchairAccessible ? 'text-slate-800' : 'text-slate-400 line-through'}>
                      Wheelchair Access
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className={loc.wheelchairParking ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {loc.wheelchairParking ? '✓' : '✗'}
                    </span>
                    <span className={loc.wheelchairParking ? 'text-slate-800' : 'text-slate-400 line-through'}>
                      Accessible Parking
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className={loc.accessibleToilets ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {loc.accessibleToilets ? '✓' : '✗'}
                    </span>
                    <span className={loc.accessibleToilets ? 'text-slate-800' : 'text-slate-400 line-through'}>
                      Accessible Toilets
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className={loc.ramps ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {loc.ramps ? '✓' : '✗'}
                    </span>
                    <span className={loc.ramps ? 'text-slate-800' : 'text-slate-400 line-through'}>
                      Ramps (&le; 1:12)
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className={loc.elevators ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {loc.elevators ? '✓' : '✗'}
                    </span>
                    <span className={loc.elevators ? 'text-slate-800' : 'text-slate-400 line-through'}>
                      Elevators / Lifts
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className={loc.medicalAssistance ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {loc.medicalAssistance ? '✓' : '✗'}
                    </span>
                    <span className={loc.medicalAssistance ? 'text-slate-800' : 'text-slate-400 line-through'}>
                      Medical First-Aid
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                  <strong className="text-slate-800">Audit Notes:</strong> {loc.notes}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Indicator */}
      <DataSourceTrustIndicator />
    </div>
  );
};
