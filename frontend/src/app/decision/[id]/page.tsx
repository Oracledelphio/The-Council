"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/constants";
import type { DecisionRecord } from "@/lib/types";

export default function DecisionPage() {
  const { id } = useParams();
  const [decision, setDecision] = useState<DecisionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/api/v1/decisions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Decision not found");
        return res.json();
      })
      .then((data) => setDecision(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-white/60">Decision not found.</p>
        <Link href="/crucible" className="text-[#D4AF37] hover:underline">
          Return to Council
        </Link>
      </div>
    );
  }

  const isPositive = ["FUND", "APPROVE", "PROCEED"].includes(decision.arbitrator.verdict);
  const verdictColor = isPositive ? "text-[#22C55E]" : "text-[#FF2A2A]";
  const verdictBg = isPositive ? "bg-[#22C55E]/10" : "bg-[#FF2A2A]/10";
  const verdictBorder = isPositive ? "border-[#22C55E]/20" : "border-[#FF2A2A]/20";

  return (
    <div className="flex-1 overflow-y-auto print:bg-white print:text-black">
      {/* Action Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#121212]/80 backdrop-blur-md print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/crucible" className="text-white/50 hover:text-white transition-colors text-sm">
            ← Back
          </Link>
          <span className="text-sm font-medium text-white/40">
            {decision.decision_id}
          </span>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-1.5 rounded bg-white/10 text-white/80 text-sm font-medium hover:bg-white/20 transition-colors"
        >
          Export PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.02] text-xs text-white/50 tracking-widest uppercase mb-4">
            Council Executive Report
          </div>
          <h1 className="text-4xl font-[family-name:var(--font-heading)] font-bold">
            {decision.council_type} Deliberation
          </h1>
          <p className="text-white/40 text-sm">
            Recorded on {new Date(decision.created_at).toLocaleString()}
          </p>
        </div>

        {/* Verdict Banner */}
        <div className={`p-6 rounded-xl border ${verdictBorder} ${verdictBg} flex flex-col items-center justify-center gap-2 text-center`}>
          <span className="text-xs uppercase tracking-widest opacity-80 font-medium">
            Final Verdict
          </span>
          <span className={`text-5xl font-bold tracking-tight ${verdictColor}`}>
            {decision.arbitrator.verdict}
          </span>
          <div className="mt-2 text-sm opacity-80">
            Confidence: {decision.arbitrator.confidence}%
          </div>
        </div>

        {/* Executive Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <h3 className="text-sm font-semibold text-[#00E5FF] mb-2 uppercase tracking-wider">
              Asymmetric Upside
            </h3>
            <p className="text-white/80 leading-relaxed text-sm">
              {decision.arbitrator.asymmetric_upside}
            </p>
          </div>
          <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <h3 className="text-sm font-semibold text-[#FF2A2A] mb-2 uppercase tracking-wider">
              Fatal Flaw
            </h3>
            <p className="text-white/80 leading-relaxed text-sm">
              {decision.arbitrator.fatal_flaw}
            </p>
          </div>
        </div>

        {/* Arbitrator Rationale */}
        <div className="space-y-4">
          <h2 className="text-lg font-[family-name:var(--font-heading)] font-semibold border-b border-white/[0.06] pb-2">
            Arbitrator&apos;s Rationale
          </h2>
          <p className="text-white/70 leading-relaxed text-sm whitespace-pre-wrap">
            {decision.arbitrator.rationale}
          </p>
        </div>

        {/* Original Proposal */}
        <div className="space-y-4">
          <h2 className="text-lg font-[family-name:var(--font-heading)] font-semibold border-b border-white/[0.06] pb-2">
            Original Proposal
          </h2>
          <div className="p-6 rounded-xl border border-white/[0.06] bg-[#1A1A1A]">
            <p className="text-white/70 leading-relaxed text-sm whitespace-pre-wrap">
              {decision.proposal}
            </p>
          </div>
        </div>

        {/* Transcripts */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-sm font-[family-name:var(--font-heading)] font-semibold text-[#00E5FF] border-b border-[#00E5FF]/20 pb-2">
              Advocate Defense
            </h2>
            <div className="text-white/60 leading-relaxed text-xs whitespace-pre-wrap">
              {decision.advocate.output}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-[family-name:var(--font-heading)] font-semibold text-[#FF2A2A] border-b border-[#FF2A2A]/20 pb-2">
              Inquisitor Attack
            </h2>
            <div className="text-white/60 leading-relaxed text-xs whitespace-pre-wrap">
              {decision.inquisitor.output}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
