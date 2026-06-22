# Integrate GEO Engine Microservice

This plan outlines the integration of the newly deployed Modal vLLM microservice into the current Oreo360 web application, fulfilling Step 3 of the Cloud Plan.

## Background Context
Currently, the backend's `geo.controller.ts` is configured to point to a local Python FastAPI (`FASTAPI_URL`). Now that the GEO engine is hosted on Modal as an OpenAI-compatible vLLM endpoint, we need to update our backend to construct the proper prompts, communicate with Modal via REST, parse the output, and display it seamlessly on the frontend.

> [!IMPORTANT]
> **User Review Required**
> Please review this implementation plan. Specifically, note the open questions below regarding the user flow. Once approved, I will begin implementing these changes.

## Open Questions
> [!WARNING]
> 1. **Auto-Save vs. Manual Save**: When the AI generates the post, should the backend automatically save it as a "Draft" in the database? Or should the backend simply return the generated text to the frontend so the user can review and edit it before manually clicking a "Save/Publish" button? (I recommend returning it to the frontend for manual review first).
> 2. **Modal URL**: Do you have the specific Endpoint URL that Modal provided you after deploying `serve.py`? If so, we will need to add it to the `.env` file.

## Proposed Changes

### Configuration
#### [MODIFY] `backend/.env.example`
- Add `MODAL_API_KEY` (if you added authentication to the endpoint).
- Update the `GEO_ENGINE_URL` description to point to the Modal endpoint.

### Backend Infrastructure

#### [MODIFY] `backend/src/services/geo.service.ts`
- Refactor the existing `callFastAPI` function into a more robust `callGeoEngine` function.
- Update the HTTP request to match the standard OpenAI `v1/chat/completions` REST format expected by vLLM:
  - Add `Authorization: Bearer <MODAL_API_KEY>` to the headers.
  - Update the fetch URL to point directly to the Modal endpoint.

#### [MODIFY] `backend/src/controllers/geo.controller.ts`
- Update the `generateCaption` function to:
  1. Accept an expanded payload: `platform`, `topic`, `tone`, `targetAudience`, and `goal`.
  2. Construct the exact system prompt template used during your fine-tuning phase.
  3. Query the `geo.service`.
  4. Implement a parsing function to take the raw string returned by the LLM and extract the individual components (e.g., using regex to find "Caption:", "Hashtags:", "Alt-Text:", "Meta Description:").
  5. Return this parsed JSON object to the frontend.
- Adjust `optimizeContent`, `predictEngagement`, and `detectLanguage` endpoints similarly to use the new vLLM API instead of FastAPI.

### Frontend UI Integration

#### [MODIFY] `orean-web/components/...` (Post Creation Form)
- Introduce a "Generate with AI (GEO)" button inside the post creation or campaign modal.
- Build a small input form/modal for the user to provide the `topic`, `tone`, and `targetAudience`.
- Implement a loading state (spinner/skeleton) while the request is pending.
- Automatically populate the main text editor and hashtag inputs with the returned data once the generation is complete.

## Verification Plan

### Manual Verification
1. We will update the `.env` file with the actual Modal Endpoint URL.
2. We will test the `generateCaption` endpoint using Postman or a direct frontend UI click.
3. We will verify that the prompt is correctly assembled, sent to Modal, and that Modal scales up from 0 to serve the request.
4. We will confirm the frontend correctly receives and populates the generated fields without any page redirects.
