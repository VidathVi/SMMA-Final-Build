# Master Architecture & Product Plan: SMMA-Final-Build

This master document consolidates the complete architectural strategy, deployment workflow, product roadmap, API security model, and microservice integrations for the SMMA-Final-Build application.

---

## 1. Complete System Architecture

We are utilizing a microservice-oriented architecture with a hybrid API Gateway pattern, separating edge routing from core business logic. The system dynamically routes LLM inference based on the environment (Local vs. Cloud).

### A. Local Development Architecture Diagram

When running locally via `docker-compose`, all services (including the database and LLM) run on your machine.

```mermaid
graph TD
    User["Developer Machine / Localhost"] -->|"HTTPS Requests"| Kong["Kong API Gateway"]
    
    Kong -->|"Valid JWT"| Backend["Node.js Express Backend"]
    
    Backend -->|"Reads/Writes"| LocalDB[("Local PostgreSQL Container")]
    LocalDB -->|"Mounts"| DBVolume[("Local DB Volume ./postgres_data")]
    
    Backend -->|"HTTP POST (GEO_ENGINE_URL)"| LocalLLM["Local Ollama Container"]
    LocalLLM -->|"Mounts"| ModelVolume[("Local Model Folder ./models")]
```

### B. Production Cloud Architecture Diagram

When deployed to production, the system connects to external managed services.

```mermaid
graph TD
    User["User Client / Frontend"] -->|"HTTPS Requests"| Kong["Kong API Gateway"]
    
    Kong -->|"Valid JWT"| Backend["Node.js Express Backend"]
    
    Backend -->|"Reads/Writes"| CloudDB[("Managed Cloud DB e.g., RDS/Supabase")]
    
    Backend -->|"HTTP POST (GEO_ENGINE_URL)"| CloudLLM["RunPod Serverless GPU Microservice"]
    CloudLLM -->|"Downloads Weights"| HuggingFace["Hugging Face Hub"]
```

---

## 2. API Security & Access Control (Hybrid Approach)

To ensure maximum security and performance, we implement a **Hybrid Security Model** utilizing Kong API Gateway in tandem with backend application logic.

### A. Kong API Gateway (Coarse-Grained & Edge Security)
Kong acts as the gatekeeper at the edge of the network.
*   **Authentication:** Validates incoming JWTs (checks signature and expiration). Drops invalid requests before they reach the backend, saving CPU cycles.
*   **Coarse-Grained RBAC:** Enforces path-based access control by reading JWT claims (e.g., blocking non-admins from `/api/v1/admin/*`).
*   **Global Security:** Handles API Rate Limiting, DDoS protection, CORS headers, and SSL termination.

### B. Node.js Backend (Fine-Grained ABAC & Business Logic)
The backend assumes incoming requests are authenticated and authorized for the specific route, allowing developers to focus purely on business logic.
*   **Resource Ownership:** Handles Attribute-Based Access Control (ABAC). Checks if the user actually owns the data they are requesting (e.g., `document.ownerId === user.id`).
*   **Contextual Logic:** Manages multi-tenant checks, subscription tier limits, and issues the JWT containing the user's role upon login.
*   **UI State:** Passes the user's role back to the frontend so the UI can conditionally render components (like Admin sidebars).

---

## 3. Environment-Based Deployment Architecture

We utilize a varying infrastructure strategy based on the deployment target, keeping the application stateless and relying on environment variables (`DATABASE_URL`).

### Deployment Pipeline Diagram

```mermaid
graph TD
    Developer["Developer Machine"] -->|"docker-compose up"| LocalDocker["Local Docker Container Stack"]
    LocalDocker -->|"Mounts"| LocalVol[("Local DB Volume")]
    LocalDocker -->|"Runs"| LocalLLM["Local Ollama Container"]
    LocalLLM -->|"Mounts"| ModelVol[("Local Model Volume")]
    
    GitPush["Git Commit & Push"] -->|"Triggers"| GHA["GitHub Actions Runner"]
    GHA -->|"If target is Staging"| StagingEnv["Lightweight Cloud Container Runner"]
    GHA -->|"If target is Production"| K8sCluster["Kubernetes Cluster"]
    
    StagingEnv -->|"Reads Env"| RemoteDB[("Managed Cloud DB")]
    K8sCluster -->|"Reads Secrets"| RemoteDB
    
    StagingEnv -->|"Queries (via URL)"| RunPod["GEO Engine RunPod Microservice"]
    K8sCluster -->|"Queries (via API)"| RunPod
    RunPod -->|"Pulls Weights"| HF["Hugging Face Hub"]
```

### A. Local Development (Docker Compose)
*   **Setup:** A single `docker-compose.yml` spins up the Next.js frontend, Node backend, Kong Gateway, local PostgreSQL container, **and the Ollama Local LLM container**.
*   **Storage:** 
    *   The database uses a local Docker volume (`postgres_local_data`) for persistence.
    *   The Ollama container mounts a local `./models` directory holding your `model-q4_k_m.gguf` file so it doesn't need to re-download the model on every boot.
*   **Automatic Startup:** Both the database and local LLM spin up automatically alongside the app under `docker-compose up`.

