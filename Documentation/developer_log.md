# SMMA Developer Activity & Project Log

This document serves as a persistent, running log of all activities, structural decisions, code modifications, and feature integrations carried out in the SMMA (Social Media Management Automation) project.

---

## 📅 Timeline & Activity Log

### [2026-06-24] Managed Services Setup, Redis SSL/TLS & Platform Credentials Documentation
**Author:** AI Coding Assistant
**Components Involved:** `backend/src/services/queue.service.ts`, `backend/.env`, Database, `Documentation/api_keys_setup.md`

- **Database Initialization**: Successfully applied the Prisma schema to the Neon PostgreSQL instance (`prisma migrate dev`) and executed the seed script. The database is now populated with the default configuration (4 roles, 5 campaign statuses, 3 post statuses, and the initial admin user).
- **Aiven Valkey/Redis Integration**: Confirmed deployment of the message broker using Aiven's Valkey instance named `smma-redis`.
- **SSL/TLS Client Support**: Updated the `parseRedisUrl` function inside `queue.service.ts` to inspect the connection protocol. If `rediss://` (secure Redis connection) is supplied, it now dynamically injects the `tls: {}` option into the ioredis options. This ensures a successful SSL handshake with Aiven.
- **Integration Credentials Documentation**: Authored a detailed step-by-step setup guide ([api_keys_setup.md](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/Documentation/api_keys_setup.md)) explaining how to obtain credentials, configure redirect URIs, and handle tokens for Google, YouTube, Meta, WhatsApp, LinkedIn, and TikTok.
- **Platform Credentials Integration**: Populated active credentials in the `backend/.env` file:
  - **Google & YouTube:** Client ID, Client Secret, and YouTube Data API Key successfully configured.
  - **Meta:** App ID and App Secret configured; OAuth redirect flow verified using the automatically allowed development `localhost` setup.
  - **LinkedIn:** Client ID and Client Secret configured and page links established.
  - **WhatsApp & TikTok:** Config and setup deferred to a later iteration.

### [2026-06-23] Cloud Database & Message Broker Selection
**Author:** AI Coding Assistant
**Components Involved:** Cloud Infrastructure, `backend/prisma/schema.prisma`, `backend/src/services/queue.service.ts`

- **Database Decision (Neon PostgreSQL)**: Selected **Neon** for managing the serverless PostgreSQL instances. Chosen for its automatic scaling, direct Prisma support, and database branching features (which allow staging and production to run isolated branches easily).
- **Message Broker Decision (Aiven Redis)**: Selected **Aiven Redis** (Free Tier: 1GB RAM) to run the BullMQ task queues. 
  - *Rationale*: BullMQ workers poll Redis continuously. A serverless pay-per-request Redis (like Upstash) would quickly exhaust its daily command limit. Aiven provides a standard always-on Redis container with no daily command limit, ensuring 24/7 background worker execution on the free tier.

### [2026-06-23] GEO Engine Microservice Integration (Backend & Frontend)
**Author:** AI Coding Assistant
**Components Involved:** `backend/src/services/geo.service.ts`, `backend/src/controllers/geo.controller.ts`, `backend/.env`, `orean-web/app/dashboard/publisher/page.tsx`

#### 1. Backend Migration to Modal vLLM
- **Environment Updates**: Introduced `GEO_ENGINE_URL` and `MODAL_API_KEY` to `.env` and `.env.example`.
- **vLLM Integration**: Replaced the local FastAPI fallback with direct OpenAI-compatible API calls (`v1/chat/completions`) pointing to the serverless Modal vLLM deployment.
- **System Prompts**: Configured strict JSON schema system prompts to guarantee output formatting for caption, hashtags, alt-text, and meta descriptions.
- **Robust Parsing**: Added custom parsing utility to clean LLM response wrappers and convert the result into a clean JSON object.
- **Auto-Saving Drafts**: Modified the controller to automatically save generated metadata as a `"Draft"` post inside the PostgreSQL database (via `postService.create()`) if `campaignId` is provided.

