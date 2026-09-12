import {
  RegionalStateData,
  HubLocation,
  RouteOption,
  LiveAlert,
  LogisticsPlan,
  EmergencyAsset,
  RouteQuery,
  CitizenPopularRoute,
  HelplineContact,
  DestinationPicture,
  RoadSignalExplanation
} from '../types';

export const DEFAULT_DEMO_QUERY: RouteQuery = {
  from: 'Guwahati, Assam',
  to: 'Imphal, Manipur',
  vehicleType: 'Heavy Truck (Multi-Axle 16-Wheeler)',
  cargoWeightTons: 10,
  cargoType: 'Essential Industrial & FMCG Goods',
  priority: 'High',
  departureTime: 'Tomorrow, 08:00 AM',
};

// Route Coordinates approximation for GIS drawing across NER
// Guwahati ~ [26.1445, 91.7362]
// Nagaon ~ [26.3452, 92.6840]
// Dimapur ~ [25.9090, 93.7266]
// Kohima ~ [25.6747, 94.1105]
// Senapati ~ [25.2677, 94.0186]
// Imphal ~ [24.8170, 93.9368]
// Silchar ~ [24.8333, 92.7789]
// Jiribam ~ [24.8037, 93.1278]
// Noney ~ [24.7892, 93.5822]

export const MOCK_ROUTES_GUWAHATI_TO_IMPHAL: RouteOption[] = [
  {
    id: 'route-a-fastest',
    code: 'ROUTE_A',
    title: 'Route A — Direct Mountain Corridor',
    subtitle: 'Via Nagaon → Dimapur → Kohima → Senapati (NH-29 / NH-2)',
    tag: 'FASTEST (SHORTEST TIME)',
    isAiRecommended: false,
    distanceKm: 480,
    eta: '10h 05m',
    durationMinutes: 605,
    riskScore: 72,
    riskLevel: 'high',
    statusText: 'HIGH RISK',
    summary: 'Direct passage through Kohima-Senapati ghats. High vulnerability to active monsoon slope movement.',
    highwayNumbers: ['NH-27', 'NH-29', 'NH-2'],
    keyWaypoints: ['Guwahati', 'Nagaon', 'Dimapur', 'Kohima', 'Senapati', 'Imphal'],
    riskFactors: [
      { name: 'Heavy Rainfall Alert', scoreDelta: 25, desc: 'High intensity monsoon band near Kohima-Maram stretch (78mm/24h)', category: 'weather' },
      { name: 'Landslide History', scoreDelta: 30, desc: '3 major slip events in the last 14 days along NH-2 Paglapahar & Senapati ghats', category: 'terrain' },
      { name: 'Road Condition Disruption', scoreDelta: 15, desc: 'Pavement subsidence on narrow hairpin turns with 1-lane bottleneck', category: 'infrastructure' },
      { name: 'Traffic Congestion', scoreDelta: 8, desc: 'Heavy vehicle queuing at Dimapur-Chumukedima transit checkpost', category: 'traffic' },
      { name: 'Vehicle & Cargo Load', scoreDelta: 4, desc: '10-ton axle stress on steep 9.2% incline zones', category: 'cargo' }
    ],
    suitableVehicles: ['Light Commercial Vehicles', 'Passenger SUVs', 'Emergency Convoy with Escort'],
    color: '#ef4444',
    mapCoordinates: [
      [26.1445, 91.7362], // Guwahati
      [26.1820, 92.1500], // Jagiroad
      [26.3452, 92.6840], // Nagaon
      [26.0120, 93.3100], // Diphu bypass
      [25.9090, 93.7266], // Dimapur
      [25.8100, 93.8500], // Chumukedima
      [25.6747, 94.1105], // Kohima
      [25.5200, 94.0800], // Maram
      [25.2677, 94.0186], // Senapati
      [24.9800, 93.9600], // Kangpokpi
      [24.8170, 93.9368]  // Imphal
    ],
    pros: ['Shortest geographic distance (480 km)', 'Direct single transit line'],
    cons: ['Critical landslide vulnerability', 'Active traffic jam near Kohima ridge', 'Dangerous for 10-ton loads in wet weather'],
    elevationPeakMeters: 1444,
    rainfallForecastMm: 78
  },
  {
    id: 'route-b-recommended',
    code: 'ROUTE_B',
    title: 'Route B — Southern Valleys & Bypass Corridor',
    subtitle: 'Via Lumding → Silchar → Jiribam → Noney Expressway (NH-27 / NH-37)',
    tag: 'AI RECOMMENDED (OPTIMAL SAFETY)',
    isAiRecommended: true,
    distanceKm: 505,
    eta: '11h 20m',
    durationMinutes: 680,
    riskScore: 28,
    riskLevel: 'low',
    statusText: 'LOW RISK',
    summary: 'Engineered highway with newly reinforced retaining walls, lower elevation gradient, and all-weather pavement.',
    highwayNumbers: ['NH-27', 'NH-54', 'NH-37 / New NH-37 Express'],
    keyWaypoints: ['Guwahati', 'Lumding', 'Silchar Bypass', 'Jiribam Border', 'Noney Bridge', 'Imphal West'],
    riskFactors: [
      { name: 'Rainfall Exposure', scoreDelta: 8, desc: 'Moderate intermittent drizzle (14mm/24h), well within drainage limits', category: 'weather' },
      { name: 'Slope Stability Index', scoreDelta: 6, desc: 'Geotextile netting and reinforced gabion walls active on cutting zones', category: 'terrain' },
      { name: 'Pavement Quality', scoreDelta: 4, desc: 'Multi-lane dual carriageway on 78% of corridor, high friction grade', category: 'infrastructure' },
      { name: 'Traffic Flow', scoreDelta: 5, desc: 'Free-flowing corridor with dedicated heavy-truck fast-lanes', category: 'traffic' },
      { name: 'Vehicle & Cargo Load', scoreDelta: 5, desc: 'Engineered for 40-ton multi-axle freight; optimal for 10 tons', category: 'cargo' }
    ],
    suitableVehicles: ['Heavy Commercial Multi-Axle', '10-40 Ton Trucks', 'Tankers', 'Container Freight'],
    color: '#10b981',
    mapCoordinates: [
      [26.1445, 91.7362], // Guwahati
      [26.1100, 92.3500], // Hojai approach
      [25.7500, 93.1700], // Lumding
      [25.1800, 92.8500], // Haflong bypass (engineered bridge)
      [24.8333, 92.7789], // Silchar Hub
      [24.7800, 92.9500], // Lakhipur
      [24.8037, 93.1278], // Jiribam Checkpost
      [24.7892, 93.5822], // Noney Viaduct
      [24.8100, 93.7800], // Awang Khunou
      [24.8170, 93.9368]  // Imphal
    ],
    pros: [
      '★ 61% lower disruption risk for heavy trucks',
      'Engineered all-weather culverts and landslide nets',
      'Stable low-elevation passage with gentle gradients',
      '24/7 highway patrol and recovery cranes deployed'
    ],
    cons: ['+25 km longer than direct mountain ridge', '+1 hour 15 min estimated driving time'],
    elevationPeakMeters: 790,
    rainfallForecastMm: 14
  },
  {
    id: 'route-c-alternative',
    code: 'ROUTE_C',
    title: 'Route C — Upper Assam & Golaghat Flank',
    subtitle: 'Via Kaziranga Edge → Golaghat → Dimapur Bypass → Senapati South',
    tag: 'ALTERNATIVE ROUTE',
    isAiRecommended: false,
    distanceKm: 530,
    eta: '12h 10m',
    durationMinutes: 730,
    riskScore: 41,
    riskLevel: 'moderate',
    statusText: 'MODERATE RISK',
    summary: 'Wider peripheral loop bypassing upper Meghalaya hills. Suitable as secondary fallback if NH-37 experiences maintenance.',
    highwayNumbers: ['NH-715', 'NH-129', 'NH-2'],
    keyWaypoints: ['Guwahati', 'Tezpur Bridge', 'Golaghat', 'Dimapur Outskirts', 'Senapati Southern Cut', 'Imphal'],
    riskFactors: [
      { name: 'Weather Index', scoreDelta: 14, desc: 'Moderate rains with fog pockets near river basins in early morning', category: 'weather' },
      { name: 'Terrain Exposure', scoreDelta: 12, desc: 'Moderate slope angles; 1 patch of loose gravel near boundary check', category: 'terrain' },
      { name: 'Highway Restrictions', scoreDelta: 7, desc: 'Wildlife speed ceiling (40 km/h) near Kaziranga forest buffer', category: 'traffic' },
      { name: 'Bridge Load Limit', scoreDelta: 5, desc: 'Single older truss bridge with 20-ton ceiling', category: 'infrastructure' },
      { name: 'Cargo Handling', scoreDelta: 3, desc: 'Comfortable for 10-ton truck', category: 'cargo' }
    ],
    suitableVehicles: ['Medium Trucks', 'Standard Heavy Commercial Trucks', 'Buses'],
    color: '#f59e0b',
    mapCoordinates: [
      [26.1445, 91.7362], // Guwahati
      [26.6300, 92.7900], // Tezpur Bridge
      [26.5000, 93.4500], // Bokakhat
      [26.5167, 93.9667], // Golaghat
      [25.9800, 93.8800], // Dimapur Outskirts
      [25.6200, 94.1500], // Kohima Eastern Ring
      [25.2677, 94.0186], // Senapati
      [24.8170, 93.9368]  // Imphal
    ],
    pros: ['Avoids core central choke points', 'Excellent wide toll road in Assam portion'],
    cons: ['Longest route (+50 km)', 'Wildlife corridor speed limits apply', 'Moderate ETA delay'],
    elevationPeakMeters: 1120,
    rainfallForecastMm: 32
  }
];

