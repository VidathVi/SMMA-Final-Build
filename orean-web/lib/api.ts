// Centralized fetch wrapper to inject tokens and handle 401s globally

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { requireAuth = true, headers, ...restOptions } = options;

  const finalHeaders = new Headers(headers);

  if (requireAuth) {
    // Both token and orean360_token are supported based on user legacy
    const token = localStorage.getItem("token") || localStorage.getItem("orean360_token");
    if (token) {
      finalHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  // Ensure JSON content type by default unless it's FormData
  if (!finalHeaders.has("Content-Type") && !(options.body instanceof FormData)) {
    finalHeaders.set("Content-Type", "application/json");
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...restOptions,
    headers: finalHeaders,
  });

  if (response.status === 401) {
    // Attempt Auto-Logout or Session Refresh here in the future
    console.warn("Unauthorized access - token may be expired");
    if (typeof window !== "undefined") {
        // window.location.href = "/login"; // Optional: Force logout
    }
  }

  return response;
}
