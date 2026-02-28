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


def chat_about_code(
    code: str,
    language: str,
    file_name: str,
    message: str,
    conversation_history: list,
) -> dict:
    """Context-aware AI chat about code."""
    system_prompt = f"""You are an expert {language} code assistant helping with a file named '{file_name}'.
You have access to the following code:

```{language}
{code}
```

Answer questions about this code accurately and helpfully. When referencing code, be specific."""

    messages = [{"role": "system", "content": system_prompt}]
    for entry in (conversation_history or []):
        role = entry.get("role", "user")
        content = entry.get("content", "")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": message})

    context_used = [f"File: {file_name}", f"Language: {language}"]

    try:
        client = _get_client()
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.3,
            max_tokens=2048,
        )
        reply = response.choices[0].message.content.strip()
        return {
            "response": reply,
            "context_used": context_used,
        }
    except Exception as e:
        logger.error(f"Chat error: {e}", exc_info=True)
        raise
