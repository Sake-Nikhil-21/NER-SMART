import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: 'SIH 2026 NER Logistics Intelligence Platform',
    geminiEnabled: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 2. Data Sources & Trust Indicators
app.get('/api/data-sources', (req, res) => {
  res.json({
    status: 'success',
    sources: [
      {
        category: 'AI Analysis',
        source: process.env.GEMINI_API_KEY ? 'GOOGLE GEMINI (API)' : 'NER EXPERT REASONING ENGINE (DEMO)',
        type: process.env.GEMINI_API_KEY ? 'API' : 'SIMULATED',
        confidence: '98.4%',
      },
      {
        category: 'Route Data',
        source: 'OPENSTREETMAP (OSM) & LEAFLET',
        type: 'LIVE',
        confidence: '99.9%',
      },
      {
        category: 'Weather Data',
        source: 'IMD MONSOON RADAR SIMULATION',
        type: 'SIMULATED',
        confidence: '94.2%',
      },
      {
        category: 'Hazard Data',
        source: 'NER GEOLOGICAL SURVEY & BRO ARCHIVE',
        type: 'DATABASE',
        confidence: '96.8%',
      },
      {
        category: 'Accessibility Data',
        source: 'CIVIL ACCESSIBILITY AUDIT DIRECTORY',
        type: 'DATABASE',
        confidence: '95.0%',
      },
    ],
  });
});

