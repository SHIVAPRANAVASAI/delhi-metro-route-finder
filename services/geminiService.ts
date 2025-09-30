import { GoogleGenAI, Type } from '@google/genai';
import { RouteResult } from '../types';
import { METRO_LINES } from '../metroMapData';

// FIX: Replaced local pathfinding with Gemini API for route calculation.
// This aligns with the project's intent (geminiService.ts) and provides a more
// flexible and powerful routing engine.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const routeSchema = {
    type: Type.OBJECT,
    properties: {
      totalStations: { type: Type.NUMBER, description: "Total number of stations in the route, including start and end." },
      interchanges: { type: Type.NUMBER, description: "Total number of interchanges in the route." },
      route: {
        type: Type.ARRAY,
        description: "An array of steps representing the route from start to end.",
        items: {
          type: Type.OBJECT,
          properties: {
            stationName: { type: Type.STRING, description: "The name of the station." },
            line: { type: Type.STRING, description: "The metro line taken to arrive at this station. For the start station, it's the line to take to the next station." },
            isInterchange: { type: Type.BOOLEAN, description: "True if this station is an interchange where the user needs to switch lines. The end station is never an interchange." }
          },
          required: ['stationName', 'line', 'isInterchange']
        }
      }
    },
    required: ['totalStations', 'interchanges', 'route']
};

export const findShortestRoute = async (startStation: string, endStation: string): Promise<RouteResult> => {
  const metroDataString = JSON.stringify(METRO_LINES);
  
  const systemInstruction = `You are an expert Delhi Metro route planner. Your task is to find the shortest route between two stations using the provided metro network data. The shortest route is defined as the one with the minimum number of stations. If there are multiple routes with the same number of stations, choose the one with the fewest interchanges. The response must be a JSON object that adheres to the provided schema. Use the exact line names provided in the 'name' field of the network data (e.g., "Line-1 (Red)", "Line-2 (Yellow)").

Key rules for generating the route:
1. The 'route' array must include every station from start to end.
2. For the starting station, the 'line' property should be the name of the line to take towards the second station.
3. For all subsequent stations, the 'line' property is the line taken from the *previous* station to arrive at the *current* station.
4. A station is an interchange ('isInterchange: true') only if a traveler must switch lines at that station to continue their journey. The final destination is never an interchange.
5. Accurately calculate 'totalStations' (the total count of items in the 'route' array) and 'interchanges' (the total count of stations where 'isInterchange' is true).`;

  const prompt = `
Using the Delhi Metro network data below, find the shortest route from "${startStation}" to "${endStation}".

Network Data:
${metroDataString}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: routeSchema,
      },
    });

    const jsonText = response.text;
    const result: RouteResult = JSON.parse(jsonText);
    
    // Post-computation validation to ensure data integrity
    const calculatedInterchanges = result.route.filter(step => step.isInterchange).length;
    if (result.interchanges !== calculatedInterchanges) {
        console.warn("Gemini-calculated interchanges mismatch. Correcting value.");
        result.interchanges = calculatedInterchanges;
    }
    if (result.totalStations !== result.route.length) {
        console.warn("Gemini-calculated totalStations mismatch. Correcting value.");
        result.totalStations = result.route.length;
    }

    return result;
  } catch (error) {
    console.error("Error fetching route from Gemini API:", error);
    throw new Error(`Failed to get route from AI service. This could be due to network issues or an invalid API key.`);
  }
};
