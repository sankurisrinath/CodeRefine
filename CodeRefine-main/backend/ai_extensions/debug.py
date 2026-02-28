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


def debug_code(code: str, language: str, error_message: str) -> dict:
    """Fix code based on error description."""
    prompt = f"""You are an expert {language} debugger. Fix the following code that is producing an error.

Error message:
{error_message}

Buggy code:
```{language}
{code}
```

Respond with a JSON object with this exact structure:
{{
  "fixed_code": "the corrected code",
  "explanation": "explanation of what caused the bug and how it was fixed",
  "changes_made": ["change 1", "change 2"]
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
            "fixed_code": data.get("fixed_code", code),
            "explanation": data.get("explanation", ""),
            "changes_made": data.get("changes_made", []),
        }
    except Exception as e:
        logger.error(f"Debug error: {e}", exc_info=True)
        raise
