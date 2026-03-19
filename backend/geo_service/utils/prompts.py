# Simple prompt templates for OpenAI calls

CAPTION_PROMPT = """
Write a compelling social media caption for the following base content.
Keep it engaging and suitable for a general audience.
Content:
{content}
"""

OPTIMIZATION_PROMPT = """
Optimize the following content for better engagement in {language}.
If hashtags are missing, suggest 3 relevant hashtags.
Content:
{content}
"""

LANGUAGE_DETECTION_PROMPT = """
Identify whether the following text is in English, Sinhala, or Tamil.
Respond with only the language name.
Text:
{content}
"""