export const NER_STATES: RegionalStateData[] = [
  {
    id: 'assam',
    name: 'Assam',
    capital: 'Dispur / Guwahati',
    code: 'AS',
    accessibilityPct: 91,
    landslideRiskPct: 24,
    floodRiskPct: 58,
    roadNetworkKm: 4280,
    activeAlerts: 6,
    status: 'optimal',
    center: [26.2006, 92.9376]
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    capital: 'Shillong',
    code: 'ML',
    accessibilityPct: 78,
    landslideRiskPct: 62,
    floodRiskPct: 18,
    roadNetworkKm: 1890,
    activeAlerts: 4,
    status: 'moderate',
    center: [25.4670, 91.3662]
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    capital: 'Kohima',
    code: 'NL',
    accessibilityPct: 73,
    landslideRiskPct: 71,
    floodRiskPct: 12,
    roadNetworkKm: 1420,
    activeAlerts: 5,
    status: 'moderate',
    center: [26.1584, 94.5624]
  },
  {
    id: 'manipur',
    name: 'Manipur',
    capital: 'Imphal',
    code: 'MN',
    accessibilityPct: 69,
    landslideRiskPct: 76,
    floodRiskPct: 35,
    roadNetworkKm: 1610,
    activeAlerts: 5,
    status: 'alert',
    center: [24.6637, 93.9063]
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    capital: 'Aizawl',
    code: 'MZ',
    accessibilityPct: 75,
    landslideRiskPct: 69,
    floodRiskPct: 15,
    roadNetworkKm: 1280,
    activeAlerts: 2,
    status: 'moderate',
    center: [23.1645, 92.9376]
  },
  {
    id: 'tripura',
    name: 'Tripura',
    capital: 'Agartala',
    code: 'TR',
    accessibilityPct: 88,
    landslideRiskPct: 19,
    floodRiskPct: 41,
    roadNetworkKm: 1150,
    activeAlerts: 1,
    status: 'optimal',
    center: [23.9408, 91.9882]
  },
  {
    id: 'arunachal',
    name: 'Arunachal Pradesh',
    capital: 'Itanagar',
    code: 'AR',
    accessibilityPct: 64,
    landslideRiskPct: 84,
    floodRiskPct: 29,
    roadNetworkKm: 2950,
    activeAlerts: 8,
    status: 'congested',
    center: [28.2180, 94.7278]
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    capital: 'Gangtok',
    code: 'SK',
    accessibilityPct: 81,
    landslideRiskPct: 59,
    floodRiskPct: 22,
    roadNetworkKm: 980,
    activeAlerts: 2,
    status: 'optimal',
    center: [27.5330, 88.5122]
  }
];

