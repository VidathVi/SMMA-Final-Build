# Orean 360 Backend

This is the backend for the Orean 360 Social Media Management Platform. It is built using Node.js, Express, and PostgreSQL.

## Features Added (v1.1)

The backend now fully supports OAuth 2.0 integrations and API interactions for the following social platforms:

- **Meta (Facebook & Instagram)**
- **YouTube (Google)**
- **LinkedIn**
- **TikTok**
- **WhatsApp Business**

## Environment Variables Configuration

To run this backend locally and test the API integrations, you will need to map the appropriate keys in your `.env` file. Copy the `.env.example` file to create your own `.env` configuration.

### Core Connections

- `PORT=8080`
- `DATABASE_URL` (Your PostgreSQL connection string)
- `JWT_SECRET` (For local auth tokens)
- `FRONTEND_URL` (Usually `http://localhost:3000`)

### Social OAuth Setup

You must register an application on the respective developer portals for these platforms to get client IDs and secrets:

- **Google Cloud Console** (For YouTube)
- **Meta For Developers** (For Facebook, Instagram, WhatsApp)
- **LinkedIn Developers**
- **TikTok For Developers**

Ensure all `_REDIRECT_URI`s in your `.env` match exactly what is registered in the developer portals (e.g., `http://localhost:8080/api/meta/callback`).

## Running the Server

```bash
npm install
npm run dev
```

The server will automatically start on the defined port and test the database connection sequentially.
