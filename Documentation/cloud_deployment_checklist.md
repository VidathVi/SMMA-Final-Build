# Cloud Deployment Checklist & Plan (Conditional Architecture)

This document outlines the roadmap and checklist for setting up the cloud infrastructure of the SMMA platform. The architecture is conditionally triggered based on the target branch in your CI/CD pipeline, deploying to either a lightweight container service (Staging) or a fully orchestrated Kubernetes cluster (Production).

---

## 🌐 Conditional Architecture Summary

```
                       [ Git Push / Merge ]
                                │
                  ┌─────────────┴─────────────┐
                  ▼                           ▼
        [ dev / staging branch ]        [ main branch ]
                  │                           │
                  ▼                           ▼
         (Staging Deployment)       (Production Deployment)
         Container-as-a-Service       Kubernetes Cluster
       (ECS Fargate / Cloud Run)     (EKS / GKE / AKS)
                  │                           │
                  ▼                           ▼
         [ Staging Cloud DB ]        [ Production Cloud DB ]
```

---

## 📋 Cloud Deployment Checklist

### Phase 1: Containerizing Applications for the Cloud
Before deploying to any cloud host, the application builds must be standardized using Docker:

- [ ] **Next.js Frontend Containerization (`/orean-web`)**:
  - Configure a multi-stage Dockerfile optimized for production.
  - Utilize the Next.js standalone output feature (`output: 'standalone'` in `next.config.js`) to drastically minimize container size by excluding developer dependencies.
- [ ] **Node.js Express Backend Containerization (`/backend`)**:
  - Write a Dockerfile that installs system-level dependencies required for media processing (specifically `ffmpeg` and `ffprobe`).
  - Configure the image to install production Node dependencies, build TypeScript to Javascript (`dist/`), and run Prisma client generation (`prisma generate`).
- [ ] **Publish Images to Registry**:
  - Set up a secure registry destination like Amazon ECR (Elastic Container Registry), Google Artifact Registry, or GitHub Packages.

---

### Phase 2: Managed Cloud Services & Dependencies
The stateless application containers need external managed services for data persistence and event processing:

- [ ] **Managed Cloud Database (Neon)**:
  - Provision two separate serverless PostgreSQL databases (one for Staging, one for Production) using **Neon**.
  - Exclude database hosting inside application containers to keep deployments stateless and resilient.
- [ ] **Managed Redis Broker (Aiven)**:
  - Set up a Redis database using **Aiven Redis** (Free Tier: 1GB RAM) to persist BullMQ queues.
  - Configure connection environment variables for both staging and production pipelines.
- [ ] **VLLM Microservice Connection**:
  - Verify that the Modal vLLM endpoint URL and API keys are accessible from the target VPCs/subnets where the frontend/backend will live.

---

### Phase 3: GitHub Actions CI/CD Pipeline (Conditional Rules)
Automate the build, migration, and deployment flow based on git actions:

- [ ] **Pipeline Secrets Configuration**:
  - Store sensitive environment variables in GitHub Secrets (`DATABASE_URL`, `REDIS_URL`, `MODAL_API_KEY`, `JWT_SECRET`, and cloud credentials).
- [ ] **Automated Database Migrations**:
  - Implement a pipeline step that executes Prisma migrations (`npx prisma migrate deploy`) against the target database BEFORE updating active containers.
- [ ] **Conditional Deployment Flow**:
  - **Staging Rule (Branch matches `dev`/`staging`)**:
    - Trigger builds for backend and frontend.
    - Deploy updated images to a serverless container platform (such as Google Cloud Run or AWS ECS Fargate).
  - **Production Rule (Branch matches `main`)**:
    - Trigger builds for backend and frontend.
    - Set up Kubectl with target production cluster access tokens.
    - Apply Kubernetes manifests directly to the cluster.

---

### Phase 4: Production Kubernetes Orchestration (Production Only)
When deploying to the production Kubernetes environment, several configuration manifests must be created:

- [ ] **Namespaces & Resource Isolation**:
  - Configure dedicated namespaces to partition resources if sharing clusters.
- [ ] **Deployments (Stateful & Stateless Services)**:
  - **Frontend Deployment**: Host the Next.js standalone application pods.
  - **Backend API Deployment**: Host the Express API pods, configured with environment variables pointing to the managed database and Redis broker.
  - **Worker Deployment**: Host the BullMQ worker tasks. These pods run the same backend container but start with environment configurations that enable queues (`ENABLE_WORKERS=true`).
- [ ] **Services & Networking**:
  - Define internal `ClusterIP` services to map ports for inner-pod communication.
  - Configure an `Ingress` controller to expose the Next.js frontend and Express backend to the web with SSL/TLS certificate termination.
- [ ] **ConfigMaps & Secrets**:
  - Define Kubernetes secrets to securely mount environment variables into the backend/worker pods at runtime.
- [ ] **Autoscaling Logic (KEDA / HPA)**:
  - Configure Horizontal Pod Autoscalers (HPA) to scale web containers based on CPU/Memory load.
  - Configure KEDA (Kubernetes Event-driven Autoscaling) to scale worker pods dynamically based on the queue depth in your Redis broker (scaling to 0 if there are no pending scheduled posts).
