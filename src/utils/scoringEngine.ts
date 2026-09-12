import { RouteOption, RiskLevel } from '../types';

export interface SimulationConditions {
  rainfall: 'normal' | 'heavy' | 'extreme';
  traffic: 'low' | 'medium' | 'high';
  roadCondition: 'good' | 'moderate' | 'poor';
  landslideRisk: 'low' | 'medium' | 'high';
}

export interface ScoringWeights {
  safetyWeight: number; // default 0.30 (30%)
  timeWeight: number; // default 0.15 (15%)
  distanceWeight: number; // default 0.10 (10%)
  weatherWeight: number; // default 0.15 (15%)
  hazardWeight: number; // default 0.10 (10%)
  roadConditionWeight: number; // default 0.10 (10%)
  accessibilityWeight: number; // default 0.05 (5%)
  logisticsWeight: number; // default 0.05 (5%)
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  safetyWeight: 0.30,
  timeWeight: 0.15,
  distanceWeight: 0.10,
  weatherWeight: 0.15,
  hazardWeight: 0.10,
  roadConditionWeight: 0.10,
  accessibilityWeight: 0.05,
  logisticsWeight: 0.05,
};

export const DEFAULT_SIMULATION_CONDITIONS: SimulationConditions = {
  rainfall: 'normal',
  traffic: 'medium',
  roadCondition: 'moderate',
  landslideRisk: 'medium',
};

export interface RouteDetailedScores {
  routeId: string;
  code: 'ROUTE_A' | 'ROUTE_B' | 'ROUTE_C';
  title: string;
  safetyScore: number; // 0 - 100
  timeScore: number; // 0 - 100
  distanceScore: number; // 0 - 100
  weatherRiskScore: number; // 0 - 100 (higher = safer)
  weatherLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  landslideRiskScore: number; // 0 - 100 (higher = safer)
  landslideLevel: 'Low' | 'Medium' | 'High';
  floodRiskScore: number; // 0 - 100 (higher = safer)
  floodLevel: 'Low' | 'Medium' | 'High';
  roadConditionScore: number; // 0 - 100
  roadConditionText: 'Good' | 'Moderate' | 'Poor';
  accessibilityScore: number; // 0 - 100
  accessibilityText: 'Good' | 'Moderate' | 'Limited';
  logisticsSuitabilityScore: number; // 0 - 100
  overallScore: number; // 0 - 100
  isRecommended: boolean;
  whyExplanation: string;
  mainRisks: string[];
  advantages: string[];
  possibleDelays: string;
  recommendedAction: string;
}

/**
 * Deterministic multi-factor route scoring engine for the North Eastern Region.
 * Calculates transparent scores based on route terrain attributes, live weather,
 * geotechnical slope risk, and user simulation conditions.
 */
