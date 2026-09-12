import React, { useEffect, useRef, useState } from 'react';
import { RouteOption, HubLocation, LiveAlert, EmergencyAsset } from '../../types';
import {
  MOCK_ROUTES_GUWAHATI_TO_IMPHAL,
  REGIONAL_HUBS,
  LIVE_ALERTS_DATA,
  EMERGENCY_ASSETS,
} from '../../data/mockData';
import {
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Truck,
  Layers,
  CloudRain,
  Crosshair,
  Sparkles,
  Info,
  Clock,
  Radio,
  Maximize2,
  Navigation2
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface NerMapProps {
  selectedRoute?: RouteOption | null;
  onSelectRoute?: (route: RouteOption) => void;
  originName?: string;
  destinationName?: string;
  activeLayers?: {
    routes: boolean;
    hubs: boolean;
    alerts: boolean;
    weather: boolean;
    emergency: boolean;
  };
  isEmergencyMode?: boolean;
  heightClass?: string;
  focusLocation?: [number, number] | null;
}

export const NerLeafletMap: React.FC<NerMapProps> = ({
  selectedRoute,
  onSelectRoute,
  originName,
  destinationName,
  activeLayers = {
    routes: true,
    hubs: true,
    alerts: true,
    weather: true,
    emergency: false,
  },
  isEmergencyMode = false,
  heightClass = 'h-[540px]',
  focusLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupsRef = useRef<{ [key: string]: any }>({});
  
  const [selectedHub, setSelectedHub] = useState<HubLocation | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<LiveAlert | null>(null);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyAsset | null>(null);
  const [activeRouteDetail, setActiveRouteDetail] = useState<RouteOption | null>(
    selectedRoute || MOCK_ROUTES_GUWAHATI_TO_IMPHAL[1]
  );
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (selectedRoute) {
      setActiveRouteDetail(selectedRoute);
    }
  }, [selectedRoute]);

  // Initialize Leaflet Map with OpenStreetMap tiles (100% Free, No API Key Required)
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      try {
        const L = (await import('leaflet')).default;

        if (!isMounted || !mapContainerRef.current) return;

        // Fix Leaflet's default marker icons in React bundles
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // Center on North East India (Assam, Meghalaya, Nagaland, Manipur)
        const map = L.map(mapContainerRef.current, {
          center: [25.7, 93.2],
          zoom: 7,
          minZoom: 5,
          maxZoom: 18,
          zoomControl: false,
        });

        // Standard OpenStreetMap tiles - Free, public, no API key required
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: ['a', 'b', 'c'],
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;
        layerGroupsRef.current = {
          routes: L.layerGroup().addTo(map),
          hubs: L.layerGroup().addTo(map),
          alerts: L.layerGroup().addTo(map),
          weather: L.layerGroup().addTo(map),
          emergency: L.layerGroup().addTo(map),
          markers: L.layerGroup().addTo(map),
        };

        setIsLeafletReady(true);

        // Invalidate size to ensure clean tile rendering on mount
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 150);
      } catch (err) {
        console.error('Failed to load Leaflet:', err);
      }
    };

    initMap();

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Layers, Routes, Start/Destination Markers on Leaflet map
  useEffect(() => {
    if (!isLeafletReady || !mapInstanceRef.current) return;

    const L = (window as any).L || (window as any).leaflet;
    if (!L) return;

    const map = mapInstanceRef.current;
    const { routes, hubs, alerts, weather, emergency, markers } = layerGroupsRef.current;

    // Clear old layers
    routes.clearLayers();
    hubs.clearLayers();
    alerts.clearLayers();
    weather.clearLayers();
    emergency.clearLayers();
    if (markers) markers.clearLayers();

    // 1. Draw Routes
    if (activeLayers.routes) {
      MOCK_ROUTES_GUWAHATI_TO_IMPHAL.forEach((route) => {
        const isHighlighted = activeRouteDetail?.id === route.id;
        const color =
          route.code === 'ROUTE_B'
            ? '#059669' // Emerald Green for Safe / AI Recommended
            : route.code === 'ROUTE_A'
            ? '#dc2626' // Red for High Risk
            : '#d97706'; // Amber for Alternate

        const weight = isHighlighted ? (route.code === 'ROUTE_B' ? 7 : 6) : 3.5;
        const opacity = isHighlighted ? 0.95 : 0.45;
        const dashArray = route.code === 'ROUTE_A' ? '7, 7' : undefined;

        const polyline = L.polyline(route.mapCoordinates, {
          color,
          weight,
          opacity,
          dashArray,
          lineJoin: 'round',
          lineCap: 'round',
        }).addTo(routes);

        polyline.on('click', () => {
          setActiveRouteDetail(route);
          if (onSelectRoute) onSelectRoute(route);
        });

        // Tooltip
        polyline.bindTooltip(
          `<div class="p-1">
            <strong style="color: ${color}; font-size: 12px;">${route.title}</strong><br/>
            <span style="font-size: 11px; color: #475569;">${route.distanceKm} km • ${route.eta} • Risk: ${route.riskScore}/100</span>
          </div>`,
          { sticky: true, className: 'leaflet-custom-tooltip' }
        );
      });

      // Draw Start and Destination Markers for active route
      if (activeRouteDetail && activeRouteDetail.mapCoordinates && activeRouteDetail.mapCoordinates.length > 1 && markers) {
        const coords = activeRouteDetail.mapCoordinates;
        const startCoord = coords[0];
        const destCoord = coords[coords.length - 1];

        const startLabel = originName ? originName.split(',')[0] : 'Origin';
        const destLabel = destinationName ? destinationName.split(',')[0] : 'Destination';

        // Start / Origin Icon
        const startIcon = L.divIcon({
          className: 'custom-start-marker',
          html: `
            <div class="flex items-center space-x-1 bg-emerald-600 text-white font-bold text-[10px] px-2 py-1 rounded-full shadow-lg border-2 border-white ring-2 ring-emerald-500/50 whitespace-nowrap">
              <span>● ${startLabel}</span>
            </div>
          `,
          iconSize: [80, 24],
          iconAnchor: [40, 12],
        });

        // Destination Icon
        const destIcon = L.divIcon({
          className: 'custom-dest-marker',
          html: `
            <div class="flex items-center space-x-1 bg-blue-700 text-white font-bold text-[10px] px-2 py-1 rounded-full shadow-lg border-2 border-white ring-2 ring-blue-500/50 whitespace-nowrap">
              <span>🏁 ${destLabel}</span>
            </div>
          `,
          iconSize: [95, 24],
          iconAnchor: [47, 12],
        });

        L.marker(startCoord, { icon: startIcon }).addTo(markers).bindTooltip(`<b>Start Location</b><br/>${originName || 'Guwahati Transit Node'}`, { sticky: true });
        L.marker(destCoord, { icon: destIcon }).addTo(markers).bindTooltip(`<b>Destination</b><br/>${destinationName || 'Imphal Terminal'}`, { sticky: true });
      }
    }

    // 2. Draw Logistics Hubs
    if (activeLayers.hubs) {
      REGIONAL_HUBS.forEach((hub) => {
        const customIcon = L.divIcon({
          className: 'custom-hub-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <span class="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              <div class="bg-white border-2 border-blue-600 rounded-lg p-1 shadow-md group-hover:scale-110 transition-all">
                <svg class="w-3.5 h-3.5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker(hub.coords, { icon: customIcon }).addTo(hubs);
        marker.on('click', () => {
          setSelectedHub(hub);
          setSelectedAlert(null);
          setSelectedEmergency(null);
        });
      });
    }

    // 3. Draw Live Alerts
    if (activeLayers.alerts) {
      LIVE_ALERTS_DATA.forEach((alert) => {
        const alertColor =
          alert.severity === 'critical'
            ? '#dc2626'
            : alert.severity === 'high'
            ? '#ea580c'
            : alert.severity === 'moderate'
            ? '#ca8a04'
            : '#16a34a';

        const alertIcon = L.divIcon({
          className: 'custom-alert-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer">
              <span class="absolute inline-flex h-7 w-7 rounded-full opacity-50 animate-ping" style="background-color: ${alertColor}"></span>
              <div class="rounded-full p-1.5 border-2 bg-white shadow-md flex items-center justify-center" style="border-color: ${alertColor}">
                <div class="w-2.5 h-2.5 rounded-full" style="background-color: ${alertColor}"></div>
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker(alert.coordinates, { icon: alertIcon }).addTo(alerts);
        marker.on('click', () => {
          setSelectedAlert(alert);
          setSelectedHub(null);
          setSelectedEmergency(null);
        });
      });
    }

    // 4. Draw Weather Hazards (Rainfall Isobars)
    if (activeLayers.weather) {
      // Add simulated radar rain cell over Kohima/Senapati
      const rainCircle = L.circle([25.4, 94.05], {
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.18,
        radius: 45000,
        dashArray: '4, 4',
      }).addTo(weather);
      rainCircle.bindTooltip('🌧️ Active Monsoon Cloudburst Band (78mm/24h)', { sticky: true });
    }

    // 5. Draw Emergency Facilities when Emergency Mode is active
    if (isEmergencyMode || activeLayers.emergency) {
      EMERGENCY_ASSETS.forEach((asset) => {
        const assetIcon = L.divIcon({
          className: 'custom-emergency-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer">
              <div class="bg-rose-100 border-2 border-rose-600 rounded-md p-1 shadow-sm">
                <span class="text-xs font-bold">${asset.type === 'Hospital' ? '🏥' : asset.type === 'NDRF Camp' ? '🛡️' : '🚁'}</span>
              </div>
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker(asset.coords, { icon: assetIcon }).addTo(emergency);
        marker.on('click', () => {
          setSelectedEmergency(asset);
          setSelectedHub(null);
          setSelectedAlert(null);
        });
      });
    }

    // Automatically fit map bounds to the active route
    if (activeRouteDetail?.mapCoordinates && activeRouteDetail.mapCoordinates.length > 0) {
      try {
        const bounds = L.latLngBounds(activeRouteDetail.mapCoordinates);
        map.fitBounds(bounds, { padding: [45, 45], maxZoom: 11, animate: true });
      } catch (e) {
        // fallback
      }
    }
  }, [isLeafletReady, activeLayers, activeRouteDetail, isEmergencyMode]);

  // Focus location changes
  useEffect(() => {
    if (mapInstanceRef.current && focusLocation) {
      mapInstanceRef.current.flyTo(focusLocation, 9, { duration: 1.2 });
    }
  }, [focusLocation]);

  const fitActiveRoute = () => {
    if (mapInstanceRef.current && activeRouteDetail?.mapCoordinates) {
      const L = (window as any).L || (window as any).leaflet;
      if (L) {
        const bounds = L.latLngBounds(activeRouteDetail.mapCoordinates);
        mapInstanceRef.current.fitBounds(bounds, { padding: [45, 45], maxZoom: 11, animate: true });
      }
    }
  };

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([25.7, 93.2], 7, { duration: 0.8 });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRefreshMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
      resetView();
    }
  };

  return (
    <div id="ner-gis-map-container" className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Map Header Controls */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
        <div className="flex items-center space-x-2 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200 backdrop-blur-md shadow-sm">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span className="font-bold text-slate-900">NER GIS Map (OpenStreetMap)</span>
          <span className="text-slate-500">| 8 States Live</span>
        </div>

        {isEmergencyMode && (
          <div className="flex items-center space-x-1.5 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-800 border border-rose-300 animate-pulse shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>DISASTER RESPONSE ACTIVE</span>
          </div>
        )}
      </div>

      {/* Map View Mode / Simple Action Buttons (Zoom In, Zoom Out, Refresh, Re-center) */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-wrap items-center gap-1.5">
        <button
          id="btn-map-zoom-in"
          type="button"
          onClick={handleZoomIn}
          className="flex items-center space-x-1 rounded-xl bg-white/95 px-2.5 py-1.5 text-xs font-bold text-slate-800 border border-slate-200 hover:bg-slate-50 transition shadow-sm active:scale-95"
          title="Zoom In"
        >
          <span>🔍 Zoom In</span>
        </button>

        <button
          id="btn-map-zoom-out"
          type="button"
          onClick={handleZoomOut}
          className="flex items-center space-x-1 rounded-xl bg-white/95 px-2.5 py-1.5 text-xs font-bold text-slate-800 border border-slate-200 hover:bg-slate-50 transition shadow-sm active:scale-95"
          title="Zoom Out"
        >
          <span>🔎 Zoom Out</span>
        </button>

        <button
          id="btn-map-refresh"
          type="button"
          onClick={handleRefreshMap}
          className="flex items-center space-x-1 rounded-xl bg-white/95 px-2.5 py-1.5 text-xs font-bold text-slate-800 border border-slate-200 hover:bg-slate-50 transition shadow-sm active:scale-95"
          title="Refresh Map"
        >
          <span>🔄 Refresh Map</span>
        </button>

        <button
          id="btn-map-reset-view"
          type="button"
          onClick={resetView}
          className="flex items-center space-x-1 rounded-xl bg-white/95 px-2.5 py-1.5 text-xs font-bold text-slate-800 border border-slate-200 hover:bg-slate-50 transition shadow-sm active:scale-95"
          title="Reset Map to Full North East View"
        >
          <span>📍 Re-center</span>
        </button>

        <button
          id="btn-map-fit-route"
          type="button"
          onClick={fitActiveRoute}
          className="flex items-center space-x-1 rounded-xl bg-blue-50/95 px-2.5 py-1.5 text-xs font-bold text-blue-700 border border-blue-200 hover:bg-blue-100 transition shadow-sm"
          title="Fit Complete Route to View"
        >
          <Navigation2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Fit Route</span>
        </button>
      </div>

      {/* The Leaflet / GIS Canvas Container */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-10`} />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] rounded-xl bg-white/95 p-3 text-xs border border-slate-200 backdrop-blur-md shadow-md max-w-xs sm:max-w-sm">
        <p className="font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <span>Route Risk Indicators</span>
          </span>
          <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">LIVE GIS</span>
        </p>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-5 rounded-full bg-emerald-600 border border-emerald-700"></span>
            <span className="font-bold text-emerald-800">🟢 Green = Low Risk / Recommended</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-5 rounded-full bg-amber-500 border border-amber-600"></span>
            <span className="font-bold text-amber-800">🟡 Yellow = Medium Risk / Caution</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-5 rounded-full bg-rose-600 border border-rose-700"></span>
            <span className="font-bold text-rose-800">🔴 Red = High Risk / Avoid</span>
          </div>
          <div className="flex items-center space-x-2 pt-1 border-t border-slate-200 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping"></span>
            <span>Active Landslide / Flood Incident</span>
          </div>
        </div>
      </div>

      {/* 3. Small compact arrow button shown after closing (attached near the right edge of map) */}
      {isPanelCollapsed && (
        <button
          id="btn-reopen-route-analysis"
          type="button"
          onClick={() => setIsPanelCollapsed(false)}
          aria-label="Re-open Route Analysis"
          title="Re-open Route Analysis (◀)"
          className="absolute top-14 right-2 sm:right-3 z-[1000] flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/95 border border-slate-300 text-slate-800 hover:text-blue-700 hover:bg-blue-50 shadow-md backdrop-blur-md transition-all duration-150 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
        >
          <span className="text-sm sm:text-base font-black text-blue-700 group-hover:-translate-x-0.5 transition-transform select-none">
            ◀
          </span>
        </button>
      )}

      {/* Interactive Route Analysis / Detail Drawer (Collapsible) */}
      {!isPanelCollapsed && (selectedHub || selectedAlert || selectedEmergency || activeRouteDetail) && (
        <div
          id="panel-route-analysis-box"
          className="absolute top-14 right-2 sm:right-3 z-[1000] w-72 sm:w-84 max-w-[calc(100%-1.25rem)] max-h-[calc(100%-4.5rem)] overflow-y-auto rounded-2xl bg-white/95 border border-slate-200 p-3.5 sm:p-4 shadow-xl backdrop-blur-md transition-all duration-200"
        >
          {/* Header with Title and Clear ✕ Close Button */}
          <div className="flex items-start justify-between pb-2 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-blue-700 uppercase">
                {selectedAlert
                  ? 'Hazard Incident Alert'
                  : selectedHub
                  ? 'Logistics Node Details'
                  : selectedEmergency
                  ? 'Emergency Facility'
                  : 'Route Analysis'}
              </span>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-1">
                {selectedAlert?.title || selectedHub?.name || selectedEmergency?.name || activeRouteDetail?.title}
              </h4>
            </div>
            <button
              id="btn-close-route-analysis"
              type="button"
              onClick={() => setIsPanelCollapsed(true)}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
              aria-label="Close route analysis panel"
              title="Close (✕)"
            >
              ✕
            </button>
          </div>

          <div className="mt-2.5 space-y-2.5 text-xs">
            {selectedAlert && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Severity:</span>
                  <RiskBadge level={selectedAlert.severity} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="text-slate-800 font-medium">{selectedAlert.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Reported:</span>
                  <span className="text-slate-700">{selectedAlert.timeAgo}</span>
                </div>
                <p className="text-slate-700 text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-200">
                  {selectedAlert.description}
                </p>
                <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  <strong className="block text-amber-900">Recommended Action:</strong>
                  {selectedAlert.recommendedAction}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAlert(null);
                  }}
                  className="w-full text-center text-[11px] font-semibold text-blue-600 hover:underline pt-1"
                >
                  ← Back to Route Analysis
                </button>
              </>
            )}

            {selectedHub && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">State:</span>
                  <span className="text-slate-800 font-semibold">{selectedHub.state}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Active Trucks:</span>
                  <span className="text-blue-700 font-mono font-bold">{selectedHub.activeShipments} Shipments</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Capacity Status:</span>
                  <span className="text-emerald-700 font-medium">{selectedHub.capacityStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Weather:</span>
                  <span className="text-slate-700">{selectedHub.weatherTemp} • {selectedHub.weatherCondition}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHub(null);
                  }}
                  className="w-full text-center text-[11px] font-semibold text-blue-600 hover:underline pt-1"
                >
                  ← Back to Route Analysis
                </button>
              </>
            )}

            {selectedEmergency && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Facility Type:</span>
                  <span className="text-rose-700 font-semibold">{selectedEmergency.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">State/Location:</span>
                  <span className="text-slate-800">{selectedEmergency.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-700 font-medium">{selectedEmergency.capacityStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">24/7 Helpline:</span>
                  <span className="text-blue-700 font-mono font-bold">{selectedEmergency.contact}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEmergency(null);
                  }}
                  className="w-full text-center text-[11px] font-semibold text-blue-600 hover:underline pt-1"
                >
                  ← Back to Route Analysis
                </button>
              </>
            )}

            {!selectedAlert && !selectedHub && !selectedEmergency && activeRouteDetail && (
              <>
                {/* Route A / B / C Quick Switcher */}
                <div className="space-y-1 bg-slate-50/90 p-2 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Select Route to Analyze:
                  </span>
                  <div className="space-y-1">
                    {MOCK_ROUTES_GUWAHATI_TO_IMPHAL.map((r) => {
                      const isSelected = activeRouteDetail.id === r.id;
                      const dot =
                        r.code === 'ROUTE_B'
                          ? '🟢'
                          : r.code === 'ROUTE_C'
                          ? '🟡'
                          : '🔴';
                      const label =
                        r.code === 'ROUTE_B'
                          ? 'Route B (Recommended Safe)'
                          : r.code === 'ROUTE_C'
                          ? 'Route C (Caution / Alternate)'
                          : 'Route A (High Risk / Mountain)';

                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => {
                            setActiveRouteDetail(r);
                            if (onSelectRoute) onSelectRoute(r);
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white font-bold shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="flex items-center space-x-1.5 truncate">
                            <span>{dot}</span>
                            <span className="truncate">{label}</span>
                          </span>
                          <span className={`text-[10px] font-mono flex-shrink-0 ml-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                            {r.distanceKm} km
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Safety / Accessibility Assessment */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Safety Score:</span>
                    <RiskBadge
                      level={activeRouteDetail.isAiRecommended ? 'ai-recommended' : activeRouteDetail.riskLevel}
                      text={activeRouteDetail.statusText}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-500 block text-[10px] font-mono uppercase">Distance</span>
                      <span className="text-slate-900 font-bold font-mono text-xs">{activeRouteDetail.distanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] font-mono uppercase">Estimated Time</span>
                      <span className="text-blue-700 font-bold font-mono text-xs">{activeRouteDetail.eta}</span>
                    </div>
                  </div>

                  {/* Weather & Road Analysis */}
                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Road Condition:</span>
                      <span className="font-semibold text-slate-800">
                        {activeRouteDetail.code === 'ROUTE_B'
                          ? 'Engineered 4-Lane / Grade Paved'
                          : activeRouteDetail.code === 'ROUTE_C'
                          ? '2-Lane Valley Highway'
                          : 'Narrow Mountain Ghats'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Hazard Exposure:</span>
                      <span className={`font-semibold ${
                        activeRouteDetail.code === 'ROUTE_B'
                          ? 'text-emerald-700'
                          : activeRouteDetail.code === 'ROUTE_C'
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}>
                        {activeRouteDetail.code === 'ROUTE_B'
                          ? 'Low (Monsoon Reinforced)'
                          : activeRouteDetail.code === 'ROUTE_C'
                          ? 'Medium (Moderate Rain)'
                          : 'High (Active Landslide Ridge)'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">
                    {activeRouteDetail.summary}
                  </p>

                  <button
                    id="btn-inspect-route-details"
                    type="button"
                    onClick={() => {
                      if (onSelectRoute) onSelectRoute(activeRouteDetail);
                    }}
                    className="w-full mt-1 py-1.5 text-center text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs cursor-pointer"
                  >
                    Analyze Detailed Route Factors →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

