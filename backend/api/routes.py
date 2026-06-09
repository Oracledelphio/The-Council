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
from services.db_service import db

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
    claims: list[str] = Field(default_factory=list)
    preset_id: str = "INVESTOR"
    precedents: str = ""


# --- Endpoints ---

@router.post("/extract")
async def extract_claims(req: ProposalRequest):
    """Extract 3 core claims from the proposal for the Evidence Board."""
    try:
        claims = await extract_evidence(req.proposal)
        return {"claims": claims}
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg or "quota" in error_msg.lower():
            raise HTTPException(status_code=429, detail="Free tier API Quota exceeded. Please try again later.")
        raise HTTPException(status_code=503, detail="The Council is experiencing unusually high demand. Please try again in a moment.")


@router.post("/advocate")
async def advocate_stream(req: ProposalRequest):
    """Stream the Advocate's opening argument."""
    preset = get_preset(req.preset_id)
    user_prompt = build_advocate_user_prompt(req.proposal)
    system_prompt = get_advocate_system_prompt(preset)
    fallback_text = "The Council is experiencing unusually high demand. Please try again in a moment."

    async def event_generator():
        full_response = ""
        async for chunk in stream_chat_completion(
            system_prompt, 
            user_prompt,
            agent_name=preset.advocate_title,
            fallback_text=fallback_text
        ):
            full_response += chunk
            yield chunk
            
        print("=== RAW ADVOCATE RESPONSE ===")
        print(full_response)
        print("==============================")

    return StreamingResponse(event_generator(), media_type="text/plain")


@router.post("/inquisitor")
async def inquisitor_stream(req: InquisitorRequest):
    """Stream the Inquisitor's attack."""
    print("=== INQUISITOR VARIABLE VALIDATION ===")
    print(f"PROPOSAL: {repr(req.proposal)}")
    print(f"CLAIMS: {repr(req.claims)}")
    print("======================================")

    preset = get_preset(req.preset_id)
    user_prompt = build_inquisitor_user_prompt(req.proposal, req.claims)
    system_prompt = get_inquisitor_system_prompt(preset)
    
    print("=== INQUISITOR PROMPTS ===")
    print(f"SYSTEM PROMPT:\n{system_prompt}")
    print(f"USER PROMPT:\n{user_prompt}")
    print("==========================")
    
    fallback_text = "[TARGETED_CLAIM: 1]\n\nThe Council is experiencing unusually high demand. Please try again in a moment."

    async def event_generator():
        full_response = ""
        async for chunk in stream_chat_completion(
            system_prompt, 
            user_prompt,
            agent_name=preset.inquisitor_title,
            fallback_text=fallback_text
        ):
            full_response += chunk
            yield chunk
            
        print("=== RAW INQUISITOR RESPONSE ===")
        print(full_response)
        print("==============================")

    return StreamingResponse(event_generator(), media_type="text/plain")


from services.llm_service import stream_chat_completion, get_chat_completion

# ...

@router.post("/arbitrator")
async def arbitrator_evaluate(req: ArbitratorRequest):
    """Generate the Arbitrator's verdict server-side and return validated JSON."""
    preset = get_preset(req.preset_id)
    user_prompt = build_arbitrator_user_prompt(
        req.proposal, req.advocate_text, req.inquisitor_text, req.precedents
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

    parsed_json = fallback_json
    try:
        response_text = await get_chat_completion(
            system_prompt, 
            user_prompt, 
            agent_name=preset.arbitrator_title,
            response_mime_type="application/json",
            max_output_tokens=4000
        )
        
        print("=== RAW ARBITRATOR RESPONSE ===")
        print(response_text)
        print("===============================")
        
        # Clean the response text from potential markdown blocks
        import re
        match = re.search(r'\{[\s\S]*\}', response_text)
        clean_text = match.group(0) if match else response_text.replace("```json", "").replace("```", "").strip()
        
        parsed_json = json.loads(clean_text)
        
        # Attach debug info
        parsed_json["_debug_raw_response"] = response_text
        parsed_json["_debug_clean_text"] = clean_text
    except Exception as e:
        print(f"[{preset.arbitrator_title}] Failed to generate or parse JSON: {e}")
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg or "quota" in error_msg.lower():
            fallback_json["rationale"] = "Free tier API Quota exceeded. Please try again later."
            fallback_json["fatal_flaw"] = "API Quota Limit Reached."
        fallback_json["_debug_error"] = str(e)
        return fallback_json


    # Save to MongoDB
    try:
        # Extract targeted claim
        targeted_claim_text = ""
        targeted_claim_id = None
        
        import re
        match = re.search(r'TARGETED CLAIM:\s*(?:[\*\-\d\.]*\s*)?(.*)', req.inquisitor_text, re.IGNORECASE)
        if match:
            extracted = match.group(1).strip()
            targeted_claim_text = extracted
            
            for i, claim in enumerate(req.claims):
                if extracted.lower() in claim.lower() or claim.lower() in extracted.lower():
                    targeted_claim_id = i + 1
                    break

        decision_data = {
            "council_type": preset.name,
            "proposal": req.proposal,
            "claims": req.claims,
            "advocate_output": req.advocate_text,
            "inquisitor_output": req.inquisitor_text,
            "targeted_claim_id": targeted_claim_id,
            "targeted_claim_text": targeted_claim_text,
            "verdict": parsed_json.get("verdict", ""),
            "confidence": parsed_json.get("confidence", 0),
            "fatal_flaw": parsed_json.get("fatal_flaw", ""),
            "asymmetric_upside": parsed_json.get("asymmetric_upside", ""),
            "rationale": parsed_json.get("rationale", "")
        }
        decision_id = await db.save_decision(decision_data)
        parsed_json["decision_id"] = decision_id
    except Exception as e:
        print(f"Failed to save decision to DB: {e}")

    return parsed_json

@router.get("/decisions")
async def get_decisions(limit: int = 10):
    return await db.get_recent_decisions(limit)

@router.get("/decisions/search")
async def search_decisions(query: str, limit: int = 3):
    return await db.search_similar_decisions(query, limit)

@router.get("/decisions/{decision_id}")
async def get_decision(decision_id: str):
    decision = await db.get_decision_by_id(decision_id)
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    return decision

@router.get("/analytics")
async def get_analytics():
    return await db.get_analytics_metrics()

@router.delete("/decisions/{decision_id}")
async def delete_decision(decision_id: str):
    success = await db.delete_decision(decision_id)
    if not success:
        raise HTTPException(status_code=404, detail="Decision not found")
    return {"status": "success", "message": "Decision deleted"}
