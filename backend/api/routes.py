from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
import json

from services.llm_service import stream_chat_completion
from services.evidence_extractor import extract_evidence
from core.presets import get_preset
from prompts.advocate import get_advocate_system_prompt, build_advocate_user_prompt
from prompts.inquisitor import get_inquisitor_system_prompt, build_inquisitor_user_prompt
from prompts.arbitrator import get_arbitrator_system_prompt, build_arbitrator_user_prompt

router = APIRouter(prefix="/api/v1")


# --- Request schemas ---

class ProposalRequest(BaseModel):
    proposal: str = Field(..., min_length=10, max_length=2000)
    preset_id: str = "INVESTOR"


class InquisitorRequest(BaseModel):
    proposal: str = Field(..., min_length=10, max_length=2000)
    claims: list[str]
    preset_id: str = "INVESTOR"


class ArbitratorRequest(BaseModel):
    proposal: str = Field(..., min_length=10, max_length=2000)
    advocate_text: str = Field(..., max_length=10000)
    inquisitor_text: str = Field(..., max_length=10000)
    preset_id: str = "INVESTOR"


# --- Endpoints ---

@router.post("/extract")
async def extract_claims(req: ProposalRequest):
    """Extract 3 core claims from the proposal for the Evidence Board."""
    try:
        claims = await extract_evidence(req.proposal)
        return {"claims": claims}
    except Exception as e:
        raise HTTPException(status_code=503, detail="The Council is experiencing unusually high demand. Please try again in a moment.")


@router.post("/advocate")
async def advocate_stream(req: ProposalRequest):
    """Stream the Advocate's opening argument."""
    preset = get_preset(req.preset_id)
    user_prompt = build_advocate_user_prompt(req.proposal)
    system_prompt = get_advocate_system_prompt(preset)
    fallback_text = "The Council is experiencing unusually high demand. Please try again in a moment."

    async def event_generator():
        async for chunk in stream_chat_completion(
            system_prompt, 
            user_prompt,
            agent_name=preset.advocate_title,
            fallback_text=fallback_text
        ):
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/plain")


@router.post("/inquisitor")
async def inquisitor_stream(req: InquisitorRequest):
    """Stream the Inquisitor's attack."""
    preset = get_preset(req.preset_id)
    user_prompt = build_inquisitor_user_prompt(req.proposal, req.claims)
    system_prompt = get_inquisitor_system_prompt(preset)
    fallback_text = "[TARGETED_CLAIM: 1]\n\nThe Council is experiencing unusually high demand. Please try again in a moment."

    async def event_generator():
        async for chunk in stream_chat_completion(
            system_prompt, 
            user_prompt,
            agent_name=preset.inquisitor_title,
            fallback_text=fallback_text
        ):
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/plain")


from services.llm_service import stream_chat_completion, get_chat_completion

# ...

@router.post("/arbitrator")
async def arbitrator_evaluate(req: ArbitratorRequest):
    """Generate the Arbitrator's verdict server-side and return validated JSON."""
    preset = get_preset(req.preset_id)
    user_prompt = build_arbitrator_user_prompt(
        req.proposal, req.advocate_text, req.inquisitor_text
    )
    system_prompt = get_arbitrator_system_prompt(preset)
    fallback_json = {
        "verdict": "UNAVAILABLE",
        "confidence": 0,
        "fatal_flaw": "Council deliberation interrupted.",
        "asymmetric_upside": "",
        "winning_argument": "",
        "winning_side": "INQUISITOR",
        "winning_claim_id": None,
        "rationale": "The AI service was temporarily unavailable. Please retry."
    }

    try:
        response_text = await get_chat_completion(
            system_prompt, 
            user_prompt, 
            agent_name=preset.arbitrator_title,
            response_mime_type="application/json"
        )
        
        # Clean the response text from potential markdown blocks
        import re
        match = re.search(r'\{[\s\S]*\}', response_text)
        clean_text = match.group(0) if match else response_text.replace("```json", "").replace("```", "").strip()
        
        parsed_json = json.loads(clean_text)
        return parsed_json
    except Exception as e:
        print(f"[{preset.arbitrator_title}] Failed to generate or parse JSON: {e}")
        return fallback_json