#### 2. Frontend UI Integration in Publisher Page
- **"✨ Auto-Generate with GEO" Button**: Added a dedicated magic button to the post creation toolbar on the Publisher page.
- **AI Content Generator Modal**: Designed and built an overlay modal allowing users to customize generation options (Topic, Tone, Goal, Target Audience, and Campaign selection).
- **Auto-Population**: Wired the modal to close and automatically populate the main composer’s caption, hashtags, and image alt-text fields upon successful generation.

---

### [2026-06-22] Core SMMA System Architecture Completion
**Author:** Development Team
**Components Involved:** Database, Backend APIs, Task Queues, Transcoding, Frontend Dashboards

#### 1. Prisma Schema Expansion
- Created database models for the entire workflow ecosystem:
  - `MediaAsset`: Media library file tracking, tagging, and transcoding statuses.
  - `ApprovalComment`: Workflow comment threads for collaborating on drafts.
  - `InboxMessage` & `InboxReply`: Multi-platform inbox aggregation and threading.
  - `WorkflowDefinition` & `WorkflowNode`: Automated workflow pipelines.
  - `PublishLog`: Audit trail of posts dispatched to social platforms.
  - `AnalyticsSnapshot`: Metrics snapshotted over time for Recharts graphs.

#### 2. Backend Services & REST APIs
- Created backend services, controllers, and routes for:
  - **Approvals**: Retrieve queue, change post approval statuses, manage approval comments.
  - **Analytics**: Pull aggregated overview stats, engagement metrics, and top posts.
  - **Workflows**: Full CRUD for automated publication node logic.
  - **Inbox**: Fetch aggregated streams, send replies, track read/unread states.

#### 3. Redis + BullMQ Queue Implementation
- **Publishing Queue**: Scheduled queue (`post-publishing`) handling delayed publish tasks with automatic 3x retries and exponential backoff.
- **Transcoding Queue**: Background queue (`media-transcoding`) processing resource-heavy video files.

#### 4. Media Transcoding Service
- Setup FFmpeg-based automated video processor converting uploads to platform-specific dimensions (TikTok/Reels vertical, YouTube Shorts, LinkedIn widescreen).

#### 5. Frontend Pages & Routing
- Built the following dashboard modules inside `orean-web`:
  - **Campaigns Page**: Management grid with modals to create, search, and monitor marketing campaigns.
  - **Approvals Page**: Split view showing content needing approval alongside comments.
  - **Analytics Page**: Sleek charts showing followers growth, reach, and detailed table analytics.
  - **Workflows Page**: Workflow manager listing automation paths.
  - **Assets Page**: Drag-and-drop media bank featuring tag filters and processing statuses.
  - **Calendar Page**: Month-view dashboard presenting schedules.
  - **GEO Engine Dashboard**: Interactive workspace for caption optimization, language detection, and engagement prediction.

---

## 🛠️ Current Project Directory Mapping

```
SMMA-Final-Build/
├── backend/                       # Express + Prisma + BullMQ server
│   ├── prisma/                    # Schema definition and migrations
│   └── src/
│       ├── controllers/           # Route handlers (geo, approval, analytics, workflows, etc.)
│       ├── routes/                # Express router configurations
│       └── services/              # Core business logic (geo, transcoding, queue, inbox)
├── orean-web/                     # Next.js 16 frontend app
│   ├── app/
│   │   ├── dashboard/             # Main application views (publisher, campaigns, workflows)
│   │   └── login/                 # Authentication pages
│   └── components/                # Shared layout & UI components
└── Documentation/                 # Architectural plans, walkthroughs, logs
```

---

## 🚀 Future Roadmap & Pending Steps
1. Run database migrations to apply the latest schemas (`npx prisma migrate dev`).
2. Populate the `GEO_ENGINE_URL` endpoint and `MODAL_API_KEY` inside `backend/.env`.
3. Integrate React Flow for the visual Workflow designer (currently static layouts).
4. Configure S3/Cloudinary upload services for media assets (currently local storage).
