import logging
import json
from groq import Groq
from config.settings import GROQ_API_KEY

logger = logging.getLogger(__name__)
MODEL = "llama-3.3-70b-versatile"

_client = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        if GROQ_API_KEY is None:
            raise ValueError("GROQ_API_KEY is not set.")
        _client = Groq(api_key=GROQ_API_KEY)
    return _client


def explain_code(code: str, language: str) -> dict:
    """Explain code logic in detail."""
    prompt = f"""You are an expert {language} developer. Explain the following code in detail.

Code:
```{language}
{code}
```

Respond with a JSON object with this exact structure:
{{
  "explanation": "detailed explanation of what the code does",
  "key_concepts": ["concept1", "concept2", "concept3"]
}}

Return ONLY valid JSON, no markdown fences, no extra text."""

    try:
        client = _get_client()
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=4096,
            response_format={"type": "json_object"},
        )
        data = json.loads(response.choices[0].message.content.strip())
        return {
            "explanation": data.get("explanation", ""),
            "key_concepts": data.get("key_concepts", []),
        }
    except Exception as e:
        logger.error(f"Explain error: {e}", exc_info=True)
        raise
