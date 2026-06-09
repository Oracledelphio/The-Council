import json

from services.llm_service import get_chat_completion

EXTRACT_SYSTEM_PROMPT = """You are an evidence extraction engine. Given a proposal, you must extract exactly 3 core claims or assumptions the author is making.

RULES:
- Extract EXACTLY 3 claims. No more, no less.
- Each claim must be a single, concise sentence (max 15 words).
- Focus on the assumptions that could be challenged: market size, pricing, feasibility, demand, etc.
- Output ONLY a JSON array of 3 strings. No markdown, no explanation.

Example output:
["The premium coffee market is growing 20% YoY", "Millennials will pay $8 per cup", "A subscription model ensures recurring revenue"]"""

EXTRACT_USER_PROMPT = """Extract exactly 3 core claims from this proposal:

\"\"\"{proposal}\"\"\"

Output ONLY a JSON array of 3 strings."""


async def extract_evidence(proposal: str) -> list[str]:
    """Extract 3 core claims from the proposal for the Evidence Board."""
    prompt = EXTRACT_USER_PROMPT.format(proposal=proposal)
    raw = await get_chat_completion(EXTRACT_SYSTEM_PROMPT, prompt)

    # Strip markdown code fences if the model wraps them
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[-1]
        cleaned = cleaned.rsplit("```", 1)[0]
    cleaned = cleaned.strip()

    try:
        claims = json.loads(cleaned)
        if isinstance(claims, list) and len(claims) >= 3:
            return [str(c) for c in claims[:3]]
    except json.JSONDecodeError:
        pass

    # Fallback: if parsing fails, return generic claims
    return [
        "The target market exists and is accessible",
        "The proposed solution is technically feasible",
        "The business model can generate sustainable revenue",
    ]