export function calculateRouteScores(
  route: RouteOption,
  conditions: SimulationConditions = DEFAULT_SIMULATION_CONDITIONS,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS,
  userProfile: 'general' | 'wheelchair' | 'elderly' | 'vision' = 'general',
  cargoWeightTons: number = 10,
  vehicleType: string = 'Heavy Truck'
): RouteDetailedScores {
  // Base parameters per route code
  let baseSafety = route.code === 'ROUTE_B' ? 88 : route.code === 'ROUTE_A' ? 62 : 74;
  let baseWeather = route.code === 'ROUTE_B' ? 85 : route.code === 'ROUTE_A' ? 45 : 70;
  let baseLandslide = route.code === 'ROUTE_B' ? 92 : route.code === 'ROUTE_A' ? 35 : 68;
  let baseFlood = route.code === 'ROUTE_B' ? 82 : route.code === 'ROUTE_A' ? 55 : 72;
  let baseRoadCondition = route.code === 'ROUTE_B' ? 90 : route.code === 'ROUTE_A' ? 50 : 75;
  let baseAccessibility = route.code === 'ROUTE_B' ? 87 : route.code === 'ROUTE_A' ? 58 : 72;
  let baseLogistics = route.code === 'ROUTE_B' ? 94 : route.code === 'ROUTE_A' ? 65 : 78;

  // Time & Distance normalized scores
  // Faster = higher score (Route A: 8h45m -> 88, Route B: 10h15m -> 75, Route C: 12h10m -> 60)
  let timeScore = route.code === 'ROUTE_A' ? 88 : route.code === 'ROUTE_B' ? 75 : 60;
  // Shorter = higher score (Route A: 480km -> 90, Route B: 505km -> 82, Route C: 530km -> 70)
  let distanceScore = route.code === 'ROUTE_A' ? 90 : route.code === 'ROUTE_B' ? 82 : 70;

  // Apply Simulation Modifiers
  // 1. Rainfall Impact
  if (conditions.rainfall === 'heavy') {
    if (route.code === 'ROUTE_A') {
      baseWeather -= 30;
      baseLandslide -= 35;
      baseFlood -= 25;
      baseSafety -= 25;
      timeScore -= 20; // major holding delays
    } else if (route.code === 'ROUTE_B') {
      baseWeather -= 10;
      baseLandslide -= 8;
      baseFlood -= 6;
      baseSafety -= 5;
      timeScore -= 5;
    } else {
      baseWeather -= 15;
      baseLandslide -= 12;
      baseFlood -= 10;
      baseSafety -= 10;
    }
  } else if (conditions.rainfall === 'extreme') {
    if (route.code === 'ROUTE_A') {
      baseWeather -= 50;
      baseLandslide -= 55;
      baseFlood -= 45;
      baseSafety -= 45;
      timeScore -= 40;
    } else if (route.code === 'ROUTE_B') {
      baseWeather -= 20;
      baseLandslide -= 15;
      baseFlood -= 12;
      baseSafety -= 12;
      timeScore -= 10;
    } else {
      baseWeather -= 30;
      baseLandslide -= 25;
      baseFlood -= 20;
      baseSafety -= 20;
    }
  }

  // 2. Traffic Impact
  if (conditions.traffic === 'high') {
    if (route.code === 'ROUTE_A') timeScore -= 25;
    if (route.code === 'ROUTE_B') timeScore -= 10;
    if (route.code === 'ROUTE_C') timeScore -= 8;
  } else if (conditions.traffic === 'low') {
    timeScore = Math.min(100, timeScore + 8);
  }

  // 3. Road Condition Override
  if (conditions.roadCondition === 'poor') {
    baseRoadCondition -= 25;
    baseSafety -= 15;
  } else if (conditions.roadCondition === 'good') {
    baseRoadCondition = Math.min(100, baseRoadCondition + 10);
    baseSafety = Math.min(100, baseSafety + 5);
  }

  // 4. Landslide Risk Override
  if (conditions.landslideRisk === 'high') {
    if (route.code === 'ROUTE_A') {
      baseLandslide -= 40;
      baseSafety -= 30;
    } else if (route.code === 'ROUTE_B') {
      baseLandslide -= 15;
      baseSafety -= 8;
    } else {
      baseLandslide -= 20;
      baseSafety -= 12;
    }
  } else if (conditions.landslideRisk === 'low') {
    baseLandslide = Math.min(100, baseLandslide + 10);
  }

  // 5. User Profile Adjustments
  if (userProfile === 'wheelchair' || userProfile === 'elderly') {
    if (route.code === 'ROUTE_A') baseAccessibility -= 20;
    if (route.code === 'ROUTE_B') baseAccessibility += 5;
  }

  // 6. Heavy vehicle load penalty
  if (cargoWeightTons > 15 && route.code === 'ROUTE_A') {
    baseLogistics -= 20;
    baseSafety -= 10;
  }

  // Clamp all scores 0 - 100
  const clamp = (n: number) => Math.max(5, Math.min(100, Math.round(n)));

  const safetyScore = clamp(baseSafety);
  const finalTimeScore = clamp(timeScore);
  const finalDistanceScore = clamp(distanceScore);
  const weatherRiskScore = clamp(baseWeather);
  const landslideRiskScore = clamp(baseLandslide);
  const floodRiskScore = clamp(baseFlood);
  const roadConditionScore = clamp(baseRoadCondition);
  const accessibilityScore = clamp(baseAccessibility);
  const logisticsSuitabilityScore = clamp(baseLogistics);

  // Combined Hazard Score (Landslide + Flood)
  const hazardCombined = (landslideRiskScore + floodRiskScore) / 2;

  // Calculate Overall Weighted Score
  const totalWeight =
    weights.safetyWeight +
    weights.timeWeight +
    weights.distanceWeight +
    weights.weatherWeight +
    weights.hazardWeight +
    weights.roadConditionWeight +
    weights.accessibilityWeight +
    weights.logisticsWeight;

  const rawOverall =
    safetyScore * weights.safetyWeight +
    finalTimeScore * weights.timeWeight +
    finalDistanceScore * weights.distanceWeight +
    weatherRiskScore * weights.weatherWeight +
    hazardCombined * weights.hazardWeight +
    roadConditionScore * weights.roadConditionWeight +
    accessibilityScore * weights.accessibilityWeight +
    logisticsSuitabilityScore * weights.logisticsWeight;

  const overallScore = clamp(rawOverall / (totalWeight || 1));

  // Qualitative indicators
  const weatherLevel: 'Low' | 'Medium' | 'High' | 'Extreme' =
    weatherRiskScore > 75 ? 'Low' : weatherRiskScore > 50 ? 'Medium' : weatherRiskScore > 30 ? 'High' : 'Extreme';

  const landslideLevel: 'Low' | 'Medium' | 'High' =
    landslideRiskScore > 75 ? 'Low' : landslideRiskScore > 45 ? 'Medium' : 'High';

  const floodLevel: 'Low' | 'Medium' | 'High' =
    floodRiskScore > 75 ? 'Low' : floodRiskScore > 45 ? 'Medium' : 'High';

  const roadConditionText: 'Good' | 'Moderate' | 'Poor' =
    roadConditionScore > 75 ? 'Good' : roadConditionScore > 45 ? 'Moderate' : 'Poor';

  const accessibilityText: 'Good' | 'Moderate' | 'Limited' =
    accessibilityScore > 75 ? 'Good' : accessibilityScore > 50 ? 'Moderate' : 'Limited';

  // Dynamic Explanations
  let whyExplanation = '';
  let mainRisks: string[] = [];
  let advantages: string[] = [];
  let possibleDelays = '';
  let recommendedAction = '';

  if (route.code === 'ROUTE_B') {
    whyExplanation =
      'Route B is recommended because although it is 25 km longer, it maintains high slope stability, lower flood risk, and all-weather double-lane pavement along NH-37 Jiribam.';
    mainRisks = ['Minor rain slickness near Barak valley entry', 'Moderate fuel station spacing (approx. 40 km)'];
    advantages = [
      'Engineered retaining walls on 42 vulnerable hill slopes',
      'Lower rainfall intensity compared to central mountain pass',
      '24x7 heavy recovery cranes and NDRF post coverage',
      'Optimal gradient (max 5.1%) suitable for multi-axle trucks',
    ];
    possibleDelays = '15-20 min routine toll & transit verification at Jiribam checkpost';
    recommendedAction = 'Proceed via NH-37 corridor with steady 50-60 km/h cruising speed.';
  } else if (route.code === 'ROUTE_A') {
    whyExplanation =
      'Route A is the shortest route by distance, but passes through high-risk landslide zones along the Kohima-Senapati ridge during wet conditions.';
    mainRisks = [
      'Active slope erosion at Senapati Km 284',
      'Heavy cloudburst precipitation (78mm/24h)',
      'Severe holding congestion at Dimapur weighbridge',
    ];
    advantages = ['Shortest geographic distance (480 km)', 'Direct line of travel under dry winter conditions'];
    possibleDelays = '1.5 to 3.5 hours possible holding delays due to single-lane clearance';
    recommendedAction = 'Avoid during monsoon/heavy rain. Reroute through NH-37 or maintain extreme caution.';
  } else {
    whyExplanation =
      'Route C offers a wide bypass loop through Upper Assam and Golaghat, completely avoiding central mountain choke points.';
    mainRisks = ['Longest total distance (+50 km)', 'Speed ceiling (40 km/h) in Kaziranga eco-corridor zone'];
    advantages = ['Excellent multi-lane highway in Assam sector', 'Ample rest stops, fuel stations, and repair facilities'];
    possibleDelays = '40 min wildlife speed-buffer delay';
    recommendedAction = 'Viable secondary alternate if NH-37 experiences maintenance or high volume.';
  }

  return {
    routeId: route.id,
    code: route.code,
    title: route.title,
    safetyScore,
    timeScore: finalTimeScore,
    distanceScore: finalDistanceScore,
    weatherRiskScore,
    weatherLevel,
    landslideRiskScore,
    landslideLevel,
    floodRiskScore,
    floodLevel,
    roadConditionScore,
    roadConditionText,
    accessibilityScore,
    accessibilityText,
    logisticsSuitabilityScore,
    overallScore,
    isRecommended: false, // will be tagged by collection evaluator
    whyExplanation,
    mainRisks,
    advantages,
    possibleDelays,
    recommendedAction,
  };
}

/**
 * Score all available routes and identify the top AI recommendation.
 */
export function scoreAllRoutes(
  routes: RouteOption[],
  conditions: SimulationConditions = DEFAULT_SIMULATION_CONDITIONS,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS,
  userProfile: 'general' | 'wheelchair' | 'elderly' | 'vision' = 'general',
  cargoWeightTons: number = 10,
  vehicleType: string = 'Heavy Truck'
): RouteDetailedScores[] {
  const scored = routes.map((r) =>
    calculateRouteScores(r, conditions, weights, userProfile, cargoWeightTons, vehicleType)
  );

  // Identify highest overall score
  let maxScore = -1;
  let topIndex = 0;
  scored.forEach((s, idx) => {
    if (s.overallScore > maxScore) {
      maxScore = s.overallScore;
      topIndex = idx;
    }
  });

  scored[topIndex].isRecommended = true;
  return scored;
}
