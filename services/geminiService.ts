import { GoogleGenAI } from "@google/genai";
import { Measurement, Goals } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeProgress = async (
  measurements: Measurement[],
  goals: Goals
): Promise<string> => {
  try {
    const ai = getAIClient();
    
    // Format data for the prompt
    const recentHistory = measurements
      .slice(0, 5)
      .map(m => `- Fecha: ${new Date(m.date).toLocaleDateString()}, Peso: ${m.weight}lbs, Cintura: ${m.waist}cm, Grasa: ${m.bodyFatPercentage}%, Visceral: ${m.visceralFatLevel}`)
      .join('\n');

    const prompt = `
      Actúa como un entrenador de salud experto y nutricionista motivador.
      
      MIS OBJETIVOS:
      -- Meta Intermedia --
      Peso: ${goals.intermediate.weight} lbs
      Grasa: ${goals.intermediate.bodyFat}%
      Cintura: ${goals.intermediate.waist} cm
      
      -- Meta Final --
      Peso: ${goals.final.weight} lbs
      Grasa: ${goals.final.bodyFat}%
      Cintura: ${goals.final.waist} cm
      
      MIS REGISTROS RECIENTES:
      ${recentHistory}
      
      Por favor, analiza mi progreso brevemente.
      1. Compara mi estado actual con mi Meta Intermedia (si no la he alcanzado) o mi Meta Final.
      2. Dame 2 consejos específicos y accionables basados en estos datos (ej. si la grasa visceral es alta, o si la cintura no baja).
      3. IMPORTANTE: Incluye una "Frase del día" muy motivadora al final.
      4. Responde en español y usa formato Markdown (negritas, listas).
      5. Sé conciso (máximo 150 palabras).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No se pudo generar un análisis en este momento.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Hubo un error al conectar con tu entrenador virtual. Por favor intenta más tarde.";
  }
};