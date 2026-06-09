import asyncio
import logging
from typing import AsyncGenerator

from google import genai
from google.genai import types
from google.genai.errors import APIError

from core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)
logger = logging.getLogger(__name__)

RETRY_DELAYS = [0, 2, 4, 8]

def is_transient_error(e: Exception) -> bool:
    """Determine if the exception is transient and should be retried."""
    error_str = str(e).lower()
    transient_keywords = [
        "503", "500", "unavailable", "server error",
        "connection", "timeout", "rate limit", "429"
    ]
    strict_keywords = [
        "invalid api key", "authentication", "unauthorized",
        "bad request", "400", "401", "403"
    ]
    for strict in strict_keywords:
        if strict in error_str:
            return False
    for transient in transient_keywords:
        if transient in error_str:
            return True
    # Default to retrying unknown exceptions just in case it's a network blip
    return True

async def stream_chat_completion(
    system_prompt: str, 
    user_prompt: str, 
    response_mime_type: str | None = None,
    agent_name: str = "Agent",
    fallback_text: str = ""
) -> AsyncGenerator[str, None]:
    """Stream a Gemini completion with custom exponential backoff and graceful degradation."""
    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        temperature=0.8,
        max_output_tokens=300,
        response_mime_type=response_mime_type,
    )
    
    for attempt, delay in enumerate(RETRY_DELAYS, 1):
        if delay > 0:
            await asyncio.sleep(delay)
            
        try:
            response = await client.aio.models.generate_content_stream(
                model=settings.GEMINI_MODEL,
                contents=user_prompt,
                config=config
            )
            
            async for chunk in response:
                if chunk.text:
                    yield chunk.text
                    
            if attempt > 1:
                print(f"[{agent_name}] Success after retry")
            return
            
        except Exception as e:
            if not is_transient_error(e):
                print(f"[{agent_name}] Fatal error: {e}")
                if fallback_text:
                    yield fallback_text
                return
                
            print(f"[{agent_name}] Retry {attempt}/{len(RETRY_DELAYS)} after error: {e}")
            if attempt == len(RETRY_DELAYS):
                print(f"[{agent_name}] Failed after {len(RETRY_DELAYS)} attempts")
                if fallback_text:
                    yield fallback_text
                return


async def get_chat_completion(
    system_prompt: str, 
    user_prompt: str, 
    agent_name: str = "Extractor"
) -> str:
    """Non-streaming Gemini call with custom exponential backoff."""
    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        temperature=0.4,
        max_output_tokens=200,
    )
    
    for attempt, delay in enumerate(RETRY_DELAYS, 1):
        if delay > 0:
            await asyncio.sleep(delay)
            
        try:
            response = await client.aio.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=user_prompt,
                config=config
            )
            if attempt > 1:
                print(f"[{agent_name}] Success after retry")
            return response.text or ""
            
        except Exception as e:
            if not is_transient_error(e):
                print(f"[{agent_name}] Fatal error: {e}")
                raise e
                
            print(f"[{agent_name}] Retry {attempt}/{len(RETRY_DELAYS)} after error: {e}")
            if attempt == len(RETRY_DELAYS):
                print(f"[{agent_name}] Failed after {len(RETRY_DELAYS)} attempts")
                raise e
