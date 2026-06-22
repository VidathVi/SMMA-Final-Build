# Walkthrough: GEO Engine Microservice Integration (Backend & Frontend)

We have successfully updated the backend to integrate with the new Modal vLLM serverless microservice, replacing the local FastAPI fallback, and integrated the "Auto-Generate with GEO" modal interface on the Publisher page.

## Summary of Changes

1. **Environment Variables**:
   - Added `GEO_ENGINE_URL` and `MODAL_API_KEY` to both `backend/.env.example` and `backend/.env`. You can now populate the Endpoint URL in your `.env` file.

2. **Service Layer (`geo.service.ts`)**:
   - Replaced `callFastAPI` with `callGeoEngine`.
   - Updated the HTTP request format to adhere to the OpenAI `v1/chat/completions` specification which vLLM uses.
   - Increased the request timeout to 60 seconds to accommodate LLM generation times.
   - Added Bearer token authorization support.

3. **Controller Layer (`geo.controller.ts`)**:
   - Updated the `generateCaption` payload to extract `platform`, `topic`, `tone`, `targetAudience`, `goal`, and `campaignId`.
   - Constructed a strict system prompt instructing the AI to *only* generate metadata (caption, hashtags, alt-text, meta description) in JSON format.
   - Added robust JSON parsing to extract the metadata from the LLM's raw text response.
   - **Auto-Saving**: Integrated `postService.create()` so that if a `campaignId` is provided in the request, the backend automatically saves the generated metadata as a new "Draft" post in the database before returning it to the frontend.
   - Updated other GEO endpoints (`optimizeContent`, `predictEngagement`, `detectLanguage`) to also use the new vLLM API format.

4. **Frontend UI Integration (`orean-web/app/dashboard/publisher/page.tsx`)**:
   - **"Auto-Generate with GEO" Button**: Added a shiny magic wand button inside the main "Create Post" header.
   - **AI Content Generator Modal**: Designed and built an interactive modal that captures the user's `topic`, `tone`, `goal`, and `target audience`.
   - **Data Fetching & State**: Connected the form to the backend's `/api/geo/generate-caption` route, managing loading spinners and error states.
   - **Auto-Populate**: Upon a successful response, the modal automatically closes and the main post caption area is beautifully populated with the AI-generated caption, hashtags, and alt-text!

## Next Steps
The integration is fully coded! To take it for a spin:
1. Make sure your vLLM app is running on Modal.
2. Update the `GEO_ENGINE_URL` in your backend `.env` file with your Modal endpoint.
3. Start up your backend and frontend.
4. Navigate to the Publisher page and click the new "✨ Auto-Generate with GEO" button to generate a post!
