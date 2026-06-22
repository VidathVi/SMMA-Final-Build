const GEO_ENGINE_URL = process.env.GEO_ENGINE_URL || "http://localhost:8000/v1/chat/completions";
const MODAL_API_KEY = process.env.MODAL_API_KEY || "";

/**
 * Reusable HTTP client for communicating with the Modal vLLM GEO Service
 */
export const callGeoEngine = async (body: any) => {
  try {
    // Increase timeout since LLM generation might take longer than 5 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (MODAL_API_KEY) {
      headers["Authorization"] = `Bearer ${MODAL_API_KEY}`;
    }

    const response = await fetch(GEO_ENGINE_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Modal vLLM Error: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(`Failed to communicate with GEO Engine: ${error.message}`);
  }
};
