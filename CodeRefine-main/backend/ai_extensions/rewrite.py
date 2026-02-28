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


def rewrite_code(code: str, language: str, instruction: str) -> dict:
    """Rewrite code based on user instruction."""
    prompt = f"""You are an expert {language} developer. Rewrite the following code according to the instruction provided.

Instruction: {instruction}

Original code:
```{language}
{code}
```

Respond with a JSON object with this exact structure:
{{
  "rewritten_code": "the full rewritten code",
  "explanation": "explanation of changes made"
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
            "rewritten_code": data.get("rewritten_code", code),
            "explanation": data.get("explanation", ""),
        }
    except Exception as e:
        logger.error(f"Rewrite error: {e}", exc_info=True)
        raise