export const REGIONAL_HUBS: HubLocation[] = [
  {
    id: 'hub-guwahati',
    name: 'Guwahati Multi-Modal Logistics Park',
    state: 'Assam',
    coords: [26.1445, 91.7362],
    type: 'major_hub',
    capacityStatus: 'Normal',
    activeShipments: 142,
    weatherTemp: '28°C',
    weatherCondition: 'Scattered Clouds'
  },
  {
    id: 'hub-silchar',
    name: 'Silchar Southern Logistics Depot',
    state: 'Assam / Barak Valley',
    coords: [24.8333, 92.7789],
    type: 'major_hub',
    capacityStatus: 'Normal',
    activeShipments: 68,
    weatherTemp: '27°C',
    weatherCondition: 'Light Rain'
  },
  {
    id: 'hub-dimapur',
    name: 'Dimapur Railhead & Freight Yard',
    state: 'Nagaland',
    coords: [25.9090, 93.7266],
    type: 'transit_hub',
    capacityStatus: 'Congested',
    activeShipments: 54,
    weatherTemp: '25°C',
    weatherCondition: 'Moderate Rain'
  },
  {
    id: 'hub-kohima',
    name: 'Kohima Highland Transit Hub',
    state: 'Nagaland',
    coords: [25.6747, 94.1105],
    type: 'transit_hub',
    capacityStatus: 'High Alert',
    activeShipments: 32,
    weatherTemp: '19°C',
    weatherCondition: 'Heavy Downpour'
  },
  {
    id: 'hub-imphal',
    name: 'Imphal Mantripukhri Logistics Center',
    state: 'Manipur',
    coords: [24.8170, 93.9368],
    type: 'major_hub',
    capacityStatus: 'High Alert',
    activeShipments: 47,
    weatherTemp: '22°C',
    weatherCondition: 'Thunderstorm'
  },
  {
    id: 'hub-aizawl',
    name: 'Aizawl Bawngkawn Freight Terminal',
    state: 'Mizoram',
    coords: [23.7271, 92.7176],
    type: 'transit_hub',
    capacityStatus: 'Normal',
    activeShipments: 29,
    weatherTemp: '21°C',
    weatherCondition: 'Overcast'
  },
  {
    id: 'hub-agartala',
    name: 'Agartala Integrated Check Post (ICP)',
    state: 'Tripura',
    coords: [23.8315, 91.2868],
    type: 'border_post',
    capacityStatus: 'Normal',
    activeShipments: 38,
    weatherTemp: '29°C',
    weatherCondition: 'Clear'
  },
  {
    id: 'hub-shillong',
    name: 'Shillong Umiam Logistics Node',
    state: 'Meghalaya',
    coords: [25.5788, 91.8933],
    type: 'transit_hub',
    capacityStatus: 'Normal',
    activeShipments: 31,
    weatherTemp: '18°C',
    weatherCondition: 'Misty Rain'
  },
  {
    id: 'hub-itanagar',
    name: 'Naharlagun Transport Complex',
    state: 'Arunachal Pradesh',
    coords: [27.0988, 93.6166],
    type: 'transit_hub',
    capacityStatus: 'Busy',
    activeShipments: 22,
    weatherTemp: '23°C',
    weatherCondition: 'Cloudy'
  },
  {
    id: 'hub-gangtok',
    name: 'Ranipool Freight Terminal',
    state: 'Sikkim',
    coords: [27.3389, 88.6065],
    type: 'transit_hub',
    capacityStatus: 'Normal',
    activeShipments: 19,
    weatherTemp: '16°C',
    weatherCondition: 'Foggy'
  }
];

export const LIVE_ALERTS_DATA: LiveAlert[] = [
  {
    id: 'alert-crit-1',
    severity: 'critical',
    title: 'Road section temporarily inaccessible due to landslide',
    location: 'Near Senapati-Imphal stretch (NH-2 Km 284)',
    state: 'Manipur',
    timeAgo: '10 minutes ago',
    timestamp: 'Today, 11:02 AM',
    type: 'landslide',
    description: 'Debris flow from upper hill slope triggered by localized cloudburst. Border Roads Organisation (BRO) earthmovers dispatched.',
    recommendedAction: 'Reroute all heavy cargo through NH-37 Jiribam-Silchar corridor immediately.',
    affectedRoute: 'NH-2 (Kohima ↔ Imphal Direct)',
    coordinates: [25.1200, 94.0200]
  },
  {
    id: 'alert-high-1',
    severity: 'high',
    title: 'Heavy rainfall expected near Kohima ridge',
    location: 'Kohima-Zubza Ghats (NH-29)',
    state: 'Nagaland',
    timeAgo: '42 minutes ago',
    timestamp: 'Today, 10:30 AM',
    type: 'rainfall',
    description: 'IMD Doppler Radar indicates persistent precipitation exceeding 28mm/hr for next 4 hours. Low visibility & slick mud surface.',
    recommendedAction: 'Advise heavy trucks to hold at Dimapur parking yard or take southern Haflong bypass.',
    affectedRoute: 'NH-29',
    coordinates: [25.6747, 94.1105]
  },
  {
    id: 'alert-mod-1',
    severity: 'moderate',
    title: 'Traffic congestion detected near Dimapur checkpost',
    location: 'Chumukedima Bridge Crossing',
    state: 'Nagaland',
    timeAgo: '1 hour ago',
    timestamp: 'Today, 10:12 AM',
    type: 'traffic',
    description: 'Single-lane vehicle queuing due to routine border scanning and weighbridge calibration.',
    recommendedAction: 'Expect 35-45 min delay. Plan buffer time for scheduled deliveries.',
    affectedRoute: 'NH-29',
    coordinates: [25.8100, 93.8500]
  },
  {
    id: 'alert-res-1',
    severity: 'resolved',
    title: 'Road accessibility restored near Imphal West',
    location: 'Noney Expressway Viaduct (NH-37)',
    state: 'Manipur',
    timeAgo: '2 hours ago',
    timestamp: 'Today, 09:15 AM',
    type: 'restored',
    description: 'Precautionary slope inspection cleared by NHIDCL engineers. All 2 lanes operational with green transit status.',
    recommendedAction: 'Cleared for high-tonnage multi-axle freight movement.',
    affectedRoute: 'NH-37',
    coordinates: [24.7892, 93.5822]
  },
  {
    id: 'alert-high-2',
    severity: 'high',
    title: 'Flash flood warning along Kopili River banks',
    location: 'Kampur-Lumding lowlands',
    state: 'Assam',
    timeAgo: '3 hours ago',
    timestamp: 'Today, 08:10 AM',
    type: 'flood',
    description: 'River water level nearing warning mark. Elevated flyover routes operating normally, avoid low service roads.',
    recommendedAction: 'Use elevated main highway NH-27.',
    affectedRoute: 'State Highway 19',
    coordinates: [25.9500, 92.8000]
  },
  {
    id: 'alert-mod-2',
    severity: 'moderate',
    title: 'Dense fog corridor advisory',
    location: 'Tawang-Sela Pass corridor',
    state: 'Arunachal Pradesh',
    timeAgo: '4 hours ago',
    timestamp: 'Today, 07:05 AM',
    type: 'rainfall',
    description: 'Visibility drops below 50m above 9,000 ft. Escorted convoy speed restricted to 25 km/h.',
    recommendedAction: 'Convoy headlights mandatory. Restrict night travel.',
    affectedRoute: 'NH-13 / Trans-Arunachal Highway',
    coordinates: [27.5000, 92.1000]
  }
];

