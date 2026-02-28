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


def _count_lines(code: str) -> int:
    return len([l for l in code.splitlines() if l.strip()])


def calculate_metrics(code: str, language: str) -> dict:
    """Calculate code metrics using AI and local heuristics."""
    lines_of_code = _count_lines(code)

    prompt = f"""You are an expert {language} code analyst. Analyze the following code and provide metrics.

Code:
```{language}
{code}
```

Respond with a JSON object with this exact structure:
{{
  "cyclomatic_complexity": <integer>,
  "maintainability_index": <float between 0 and 100>,
  "functions_count": <integer>,
  "classes_count": <integer>,
  "comments_ratio": <float between 0 and 1, ratio of comment lines to total lines>
}}

Return ONLY valid JSON, no markdown fences, no extra text."""

    try:
        client = _get_client()
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=512,
            response_format={"type": "json_object"},
        )
        data = json.loads(response.choices[0].message.content.strip())
        return {
            "lines_of_code": lines_of_code,
            "cyclomatic_complexity": int(data.get("cyclomatic_complexity", 1)),
            "maintainability_index": float(data.get("maintainability_index", 50.0)),
            "functions_count": int(data.get("functions_count", 0)),
            "classes_count": int(data.get("classes_count", 0)),
            "comments_ratio": float(data.get("comments_ratio", 0.0)),
        }
    except Exception as e:
        logger.error(f"Metrics error: {e}", exc_info=True)
        raise
