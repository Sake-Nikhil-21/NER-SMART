export type NavigationTab =
  | 'landing'
  | 'picture-mode'
  | 'live-navigation'
  | 'dashboard'
  | 'smart-routes'
  | 'route-analysis'
  | 'logistics-planner'
  | 'accessibility'
  | 'risk-intelligence'
  | 'live-alerts'
  | 'ai-assistant'
  | 'settings'
  | 'about';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'blocked';
export type AlertSeverity = 'critical' | 'high' | 'moderate' | 'resolved';

export interface RiskFactor {
  name: string;
  scoreDelta: number; // e.g. +25
  desc: string;
  category: 'weather' | 'terrain' | 'traffic' | 'cargo' | 'infrastructure';
}

export interface RouteOption {
  id: string;
  code: 'ROUTE_A' | 'ROUTE_B' | 'ROUTE_C';
  title: string;
  subtitle: string;
  tag: string;
  isAiRecommended?: boolean;
  distanceKm: number;
  eta: string;
  durationMinutes: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  statusText: string;
  summary: string;
  highwayNumbers: string[];
  keyWaypoints: string[];
  riskFactors: RiskFactor[];
  suitableVehicles: string[];
  color: string;
  mapCoordinates: [number, number][];
  pros: string[];
  cons: string[];
  elevationPeakMeters: number;
  rainfallForecastMm: number;
}

export interface RouteQuery {
  from: string;
  to: string;
  vehicleType: string;
  cargoWeightTons: number;
  cargoType: string;
  priority: 'Normal' | 'High' | 'Emergency Medical';
  departureTime: string;
}

export interface HubLocation {
  id: string;
  name: string;
  state: string;
  coords: [number, number]; // [lat, lng]
  type: 'major_hub' | 'transit_hub' | 'border_post' | 'emergency_depot' | 'relief_center' | 'hospital';
  capacityStatus: 'Normal' | 'Busy' | 'Congested' | 'High Alert';
  activeShipments: number;
  weatherTemp: string;
  weatherCondition: string;
}

export interface RegionalStateData {
  id: string;
  name: string;
  capital: string;
  code: string;
  accessibilityPct: number;
  landslideRiskPct: number;
  floodRiskPct: number;
  roadNetworkKm: number;
  activeAlerts: number;
  status: 'optimal' | 'moderate' | 'congested' | 'alert';
  center: [number, number];
}

export interface LiveAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  location: string;
  state: string;
  timeAgo: string;
  timestamp: string;
  type: 'landslide' | 'rainfall' | 'traffic' | 'flood' | 'blockade' | 'restored';
  description: string;
  recommendedAction: string;
  affectedRoute: string;
  coordinates: [number, number];
}

export interface LogisticsStop {
  id: string;
  name: string;
  state: string;
  coords: [number, number];
  action: 'Origin Pickup' | 'Intermediate Drop' | 'Waypoint Check' | 'Final Destination';
  cargoChangeKg: number;
  eta: string;
  distanceKm: number;
}

export interface LogisticsPlan {
  stops: LogisticsStop[];
  totalDistanceKm: number;
  estimatedTime: string;
  fuelEstimateInr: number;
  overallRisk: 'LOW' | 'MODERATE' | 'HIGH';
  efficiencyScore: number;
  carbonEmissionKg: number;
}

export interface EmergencyAsset {
  id: string;
  name: string;
  type: 'Hospital' | 'NDRF Camp' | 'Relief Center' | 'Police HQ' | 'Helipad' | 'Safe Shelter';
  location: string;
  state: string;
  coords: [number, number];
  capacityStatus: 'Available' | 'High Load' | 'Critical';
  contact: string;
  distanceFromCorridorKm: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: () => void }[];
  metadata?: {
    suggestedRoute?: string;
    riskScore?: number;
    recommendedRoad?: string;
  };
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  durationMs?: number;
}

export type UserExperienceMode = 'citizen' | 'pro';
export type LanguageCode = 'en' | 'hi' | 'as' | 'bn' | 'ne';

export type CitizenVehicleType = 'car' | 'bike' | 'bus' | 'truck';

export interface CitizenPopularRoute {
  id: string;
  from: string;
  to: string;
  name: string;
  highway: string;
  distanceKm: number;
  driveTimeCar: string;
  driveTimeBus: string;
  status: 'safe' | 'caution' | 'danger';
  statusLabel: string;
  weatherSummary: string;
  landslideRisk: 'None' | 'Low' | 'Moderate' | 'High';
  petrolPumpsOpen: boolean;
  plainAdvice: string;
  tips: string[];
  imageUrl?: string;
  conditionImageUrl?: string;
  voiceHindi?: string;
  voiceAssamese?: string;
  voiceBengali?: string;
  voiceEnglish?: string;
}

export interface DestinationPicture {
  id: string;
  city: string;
  state: string;
  landmark: string;
  photo: string;
  tag: string;
}

export interface RoadSignalExplanation {
  color: 'green' | 'yellow' | 'red';
  title: string;
  symbol: string;
  meaningEn: string;
  meaningHi: string;
  meaningAs: string;
  meaningBn: string;
  photo: string;
  audioEn: string;
  audioHi: string;
  audioAs: string;
  audioBn: string;
}

export interface HelplineContact {
  id: string;
  title: string;
  number: string;
  category: 'highway' | 'police' | 'medical' | 'disaster' | 'state';
  description: string;
  isTollFree: boolean;
}