export const MOCK_MULTI_STOP_LOGISTICS: LogisticsPlan = {
  stops: [
    {
      id: 'stop-1',
      name: 'Guwahati Central Hub',
      state: 'Assam',
      coords: [26.1445, 91.7362],
      action: 'Origin Pickup',
      cargoChangeKg: 10000,
      eta: 'Day 1, 08:00 AM',
      distanceKm: 0
    },
    {
      id: 'stop-2',
      name: 'Kohima Bypass Depot',
      state: 'Nagaland',
      coords: [25.6747, 94.1105],
      action: 'Intermediate Drop',
      cargoChangeKg: -2500,
      eta: 'Day 1, 04:30 PM',
      distanceKm: 340
    },
    {
      id: 'stop-3',
      name: 'Imphal Mantripukhri Hub',
      state: 'Manipur',
      coords: [24.8170, 93.9368],
      action: 'Intermediate Drop',
      cargoChangeKg: -4500,
      eta: 'Day 2, 09:15 AM',
      distanceKm: 140
    },
    {
      id: 'stop-4',
      name: 'Aizawl Bawngkawn Complex',
      state: 'Mizoram',
      coords: [23.7271, 92.7176],
      action: 'Final Destination',
      cargoChangeKg: -3000,
      eta: 'Day 2, 05:45 PM',
      distanceKm: 452
    }
  ],
  totalDistanceKm: 932,
  estimatedTime: '20h 35m',
  fuelEstimateInr: 8450,
  overallRisk: 'MODERATE',
  efficiencyScore: 92.4,
  carbonEmissionKg: 420
};

export const EMERGENCY_ASSETS: EmergencyAsset[] = [
  {
    id: 'em-1',
    name: '1st Battalion NDRF Patgaon Hub',
    type: 'NDRF Camp',
    location: 'Guwahati West, Assam',
    state: 'Assam',
    coords: [26.1100, 91.6000],
    capacityStatus: 'Available',
    contact: '+91-361-2849001',
    distanceFromCorridorKm: 4.2
  },
  {
    id: 'em-2',
    name: 'RIMS Regional Trauma Center',
    type: 'Hospital',
    location: 'Lamphelpat, Imphal',
    state: 'Manipur',
    coords: [24.8210, 93.9230],
    capacityStatus: 'High Load',
    contact: '+91-385-2414625',
    distanceFromCorridorKm: 1.8
  },
  {
    id: 'em-3',
    name: 'Assam Rifles Transit Support & Helipad',
    type: 'Helipad',
    location: 'Kohima South, Nagaland',
    state: 'Nagaland',
    coords: [25.6500, 94.1000],
    capacityStatus: 'Available',
    contact: '+91-370-2240112',
    distanceFromCorridorKm: 2.1
  },
  {
    id: 'em-4',
    name: 'Jiribam Border Relief Center & Heavy Crane Depot',
    type: 'Relief Center',
    location: 'Jiribam Border, Manipur',
    state: 'Manipur',
    coords: [24.8037, 93.1278],
    capacityStatus: 'Available',
    contact: '+91-387-6223400',
    distanceFromCorridorKm: 0.5
  },
  {
    id: 'em-5',
    name: 'Silchar Medical College Emergency Wing',
    type: 'Hospital',
    location: 'Ghungoor, Silchar',
    state: 'Assam',
    coords: [24.7800, 92.7900],
    capacityStatus: 'Available',
    contact: '+91-384-2240222',
    distanceFromCorridorKm: 3.5
  },
  {
    id: 'em-6',
    name: 'NDRF Quick Response Team Dimapur',
    type: 'NDRF Camp',
    location: 'Padumpukhuri, Dimapur',
    state: 'Nagaland',
    coords: [25.8900, 93.7400],
    capacityStatus: 'Available',
    contact: '+91-386-2244101',
    distanceFromCorridorKm: 1.2
  }
];

export const SAMPLE_AI_QUESTIONS = [
  'Is NH-2 currently safe for heavy trucks?',
  'Why is Route B recommended over Route A?',
  'What is the best route from Guwahati to Imphal today?',
  'Show me high-risk landslide zones.',
  'Can a 16-wheeler truck pass through Haflong ghats?',
  'What is the emergency evacuation route for Kohima?',
];

export const MOCK_AI_RESPONSES: Record<string, string> = {
  'Is NH-2 currently safe for heavy trucks?': `**NH-2 Safety Telemetry (Kohima ➔ Imphal):**\n\n🔴 **NOT RECOMMENDED TODAY FOR HEAVY TRUCKS (10T+).**\n\n- **Hazard:** Active mud slip recorded at Km 284 near Senapati (78mm precipitation).\n- **Axle Risk:** Soft unpaved shoulder slippage probability is **68%** for multi-axle trucks on steep 9.2% inclines.\n- **Recommendation:** Divert freight via **Route B (NH-37 Jiribam Expressway)** for an all-weather engineered road surface.`,

  'Why is Route B recommended over Route A?': `**Why AI Recommends Route B:**\n\n1. **Significantly Lower Risk:** Risk score is **28/100 (Low)** compared to **72/100 (High)** on Route A.\n2. **Weather Safety:** Avoids the heavy 78mm cloudburst band over Kohima ridges (Route B has <14mm rainfall).\n3. **Modern Retaining Infrastructure:** NH-37 Haflong-Jiribam corridor features 42 recently completed RCC retaining walls and geotextile rockfall barriers.\n4. **Heavy Load Compatibility:** Dual-carriageway design engineered for multi-axle commercial transport up to 40 Tons.`,

  'What is the best route from Guwahati to Imphal today?': `The best route today is **Route B (via Silchar & Jiribam NH-37)**.\n\n- **Distance:** 505 km\n- **ETA:** 11h 20m\n- **Safety Index:** 94% on-time completion probability\n- **Disruption Prevention:** Bypasses blocked landslides along the Senapati mountain pass.`,

  'Show me high-risk landslide zones.': `**Active High-Risk Landslide & Slope Hazard Zones:**\n\n1. 🔴 **NH-2 Senapati–Kangpokpi Ghats (Manipur):** Landslide debris on roadway.\n2. 🟠 **NH-29 Kohima–Zubza Pass (Nagaland):** Heavy rainfall (78mm/24h) & waterlogging.\n3. 🟠 **NH-13 Bhalukpong–Tenga Valley (Arunachal Pradesh):** Steep slope rockfall warning.\n4. 🟡 **NH-6 Lumshnong Stretch (Meghalaya):** Cave-in vulnerability under intense monsoon run-off.`,

  'default': `**road_navi AI Telemetry Analysis:**\n\nBased on real-time North East GIS telemetry and IMD rainfall radar:\n- Regional road accessibility is currently evaluated at **82% normal**.\n- Heavy commercial multi-axle freight should check bridge load limits and recent mud slip advisories.\n- For critical freight, alternative low-elevation valley corridors are recommended during monsoon precipitation.\n\nWould you like me to calculate a multi-stop route optimization?`
};

