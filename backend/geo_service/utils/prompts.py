# Simple prompt templates for OpenAI calls

CAPTION_PROMPT = """
Write a highly engaging social media caption for {platform}.
The topic is: {topic}
The tone should be: {tone}

Provide only the caption. Include suitable emojis and a couple of relevant hashtags if appropriate.
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
