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


def generate_tests(code: str, language: str, test_framework: str = "") -> dict:
    """Generate unit tests for the given code."""
    framework_hint = f"Use the {test_framework} framework." if test_framework else "Use the most appropriate testing framework for the language."

    prompt = f"""You are an expert {language} developer. Generate comprehensive unit tests for the following code.
{framework_hint}

Code:
```{language}
{code}
```

Respond with a JSON object with this exact structure:
{{
  "test_code": "the complete test code as a string",
  "test_count": <number of test cases>
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
        test_code = data.get("test_code", "")
        test_count = data.get("test_count", 0)
        if not isinstance(test_count, int):
            test_count = 0
        return {
            "test_code": test_code,
            "test_count": test_count,
        }
    except Exception as e:
        logger.error(f"Test generation error: {e}", exc_info=True)
        raise
