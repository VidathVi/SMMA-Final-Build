# GEO Content Generation Microservice Plan

Since you are integrating this into an existing web application, the GEO content generator will act as a standalone, serverless **Microservice**. Your existing web app's backend will query this microservice to generate content and then handle saving the results directly to your existing database.

## Architecture Overview

```mermaid
graph LR
    User[User Client] -->|Generates Post| ExistingApp[Your Existing Backend]
    ExistingApp -->|Saves generated content| ExistingDB[(Your Existing DB)]
    ExistingApp -->|HTTP POST (Prompt)| RunPod[RunPod Serverless GPU<br/>(vLLM / Ollama Microservice)]
    RunPod -->|Loads model weights| HF[Hugging Face Hub]
```

## Step 1: Host the Model Weights (Hugging Face)
Before the cloud GPU can run your model, it needs to download it securely.
1. Create a free account on [Hugging Face](https://huggingface.co/).
2. Create a new **Private** model repository.
3. Upload your `model-q4_k_m.gguf` (the model you export from Colab) to this repository.

## Step 2: Set Up the Serverless Inference API (RunPod)
**RunPod Serverless** is highly recommended for microservices. It provides a standard REST API endpoint that scales down to zero when not in use, meaning you only pay per second of actual text generation.

1. Create an account on **RunPod**.
2. Go to **Serverless** -> **Endpoints** and create a new endpoint.
3. Select an environment template like **vLLM** or **Ollama** (vLLM is faster for high concurrency).
4. Configure the environment variables to point to your private Hugging Face repository (you will need to provide a Hugging Face Access Token).
5. Once deployed, RunPod gives you an **Endpoint URL** and a **RunPod API Key**. This URL is your new microservice.

## Step 3: Integrating the Microservice into Your Existing Web App

You don't need to build a new frontend. You just need to write a function in your existing backend that talks to the RunPod microservice.

### Seamless UI Integration (No Redirects)
**Crucially, your users will never leave your web app or be redirected to another website.** You will build your own native User Interface (e.g., a "Generate Post" button) inside your existing app. When the user clicks this button, your frontend simply displays a loading spinner while your backend secretly talks to RunPod behind the scenes.

### 1. Constructing the Payload
When a user wants to generate a post, your backend takes their inputs (Platform, Topic, Target Audience, Goal) and injects them into the system prompt template we used during fine-tuning.

### 2. Making the API Call
Your backend makes an HTTP `POST` request to the RunPod Endpoint URL.
*   **Headers:** Include `Authorization: Bearer YOUR_RUNPOD_API_KEY`.
*   **Body:** A JSON payload containing the formatted prompt, `temperature` (e.g., 0.7), and `max_tokens` (e.g., 512).

### 3. Database Persistence
When the microservice returns the generated text:
1. Your backend parses the output to separate the Caption, Hashtags, Alt-Text, and Meta Description.
2. Insert a new record into your existing database linking this content to the user who requested it.
3. Return the saved data to your frontend so the user can see it.

## Cost Estimation
- **Model Storage (Hugging Face):** $0 / month
- **Microservice Infrastructure (RunPod):** ~$0.0002 to $0.0004 per second of generation. Since it scales to zero, you incur no costs when users aren't actively generating posts.

---

> [!NOTE]
> **User Review Required**
> Since this replaces the standalone web app concept, please review this microservice approach. If this looks good to you, the plan is finalized and we can wrap up!
