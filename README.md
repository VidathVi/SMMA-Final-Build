# SMMA — Social Media Management Automation

Welcome to the SMMA platform repository! This project is a comprehensive social media management tool featuring auto-publishing, content workflows, media transcoding, analytics tracking, unified inbox streams, and AI-driven content generation.

## 📁 Repository Structure

- **[backend/](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/backend)**: Express backend with Prisma ORM (PostgreSQL), BullMQ background worker queues, FFmpeg video transcoding, and integrations.
- **[orean-web/](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/orean-web)**: Next.js 16 frontend application designed with responsive dashboards, interactive graphs, and advanced planning calendars.
- **[Documentation/](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/Documentation)**: Architectural specifications, migration strategies, and developer walkthroughs.

## 📝 Developer Activity Log & Project History

To maintain clear accountability and track progress on all features, backend services, and UI integrations:
- Refer to **[Documentation/developer_log.md](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/Documentation/developer_log.md)** for a chronological record of all changes, migrations, and features implemented.
- Refer to **[Documentation/walkthrough.md](file:///c:/Users/dassa/Documents/GitHub/SMMA-Final-Build/Documentation/walkthrough.md)** for the latest walkthrough details on the GEO Engine Microservice integration.

## 🛠️ Quick Start

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env` (referencing `.env.example`).
4. Run migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Launch the development server:
   ```bash
   npm run dev
   ```

### Frontend
1. Navigate to the webapp directory:
   ```bash
   cd orean-web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js dev server:
   ```bash
   npm run dev
   ```
