import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Calls Gemini API in JSON mode and parses the response.
 * Strips markdown code fences if present.
 * Retries once if anything fails (parsing or calling), and throws a clean error.
 * 
 * @param {string} prompt 
 * @returns {Promise<any>}
 */
export async function callGeminiJSON(prompt) {
  const executeCall = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
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
        const err = new Error("Gemini request timed out after 15s");
        err.operation = "gemini-generateContent";
        throw err;
      }
      throw error;
    }
  };

  try {
    return await executeCall();
  } catch (firstErr) {
    console.warn("Gemini call or JSON parse failed, retrying once...");
    try {
      return await executeCall();
    } catch (secondErr) {
      throw new Error("Gemini operation failed: " + (secondErr.message || "Unknown error"));
    }
  }
}
