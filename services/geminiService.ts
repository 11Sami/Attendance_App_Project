
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAddressFromCoordinates(lat: number, lon: number): Promise<string> {
  const prompt = `Based on the following coordinates (Latitude: ${lat}, Longitude: ${lon}), provide a concise, single-line street address. Only return the address, with no extra explanation or labels. For example: '1600 Amphitheatre Parkway, Mountain View, CA, USA'. If the location is remote, provide the most specific description possible.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    const address = response.text.trim();
    if (!address) {
        throw new Error("Gemini API returned an empty address.");
    }
    return address;
  } catch (error) {
    console.error("Error fetching address from Gemini:", error);
    throw new Error("Could not determine address from coordinates.");
  }
}
