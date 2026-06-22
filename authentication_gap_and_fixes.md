# Authentication Gap & Fixes

## 1. The Issue
In the current version, someone can access the dashboard pages directly by typing in the URL (e.g., `/dashboard/campaigns`), and they will be able to see and interact with data.

### Frontend Route Protection (Next.js) Gap
* **LocalStorage-based Auth:** The JWT token is saved in `localStorage` under `"orean360_token"`.
* **Missing Subpage Checks:** Only the main root page (`/`) checks `localStorage` and redirects the user. If a user goes directly to a subpage like `/dashboard/campaigns`, that check is skipped.
* **Middleware Pass-through:** Next.js middleware runs on the server and checks for an `orean360_token` *cookie*. Since the token is in `localStorage`, the middleware finds no cookie and allows the request to pass through to the browser.
* **No local page checks:** Individual subpages do not verify the existence of the token in `localStorage` before rendering.

### Backend API Protection (Express) Gap
Many core API routes currently lack authorization middleware. The following routes do not enforce authentication:
* `/api/campaigns`
* `/api/posts`
* `/api/statuses`
* `/api/tasks`
* `/api/calendar`
* `/api/approvals`
* `/api/analytics`
* `/api/workflows`
* `/api/inbox`

Because these backend endpoints are unprotected, when an unauthenticated browser hits a URL directly, the API calls succeed and return the data to the page.

---

## 2. How to Fix It

To secure the application before deployment, you need to implement two layers of protection:

### Step 1: Secure the Backend (Express)
Apply the existing `authMiddleware` to the missing backend routes in `backend/src/server.ts` so that APIs refuse requests without a valid JWT.

**Example Fix:**
Change the route registrations in `backend/src/server.ts` to include the middleware:
```typescript
import { authMiddleware } from "./middleware/authMiddleware";

// V1 Routes
app.use("/api/campaigns", authMiddleware, campaignRoutes);
app.use("/api/posts", authMiddleware, postRoutes);
app.use("/api/statuses", authMiddleware, statusRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);
app.use("/api/calendar", authMiddleware, calendarRoutes);

// V2 Routes
app.use("/api/approvals", authMiddleware, approvalRoutes);
app.use("/api/analytics", authMiddleware, analyticsRoutes);
app.use("/api/workflows", authMiddleware, workflowRoutes);
app.use("/api/inbox", authMiddleware, inboxRoutes);
```

### Step 2: Secure the Frontend (Next.js)
Add a client-side auth guard (e.g., a shared `useAuth` hook or layout wrapper in the Next.js app) that checks `localStorage` and immediately redirects to `/login` if the token is missing.

**Example Fix:**
Update the dashboard layout (`orean-web/app/dashboard/layout.tsx`) to check for the token:
```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// ... other imports

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("orean360_token") || localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // ... rest of the layout component
}
```
