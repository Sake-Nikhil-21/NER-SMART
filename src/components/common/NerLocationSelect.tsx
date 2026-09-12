import React, { useState, useRef, useEffect, useId } from 'react';
import { MapPin, Search, ChevronDown, Check, X, Navigation } from 'lucide-react';
import { NER_LOCATION_DATA, NerStateGroup, NerCity } from '../../data/nerLocations';

interface NerLocationSelectProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: 'mapPin' | 'search';
  required?: boolean;
  onVoiceClick?: () => void;
  voiceLabel?: string;
  helperAction?: React.ReactNode;
}

export const NerLocationSelect: React.FC<NerLocationSelectProps> = ({
  id: propId,
  label,
  value,
  onChange,
  placeholder = 'Select location or type...',
  icon = 'mapPin',
  required = false,
  onVoiceClick,
  voiceLabel,
  helperAction,
}) => {
  const generatedId = useId();
  const inputId = propId || `ner-select-${generatedId}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({
    assam: true,
    manipur: true,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Expand matching state when dropdown opens or value changes
  useEffect(() => {
    if (value) {
      const match = NER_LOCATION_DATA.find((s) =>
        value.toLowerCase().includes(s.name.toLowerCase())
      );
      if (match) {
        setExpandedStates((prev) => ({ ...prev, [match.id]: true }));
      }
    }
  }, [value]);

  const handleSelectLocation = (locationString: string) => {
    onChange(locationString);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(true);
  };

  const toggleStateExpand = (stateId: string) => {
    setExpandedStates((prev) => ({
      ...prev,
      [stateId]: !prev[stateId],
    }));
  };

  // Filter based on user typed text
  const searchFilter = value.trim().toLowerCase();
  const isFiltering = searchFilter.length > 0;

  // Filtered states and cities
  const filteredStates = NER_LOCATION_DATA.filter((stateGroup) => {
    if (selectedStateFilter !== 'all' && stateGroup.id !== selectedStateFilter) {
      return false;
    }
    return true;
  }).map((stateGroup) => {
    const stateMatches =
      stateGroup.name.toLowerCase().includes(searchFilter) ||
      stateGroup.code.toLowerCase().includes(searchFilter) ||
      stateGroup.capital.toLowerCase().includes(searchFilter);

    const matchingCities = stateGroup.cities.filter((city) => {
      if (!isFiltering) return true;
      return (
        city.name.toLowerCase().includes(searchFilter) ||
        (city.tag && city.tag.toLowerCase().includes(searchFilter)) ||
        stateMatches
      );
    });

    return {
      ...stateGroup,
      stateMatches,
      matchingCities,
    };
  }).filter((group) => {
    if (!isFiltering) return true;
    return group.stateMatches || group.matchingCities.length > 0;
  });

  return (
    <div ref={containerRef} className="space-y-1.5 relative">
      {/* Label and Helper Header */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5 cursor-pointer"
        >
          {icon === 'mapPin' ? (
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          ) : (
            <Search className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          )}
          <span>{label}</span>
        </label>

        <div className="flex items-center space-x-1.5">
          {helperAction}
          {onVoiceClick && (
            <button
              type="button"
              onClick={onVoiceClick}
              className="flex items-center space-x-1 text-[11px] font-bold text-purple-700 hover:text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 hover:bg-purple-100 transition shadow-2xs"
              title="Speak your location"
            >
              <span>🔊 {voiceLabel || 'VOICE'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Input Box with Downward Arrow Dropdown Toggle */}
      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onClick={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className="w-full rounded-xl border border-slate-300 bg-white pl-3.5 pr-20 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition shadow-xs cursor-text"
        />

        {/* Action Controls on the Right: Clear button & Clear Downward Arrow */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center pr-1 space-x-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Clear text"
              aria-label="Clear location"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Prominent Downward Arrow ▼ Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen((prev) => !prev);
            }}
            aria-expanded={isOpen}
            aria-label="Choose from North Eastern Region locations list"
            className="flex items-center justify-center p-2 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 active:bg-blue-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            title="Click to choose from NER location list"
          >
            <ChevronDown
              className={`w-5 h-5 text-slate-700 font-black transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-blue-600' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Selectable Dropdown Menu with NER Region Hierarchy */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in duration-150 ring-1 ring-black/5">
          {/* Header Banner */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Choose North Eastern Region (NER) Location
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
                8 States & Cities
              </span>
            </div>

            {/* Quick State Selector Filter Pills */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setSelectedStateFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  selectedStateFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All States
              </button>
              {NER_LOCATION_DATA.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setSelectedStateFilter(st.id);
                    setExpandedStates((prev) => ({ ...prev, [st.id]: true }));
                  }}
                  className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                    selectedStateFilter === st.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

          {/* Location Groups Container */}
          <div className="max-h-72 sm:max-h-80 overflow-y-auto divide-y divide-slate-100 p-1.5">
            {filteredStates.length === 0 ? (
              <div className="p-6 text-center space-y-1">
                <p className="text-xs font-bold text-slate-700">No matching NER locations found</p>
                <p className="text-[11px] text-slate-500">
                  You can keep &ldquo;{value}&rdquo; as a custom point.
                </p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
                >
                  Use &ldquo;{value}&rdquo;
                </button>
              </div>
            ) : (
              filteredStates.map((stateGroup) => {
                const isSelectedState =
                  value.trim().toLowerCase() === stateGroup.name.toLowerCase();
                const isExpanded =
                  expandedStates[stateGroup.id] ||
                  isFiltering ||
                  selectedStateFilter === stateGroup.id;

                return (
                  <div key={stateGroup.id} className="py-1">
                    {/* STATE LEVEL ROW */}
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition">
                      <button
                        type="button"
                        onClick={() => toggleStateExpand(stateGroup.id)}
                        className="flex items-center space-x-2.5 text-left flex-1"
                      >
                        <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 font-mono text-[11px] font-black flex items-center justify-center border border-blue-200">
                          {stateGroup.code}
                        </span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                              {stateGroup.name}
                            </span>
                            {isSelectedState && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                Selected
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            Capital: {stateGroup.capital}
                          </span>
                        </div>
                      </button>

                      {/* State Action: Select State button & Expand arrow */}
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleSelectLocation(stateGroup.name)}
                          className="text-[11px] font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200 transition"
                          title={`Select ${stateGroup.name} state`}
                        >
                          Select State
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStateExpand(stateGroup.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                          title="View cities"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-150 ${
                              isExpanded ? 'rotate-180 text-blue-600' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* HIERARCHICAL IMPORTANT CITIES & HUBS */}
                    {isExpanded && (
                      <div className="pl-6 pr-2 py-1 space-y-0.5 border-l-2 border-blue-200 ml-4 my-1">
                        {stateGroup.matchingCities.map((city) => {
                          const fullLocationName = `${city.name}, ${stateGroup.name}`;
                          const isCitySelected =
                            value.trim().toLowerCase() === fullLocationName.toLowerCase() ||
                            value.trim().toLowerCase() === city.name.toLowerCase();

                          return (
                            <button
                              key={city.id}
                              type="button"
                              onClick={() => handleSelectLocation(fullLocationName)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition ${
                                isCitySelected
                                  ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-400 font-bold text-xs">↳</span>
                                <div>
                                  <span className="font-semibold text-slate-900">
                                    {city.name}
                                  </span>
                                  {city.tag && (
                                    <span className="text-[10px] text-slate-500 block font-normal">
                                      {city.tag}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-1.5 flex-shrink-0">
                                {city.isCapital && (
                                  <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                                    Capital
                                  </span>
                                )}
                                {isCitySelected && (
                                  <Check className="w-3.5 h-3.5 text-blue-600 font-black" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Help Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center space-x-1">
              <span>💡</span>
              <span>Click any state or city to select. Or type in the box to search.</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-blue-700 hover:text-blue-800 font-bold px-2.5 py-1 rounded-md hover:bg-blue-50 text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
