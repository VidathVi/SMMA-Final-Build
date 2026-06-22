# Deployment Architecture & Product Roadmap Plan

This plan outlines the containerization strategy, conditional deployments (Varying by environment), database setup strategies (local vs. cloud), and key product features missing from the SMMA-Final-Build codebase.

---

## 1. Environment-Based Deployment Architecture

We will implement a hybrid infrastructure strategy, allowing simple local orchestration and deployment to a robust production infrastructure.

```mermaid
graph TD
    Developer[Developer Machine] -->|docker-compose up| LocalDocker[Local Docker Container Stack]
    LocalDocker -->|Mounts| LocalVol[(Local DB Volume)]
    
    GitPush[Git Commit & Push] -->|Triggers| GHA[GitHub Actions Runner]
    GHA -->|If target is Staging| StagingEnv[Lightweight Cloud Container Runner]
    GHA -->|If target is Production| K8sCluster[Kubernetes Cluster]
    
    StagingEnv -->|Reads Env| RemoteDB[(Managed Cloud DB)]
    K8sCluster -->|Reads Secrets| RemoteDB
```

### A. Local Development Environment (Docker Compose)
*   Developers run the system locally using a single `docker-compose.yml` file.
*   The stack spins up the Next.js frontend, Node.js Express API backend, and a local PostgreSQL container.
*   **Persistent Storage:** The PostgreSQL container mounts to a local Docker volume (`postgres_local_data`) so database state persists across runs.
*   **Automatic Startup:** The database container **automatically boots and configures** alongside the frontend/backend apps under a single `docker compose up` command.

### B. Staging / Testing Environment (Container-as-a-Service)
*   **Trigger Condition:** Merges/Pushes to a development or testing branch.
*   **Infrastructure:** Light container hosts (e.g., AWS ECS Fargate, Render, or Google Cloud Run) deployed dynamically.
*   **Database:** Connects directly to a cloud testing database (no local database container is deployed).
*   **Startup Logic:** The cloud database instance is **always-on (permanently active)**. The deployed container simply reads connection environment variables at startup and hooks into it.

### C. Production Environment (Kubernetes Cluster)
*   **Trigger Condition:** Merges/Pushes to the `main` branch.
*   **Infrastructure:** Standard Kubernetes cluster.
*   **Decoupled Scaling:** Services scale independently using Deployments, ClusterIP Services, and Ingress routing. 
*   **Database:** Connects to an always-on production database provider.
*   **Autoscaling (Optional):** Using KEDA (Kubernetes Event-driven Autoscaling) to scale async worker pods to 0 when queue backlogs are empty.

---

## 2. Database Integration Strategy

Your code stays stateless by routing connections dynamically using standard environment variables: `DATABASE_URL`.