export const AI_KNOWLEDGE_RESPONSES: Record<string, string> = {
  'why is route b safer': `**AI Comprehensive Risk Analysis: Why Route B is Recommended**

1. **Topographic Stability:** Route B follows the engineered southern valley passage (via Silchar & Jiribam NH-37) where recent NHIDCL slope stabilization, geotextile anchoring, and reinforced retaining walls significantly suppress slope failure risks.
2. **Elevation & Monsoon Gradient:** While Route A peaks at 1,444 meters over vulnerable mountain cuts with 78mm active rainfall, Route B remains under 790m with only 14mm precipitation forecast.
3. **Heavy Vehicle Dynamics:** For a 10-ton multi-axle freight truck, Route A includes dangerous 9.2% hairpin grades prone to jackknifing during mud accumulation. Route B offers wider dual-carriageway lanes and continuous 24/7 recovery cranes.
4. **Disruption Probability:** Disruption score on Route B is just **28/100 (Low)** vs **72/100 (High)** on Route A.`,

  'can a 10-ton truck use this route': `**Tonnage & Axle Feasibility Check:**
- **Guwahati → Imphal via Route B (NH-37 Jiribam):** **YES — FULLY CERTIFIED.** Designed for up to 40-ton multi-axle commercial transport. Bridge weight ratings are rated at 70R Class.
- **Guwahati → Imphal via Route A (NH-2 Senapati):** **NOT RECOMMENDED TODAY.** Active slip warnings near Senapati create extreme 1-lane bottlenecks where 10-ton trucks face severe rollover risks on soft shoulders.`,

  'find the safest route to imphal': `The safest route from **Guwahati to Imphal** is **Route B (505 km, 11h 20m, Risk 28/100 — Low Risk)** via NH-27 → Silchar → NH-37 Jiribam Expressway. 

Although it is 25 km longer than Route A, it avoids the critical landslide zone between Kohima and Senapati, ensuring an unbroken on-time delivery.`,

  'show current high-risk areas': `**Current Monitored High-Risk Zones in NER:**
1. 🔴 **NH-2 Senapati–Kangpokpi Stretch (Manipur):** Landslide debris on roadway (Critical).
2. 🟠 **NH-29 Kohima–Zubza Ghats (Nagaland):** Heavy rainfall band (78mm/24h) & slick pavement.
3. 🟠 **NH-13 Sela Pass Corridor (Arunachal Pradesh):** Dense fog & early winter frost.
4. 🟡 **Kopili River Belt (Assam):** River bank overflow risk on service roads.`,

  'optimize my delivery': `**Logistics Optimizer Output:**
For multi-node delivery across **Guwahati → Kohima → Imphal → Aizawl**:
- Optimized Sequence: **Guwahati (Pickup) → Kohima (-2.5T) → Imphal (-4.5T) → Aizawl (-3.0T)**
- Total Distance: **932 km**
- Projected Time: **20h 35m**
- Fuel Efficiency: **₹8,450 (14.2% lower fuel burn)**
- Risk Level: **MODERATE (Stable via southern transit corridor)**`,

  'what roads are blocked': `**Active Road Blockage & Restriction Feed:**
- 🔴 **NH-2 Km 284 (Near Senapati, Manipur):** Temporarily blocked due to sudden mud slip. Clearing operation underway by BRO; expected clearance in 3.5 hours.
- 🟡 **NH-29 Chumukedima (Nagaland):** Single-lane traffic movement due to security checkpost queue.`
};

export const AI_SIMULATION_STEPS = [
  { step: 1, text: 'Collecting regional GIS & telemetry corridor coordinates...', duration: 550 },
  { step: 2, text: 'Querying IMD Doppler weather & 24h precipitation models...', duration: 600 },
  { step: 3, text: 'Evaluating real-time road accessibility & bridge load limits...', duration: 600 },
  { step: 4, text: 'Running probabilistic landslide & slope failure models...', duration: 650 },
  { step: 5, text: 'Computing highway bottlenecks & weighbridge traffic congestion...', duration: 550 },
  { step: 6, text: 'Cross-analyzing vehicle class (Heavy Truck) & 10-Ton cargo dynamics...', duration: 600 },
  { step: 7, text: 'Generating multi-attribute Pareto route comparisons (A, B, C)...', duration: 650 },
  { step: 8, text: 'Synthesizing Explainable AI safety recommendation for Route B...', duration: 500 }
];

