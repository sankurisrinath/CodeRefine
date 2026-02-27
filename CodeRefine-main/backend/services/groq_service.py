import json
import logging
import re
from groq import Groq
from config.settings import GROQ_API_KEY

logger = logging.getLogger(__name__)

MODEL = "llama-3.3-70b-versatile"

_client = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        if GROQ_API_KEY is None:
            raise ValueError("GROQ_API_KEY is not set. Check your .env file.")
        _client = Groq(api_key=GROQ_API_KEY)
    return _client


def _safe_parse_json(raw_content: str) -> dict:
    """Try multiple strategies to extract and parse JSON from LLM output."""
    # Strategy 1: extract JSON from markdown fences
    fenced = re.search(r'```(?:json)?\s*\n?(.*?)\n?```', raw_content, re.DOTALL)
    if fenced:
        try:
            return json.loads(fenced.group(1).strip())
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode failed (fenced block): {e}")

    # Strategy 2: find the first { ... } span via brace matching (string-aware)
    start = raw_content.find('{')
    if start != -1:
        depth = 0
        in_string = False
        escaped = False
        for i, ch in enumerate(raw_content[start:], start):
            if escaped:
                escaped = False
                continue
            if ch == '\\' and in_string:
                escaped = True
                continue
            if ch == '"':
                in_string = not in_string
                continue
            if not in_string:
                if ch == '{':
                    depth += 1
                elif ch == '}':
                    depth -= 1
                    if depth == 0:
                        candidate = raw_content[start:i + 1]
                        try:
                            return json.loads(candidate)
                        except json.JSONDecodeError as e:
                            logger.error(f"JSON decode failed (brace-matched): {e}")
                        break

    # Strategy 3: outermost { to last }
    last = raw_content.rfind('}')
    if start != -1 and last != -1 and last > start:
        candidate = raw_content[start:last + 1]
        try:
            return json.loads(candidate)
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode failed (outermost braces): {e}")

    raise json.JSONDecodeError("No valid JSON object found in LLM output", raw_content, 0)


def analyze_with_groq(language: str, mode: str, instruction: str, code: str, static_issues: list) -> dict:
    """Send code and static analysis results to Groq LLM for enhanced analysis."""
    static_summary = json.dumps(static_issues, indent=2) if static_issues else "None found."

    prompt = f"""You are an expert code reviewer performing a {mode} analysis of {language} code.

User instruction: {instruction or "Perform a thorough analysis."}

Static analysis tools found these issues:
{static_summary}

Source code to analyze:
```{language}
{code}
```

Please provide a comprehensive analysis. Your response MUST be valid JSON with this exact structure:
{{
  "ai_issues": [
    {{
      "type": "string (issue category)",
      "line": <integer line number or 0 if unknown>,
      "severity": "HIGH | MEDIUM | LOW",
      "message": "brief description of the issue",
      "explanation": "detailed explanation of why this is an issue",
      "suggestion": "specific actionable fix suggestion"
    }}
  ],
  "optimized_code": "the full refactored/optimized version of the code",
  "explanation": "overall summary of the analysis and key improvements made"
}}

Instructions:
1. Explain each static finding listed above (include them in ai_issues with explanation/suggestion).
2. Detect additional issues not caught by static tools.
3. Suggest refactoring improvements.
4. Provide the optimized code in the optimized_code field.
5. Return ONLY valid JSON, no markdown fences, no extra text."""

    content = ""
    try:
        client = _get_client()
        logger.info(f"Calling Groq API with model {MODEL}...")
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=8192,
            response_format={"type": "json_object"},
        )
        logger.info("Groq API response received successfully.")
        content = response.choices[0].message.content.strip()
        data = _safe_parse_json(content)
        return {
            "ai_issues": data.get("ai_issues", []),
            "optimized_code": data.get("optimized_code", code),
            "explanation": data.get("explanation", ""),
        }
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode failed: {e}")
        logger.error(f"Raw Groq response: {content}")
        return {"ai_issues": [], "optimized_code": code, "explanation": "Analysis could not be completed. Please try again."}
    except Exception as e:
        logger.error(f"Groq API error: {e}", exc_info=True)
        return {"ai_issues": [], "optimized_code": code, "explanation": "An error occurred while contacting the AI service."}
