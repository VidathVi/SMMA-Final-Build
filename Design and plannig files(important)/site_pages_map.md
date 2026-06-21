# SMMA-Final-Build: Site Pages & Routes Map

The SMMA-Final-Build project contains two primary Next.js frontend applications inside `/frontend` and `/orean-web`. Additionally, there is a root Vite development configuration serving a profile settings app.

Below is an inventory of all pages and routes, their source file locations, and what they do.

---

## 1. Frontend Subproject (`/frontend`)

This workspace contains the initial Next.js project structure, but its source code at `frontend/src/app` is also served by the root Vite project in standard SPA mode.

### Primary Application Pages & Routes

| Route | Page / Component | Source File Path | Description |
| :--- | :--- | :--- | :--- |
| **`/`** | Home Redirector | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/frontend/src/app/page.tsx) | Displays a loading screen and automatically redirects the user to `/signin` after 2.5 seconds. |
| **`/signin`** | Sign-In Page | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/frontend/src/app/signin/page.tsx) | Login portal. Authenticators against the backend endpoint (`/api/auth/login`), stores `orean360_token` in local storage, and redirects to `/dashboard`. Includes mock buttons for social integrations (Google, Facebook, LinkedIn, Instagram). |
| **`/login`** | Login Page | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/frontend/src/app/login/page.tsx) | Alternate login flow utilizing similar credential verification. |
| **`/register`** | Register Page | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/frontend/src/app/register/page.tsx) | Registration form allowing users to sign up by inputting a username and password. On success, redirects to `/login`. |
| **`/signup`** | Sign-Up Page | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/frontend/src/app/signup/page.tsx) | Alternate signup layout mapping to the registration backend. |
| **`/dashboard`** | Main Dashboard | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/frontend/src/app/dashboard/page.tsx) | Global Overview dashboard. Displays campaign KPIs (Active campaigns, Pending approvals, Engagement numbers, Avg GEO content score), Kanban pipelines (Drafting, In Review, Scheduled columns), and quick pending actions. |
| **`/create-post`** | Publisher / Post Creator | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/frontend/src/app/create-post/page.tsx) | Dynamic post composer. Supports selecting target channels, post optimization descriptions, uploading media assets (up to 6 images/videos), scheduling, and live platform mock previews (Instagram, Facebook, X, TikTok, YouTube, WhatsApp, Telegram). |
| **`/inbox`** | Unified Social Inbox | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/frontend/src/app/inbox/page.tsx) | Aggregates user comments, direct messages, and reviews across channels (Facebook, Instagram, WhatsApp, LinkedIn, YouTube, X). Supports tabs filtering ("All", "Private", "Comments", "Reviews"), threads list, and sending replies. |
| **`/calendar`** | Content Calendar | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/frontend/src/app/calendar/page.tsx) | Grid layout calendar mapping campaign schedules. Highlights posts via URL search query filters (`taskId`). |
| **`/approval`** | Administrative Approvals | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/frontend/src/app/approval/page.tsx) | Tabular tasks board. Allows filtering/sorting by task status or priority, editing existing records, and creating new tasks via modal. |
| **`/personal-profile`** | Settings Sync | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/frontend/src/app/personal-profile/page.tsx) | Interface rendering a standalone profile manager, syncing changes with `localStorage`. |
| **`-`** | Profile Tabs Application | [App.jsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/frontend/src/app/App.jsx) | Root component served under Vite. Implements a tab-based settings dashboard. Tabs: **Personal Profile**, **Organization**, **AI & Integrations**, **Security & Access**, **Billing & Plan**, and **Danger Zone**. |

---

## 2. Next.js Web App Subproject (`/orean-web`)

A modular, Next.js App Router subproject representing the production web structure of **Orean**.

### Core Routes & Implementations

| Route | Page / Component | Source File Path | Description |
| :--- | :--- | :--- | :--- |
| **`/`** | Dynamic Entry Page | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/orean-web/app/page.tsx) | Logical routing based on login status. Checks `orean360_token` in storage: if found, redirects to `/dashboard`, else redirects to `/login`. |
| **`/login`** / **`/signin`** | Sign-In Portal | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/orean-web/app/login/page.tsx) | Standard login matching authentication backend. |
| **`/register`** / **`/signup`** | Enhanced Register Page | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/orean-web/app/register/page.tsx) | Advanced registration flow. Integrates native credentials register and Google Identity One-Tap/Sign-In OAuth flows. |
| **`/dashboard`** | Web Dashboard | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/orean-web/app/dashboard/page.tsx) | Next.js layout displaying campaign KPI summaries, action items, and sidebar navigation links. |
| **`/dashboard/publisher`** | Composer & Scheduler | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/orean-web/app/dashboard/publisher/page.tsx) | Content creation board supporting multi-platform preview formats (equivalent to `create-post` in the frontend subproject). |
| **`/dashboard/inbox`** | Unified Inbox | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/orean-web/app/dashboard/inbox/page.tsx) | Refactored Tailwind components for unified message aggregation. Integrates filtering tabs ("All", "Private", "Comments", "Reviews"), message bubbles, search inputs, and direct send button actions. |
| **`/dashboard/settings`** | Settings Panel | [page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/orean-web/app/dashboard/settings/page.tsx) | Massive dashboard hosting settings tabs: **Personal Profile**, **Organization Profile**, **Connected Accounts** (Instagram, Facebook, X, LinkedIn, YouTube, TikTok, WhatsApp QR link), **AI & Integrations**, **Security & Access**, **Billing & Plan**, and **Danger Zone**. |

### Under Construction Modules (Placeholders)

These routes exist within the dashboard routing structure but currently display a *"This module is under construction"* message:

1.  **Workflows:** `/dashboard/workflows` ([page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/orean-web/app/dashboard/workflows/page.tsx)) - Flow orchestration.
2.  **Assets:** `/dashboard/assets` ([page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/orean-web/app/dashboard/assets/page.tsx)) - Media library/assets list.
3.  **Campaigns:** `/dashboard/campaigns` ([page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/orean-web/app/dashboard/campaigns/page.tsx)) - Campaigns tracker.
4.  **Approvals:** `/dashboard/approvals` ([page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/orean-web/app/dashboard/approvals/page.tsx)) - Content approval management.
5.  **Analytics:** `/dashboard/analytics` ([page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/orean-web/app/dashboard/analytics/page.tsx)) - Analytical data reporting.
6.  **GEO Engine:** `/dashboard/geo-engine` ([page.tsx](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/orean-web/app/dashboard/geo-engine/page.tsx)) - Standalone Generative Engine Optimization panel.
