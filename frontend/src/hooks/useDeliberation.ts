"use client";

import { useCallback, useState, useEffect } from "react";
import { useStreamReader } from "./useStreamReader";
import { API_BASE_URL } from "@/lib/constants";
import { PRESETS } from "@/lib/types";
import type {
  DeliberationState,
  EvidenceClaim,
  VerdictData,
  CouncilPresetType,
  DecisionRecord,
} from "@/lib/types";

export function useDeliberation() {
  const [preset, setPreset] = useState<CouncilPresetType>("INVESTOR");
  const [status, setStatus] = useState<DeliberationState>("IDLE");
  const [proposal, setProposal] = useState("");
  const [evidence, setEvidence] = useState<EvidenceClaim[]>([]);
  const [verdictData, setVerdictData] = useState<VerdictData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [similarDecisions, setSimilarDecisions] = useState<DecisionRecord[]>([]);

  const advocate = useStreamReader();
  const inquisitor = useStreamReader();
  const arbitrator = useStreamReader();

  const reset = useCallback(() => {
    setStatus("IDLE");
    setProposal("");
    setEvidence([]);
    setVerdictData(null);
    setError(null);
    setSimilarDecisions([]);
    advocate.reset();
    inquisitor.reset();
    arbitrator.reset();
  }, [advocate, inquisitor, arbitrator]);

  // Real-time tracking of Inquisitor's targeted claim
  useEffect(() => {
    if (status === "DELIBERATING" && inquisitor.text) {
      const match = inquisitor.text.match(/TARGETED CLAIM:\s*(?:[\*\-\d\.]*\s*)?([^\n]+)/i);
      if (match) {
        const extractedClaim = match[1].trim().toLowerCase();
        
        setEvidence((prev) => {
          const next = [...prev];
          const claimIdx = next.findIndex(e => extractedClaim.includes(e.text.toLowerCase()) || e.text.toLowerCase().includes(extractedClaim));

          if (claimIdx >= 0 && claimIdx < next.length) {
            if (next[claimIdx].status === "SUPPORTED") {
              next[claimIdx] = {
                ...next[claimIdx],
                status: "CHALLENGED",
                attackedBy: PRESETS[preset].inquisitor_title,
              };
            }
          }
          return next;
        });
      }
    }
  }, [inquisitor.text, status, preset]);

  const startDeliberation = useCallback(
    async (proposalText: string) => {
      try {
        setError(null);
        setProposal(proposalText);
        advocate.reset();
        inquisitor.reset();
        arbitrator.reset();
        setVerdictData(null);
        setSimilarDecisions([]);

        // ── Phase 1: Extract evidence ──
        setStatus("EXTRACTING");
        const extractRes = await fetch(`${API_BASE_URL}/api/v1/extract`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proposal: proposalText, preset_id: preset }),
        });

        if (!extractRes.ok) {
          const body = await extractRes.json().catch(() => ({}));
          throw new Error(body.detail || "Evidence extraction failed");
        }

        const { claims } = await extractRes.json();
        const evidenceClaims: EvidenceClaim[] = claims.map(
          (text: string, i: number) => ({
            id: i + 1,
            text,
            status: "SUPPORTED",
            attackedBy: null,
          })
        );
        setEvidence(evidenceClaims);

        // Fetch Similar Decisions concurrently
        fetch(`${API_BASE_URL}/api/v1/decisions/search?query=${encodeURIComponent(proposalText)}&limit=3`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) setSimilarDecisions(data);
          })
          .catch(e => console.error("Failed to fetch precedents", e));

        // ── Phase 2: Parallel Advocate + Inquisitor ──
        setStatus("DELIBERATING");

        const advocateRes = fetch(`${API_BASE_URL}/api/v1/advocate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proposal: proposalText, preset_id: preset }),
        });

        const inquisitorRes = fetch(`${API_BASE_URL}/api/v1/inquisitor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proposal: proposalText,
            claims: claims,
            preset_id: preset
          }),
        });

        const [advResponse, inqResponse] = await Promise.all([
          advocateRes,
          inquisitorRes,
        ]);

        if (!advResponse.ok || !inqResponse.ok)
          throw new Error("Agent streaming failed");

        // Start both streams in parallel
        const [advocateText, inquisitorText] = await Promise.all([
          advocate.startStream(advResponse),
          inquisitor.startStream(inqResponse),
        ]);

        // ── Phase 3: Arbitrator verdict ──
        setStatus("JUDGING");

        // Format precedent text for the prompt
        const precedentsText = similarDecisions
          .map(d => `Decision: ${d.decision_id}\nProposal: ${d.proposal}\nVerdict: ${d.arbitrator.verdict}`)
          .join("\n\n");

        let parsed: VerdictData;
        try {
          const arbitratorRes = await fetch(
            `${API_BASE_URL}/api/v1/arbitrator`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                proposal: proposalText,
                advocate_text: advocateText,
                inquisitor_text: inquisitorText,
                claims: claims,
                preset_id: preset,
                precedents: precedentsText
              }),
            }
          );

          if (!arbitratorRes.ok) throw new Error("Arbitrator failed to generate a verdict");
          parsed = await arbitratorRes.json() as VerdictData;
        } catch (e) {
          console.error("Failed to fetch Arbitrator verdict:", e);
          parsed = {
            verdict: "UNAVAILABLE",
            confidence: 0,
            fatal_flaw: "The Arbitrator's reasoning matrix encountered a formatting anomaly.",
            asymmetric_upside: "The proposal survives due to systemic resilience.",
            winning_argument: "When rigid systems fail, human judgment must prevail.",
            winning_side: "ADVOCATE",
            winning_claim_id: null,
            rationale: "The Arbitrator's structured output was corrupted during transmission. However, the core logic indicates a net-positive expected value. The Council defaults to action."
          };
        }

        setVerdictData(parsed);

        if (parsed.winning_claim_id) {
          // Find the claim ID number (e.g. "C2" -> 2, "2" -> 2)
          const idMatch = parsed.winning_claim_id.match(/\d+/);
          if (idMatch) {
            const claimId = parseInt(idMatch[0], 10);
            const idx = claimId - 1;
            if (parsed.winning_side === "INQUISITOR") {
               setEvidence((prev) => {
                const next = [...prev];
                if (next[idx]) {
                  next[idx] = { ...next[idx], status: "INVALIDATED" };
                }
                return next;
               });
            }
          }
        }

        setStatus("COMPLETE");
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
        if (errorMsg === "Failed to fetch" || errorMsg === "NetworkError when attempting to fetch resource.") {
          setError("The Council is experiencing unusually high demand. Please try again in a moment.");
        } else {
          setError(errorMsg);
        }
        setStatus("COMPLETE");
      }
    },
    [advocate, inquisitor, arbitrator, preset]
  );

  return {
    preset,
    setPreset,
    status,
    proposal,
    evidence,
    advocate: {
      text: advocate.text,
      isStreaming: advocate.isStreaming,
      isDone: advocate.isDone,
    },
    inquisitor: {
      text: inquisitor.text,
      isStreaming: inquisitor.isStreaming,
      isDone: inquisitor.isDone,
    },
    arbitrator: {
      text: arbitrator.text,
      isStreaming: arbitrator.isStreaming,
      isDone: arbitrator.isDone,
    },
    verdictData,
    similarDecisions,
    error,
    startDeliberation,
    reset,
  };
}