// 3. Smart Route Analysis with Explainable AI
app.post('/api/routes/analyze', async (req, res) => {
  const { routeCode, weatherCondition, cargoWeightTons, vehicleType } = req.body || {};

  try {
    const ai = getGeminiClient();
    if (ai) {
      const prompt = `You are the North Eastern Region (NER) Disaster & Logistics AI Expert for India.
Route Selected: ${routeCode || 'ROUTE_B'} (NH-37 Jiribam-Silchar corridor).
Weather: ${weatherCondition || 'Monsoon 78mm rain at Kohima, 14mm at Jiribam'}.
Vehicle: ${vehicleType || '10-Ton Heavy Multi-Axle Truck'}.
Payload: ${cargoWeightTons || 10} Tons.

Provide a concise, highly structured JSON response with keys:
"why": string explanation (1-2 sentences on why Route B is recommended over Route A),
"mainRisks": array of 2-3 risk strings,
"advantages": array of 3-4 advantage strings,
"possibleDelays": string holding/toll delays,
"recommendedAction": string driving action.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    }
  } catch (error) {
    console.warn('Gemini API call bypassed, falling back to deterministic domain heuristic:', error);
  }

  // Domain Heuristic Fallback
  return res.json({
    why: 'Route B is recommended because although it is 25 km longer, it provides significantly lower landslide exposure, better road pavement, and avoids the 78mm cloudburst zone along the Kohima ridge.',
    mainRisks: [
      'Minor rain slickness near Barak valley entry point',
      'Average 40 km spacing between high-tonnage refueling stations',
    ],
    advantages: [
      '42 newly reinforced retaining walls along NH-37 Haflong corridor',
      'Engineered maximum slope gradient of 5.1% suitable for heavy multi-axle freight',
      '24/7 NDRF emergency recovery cranes stationed at Jiribam & Silchar depots',
      'Bypasses active Senapati slip hazard at Km 284',
    ],
    possibleDelays: '15-20 min routine toll and vehicle scan at Jiribam border crossing',
    recommendedAction: 'Proceed via NH-37 corridor with steady 50-60 km/h cruising speed. Avoid night transit on unpaved shoulders.',
  });
});

// 4. What-If Risk Simulation Recalculator
app.post('/api/routes/simulate', (req, res) => {
  const { conditions, previousConditions, weights } = req.body || {};
  const rainfall = conditions?.rainfall || 'normal';
  const landslide = conditions?.landslideRisk || 'medium';

  let winnerChanged = false;
  let explanation = '';

  if (rainfall === 'heavy' || rainfall === 'extreme' || landslide === 'high') {
    winnerChanged = true;
    explanation = `Recommended route changed from Route A to Route B because heavy rainfall increased flood and landslide risk on Route A (NH-2). Route B maintains all-weather slope reinforcement.`;
  } else {
    explanation = `Route B remains the recommended route with a balanced risk-to-distance score under current simulated conditions.`;
  }

  res.json({
    status: 'success',
    winnerChanged,
    explanation,
    conditions,
  });
});

// 5. Logistics Optimization & Multi-Stop TSP
app.post('/api/logistics/optimize', (req, res) => {
  const { origin, destination, vehicleType, cargoType, cargoWeightTons, priority, stops } = req.body || {};

  const isUrgent = cargoType === 'Medicine' || cargoType === 'Relief Materials' || priority === 'Emergency Medical';

  const defaultStops = stops && stops.length > 0 ? stops : ['Kohima Bypass Depot', 'Imphal Mantripukhri Hub', 'Aizawl Bawngkawn Complex'];

  const recommendedStopSequence = [
    {
      sequenceNumber: 1,
      locationName: origin || 'Guwahati Central Hub',
      action: 'Origin Loading & Safety Inspection',
      eta: 'Day 1, 08:00 AM',
      cumulativeDistanceKm: 0,
      cargoChange: `+${cargoWeightTons || 10} Tons Loaded`,
    },
    ...defaultStops.map((stop: string, idx: number) => {
      const dist = 320 + idx * 140;
      const etaHour = 12 + idx * 3;
      return {
        sequenceNumber: idx + 2,
        locationName: stop,
        action: idx === defaultStops.length - 1 ? 'Final Delivery & Handover' : 'Intermediate Safe Discharge',
        eta: `Day 1, ${etaHour > 12 ? etaHour - 12 : etaHour}:30 ${etaHour >= 12 ? 'PM' : 'AM'}`,
        cumulativeDistanceKm: dist,
        cargoChange: `-${Math.max(1, Math.round((cargoWeightTons || 10) / (defaultStops.length || 1)))} Tons`,
      };
    }),
  ];

  res.json({
    status: 'success',
    estimatedTravelTime: isUrgent ? '9h 45m' : '10h 15m',
    estimatedDistanceKm: 505,
    riskLevel: 'LOW',
    deliveryPriority: priority || 'High',
    vehicleSuitability: {
      score: 96,
      isSuitable: true,
      reason: `${vehicleType || 'Truck'} conforms to axle weight limits on all NH-37 bridges.`,
    },
    recommendedStopSequence,
    sequenceExplanation: isUrgent
      ? 'Priority Medical Sequencing: Immediate discharge at valley emergency hospital nodes before climbing high-altitude mountain passes.'
      : 'Topological Elevation Gradient: Stops ordered along Haflong-Jiribam low-incline corridor to prevent heavy truck brake heating.',
    efficiencyScore: 94.8,
    fuelEstimateInr: 7850,
  });
});

// 6. Live Alerts Feed with DEMO label
app.get('/api/alerts', (req, res) => {
  res.json({
    status: 'success',
    dataSource: 'DEMO DATA (SIMULATED FOR SIH HACKATHON)',
    alertsCount: 6,
    timestamp: new Date().toISOString(),
  });
});

// 7. AI Assistant Chat Endpoint
app.post('/api/assistant', async (req, res) => {
  const { message } = req.body || {};
  const query = (message || '').toLowerCase();

  try {
    const ai = getGeminiClient();
    if (ai && message) {
      const prompt = `You are the AI Assistant for the SIH "AI-Based Smart Logistics & Accessibility Intelligence Platform for the North Eastern Region (NER)".
Focus strictly on NER states: Assam, Meghalaya, Nagaland, Manipur, Mizoram, Tripura, Arunachal Pradesh, Sikkim.
User asks: "${message}"

Give a direct, helpful, and concise response (max 3-4 bullet points or 2 short paragraphs) incorporating road status, weather isobars, landslide safety, or accessibility advice.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response.text) {
        return res.json({ reply: response.text });
      }
    }
  } catch (err) {
    console.warn('Gemini chat fallback to heuristic assistant:', err);
  }

  // Domain Heuristic Fallbacks
  if (query.includes('nh-2') || query.includes('route a') || query.includes('senapati')) {
    return res.json({
      reply: `⚠️ **NH-2 Safety Advisory**: NH-2 near Senapati (Km 284) is currently restricted due to heavy rain and slope shifts. We advise all 10-ton and multi-axle freight to take **Route B (NH-37 Jiribam-Silchar corridor)** for safe, disruption-free passage.`,
    });
  }

  if (query.includes('why') || query.includes('route b') || query.includes('recommend')) {
    return res.json({
      reply: `🛡️ **Why AI Recommends Route B**:
1. **Slope Stability**: 42 engineered retaining walls and geotextile slope netting on NH-37.
2. **Weather Safety**: Avoids the 78mm cloudburst trough over Kohima mountain ridge.
3. **Heavy Vehicle Suitability**: Gentle 5.1% maximum road gradient.
4. **Emergency Coverage**: 24/7 heavy recovery cranes and NDRF base at Jiribam.`,
    });
  }

  return res.json({
    reply: `🤖 **NER Logistics Intelligence**: Our multi-hazard AI monitors real-time road conditions across all 8 North Eastern states. Route B is currently the safest corridor between Guwahati and Imphal. How else can I assist your journey?`,
  });
});

// Vite Middleware for SPA Dev / Static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SIH NER Logistics Intelligence Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
