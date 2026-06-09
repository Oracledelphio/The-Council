"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/lib/constants";
import type { DecisionRecord } from "@/lib/types";
import { PRESETS } from "@/lib/types";

export function MemorySidebar() {
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDecisions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/decisions?limit=15`);
      if (res.ok) {
        const data = await res.json();
        setDecisions(data);
      }
    } catch (e) {
      console.error("Failed to fetch decisions", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
    // Poll every 10 seconds to keep the sidebar updated
    const interval = setInterval(fetchDecisions, 10000);
    return () => clearInterval(interval);
  }, []);

  // Group decisions by council type
  const groupedDecisions = decisions.reduce((acc, d) => {
    if (!acc[d.council_type]) acc[d.council_type] = [];
    acc[d.council_type].push(d);
    return acc;
  }, {} as Record<string, DecisionRecord[]>);

  return (
    <aside className="w-64 border-r border-white/[0.06] bg-[#121212] flex flex-col h-full print:hidden">
      <div className="p-4 border-b border-white/[0.06] flex flex-col gap-3">
        <Link
          href="/"
          className="font-[family-name:var(--font-heading)] font-semibold text-white/90 text-lg hover:text-white transition-colors"
        >
          Council AI
        </Link>
        <div className="flex flex-col gap-2">
          <Link
            href="/crucible"
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 text-white/80 text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <span className="text-white/50">+</span> New Deliberation
          </Link>
          <Link
            href="/analytics"
            className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/[0.1] text-white/60 text-sm font-medium hover:text-white/80 hover:bg-white/[0.05] transition-colors"
          >
            <span className="text-white/50">📊</span> Executive Analytics
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
            Institutional Memory
          </h2>
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-10 bg-white/[0.02] rounded" />
              <div className="h-10 bg-white/[0.02] rounded" />
              <div className="h-10 bg-white/[0.02] rounded" />
            </div>
          ) : decisions.length === 0 ? (
            <p className="text-xs text-white/40">No historical decisions found.</p>
          ) : (
            <div className="space-y-6">
              {Object.keys(PRESETS).map((presetKey) => {
                const presetName = PRESETS[presetKey as keyof typeof PRESETS].name;
                const docs = groupedDecisions[presetName] || [];
                if (docs.length === 0) return null;

                return (
                  <div key={presetName} className="space-y-2">
                    <h3 className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
                      {presetName}
                    </h3>
                    <div className="flex flex-col gap-1">
                      {docs.map((d) => (
                        <Link
                          key={d.decision_id}
                          href={`/decision/${d.decision_id}`}
                          className="group block p-2 rounded bg-white/[0.02] border border-white/[0.04] hover:border-white/20 hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-white/40 font-mono">
                              {d.decision_id.split("-").slice(1).join("-")}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-sm font-medium ${
                                ["FUND", "APPROVE", "PROCEED"].includes(d.arbitrator.verdict)
                                  ? "bg-[#22C55E]/10 text-[#22C55E]"
                                  : ["KILL", "REJECT", "HALT"].includes(d.arbitrator.verdict)
                                  ? "bg-[#FF2A2A]/10 text-[#FF2A2A]"
                                  : "bg-white/10 text-white/60"
                              }`}
                            >
                              {d.arbitrator.verdict}
                            </span>
                          </div>
                          <p className="text-xs text-white/70 truncate group-hover:text-white transition-colors">
                            {d.proposal}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
