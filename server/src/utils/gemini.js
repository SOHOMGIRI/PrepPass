import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Primary and fallback models
const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const FALLBACK_MODEL = "gemini-1.5-flash";

/**
 * Calls Gemini API in JSON mode and parses the response.
 * Strips markdown code fences if present.
 * Retries once if anything fails (parsing or calling), and falls back gracefully.
 * 
 * @param {string} prompt 
 * @returns {Promise<any>}
 */
export async function callGeminiJSON(prompt) {
  if (!ai || !apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in server environment");
  }

  const executeCallWithModel = async (modelName) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      let text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      // Strip any accidental markdown code fences (```json or ```)
      text = text.trim();
      if (text.startsWith("```")) {
        text = text.replace(/^```(?:json)?\s*/i, "");
        text = text.replace(/\s*```$/, "");
      }
      text = text.trim();

      return JSON.parse(text);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        const err = new Error(`Gemini request timed out after 20s on model ${modelName}`);
        err.operation = "gemini-generateContent";
        throw err;
      }
      throw error;
    }
  };

  try {
    return await executeCallWithModel(PRIMARY_MODEL);
  } catch (primaryErr) {
    console.warn(`[GEMINI] Primary model (${PRIMARY_MODEL}) failed: ${primaryErr.message}. Retrying with fallback model (${FALLBACK_MODEL})...`);
    try {
      return await executeCallWithModel(FALLBACK_MODEL);
    } catch (fallbackErr) {
      console.error("[GEMINI] Fallback model also failed:", fallbackErr.message);
      throw new Error(`Gemini intelligence service unavailable: ${fallbackErr.message || "Unknown error"}`);
    }
  }
}
