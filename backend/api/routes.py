from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from services.llm_service import stream_chat_completion
from services.evidence_extractor import extract_evidence
from prompts.advocate import ADVOCATE_SYSTEM_PROMPT, build_advocate_user_prompt
from prompts.inquisitor import INQUISITOR_SYSTEM_PROMPT, build_inquisitor_user_prompt
from prompts.arbitrator import ARBITRATOR_SYSTEM_PROMPT, build_arbitrator_user_prompt

router = APIRouter(prefix="/api/v1")


# --- Request schemas ---

class ProposalRequest(BaseModel):
    proposal: str = Field(..., min_length=10, max_length=2000)


class InquisitorRequest(BaseModel):
    proposal: str = Field(..., min_length=10, max_length=2000)
    claims: list[str]


class ArbitratorRequest(BaseModel):
    proposal: str = Field(..., min_length=10, max_length=2000)
    advocate_text: str = Field(..., max_length=10000)
    inquisitor_text: str = Field(..., max_length=10000)


# --- Endpoints ---

import json

@router.post("/extract")
async def extract_claims(req: ProposalRequest):
    """Extract 3 core claims from the proposal for the Evidence Board."""
    try:
        claims = await extract_evidence(req.proposal)
        return {"claims": claims}
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail="The Council is experiencing unusually high demand. Please try again in a moment.")


@router.post("/advocate")
async def advocate_stream(req: ProposalRequest):
    """Stream the Advocate's opening argument."""
    user_prompt = build_advocate_user_prompt(req.proposal)
    fallback_text = "The Council is experiencing unusually high demand. Please try again in a moment."

    async def event_generator():
        async for chunk in stream_chat_completion(
            ADVOCATE_SYSTEM_PROMPT, 
            user_prompt,
            agent_name="Advocate",
            fallback_text=fallback_text
        ):
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/plain")


@router.post("/inquisitor")
async def inquisitor_stream(req: InquisitorRequest):
    """Stream the Inquisitor's attack."""
    user_prompt = build_inquisitor_user_prompt(req.proposal, req.claims)
    fallback_text = "[TARGETED_CLAIM: 1]\n\nThe Council is experiencing unusually high demand. Please try again in a moment."

    async def event_generator():
        async for chunk in stream_chat_completion(
            INQUISITOR_SYSTEM_PROMPT, 
            user_prompt,
            agent_name="Inquisitor",
            fallback_text=fallback_text
        ):
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/plain")


@router.post("/arbitrator")
async def arbitrator_stream(req: ArbitratorRequest):
    """Stream the Arbitrator's verdict."""
    user_prompt = build_arbitrator_user_prompt(
        req.proposal, req.advocate_text, req.inquisitor_text
    )
    fallback_json = {
        "verdict": "UNAVAILABLE",
        "confidence": 0,
        "fatal_flaw": "Council deliberation interrupted.",
        "asymmetric_upside": "",
        "winning_argument": "",
        "winning_side": "INQUISITOR",
        "invalidated_claim_id": None,
        "rationale": "The AI service was temporarily unavailable. Please retry."
    }

    async def event_generator():
        async for chunk in stream_chat_completion(
            ARBITRATOR_SYSTEM_PROMPT, 
            user_prompt, 
            response_mime_type="application/json",
            agent_name="Arbitrator",
            fallback_text=json.dumps(fallback_json)
        ):
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/plain")
