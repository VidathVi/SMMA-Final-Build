const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

/**
 * Reusable HTTP client for communicating with the internal Python GEO Service
 */
export const callFastAPI = async (endpoint: string, body: any) => {
  try {
    // Implement a 5-second timeout so the UI doesn't hang if FastAPI is unreachable
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${FASTAPI_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`FastAPI Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(`Failed to communicate with GEO Engine: ${error.message}`);
  }
};
