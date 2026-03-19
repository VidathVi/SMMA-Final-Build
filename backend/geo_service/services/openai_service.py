import os
from openai import OpenAI
from utils.prompts import CAPTION_PROMPT, OPTIMIZATION_PROMPT, LANGUAGE_DETECTION_PROMPT

# The OpenAI client automatically looks for OPENAI_API_KEY in the environment variables
client = OpenAI()

def _call_openai(prompt: str) -> str:
    """Reusable helper for calling the OpenAI Chat API."""
    
    # Catch cases where the key hasn't been set yet
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        return "Error: OpenAI API key is not configured. Please add it to your .env file."

    try:
        response = client.chat.completions.create(
            # Using gpt-4o-mini as it's the fastest and most cost-effective for general university tasks
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful social media and Generative Engine Optimization API expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=300
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error connecting to OpenAI: {str(e)}"

def generate_caption(topic: str, platform: str, tone: str) -> str:
    prompt = CAPTION_PROMPT.format(topic=topic, platform=platform, tone=tone)
    return _call_openai(prompt)

def optimize_text(content: str, language: str) -> str:
    prompt = OPTIMIZATION_PROMPT.format(content=content, language=language)
    return _call_openai(prompt)

def predict_engagement(content: str) -> str:
    prompt = f"Analyze this content and predict social media engagement (High, Medium, Low) with a brief 1-sentence reason:\n\n{content}"
    return _call_openai(prompt)

def detect_language(content: str) -> str:
    prompt = LANGUAGE_DETECTION_PROMPT.format(content=content)
    return _call_openai(prompt)

def analyze_tone_and_hashtags(content: str) -> str:
    """Reusable service function specifically for tone analysis and hashtags."""
    prompt = f"Analyze the tone of the following content. Then, suggest 5 highly relevant hashtags for reach.\nContent: {content}"
    return _call_openai(prompt)
