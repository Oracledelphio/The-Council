export type AgentRole = "advocate" | "inquisitor" | "arbitrator";

export type DeliberationState =
  | "IDLE"
  | "EXTRACTING"
  | "DELIBERATING"
  | "JUDGING"
  | "COMPLETE";

export interface VerdictData {
  verdict: "FUND" | "KILL";
  confidence: number;
  fatal_flaw: string;
  asymmetric_upside: string;
  winning_argument: string;
  winning_side: "ADVOCATE" | "INQUISITOR";
  invalidated_claim_id: number | null;
  rationale: string;
}

export type ClaimStatus = "SUPPORTED" | "CHALLENGED" | "INVALIDATED";

export interface EvidenceClaim {
  id: number;
  text: string;
  status: ClaimStatus;
  attackedBy: "Inquisitor" | null;
}
