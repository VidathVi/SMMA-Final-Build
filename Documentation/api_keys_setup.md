# Integration Credentials Guide: WhatsApp, Meta, Google, LinkedIn & TikTok

This guide provides step-by-step instructions on how to set up developer portals and retrieve client IDs, secrets, and API keys for the connected platforms configured in `backend/.env`.

---

## 1. Google Cloud Console (Google & YouTube)
Google OAuth and YouTube APIs are managed through the same Google Cloud Console.

### Step 1: Create a Google Cloud Project
1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Log in with your Google account.
3. Click the project dropdown in the top-left corner and select **New Project**.
4. Name your project (e.g., `SMMA-Platform`) and click **Create**.

### Step 2: Enable the Required APIs
1. In the search bar at the top, search for **YouTube Data API v3** and select it.
2. Click **Enable**.
3. Next, search for **YouTube Analytics API** and select it.
4. Click **Enable**. (This is **required** because the backend requests the analytics scope. If you don't enable this API, the `yt-analytics.readonly` scope will not be visible in the next step).

### Step 3: Configure the Google Auth Platform (OAuth Consent Screen)
1. Go to **APIs & Services** > **OAuth consent screen** (or **Google Auth Platform**) from the left-hand navigation.
2. If prompted, choose **External** (unless you are restricting access to users in a Google Workspace organization) and click **Create**.
3. Under **Branding** (or App Information), fill in the required details:
   - **App name**: e.g., `SMMA App`
   - **User support email**: Your email address
   - **Developer contact information**: Your email address at the bottom.
   - Click **Save and Continue** or navigate to the next page.
4. Go to **Data Access** on the left menu (or click continue):
   - You will see the **Scopes** section. Click the **Add or remove scopes** button.
   - In the slide-out panel, search for or check the following scopes:
     - `.../auth/youtube.readonly`
     - `.../auth/youtube.force-ssl`
     - `.../auth/yt-analytics.readonly`
   - Click **Update** at the bottom of the slide-out panel.
5. Go to **Audience** (or Test Users) on the left menu:
   - Add the Google email accounts you intend to use to test OAuth login (essential since the app starts in "Testing" mode).
6. Save and finalize your configuration.

### Step 4: Create OAuth 2.0 Credentials
1. Navigate to **APIs & Services** > **Credentials**. You can find this in two ways:
   - **Via Search (Fastest):** Type **"Credentials"** in the search bar at the top of the page and select **Credentials (APIs & Services)**.
   - **Via Menu:** Click the **Hamburger Menu (≡)** in the top-left corner (next to the Google Cloud logo), hover over **APIs & Services**, and select **Credentials**.
2. Click **+ Create Credentials** at the top of the Credentials page and select **OAuth client ID**.
3. Set the **Application type** to **Web application**.
4. Name your credential (e.g., `SMMA Backend`).
5. Under **Authorized redirect URIs**, add:
   - `http://localhost:8080/api/youtube/callback`
6. Click **Create**.
7. Copy the generated **Client ID** and **Client Secret**.
8. Populate these in your `.env` file:
   - `YOUTUBE_CLIENT_ID` (and optionally `GOOGLE_CLIENT_ID`)
   - `YOUTUBE_CLIENT_SECRET` (and optionally `GOOGLE_CLIENT_SECRET`)

### Step 5: Create a YouTube API Key
1. In **APIs & Services** > **Credentials**, click **+ Create Credentials** and select **API Key**.
2. Copy the generated key.
3. Populate this in your `.env` file:
   - `YOUTUBE_API_KEY`

---

## 2. Meta Developer Portal (Facebook, Instagram & WhatsApp)
Facebook, Instagram, and WhatsApp integrations are all managed via Meta.

### Step 1: Register as a Developer and Access "My Apps"
1. Go to the [Meta for Developers Portal](https://developers.facebook.com/).
2. Log in with your Facebook credentials.
3. If you haven't registered as a Meta Developer yet:
   - Click **Get Started** in the top-right corner.
   - Complete the registration steps (verify your email, agree to the terms, and select your developer role).
4. Once registered or logged in, you can access the apps dashboard in two ways:
   - Click **My Apps** in the top-right corner of the header.
   - Or go directly to the URL: [https://developers.facebook.com/apps/](https://developers.facebook.com/apps/)
5. Click **Create App** (usually a green button in the top-right or center).
6. Under app type / use case selection:
   - Choose **Other** -> **Business** (or select the specific use cases you need, such as Facebook Login, Instagram Graph API, or WhatsApp).
7. In the wizard screens:
   - **App Details:** Enter your App Name and Contact Email.
   - **Business:** When asked *"Which business portfolio do you want to connect to this app?"*, select **"I don't want to connect a business portfolio yet"** (this is ideal for development and local testing). Click **Next**.
   - **Final Steps:** Click **Create App** and verify your Facebook password if prompted.

### Step 2: Get App ID & App Secret
1. In the left navigation, go to **App Settings** > **Basic**.
2. Copy your **App ID** and click **Show** to view and copy your **App Secret**.
3. Populate these in your `.env` file:
   - `META_APP_ID`
   - `META_APP_SECRET`

### Step 3: Add Facebook Login (OAuth)
1. In the app dashboard, look under **Products** on the left menu (or click **Add Product** if it's not listed).
2. Click **Settings** under **Facebook Login** (or **Facebook Login for Business**).
3. Under **Client OAuth settings**, verify that:
   - **Client OAuth login** is set to **Yes**.
   - **Web OAuth login** is set to **Yes**.
4. Configure the redirect URI:
   - **Note for Local Testing:** Meta automatically allows redirects to `http://localhost` while the app is in Development Mode. If you try to enter `http://localhost:8080/api/meta/callback`, Meta might show an error saying it is already allowed. You can leave the **Valid OAuth Redirect URIs** field empty for now.
   - **For Production:** When you deploy your application to a live domain, you must enter your production callback URL (e.g., `https://yourdomain.com/api/meta/callback`) in this field and click **Save Changes**.
5. Set the `META_REDIRECT_URI` to `http://localhost:8080/api/meta/callback` in your `.env`.

---

## 3. WhatsApp Business API (via Meta)
WhatsApp uses a separate developer workspace under Meta.

### Step 1: Enable WhatsApp in Meta App
1. Inside your Meta app dashboard, click **Add Product** on the left menu.
2. Find **WhatsApp** and click **Set Up**.
3. You will be asked to select or create a Meta Business Account. If you don't have one, Meta will guide you to create one automatically.

### Step 2: Get WhatsApp IDs (Test Environment)
1. Go to **WhatsApp** > **API Setup** on the left sidebar.
2. In the setup panel, look for:
   - **Phone Number ID**: Copy this to `WHATSAPP_PHONE_NUMBER_ID` in `.env`.
   - **WhatsApp Business Account ID**: Copy this to `WHATSAPP_BUSINESS_ACCOUNT_ID` in `.env`.
   - **Test Phone Number**: This is your sandbox phone number (e.g., `WHATSAPP_PHONE_NUMBER` in `.env`).
3. You will also see a **Temporary Access Token**. Copy this to `WHATSAPP_ACCESS_TOKEN`.
   > [!WARNING]
   > Temporary access tokens expire in 24 hours. For development, they are fine, but for production, you must generate a permanent token (see next step).

### Step 3: Generate a Permanent WhatsApp Access Token
1. Go to the [Meta Business Suite](https://business.facebook.com/) settings page.
2. Go to **Users** > **System Users**.
3. Click **Add** to create a new System User (assign them the Admin role).
4. Select the user and click **Generate Token**.
5. Select your App and check the scopes:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
6. Click **Generate Token**. Copy this token; it will never expire. Place it in `WHATSAPP_ACCESS_TOKEN`.

### Step 4: Configure Webhooks (Verify Token)
1. Go to **WhatsApp** > **Configuration** in the Meta Developer portal.
2. In the Webhook section, enter a callback URL (usually your live domain or ngrok tunnel pointing to `/api/whatsapp/webhook`).
3. The **Verify Token** can be any secure random string you choose. It must match `WHATSAPP_VERIFY_TOKEN` in your `.env` (e.g., `orean360_whatsapp_verify`).

---

## 4. LinkedIn Developer Portal
LinkedIn OAuth and publishing are managed through LinkedIn's developer dashboard.

### Step 1: Create an App
1. Go to the [LinkedIn Developers Portal](https://www.linkedin.com/developers/).
2. Click **Create App**.
3. Fill in the app details. 
   > [!IMPORTANT]
   > LinkedIn requires you to associate your app with an existing **LinkedIn Page** (Company Page). You cannot create an app without linking a page you admin.
4. Upload a logo and agree to the terms.

### Step 2: Request Products (Permissions)
1. Go to the **Products** tab of your LinkedIn app.
2. Request the following products:
   - **Share on LinkedIn** (for publishing text/images/video to user profiles).
   - **Sign In with LinkedIn** (for user authentication).
   - **Community Management API** (if posting directly to company pages is required).
3. Wait for approval (some products are auto-approved instantly; others might take a few minutes).

### Step 3: Get Client Credentials
1. Go to the **Auth** tab.
2. Under **Application credentials**, copy:
   - **Client ID** (maps to `LINKEDIN_CLIENT_ID` in `.env`)
   - **Client Secret** (maps to `LINKEDIN_CLIENT_SECRET` in `.env`)
3. Scroll down to **OAuth 2.0 settings** and add the redirect URI:
   - `http://localhost:8080/api/linkedin/callback`
4. Update `LINKEDIN_REDIRECT_URI` in `.env`.

---

## 5. TikTok Developer Portal
TikTok integrations are managed via TikTok for Developers.

### Step 1: Register Developer Account
1. Visit the [TikTok for Developers Portal](https://developers.tiktok.com/).
2. Log in or create a developer account.
3. Click **My Apps** > **Create App**.
4. Choose **Web App** as your application type and fill in the registration form.

### Step 2: Get Client Key & Client Secret
1. Select your app in the developer portal dashboard.
2. Navigate to **App Details**.
3. Copy the following:
   - **Client Key** (maps to `TIKTOK_CLIENT_KEY` in `.env`)
   - **Client Secret** (maps to `TIKTOK_CLIENT_SECRET` in `.env`)

### Step 3: Add Webhook & Redirect URIs
1. In the app settings, add the redirect URI:
   - `http://localhost:8080/api/tiktok/callback`
2. Update `TIKTOK_REDIRECT_URI` in `.env`.
3. Request product permissions for:
   - **Video Kit** (essential for uploading and sharing video posts).
   - **User Info** (for retrieving user profiles and authentication).
