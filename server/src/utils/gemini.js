import { GoogleGenAI } from "@google/genai";

const apiKey = (process.env.GEMINI_API_KEY || "").trim();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Modern Gemini model hierarchy compatible with @google/genai v2.16+
const rawEnvModel = (process.env.GEMINI_MODEL || "").trim();
// If env var was set to deprecated/unsupported 1.5-flash on v1beta, upgrade to 2.0-flash
const envModel = rawEnvModel === "gemini-1.5-flash" || rawEnvModel === "models/gemini-1.5-flash" ? "gemini-2.0-flash" : rawEnvModel;

const MODEL_HIERARCHY = [
  envModel,
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-pro",
].filter(Boolean);

/**
 * Calls Gemini API in JSON mode and parses the response.
 * Strips markdown code fences if present.
 * Iterates through modern model hierarchy if any model reports 404 or fails.
 * 
 * @param {string} prompt 
 * @returns {Promise<any>}
 */
export async function callGeminiJSON(prompt) {
  if (!ai || !apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in server environment");
  }

  let lastError = null;

  for (const modelName of MODEL_HIERARCHY) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

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
      const isAbort = error.name === "AbortError";
      const errMsg = isAbort ? `Timed out on model ${modelName}` : error.message;
      console.warn(`[GEMINI] Model ${modelName} failed (${errMsg}). Trying next candidate...`);
      lastError = error;
    }
  }

  console.error("[GEMINI] All model candidates exhausted:", lastError?.message);
  throw new Error(`Gemini intelligence service unavailable: ${lastError?.message || "Unknown error"}`);
}
