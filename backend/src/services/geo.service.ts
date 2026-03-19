const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

/**
 * Reusable HTTP client for communicating with the internal Python GEO Service
 */
export const callFastAPI = async (endpoint: string, body: any) => {
  try {
    // We use the native fetch API available in modern Node.js environments
    const response = await fetch(`${FASTAPI_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`FastAPI Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(`Failed to communicate with GEO Engine: ${error.message}`);
  }
};