### B. Staging & Production (Kubernetes / Cloud Container Runners)
*   **CI/CD Pipeline (GitHub Actions):** Triggered by pushes to specific branches.
*   **Job Flow:** Checkout codebase -> Set Node/NPM -> Run Prisma Migrations (`npx prisma migrate deploy`) -> Build Docker Images -> Deploy to Cloud.
*   **Database Integration:** Cloud environments **do not** run the local Postgres container. Instead, they connect to a permanently active managed database provider (e.g., Supabase, AWS RDS) using credentials injected securely via GitHub Secrets.

---

## 4. GEO Content Generation Microservice

The GEO content engine runs as a standalone microservice to avoid bogging down the main backend with heavy LLM inference tasks. The connection is dynamically routed based on the environment.

### A. Local Inference Setup (Ollama Docker)
When developing locally, the system uses your machine's resources to save money:
1.  **Local Model Folder:** Place your `model-q4_k_m.gguf` inside a local `./models` folder.
2.  **Ollama Container:** The `docker-compose.yml` runs the official `ollama/ollama` image, mounting the `./models` folder.
3.  **Environment Routing:** Your `.env` file points the backend to the local container: `GEO_ENGINE_URL=http://ollama:11434/api/generate`.

### B. Cloud Inference Setup (RunPod Serverless)
When deployed to production, the system switches to cloud GPUs:
1.  **Hugging Face:** Host your fine-tuned `model-q4_k_m.gguf` in a private repository.
2.  **RunPod Serverless GPU:** Create an endpoint running an Ollama/vLLM container pointing to your Hugging Face repo. RunPod scales down to zero when idle, minimizing costs.
3.  **Environment Routing:** The production cloud environment overrides the variable: `GEO_ENGINE_URL=https://api.runpod.ai/v2/YOUR_ENDPOINT/run`.

### C. Backend Integration Flow
1.  **Seamless UI:** Users click "Generate Post" in the web app. No redirects occur.
2.  **Dynamic API Call:** The Node.js backend reads `process.env.GEO_ENGINE_URL` and makes a secure HTTP POST to either the local Ollama container or the RunPod endpoint.
3.  **Database Persistence:** Once the LLM returns the generated text, the backend parses it (Caption, Hashtags, Alt-Text), saves a new record to the PostgreSQL database, and returns the data to the frontend.

---

## 5. UI/UX & Codebase Optimization Recommendations

> [!IMPORTANT]
> To ensure long-term maintainability and performance, the following structural refactoring should occur on the existing frontend codebase.

### A. Consolidate Duplicate Component Libraries
*   Move shared components (e.g., `InstagramPreview`, `FacebookPreview`, `LoadingScreen`) currently duplicated in `/frontend` and `/orean-web` into a common workspace package (e.g., `/packages/shared-ui`). This ensures visual consistency.

### B. Parameterize Environment Variables
*   Replace hardcoded fetch URLs (`http://localhost:8080`) with environment variables (`process.env.NEXT_PUBLIC_API_URL`) to allow seamless deployment across environments.

### C. Connect Static Mockups to Real State
*   Replace `setTimeout` simulated loading states in the Dashboard and Approvals list with real TanStack Query data fetching connected to the Postgres/Prisma backend.

---

## 6. Product Roadmap: Finishing the Workspaces

The following technical strategies will transition the current under-construction placeholder pages into functional features:

*   **Workflows (`/dashboard/workflows`):** Integrate a visual canvas node builder like **React Flow** to let users build drag-and-drop social approval pipelines.
*   **Assets (`/dashboard/assets`):** Connect the UI to an active storage service (AWS S3/Cloudinary) supporting multi-file drag-and-drop and metadata tagging.
*   **Campaigns (`/dashboard/campaigns`):** Implement relational DB schemas linking multiple posts/assets into unified marketing drives, with aggregated reach metrics.
*   **Approvals (`/dashboard/approvals`):** Build a split-screen view showing the post preview alongside a live comments thread using WebSockets for real-time collaboration.
*   **Analytics (`/dashboard/analytics`):** Integrate **Recharts** for visualizing brand health metrics (follower growth, engagement rates) with date-range filters.
*   **GEO Engine Analytics (`/dashboard/geo-engine`):** Run background algorithms to score generated text on Citation Probability, Semantic Density, and Readability, displaying the results in visual gauge charts.

---

## 7. Core Feature Gaps (To-Do List)

To make the platform truly production-ready, the following robust backend features are required:

- [ ] **Active Task Queues (BullMQ + Redis):** Replace in-memory scheduled timers with persistent Redis queues to ensure scheduled posts are not lost during server restarts.
- [ ] **Rate-Limiting & Buffering:** Implement throttling within queue workers to respect social media API rate limits.
- [ ] **Media Transcoding Service:** Add an FFmpeg background microservice to format video uploads into platform-specific codecs, dimensions, and sizes (TikTok, IG Reels, YouTube).
- [ ] **OAuth Refresh Monitors:** Track social token expiration dates in PostgreSQL and alert users to re-authenticate before tokens expire.
- [ ] **Execution Auditing:** Store all API response payloads in a `PublishLog` table so users can see exact error reasons if a post fails (e.g., copyright strike, text too long).
