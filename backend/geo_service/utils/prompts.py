# Simple prompt templates for OpenAI calls

CAPTION_PROMPT = """
Write a highly engaging social media caption for {platform}.
The topic is: {topic}
The tone should be: {tone}

Provide only the caption. Include suitable emojis and a couple of relevant hashtags if appropriate.
"""

OPTIMIZATION_PROMPT = """
You are an expert social media optimizer.
Please optimize the following caption for better engagement.
Original Caption: {caption}
Target Language: {language}
Tone to Maintain: {tone}

Tasks:
1. Improve the caption to be more engaging.
2. Generate 3-5 highly relevant hashtags.
{variants_instruction}

Keep your response clean and well-formatted.
"""

LANGUAGE_DETECTION_PROMPT = """
Identify whether the following text is in English, Sinhala, or Tamil.
Respond with only the language name.
Text:
{content}
"""