export const CITIZEN_POPULAR_ROUTES: CitizenPopularRoute[] = [
  {
    id: 'cit-1',
    from: 'Guwahati, Assam',
    to: 'Shillong, Meghalaya',
    name: 'Guwahati to Shillong Expressway',
    highway: 'NH-6 (4-Lane Scenic Highway)',
    distanceKm: 98,
    driveTimeCar: '2h 15m',
    driveTimeBus: '3h 30m',
    status: 'safe',
    statusLabel: 'CLEAR & SAFE',
    weatherSummary: 'Pleasant 21°C • Light cloud cover • Great visibility',
    landslideRisk: 'None',
    petrolPumpsOpen: true,
    plainAdvice: 'Excellent 4-lane road conditions. Umiam Lake viewpoint area is completely clear. Safe for night travel.',
    tips: [
      'Top-up fuel at Jorabat or Nongpoh',
      'Popular family restaurants active at Nongpoh stretch',
      'No heavy fog expected before 9 PM'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    conditionImageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    voiceHindi: 'गुवाहाटी से शिलांग का रास्ता बिल्कुल साफ और सुरक्षित है। सड़क पर कोई रुकावट नहीं है। कार से सवा दो घंटे लगेंगे। पेट्रोल पंप खुले हैं।',
    voiceAssamese: 'গুৱাহাটীৰ পৰা শ্বিলংলৈ পথ সম্পূৰ্ণ সুৰক্ষিত আৰু খোলা আছে। কোনো বাধা নাই। গাড়ীৰে দুঘণ্টা পোন্ধৰ মিনিট লাগিব।',
    voiceBengali: 'গুয়াহাটি থেকে শিলং রাস্তা সম্পূর্ণ নিরাপদ এবং খোলা আছে। গাড়ি নিয়ে যেতে প্রায় দুই ঘন্টা পনেরো মিনিট সময় লাগবে।',
    voiceEnglish: 'Guwahati to Shillong expressway is clear and completely safe. Road conditions are excellent with all fuel stations open.'
  },
  {
    id: 'cit-2',
    from: 'Guwahati, Assam',
    to: 'Kaziranga / Tezpur, Assam',
    name: 'Guwahati to Kaziranga National Park',
    highway: 'NH-27 / NH-715',
    distanceKm: 195,
    driveTimeCar: '3h 45m',
    driveTimeBus: '5h 15m',
    status: 'safe',
    statusLabel: 'ALL CLEAR',
    weatherSummary: 'Sunny 29°C • Dry tarmac • Low wind',
    landslideRisk: 'None',
    petrolPumpsOpen: true,
    plainAdvice: 'Smooth 4-lane highway up to Nagaon bypass. Please observe animal crossing 40 km/h speed limits in Kaziranga corridor.',
    tips: [
      'Speed cameras active in Kohora & Bagori ranges',
      'EV Charging & petrol pumps open 24x7 near Nagaon',
      'Ideal for family cars and tourist buses'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581852017103-68ac65514cf7?auto=format&fit=crop&w=600&q=80',
    conditionImageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    voiceHindi: 'गुवाहाटी से काजीरंगा राष्ट्रीय उद्यान का रास्ता पूरी तरह खुला है। धूप खिली है और सड़क सूखी है। काजीरंगा में गति 40 किलोमीटर से कम रखें।',
    voiceAssamese: 'গুৱাহাটীৰ পৰা কাজিৰঙালৈ ৰাষ্ট্ৰীয় ঘাইপথ সম্পূৰ্ণ পৰিষ্কাৰ আৰু সুৰক্ষিত। কাজিৰঙা অঞ্চলত গাড়ীৰ গতি সীমিত ৰাখক।',
    voiceBengali: 'গুয়াহাটি থেকে কাজিরাঙ্গা রাস্তা পুরোপুরি খোলা এবং নিরাপদ। আবহাওয়া রৌদ্রোজ্জ্বল। জাতীয় উদ্যানে গতি সাবধানে রাখুন।',
    voiceEnglish: 'Guwahati to Kaziranga highway is fully open and smooth. Sunny weather throughout. Please maintain animal crossing speed limits.'
  },
  {
    id: 'cit-3',
    from: 'Dimapur, Nagaland',
    to: 'Kohima, Nagaland',
    name: 'Dimapur to Kohima Hill Road',
    highway: 'NH-29 Hill Bypass',
    distanceKm: 74,
    driveTimeCar: '2h 10m',
    driveTimeBus: '3h 15m',
    status: 'caution',
    statusLabel: 'CAUTION: DRIVE SLOW',
    weatherSummary: 'Drizzle 18°C • Mountain mist • Wet pavement',
    landslideRisk: 'Low',
    petrolPumpsOpen: true,
    plainAdvice: 'Road is open for all cars and sumos. Moderate drizzle near Zubza ghats, keep safe following distance.',
    tips: [
      'Use low gear and fog lights while ascending Kohima ridge',
      'Chumukedima 4-lane section is fast and clear',
      'Mechanic & tyre repair shops available in Medziphema'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    conditionImageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
    voiceHindi: 'दीमापुर से कोहिमा का रास्ता खुला है, लेकिन हल्की बारिश और धुंध है। गाड़ी धीमी गति और हेडलाइट जलाकर चलाएं। सावधानी से यात्रा करें।',
    voiceAssamese: 'ডিমাপুৰৰ পৰা কহিমালৈ পথ খোলা আছে, কিন্তু বৰষুণ আৰু কুঁৱলীৰ বাবে সাৱধানে গাড়ী চলাওক।',
    voiceBengali: 'দিমাপুর থেকে কোহিমা রাস্তা খোলা আছে, কিন্তু পাহাড়ি বৃষ্টি এবং কুয়াশা রয়েছে। ধীরে এবং সাবধানে গাড়ি চালান।',
    voiceEnglish: 'Dimapur to Kohima road is open with caution. Light rain and mist on mountain turns. Please drive with headlights on.'
  },
  {
    id: 'cit-4',
    from: 'Silchar, Assam',
    to: 'Imphal, Manipur',
    name: 'Silchar to Imphal via Jiribam Highway',
    highway: 'NH-37 (New All-Weather Expressway)',
    distanceKm: 242,
    driveTimeCar: '6h 15m',
    driveTimeBus: '8h 30m',
    status: 'safe',
    statusLabel: 'RECOMMENDED SAFE ROUTE',
    weatherSummary: 'Mild overcast 24°C • New bridge open',
    landslideRisk: 'Low',
    petrolPumpsOpen: true,
    plainAdvice: 'Best and safest route connecting Assam & Manipur. Newly constructed Makru & Barak bridges ensure smooth transit.',
    tips: [
      'Much safer today than NH-2 Senapati route',
      'Police assistance booths active at Jiribam & Noney',
      'Good tea stalls and eateries at Nungba market'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=600&q=80',
    conditionImageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    voiceHindi: 'सिलचर से इंफाल का जिरीबाम वाला नया रास्ता सुरक्षित है। नए पुल खुल चुके हैं। आज यही रास्ता चुनें, यह सेनापति मार्ग से बहुत सुरक्षित है।',
    voiceAssamese: 'শিলচৰৰ পৰা ইম্ফললৈ জিৰিবামৰ নতুন ৰাষ্ট্ৰীয় ঘাইপথ সুৰক্ষিত আৰু অনুমোদিত। নতুন দলংবোৰ মুকলি আছে।',
    voiceBengali: 'শিলচর থেকে ইম্ফল জিরিবাম হাইওয়ে সম্পূর্ণ নিরাপদ। নতুন ব্রিজ খোলা রয়েছে। ভ্রমণকারীদের জন্য এটি সবচেয়ে নিরাপদ রুট।',
    voiceEnglish: 'Silchar to Imphal via Jiribam NH-37 is safe and recommended. New bridges are open with smooth mountain passage.'
  },
  {
    id: 'cit-5',
    from: 'Gangtok, Sikkim',
    to: 'Siliguri, West Bengal',
    name: 'Gangtok to Siliguri Teesta Valley Corridor',
    highway: 'NH-10 (via Rangpo & Sevoke)',
    distanceKm: 114,
    driveTimeCar: '3h 50m',
    driveTimeBus: '5h 00m',
    status: 'caution',
    statusLabel: 'CAUTION: SINGLE LANE PASS',
    weatherSummary: 'Scattered showers 19°C • Teesta river normal',
    landslideRisk: 'Moderate',
    petrolPumpsOpen: true,
    plainAdvice: 'Open for all light cars and shared sumos. Road widening near 29th Mile has single-lane convoy control.',
    tips: [
      'Allow extra 45 mins buffer for Rangpo checkpost',
      'Heavy trucks restricted between 12 PM - 3 PM to ease passenger traffic',
      'Coronation Bridge route open with clear visibility'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?auto=format&fit=crop&w=600&q=80',
    conditionImageUrl: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=800&q=80',
    voiceHindi: 'गंगटोक से सिलीगुड़ी तीस्ता घाटी मार्ग खुला है, लेकिन उनतीसवें मील पर सड़क चौड़ीकरण के कारण गाड़ियां धीरे निकल रही हैं। समय लेकर चलें।',
    voiceAssamese: 'গেংটকৰ পৰা শিলিগুৰিলৈ পথ খোলা আছে, কিন্তু ২৯ মাইল অঞ্চলত সাৱধানে যাব লাগিব।',
    voiceBengali: 'গ্যাংটক থেকে শিলিগুড়ি তিস্তা ভ্যালি রাস্তা খোলা আছে, তবে ২৯ মাইলে যানজটের সম্ভাবনা রয়েছে। সাবধানে চালান।',
    voiceEnglish: 'Gangtok to Siliguri Teesta route is open with single-lane passage near 29th Mile. Passenger cars can proceed with caution.'
  },
  {
    id: 'cit-6',
    from: 'Agartala, Tripura',
    to: 'Dharmanagar, Tripura',
    name: 'Agartala to North Tripura Backbone',
    highway: 'NH-8 (Teliamura - Kumarghat Corridor)',
    distanceKm: 168,
    driveTimeCar: '3h 55m',
    driveTimeBus: '5h 20m',
    status: 'safe',
    statusLabel: 'SMOOTH & OPEN',
    weatherSummary: 'Sunny 30°C • Clear highways',
    landslideRisk: 'None',
    petrolPumpsOpen: true,
    plainAdvice: 'Excellent state highway connectivity with fast EV chargers and multiple highway dhabas.',
    tips: [
      'Wide roads suitable for two-wheelers and family hatchbacks',
      'Fuel stations available every 15 km'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80',
    conditionImageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    voiceHindi: 'अगरतला से धर्मनगर का राष्ट्रीय राजमार्ग पूरी तरह खुला और सुगम है। सभी गाड़ियां और बाइक आराम से जा सकती हैं।',
    voiceAssamese: 'আগৰতলাৰ পৰা ধৰ্মনগৰলৈ পথ সম্পূৰ্ণ মুকলি আৰু সুৰক্ষিত। পেট্ৰল পাম্প উপলব্ধ।',
    voiceBengali: 'আগরতলা থেকে ধর্মনগর হাইওয়ে পুরোপুরি মসৃণ এবং খোলা। যেকোনো গাড়িতে যাত্রা করা নিরাপদ।',
    voiceEnglish: 'Agartala to Dharmanagar highway is smooth and open with complete service amenities and clear weather.'
  },
  {
    id: 'cit-7',
    from: 'Kohima, Nagaland',
    to: 'Imphal, Manipur',
    name: 'Kohima to Imphal Direct Mountain Highway',
    highway: 'NH-2 (via Senapati & Kangpokpi)',
    distanceKm: 140,
    driveTimeCar: '4h 45m',
    driveTimeBus: '6h 30m',
    status: 'danger',
    statusLabel: 'DANGER / AVOID TODAY',
    weatherSummary: 'Heavy Rain 78mm • Mud slip near Km 284',
    landslideRisk: 'High',
    petrolPumpsOpen: false,
    plainAdvice: '⚠️ Active landslide clearance in progress near Senapati. Regular passenger cars advised to divert or postpone non-urgent travel.',
    tips: [
      'BRO earthmovers clearing rocks near Maram pass',
      'Consider alternative flight or southern Silchar-Jiribam road',
      'Emergency control room contact: 03871-222201'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    conditionImageUrl: 'https://images.unsplash.com/photo-1545642456-4c40597371d9?auto=format&fit=crop&w=800&q=80',
    voiceHindi: 'सावधान! कोहिमा से इंफाल सेनापति वाला रास्ता भूस्खलन के कारण बंद है। भारी बारिश से मिट्टी और पत्थर गिरे हैं। आज इस रास्ते पर बिल्कुल न जाएं।',
    voiceAssamese: 'সাৱধান! কহিমাৰ পৰা ইম্ফললৈ সেনাপতি অঞ্চলত পাহাৰ খহি পথ বন্ধ হৈ আছে। আজি এই পথেৰে নাযাব।',
    voiceBengali: 'সতর্কবার্তা! কোহিমা থেকে ইম্ফল সেনাপতি রুটে ধস নেমে রাস্তা বন্ধ রয়েছে। আজ এই রাস্তায় ভ্রমণ এড়িয়ে চলুন।',
    voiceEnglish: 'Danger alert! Kohima to Imphal NH-2 is currently blocked near Senapati due to active mudslide. Avoid this road today.'
  }
];

export const CITIZEN_HELPLINES: HelplineContact[] = [
  {
    id: 'hl-1',
    title: 'National Highway Helpline (NHAI)',
    number: '1033',
    category: 'highway',
    description: '24x7 Toll-Free Emergency Road Assistance, Crane Recovery & First Aid across all National Highways.',
    isTollFree: true
  },
  {
    id: 'hl-2',
    title: 'National Emergency Response (SOS)',
    number: '112',
    category: 'disaster',
    description: 'Single unified emergency number for Police, Fire, and Hill Rescue across all 8 North Eastern states.',
    isTollFree: true
  },
  {
    id: 'hl-3',
    title: 'Ambulance & Medical Emergency',
    number: '108',
    category: 'medical',
    description: 'Free 24x7 Government emergency ambulance dispatch with trained paramedic staff.',
    isTollFree: true
  },
  {
    id: 'hl-4',
    title: 'Border Roads (BRO) Hill Control Room',
    number: '1800-180-2222',
    category: 'highway',
    description: 'Live hill road opening status, landslide clearance updates & high-altitude convoy support.',
    isTollFree: true
  },
  {
    id: 'hl-5',
    title: 'State Disaster Management (SDMA NER)',
    number: '1070',
    category: 'disaster',
    description: 'Flood warnings, cloudburst evacuation assistance and local relief camp locations.',
    isTollFree: true
  },
  {
    id: 'hl-6',
    title: 'Women & Tourist Safety Helpline',
    number: '1091',
    category: 'police',
    description: 'Dedicated 24x7 safety hotline for female travelers, solo tourists and night commuters.',
    isTollFree: true
  }
];

export const NORTH_EAST_PICTURE_DESTINATIONS: DestinationPicture[] = [
  {
    id: 'dest-guwahati',
    city: 'Guwahati',
    state: 'Assam',
    landmark: 'Brahmaputra River Gateway',
    photo: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=600&q=80',
    tag: 'Main Hub'
  },
  {
    id: 'dest-shillong',
    city: 'Shillong',
    state: 'Meghalaya',
    landmark: 'Pine Hills & Umiam Lake',
    photo: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    tag: 'Hill Station'
  },
  {
    id: 'dest-kaziranga',
    city: 'Kaziranga',
    state: 'Assam',
    landmark: 'Wildlife Reserve Highway',
    photo: 'https://images.unsplash.com/photo-1581852017103-68ac65514cf7?auto=format&fit=crop&w=600&q=80',
    tag: 'National Park'
  },
  {
    id: 'dest-kohima',
    city: 'Kohima',
    state: 'Nagaland',
    landmark: 'Naga Mountain Ridge',
    photo: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    tag: 'High Hills'
  },
  {
    id: 'dest-imphal',
    city: 'Imphal',
    state: 'Manipur',
    landmark: 'Loktak Lake & Valley',
    photo: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=600&q=80',
    tag: 'Valley Hub'
  },
  {
    id: 'dest-gangtok',
    city: 'Gangtok',
    state: 'Sikkim',
    landmark: 'Kanchenjunga Snow Peaks',
    photo: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?auto=format&fit=crop&w=600&q=80',
    tag: 'Alpine Pass'
  },
  {
    id: 'dest-agartala',
    city: 'Agartala',
    state: 'Tripura',
    landmark: 'Ujjayanta Heritage Palace',
    photo: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80',
    tag: 'Border City'
  },
  {
    id: 'dest-siliguri',
    city: 'Siliguri',
    state: 'North Bengal Gateway',
    landmark: 'Teesta River Mountain Gorge',
    photo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    tag: 'Transit Hub'
  }
];

export const ROAD_SIGNAL_PICTURE_GUIDE: RoadSignalExplanation[] = [
  {
    color: 'green',
    title: 'हरा संकेत: रास्ता खुला है (ROAD OPEN)',
    symbol: '🟢',
    meaningEn: 'Completely safe! You can travel without any hesitation. No landslides or blockages.',
    meaningHi: 'बिल्कुल सुरक्षित! बेझिझक यात्रा करें। सड़क पूरी तरह खुली है और कोई रुकावट नहीं है।',
    meaningAs: 'সম্পূৰ্ণ সুৰক্ষিত! নিশ্চিন্তে যাত্ৰা কৰক। পথ মুকলি আছে।',
    meaningBn: 'সম্পূর্ণ নিরাপদ! নিশ্চিন্তে যাত্রা করতে পারেন। রাস্তা খোলা আছে।',
    photo: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    audioEn: 'Green signal means the road is completely open and safe to travel today.',
    audioHi: 'हरा संकेत का मतलब है कि रास्ता पूरी तरह खुला है और आप आराम से जा सकते हैं।',
    audioAs: 'সেউজীয়া সংকেতৰ অৰ্থ হ’ল পথ মুকলি আৰু যাত্ৰা কৰা সম্পূৰ্ণ সুৰক্ষিত।',
    audioBn: 'সবুজ সংকেতের অর্থ হলো রাস্তা পুরোপুরি খোলা এবং নিরাপদ।'
  },
  {
    color: 'yellow',
    title: 'पीला संकेत: संभलकर चलें (CAUTION)',
    symbol: '🟡',
    meaningEn: 'Caution needed! Drive slowly. There is rain, fog, or single-lane road ahead.',
    meaningHi: 'सावधानी जरूरी! गाड़ी धीमी गति से चलाएं। आगे बारिश, कोहरा या एकतरफा रास्ता हो सकता है।',
    meaningAs: 'সাৱধানতা প্ৰয়োজন! গাড়ী লাহে লাহে চলাওক। বৰষুণ বা কুঁৱলী আছে।',
    meaningBn: 'সতর্ক থাকুন! ধীরে গাড়ি চালান। বৃষ্টি, কুয়াশা বা একমুখী রাস্তা রয়েছে।',
    photo: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
    audioEn: 'Yellow signal means please drive slowly with headlights on due to wet road or mist.',
    audioHi: 'पीला संकेत का मतलब है कि आगे बारिश या धुंध है। गाड़ी धीमी चलाएं और लाइट ऑन रखें।',
    audioAs: 'হালধীয়া সংকেতৰ অৰ্থ হ’ল লাহে লাহে আৰু সাৱধানে গাড়ী চলাওক।',
    audioBn: 'হলুদ সংকেতের অর্থ হলো সাবধানে এবং ধীরে গাড়ি চালাতে হবে।'
  },
  {
    color: 'red',
    title: 'लाल संकेत: रास्ता बंद है (DANGER / STOP)',
    symbol: '🔴',
    meaningEn: 'Danger! Road is blocked due to landslide or water. Do NOT go today!',
    meaningHi: 'खतरा! भूस्खलन या पानी भरने से रास्ता बंद है। आज इस रास्ते पर बिल्कुल न जाएं!',
    meaningAs: 'বিপদ! পাহাৰ খহি বা পানী উঠি পথ বন্ধ। আজি নাযাব!',
    meaningBn: 'বিপদ! ধস বা বন্যার কারণে রাস্তা বন্ধ। আজ এই রাস্তায় যাবেন না!',
    photo: 'https://images.unsplash.com/photo-1545642456-4c40597371d9?auto=format&fit=crop&w=800&q=80',
    audioEn: 'Red signal means danger! The road is currently blocked by a landslide. Do not travel.',
    audioHi: 'लाल संकेत का मतलब है कि रास्ता भूस्खलन से बंद है। आज इस रास्ते पर मत जाइए।',
    audioAs: 'ৰঙা সংকেতৰ অৰ্থ হ’ল পথ বন্ধ। পাহাৰ খহি পৰিছে। আজি যাত্ৰা নকৰিব।',
    audioBn: 'লাল সংকেতের অর্থ হলো রাস্তা বন্ধ। ভূমিধসের কারণে যাত্রা স্থগিত রাখুন।'
  }
];

export const VEHICLE_PICTURE_OPTIONS = [
  {
    id: 'car',
    name: 'कार / टैक्सी / सूमो (Car & Taxi)',
    photo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    descHi: 'परिवार, टैक्सी व छोटी गाड़ी',
    descEn: 'Family cars, Hatchbacks, Taxis'
  },
  {
    id: 'bike',
    name: 'बाइक / स्कूटर (Two-Wheeler)',
    photo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    descHi: 'मोटरसाइकिल, स्कूटी',
    descEn: 'Motorcycles & Scooters'
  },
  {
    id: 'bus',
    name: 'यात्री बस / टाटा सूमो (Bus / Sumo)',
    photo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
    descHi: 'सरकारी बस, प्राइवेट बस, शेयर्ड सूमो',
    descEn: 'Public & private passenger buses'
  },
  {
    id: 'truck',
    name: 'ट्रक / मालवाहक गाड़ी (Truck / Goods)',
    photo: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
    descHi: 'सब्जी, राशन, सामान ढोने वाली गाड़ी',
    descEn: 'Commercial supply transport'
  }
];

export const COMMON_HAZARDS_PICTURE_GUIDE = [
  {
    id: 'haz-sun',
    titleHi: 'साफ धूप (Clear Road)',
    titleEn: 'Sunny & Dry Tarmac',
    photo: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    status: 'good' as const,
    adviceHi: 'सड़क सूखी है। यात्रा के लिए सबसे उत्तम समय।'
  },
  {
    id: 'haz-rain',
    titleHi: 'पहाड़ी बारिश (Rain & Slick)',
    titleEn: 'Mountain Rain & Wet Surface',
    photo: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    status: 'caution' as const,
    adviceHi: 'मोड़ पर ब्रेक धीरे लगाएं। फिसलन हो सकती है।'
  },
  {
    id: 'haz-slide',
    titleHi: 'भूस्खलन / पत्थर (Landslide / Rocks)',
    titleEn: 'Active Landslide Hazard',
    photo: 'https://images.unsplash.com/photo-1545642456-4c40597371d9?auto=format&fit=crop&w=600&q=80',
    status: 'danger' as const,
    adviceHi: 'पहाड़ से पत्थर गिर रहे हैं। रास्ता साफ होने तक रुकें।'
  },
  {
    id: 'haz-fog',
    titleHi: 'घना कोहरा / धुंध (Mountain Fog)',
    titleEn: 'Dense Fog & Low Visibility',
    photo: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=600&q=80',
    status: 'caution' as const,
    adviceHi: 'फॉग लैंप और हेडलाइट जलाएं। आगे की गाड़ी से दूरी रखें।'
  }
];

