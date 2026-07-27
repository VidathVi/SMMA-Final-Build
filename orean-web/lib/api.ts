// Centralized fetch wrapper to inject tokens and handle 401s globally

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { requireAuth = true, headers, ...restOptions } = options;

  const finalHeaders = new Headers(headers);

  if (requireAuth) {
    // Check orean360_token first (primary), then legacy "token" key
    const token =
      localStorage.getItem("orean360_token") || localStorage.getItem("token");
    if (token) {
      finalHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  // Ensure JSON content type by default unless it's FormData
  if (
    !finalHeaders.has("Content-Type") &&
    !(options.body instanceof FormData)
  ) {
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
