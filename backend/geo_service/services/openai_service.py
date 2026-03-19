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
        # Fallback Simulation Mode for University Demo (Active if out of credits)
        print(f"OpenAI API Warning: {str(e)}\n--- Triggering Simulation Mode ---")
        
        if "detect" in prompt.lower() or "language" in prompt.lower():
            return "English"
        elif "predict" in prompt.lower() or "engagement" in prompt.lower():
            return "High - Simulated engagement prediction based on keyword synergy."
        else:
            return (
                "Here is an incredibly optimized caption! 🚀 It grabs attention and builds curiosity.\n\n"
                "#Orean360 #Innovation #Trending #EcoMugs\n\n"
                "[Mock Variant 2]: Stop scrolling! Check out why everyone is talking about this! ✨ #Viral #MustHave"
            )

def generate_caption(topic: str, platform: str, tone: str) -> str:
    prompt = CAPTION_PROMPT.format(topic=topic, platform=platform, tone=tone)
    return _call_openai(prompt)

def optimize_text(caption: str, tone: str, language: str, generate_variants: bool) -> str:
    variants_instruction = "3. Generate 2-3 alternative variants of the optimized caption." if generate_variants else ""
    prompt = OPTIMIZATION_PROMPT.format(
        caption=caption, 
        language=language, 
        tone=tone, 
        variants_instruction=variants_instruction
    )
    return _call_openai(prompt)

def predict_engagement(content: str) -> dict:
    """Simulates an engagement prediction using basic heuristics for the university project."""
    score = 50
    suggestions = []
    
    if len(content) > 80:
        score += 15
    else:
        suggestions.append("Make the caption longer to provide more context.")
        
    hashtag_count = content.count("#")
    if hashtag_count >= 3:
        score += 20
    elif hashtag_count > 0:
        score += 10
        suggestions.append("Add more hashtags (3-5 is optimal).")
    else:
        suggestions.append("Include relevant hashtags to boost your reach.")
        
    if "?" in content or "!" in content:
        score += 15
    else:
        suggestions.append("Add a question or exclamation to encourage audience interaction.")
        
    return {
        "score": min(score, 98),
        "suggestions": suggestions if suggestions else ["This caption is perfectly optimized!"]
    }

def detect_language(content: str) -> str:
    prompt = LANGUAGE_DETECTION_PROMPT.format(content=content)
    return _call_openai(prompt)

def analyze_tone_and_hashtags(content: str) -> str:
    """Reusable service function specifically for tone analysis and hashtags."""
    prompt = f"Analyze the tone of the following content. Then, suggest 5 highly relevant hashtags for reach.\nContent: {content}"
    return _call_openai(prompt)
