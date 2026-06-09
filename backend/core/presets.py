from pydantic import BaseModel

class CouncilPreset(BaseModel):
    id: str
    name: str
    purpose: str
    advocate_title: str
    inquisitor_title: str
    arbitrator_title: str
    positive_verdict: str
    negative_verdict: str


PRESETS = {
    "INVESTOR": CouncilPreset(
        id="INVESTOR",
        name="Investor Panel",
        purpose="Evaluate startups and investments.",
        advocate_title="Venture Capitalist",
        inquisitor_title="Short Seller",
        arbitrator_title="Managing Partner",
        positive_verdict="FUND",
        negative_verdict="KILL"
    ),
    "PRODUCT": CouncilPreset(
        id="PRODUCT",
        name="Product Review Board",
        purpose="Evaluate products, features, roadmaps, and launches.",
        advocate_title="Product Strategist",
        inquisitor_title="QA Director",
        arbitrator_title="Chief Product Officer",
        positive_verdict="APPROVE",
        negative_verdict="REJECT"
    ),
    "EXECUTIVE": CouncilPreset(
        id="EXECUTIVE",
        name="Executive Council",
        purpose="Evaluate business decisions and strategic initiatives.",
        advocate_title="Growth Executive",
        inquisitor_title="Risk Executive",
        arbitrator_title="Chief Executive Officer",
        positive_verdict="PROCEED",
        negative_verdict="HALT"
    )
}

def get_preset(preset_id: str) -> CouncilPreset:
    return PRESETS.get(preset_id.upper(), PRESETS["INVESTOR"])
