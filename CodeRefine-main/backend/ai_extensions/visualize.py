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


def visualize_code(code: str, language: str) -> dict:
    """Generate a structural visualization of the code."""
    prompt = f"""You are an expert {language} developer. Analyze the following code and generate a structural visualization.

Code:
```{language}
{code}
```

Respond with a JSON object with this exact structure:
{{
  "type": "flowchart",
  "data": {{
    "mermaid": "valid Mermaid.js diagram definition as a string (flowchart TD format)",
    "description": "brief description of the structure"
  }}
}}

The mermaid field must be a valid Mermaid.js flowchart definition string showing the code structure.
Return ONLY valid JSON, no markdown fences, no extra text."""

    try:
        client = _get_client()
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=2048,
            response_format={"type": "json_object"},
        )
        data = json.loads(response.choices[0].message.content.strip())
        return {
            "type": data.get("type", "flowchart"),
            "data": data.get("data", {}),
        }
    except Exception as e:
        logger.error(f"Visualize error: {e}", exc_info=True)
        raise
