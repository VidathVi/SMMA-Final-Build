# Complete Platform Workflow & User Journey

This document outlines the ideal, end-to-end user workflow for the SMMA (Social Media Marketing Agency) platform. It describes how all the features, integrations, and microservices tie together to create a seamless experience for marketers and teams.

---

## Phase 1: Onboarding & Setup

### 1. Account Creation & Team Setup
*   **Sign Up:** The user (Agency Owner) signs up and logs in via email/password or Google OAuth. The Kong API Gateway issues a secure JWT token containing their "Admin" role.
*   **Invite Team Members:** The owner invites writers, reviewers, and clients to the platform, assigning them specific roles (e.g., `Writer`, `Approver`, `Client`). 
*   **Contextual Access:** Based on these roles, the backend ensures users only see what they are allowed to see (e.g., a Client can only see the Approvals screen, not the Analytics or Settings).

### 2. Connecting Social Media Accounts
*   **OAuth Flow:** The Admin navigates to `/dashboard/settings` and clicks to connect Facebook, Instagram, LinkedIn, TikTok, YouTube, and WhatsApp.
*   **Secure Redirect:** They are securely redirected to the official platform login pages. 
*   **Token Storage:** The user authorizes the SMMA app, and the backend securely stores the returning `access_token` and `refresh_token` in the database. The user never types their social media passwords into the platform.

---

## Phase 2: Planning & Asset Management

### 3. Creating a Campaign
*   **Campaign Setup (`/dashboard/campaigns`):** The user creates a new "Summer Sale 2026" Campaign. This acts as a centralized folder that will hold all the posts, team members, and assets related to this marketing push.

### 4. Uploading Media Assets
*   **Asset Library (`/dashboard/assets`):** The user drag-and-drops raw video and image files into the Asset Manager.
*   **Cloud Storage & Transcoding:** The files are uploaded to cloud storage (like AWS S3). A background microservice (using FFmpeg) automatically transcodes videos into the correct aspect ratios and codecs required by Instagram Reels, TikTok, and YouTube Shorts.

---

## Phase 3: Content Creation

### 5. AI-Assisted Content Generation (GEO Engine)
*   **Using the GEO Studio (`/dashboard/geo-engine`):** Instead of writing captions from scratch, a Writer opens the GEO Engine. They input the target audience and prompt: *"Write an engaging post about our new summer discounts."*
*   **Microservice Execution:** The frontend displays a loading state while the Node.js backend securely sends the prompt to the RunPod Serverless GPU microservice.
*   **Retrieval:** The fine-tuned LLM model on RunPod generates SEO-optimized captions, hashtags, and alt-text, which the backend saves directly to the database. 
*   **Analytics Scoring:** The engine scores the generated text on its "Citation Probability" (how likely it is to be picked up by AI search engines like Perplexity or ChatGPT).

### 6. Drafting the Post
*   **Post Composition:** The Writer attaches the generated caption, selects a video from the Asset Library, and ticks the checkboxes for the target platforms (`[x] Instagram`, `[x] TikTok`, `[x] Facebook`).
*   **Previewing:** The frontend renders accurate UI mockups (e.g., `InstagramPreview`, `FacebookPreview`) so the Writer can see exactly how the post will look on a mobile phone before it goes live.

---

## Phase 4: Approval & Pipeline

### 7. Automated Workflows (`/dashboard/workflows`)
*   **Triggering the Pipeline:** Upon saving the draft, it enters a visual approval pipeline built with React Flow.
*   **Review Process (`/dashboard/approvals`):** The draft moves to the "Manager Approval" stage. The Manager receives an email/dashboard notification.
*   **Collaboration:** The Manager opens the Approval split-screen. They see the post preview on the left, and use the real-time websocket chat thread on the right to say, *"Make the caption shorter."* They click **"Request Changes"**.
*   **Final Sign-off:** The Writer edits the post. The Manager reviews it again and clicks **"Approve"**. The post is now ready for scheduling.

---

## Phase 5: Scheduling & Execution

### 8. The Content Calendar (`/dashboard/calendar`)
*   **Drag-and-Drop Scheduling:** The approved post appears on the Calendar view. The user drags it to Friday at 12:00 PM. The backend updates the scheduled posting time in the database.

### 9. The Background Queue (BullMQ + Redis)
*   **Task Ingestion:** At 11:59 AM on Friday, the background queue worker (Redis/BullMQ) wakes up and grabs the scheduled post from the database.
*   **Rate-Limiting & Buffering:** The worker checks if the application is hitting API rate limits. If too many posts are scheduled at exactly 12:00 PM, the queue buffers them, sending them out sequentially (e.g., 50 per second) to avoid getting the developer account banned.
*   **API Publishing:** The worker retrieves the stored OAuth access tokens and fires simultaneous API requests to Facebook, Instagram, and TikTok servers with the media attachments and text.

---

## Phase 6: Post-Publishing & Analytics

### 10. Execution Auditing
*   **Success/Failure Logs:** If a platform (e.g., TikTok) rejects the post because the video is too long, the API returns an error. The worker logs this in the `PublishLog` table.
*   **User Alerts:** The user receives a notification on their dashboard explaining exactly why the TikTok post failed, allowing them to fix and retry it.

### 11. Performance Tracking (`/dashboard/analytics`)
*   **Data Aggregation:** Over the next 7 days, background jobs periodically fetch likes, shares, and view counts from the social platforms using the OAuth tokens.
*   **Visualizing Success:** The user opens the Analytics page to view Recharts-powered graphs. Because posts are linked to the "Summer Sale 2026" Campaign, they can view the aggregated engagement metrics across *all* platforms for that specific campaign, proving ROI to their clients.
