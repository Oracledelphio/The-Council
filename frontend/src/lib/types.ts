export type AgentRole = "advocate" | "inquisitor" | "arbitrator";

export type CouncilPresetType = "INVESTOR" | "PRODUCT" | "EXECUTIVE";

export interface CouncilPreset {
  id: CouncilPresetType;
  name: string;
  purpose: string;
  advocate_title: string;
  inquisitor_title: string;
  arbitrator_title: string;
  positive_verdict: string;
  negative_verdict: string;
}

export const PRESETS: Record<CouncilPresetType, CouncilPreset> = {
  INVESTOR: {
    id: "INVESTOR",
    name: "Investor Panel",
    purpose: "Evaluate startups and investments.",
    advocate_title: "Venture Capitalist",
    inquisitor_title: "Short Seller",
    arbitrator_title: "Managing Partner",
    positive_verdict: "FUND",
    negative_verdict: "KILL"
  },
  PRODUCT: {
    id: "PRODUCT",
    name: "Product Review Board",
    purpose: "Evaluate products, features, roadmaps, and launches.",
    advocate_title: "Product Strategist",
    inquisitor_title: "QA Director",
    arbitrator_title: "Chief Product Officer",
    positive_verdict: "APPROVE",
    negative_verdict: "REJECT"
  },
  EXECUTIVE: {
    id: "EXECUTIVE",
    name: "Executive Council",
    purpose: "Evaluate business decisions and strategic initiatives.",
    advocate_title: "Growth Executive",
    inquisitor_title: "Risk Executive",
    arbitrator_title: "Chief Executive Officer",
    positive_verdict: "PROCEED",
    negative_verdict: "HALT"
  }
};

export type DeliberationState =
  | "IDLE"
  | "EXTRACTING"
  | "DELIBERATING"
  | "JUDGING"
  | "COMPLETE";

export interface VerdictData {
  verdict: string;
  confidence: number;
  fatal_flaw: string;
  asymmetric_upside: string;
  winning_argument: string;
  winning_side: "ADVOCATE" | "INQUISITOR";
  winning_claim_id: string | null;
  rationale: string;
}

export type ClaimStatus = "SUPPORTED" | "CHALLENGED" | "INVALIDATED";

export interface EvidenceClaim {
  id: number;
  text: string;
  status: ClaimStatus;
  attackedBy: string | null;
}

export interface DecisionRecord {
  _id: string;
  decision_id: string;
  created_at: string;
  council_type: string;
  proposal: string;
  claims: string[];
  advocate: {
    output: string;
  };
  inquisitor: {
    output: string;
  };
  arbitrator: {
    verdict: string;
    confidence: number;
    fatal_flaw: string;
    asymmetric_upside: string;
    rationale: string;
  };
}

export interface AnalyticsMetrics {
  total_decisions: number;
  fund_rate: number;
  kill_rate: number;
  council_usage: Array<{ type: string; count: number }>;
}