### A. Local Configuration
Prisma reads the database URL locally from `/backend/.env` or Docker Compose variables:
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/orean360
```
This points to the PostgreSQL container running inside your local network.

### B. Production Configuration (GitHub Actions Integration)
When deploying, the local database container is not run. Instead, the backend connects directly to a managed Postgres database (e.g. Supabase, AWS RDS, Neon, or Google Cloud SQL) using credentials injected securely via secrets.

1.  **Configure GitHub Secrets:** 
    *   Store your database connection string as a repository secret: `DATABASE_URL`.
2.  **Define Pipeline Job Steps:**
    *   Run migrations before updating container builds.
    *   Inject secrets into build and deploy environments dynamically:
    ```yaml
    # Example Workflow Steps
    - name: Run Prisma Database Migrations
      run: npx prisma migrate deploy
      working-directory: ./backend
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
    ```

---

## 3. Completed Actions Summary

To prepare the repository for this clean architecture plan, the following modifications have already been performed:

1.  **Removed GEO Engine / GEO Studio Code:**
    *   Deleted local directories: `frontend/src/app/geo-studio`, `orean-web/app/dashboard/geo-engine`, and `backend/geo_service`.
    *   Cleaned layouts: Removed `GEO Studio` and `Geo Engine` options from `Sidebar.tsx`, `Header.tsx`, and `Navbar.tsx` across both the Vite and Next.js projects.
2.  **Cleaned Deprecated and Scratch Files:**
    *   Deleted `_V1_deprecated` and `Orean_360_V1` folders.
    *   Removed `useState.jsx` and various build log text files (`build_log.txt`, `tsc_errors.txt`, `next_errors.txt`).
3.  **Committed and Synced:**
    *   Staged, committed, and pushed cleanups to the remote GitHub `main` branch. Verified both project build pipelines compile successfully.

---

## 4. Remaining Action Checklist (To-Do)

Here are the step-by-step tasks left to fully implement this automated containerization and deployment workflow:

### Step 1: Write backend Dockerfile
- [ ] Create a `Dockerfile` inside `/backend`.
- [ ] Install Node.js dependencies, compile TypeScript via `tsc`, expose port `8080`, and configure it to run `node dist/server.js`.

### Step 2: Write frontend/next.js Dockerfile
- [ ] Create a multi-stage `Dockerfile` inside `/orean-web`.
- [ ] **Stage 1 (Build):** Install project dependencies and compile Next.js production builds (`next build`).
- [ ] **Stage 2 (Run):** Copy only the built output files (`.next/standalone` and `/public`) to a lightweight node runtime to keep image sizes small.

### Step 3: Write root-level Docker Compose Config
- [ ] Create a `docker-compose.yml` in the project root.
- [ ] Configure `db` service running the public `postgres` image, mapping port `5432`.
- [ ] Define a persistent Docker volume (`postgres_local_data`) and mount it to `/var/lib/postgresql/data`.
- [ ] Configure `backend` and `frontend` services mapping ports and passing the local `DATABASE_URL` env variable.

### Step 4: Write GitHub Actions Workflow file
- [ ] Create a workflow file at `.github/workflows/deploy.yml`.
- [ ] Configure the build trigger to run on `push` or `pull_request` to target branches.
- [ ] **Job Step 1:** Checkout codebase and set up Node/NPM.
- [ ] **Job Step 2:** Retrieve the secure `DATABASE_URL` from GitHub Secrets (`secrets.DATABASE_URL`) and run Prisma migrations via `npx prisma db push` or `npx prisma migrate deploy`.
- [ ] **Job Step 3 (Optional):** Build Docker images using the Dockerfiles, tag them, and push them to a container registry (Docker Hub, AWS ECR, or GitHub Packages).
- [ ] **Job Step 4 (Optional):** Trigger deployment changes on the cloud host (e.g. AWS ECS Fargate, Kubernetes Cluster, or Google Cloud Run), passing env variables securely.

### Step 5: Configure Cloud Database Instance
- [ ] Spin up an active database instance using a managed provider (e.g., Supabase or AWS RDS).
- [ ] Save the database connection string as a GitHub Repository Secret.

---

## 5. Product Feature Gaps

To make this social media scheduling application production-ready, the following core features should be scheduled for development:

### 1. Active Task & Event Queues (BullMQ + Redis)
*   **Problem:** Storing scheduled post timers in node memory is unreliable; if the server restarts, pending schedules are lost.
*   **Solution:** Implement persistent queues using Redis and BullMQ. Background workers will periodically pick up tasks, publish posts, and track job failures.

### 2. Rate-Limiting & Buffering
*   **Problem:** Directly calling social media APIs concurrently leads to rate-limiting blocks or bans.
*   **Solution:** Implement throttling buffers within the queue workers to space posts out according to API limits.

### 3. Media Transcoding Service (FFmpeg)
*   **Problem:** Instagram, TikTok, and YouTube require specific codecs, file dimensions, file sizes, and aspect ratios.
*   **Solution:** Add a background microservice that transcodes uploaded media assets into optimized streaming profiles and generates visual thumbnails.

### 4. OAuth Refresh Token Monitors
*   **Problem:** Connected social network authentication tokens expire periodically.
*   **Solution:** Track token parameters in PostgreSQL, monitor token expiry dates, and alert users via dashboard notifications or emails to re-authenticate before scheduled content fails.

### 5. Detailed Execution Auditing
*   **Problem:** Users must know exactly why a post failed (e.g., copyright violation, text too long, API outage).
*   **Solution:** Store response payloads returned by social APIs in a `PublishLog` audit table and present clear error messages on the customer dashboard.
