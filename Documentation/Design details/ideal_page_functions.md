# Ideal Page Functions & Feature Requirements

This document outlines how each primary page in the SMMA-Final-Build application should ideally function and the core functions/methods each page must contain to achieve its intended user experience.

## 1. Authentication & Onboarding
**Pages:** `/`, `/login`, `/register`

**How it should function:**
These pages serve as the secure gateway to the platform. They must validate user credentials securely, establish authenticated sessions via JWTs, and handle graceful redirects (e.g., sending unauthenticated users from protected routes back to login, and routing authenticated users directly to the dashboard). The UI must support both native email/password entry and seamless social OAuth flows (like Google Identity One-Tap).

**Ideal Core Functions:**
*   `handleLogin(credentials)`: Validates the inputted username/password against the backend `/api/auth/login` endpoint.
*   `handleRegistration(userData)`: Creates a new user profile securely via the registration endpoint.
*   `storeAuthToken(token)`: Securely saves the `orean360_token` (ideally moving towards HTTP-only cookies, or utilizing secure `localStorage`).
*   `verifySession()`: Runs on component mount to check token validity and redirect appropriately based on the authentication state.
*   `handleSocialLogin(provider)`: Triggers third-party OAuth flows (Google, Facebook, etc.) and handles the callback tokens.

---

## 2. Dashboard
**Page:** `/dashboard`

**How it should function:**
The dashboard is the central hub for the user, providing an immediate snapshot of their account health, pending tasks, and overall campaign metrics. It should load quickly by utilizing aggregated backend endpoints and update dynamically without requiring full page reloads.

**Ideal Core Functions:**
*   `fetchKPIs()`: Retrieves aggregated metrics for the top cards (Active campaigns, pending approvals, engagement rates, Average GEO scores).
*   `fetchPipelineData()`: Loads the current status and counts for the Kanban pipelines (Drafting, In Review, Scheduled).
*   `fetchActionItems()`: Retrieves specific tasks or alerts that require immediate user attention or interaction.
*   `renderNavigation()`: Dynamically renders sidebar navigation links based on user roles, permissions, and active subscriptions.

---

## 3. Publisher / Post Creator
**Page:** `/dashboard/publisher` (or `/create-post`)

**How it should function:**
This is the core content creation tool. It must allow users to compose multi-channel posts, upload and manage media, and preview exactly how the post will look on each specific network natively. It must connect to the GEO Engine microservice for seamless AI content optimization.

**Ideal Core Functions:**
*   `handleMediaUpload(files)`: Uploads and processes images/videos (up to 6 files), handling file size constraints and formatting.
*   `generateOptimizedContent(prompt)`: Makes an asynchronous call to the GEO Engine microservice (RunPod/Ollama) to generate optimized captions, hashtags, and alt-text without blocking the UI.
*   `updatePlatformPreview(platform, content)`: Dynamically re-renders the live mock preview components (IG, FB, X, TikTok, etc.) as the user types or uploads media.
*   `schedulePost(postData, datetime)`: Submits the final payload to the backend to be inserted into the persistent task queue (e.g., Redis/BullMQ) for future publishing.

---

## 4. Unified Inbox
**Page:** `/dashboard/inbox` (or `/inbox`)

**How it should function:**
The unified inbox aggregates communication from all connected social channels into a single, cohesive feed. It should support real-time updates (via WebSockets or intelligent polling), rich tabbed filtering, and allow users to reply directly from the platform without logging into the native networks.

**Ideal Core Functions:**
*   `fetchMessages(filter)`: Retrieves messages, comments, and reviews from the backend, filtered by selected tabs ("All", "Private", "Comments").
*   `sendMessageReply(messageId, replyContent)`: Dispatches a user's reply through the backend to the specific social network's API.
*   `markAsRead(messageId)`: Updates the message's read/unread status in the database.
*   `searchInbox(query)`: Filters the locally loaded message threads based on text input.

---

## 5. Content Calendar
**Page:** `/calendar`

**How it should function:**
The calendar provides a visual, chronological view of all scheduled, published, and drafted posts. It should support drag-and-drop rescheduling to make campaign management effortless and visually distinguish between different post statuses and target platforms using color coding or icons.

**Ideal Core Functions:**
*   `fetchMonthlySchedule(month, year)`: Loads all posts applicable to the current calendar grid view.
*   `handleDragAndDrop(postId, newDate)`: Updates the scheduled execution time of a post via a backend API call when dropped on a new date cell.
*   `filterCalendar(platforms, statuses)`: Toggles the visibility of specific posts on the grid based on user-selected filters.
*   `openPostDetails(taskId)`: Parses URL search queries or click events to open a detailed modal with the specific post's configuration.

---

## 6. Administrative Approvals
**Page:** `/dashboard/approvals` (or `/approval`)

**How it should function:**
This page facilitates collaboration between team members or external clients. It acts as a task board where content drafts can be reviewed, commented on, and explicitly approved or rejected before publication. It should ultimately support real-time collaboration.

**Ideal Core Functions:**
*   `fetchApprovalTasks(status)`: Loads all tasks currently flagged as requiring review.
*   `updateTaskStatus(taskId, status)`: Changes a task's state from 'In Review' to 'Approved' or 'Rejected'.
*   `submitFeedbackComment(taskId, comment)`: Adds a collaborative text comment to a specific draft.
*   `openSplitScreenView(taskId)`: Initializes a dual-pane UI showing the post preview on one side and a live, WebSocket-powered comment thread on the other.

---

## 7. Settings & Profile
**Page:** `/dashboard/settings` (or `/personal-profile`)

**How it should function:**
The settings panel manages all user configurations, organization details, connected social accounts, and billing. It needs to cleanly handle secure data updates and execute the complex OAuth handshakes required for connecting third-party platforms.

**Ideal Core Functions:**
*   `updateUserProfile(data)`: Submits and saves personal user or organizational information.
*   `connectSocialAccount(platform)`: Initiates the OAuth flow to securely link a new social media page (Instagram, Facebook, LinkedIn, etc.) and save the access tokens.
*   `disconnectSocialAccount(platformId)`: Revokes platform access tokens and removes the connection from the database.
*   `manageSubscription(planId)`: Interacts with the integrated billing provider (e.g., Stripe) to allow users to upgrade, downgrade, or cancel their plans.

---

## 8. Specialized Modules (Under Construction)

**How they should ideally function:**
*   **Workflows (`/dashboard/workflows`):** Should provide a visual canvas utilizing a library like React Flow. Functions: `addNode()`, `connectNodes()`, and `savePipelineDef()` to orchestrate complex, multi-step approval chains.
*   **Assets (`/dashboard/assets`):** Should act as a robust media drive. Functions: `uploadToCloudStorage()`, `tagAsset(assetId, tags)`, and `fetchAssets(filters)` for a centralized media library.
*   **Campaigns (`/dashboard/campaigns`):** Should link disparate posts into a singular campaign entity. Functions: `createCampaign()`, `linkPostToCampaign(postId, campaignId)`, and `fetchCampaignMetrics()` to track aggregate performance.
*   **Analytics (`/dashboard/analytics`):** Should aggregate data into visual reporting charts (using libraries like Recharts). Functions: `fetchTimeSeriesData(metric, dateRange)` and `exportReport(format)` to download PDFs/CSV.
*   **GEO Engine (`/dashboard/geo-engine`):** Should act as a dashboard for the AI generation system. Functions: `analyzeTextMetrics(text)` to run algorithms scoring Citation Probability, Semantic Density, and Readability, and `renderGaugeCharts()` to visualize the results.
