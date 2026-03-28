import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateCareerMindmap = async (careerProfile: string) => {
  if (!ai) throw new Error("AI service not initialized");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `You are Alejandro Soria, a world-class hospitality leader and mentor. 
      A member of your community has shared their career profile:
      "${careerProfile}"
      
      Based on this, provide a "Career Mindmap" or strategic advice. 
      Focus on:
      1. Where they are currently in their hospitality journey.
      2. 3-4 specific "Next Moves" they can take to grow within the hospitality industry.
      3. A "Hand-Picked Note" from you (Alejandro) about how they can stand out to quality owners.
      
      Keep the tone professional, direct, and encouraging. Use a structured format (e.g., bullet points or numbered steps).`,
    });

    return response.text;
  } catch (error) {
    console.error("Mindmap Generation Error:", error);
    throw error;
  }
};
