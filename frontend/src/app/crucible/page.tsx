"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useDeliberation } from "@/hooks/useDeliberation";
import { ProposalForm } from "@/components/proposal/proposal-form";
import { EvidenceBoard } from "@/components/deliberation/evidence-board";
import { CrucibleArena } from "@/components/deliberation/crucible-arena";
import { VerdictDashboard } from "@/components/verdict/verdict-dashboard";
import { Timeline } from "@/components/deliberation/timeline";

import { PRESETS } from "@/lib/types";
import { CouncilSelector } from "@/components/proposal/council-selector";

export default function CruciblePage() {
  const deliberation = useDeliberation();
  const { status, preset, setPreset } = deliberation;
  const currentPreset = PRESETS[preset];

  const isDeliberating =
    status === "EXTRACTING" ||
    status === "DELIBERATING" ||
    status === "JUDGING" ||
    status === "COMPLETE";

  return (
    <main className="flex-1 flex flex-col h-full print:bg-white print:text-black">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] print:hidden">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors"
        >
          <span className="text-sm">←</span>
          <span className="font-[family-name:var(--font-heading)] text-sm font-medium">
            Council AI
          </span>
        </Link>

        {status !== "IDLE" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                status === "COMPLETE"
                  ? "bg-[#22C55E]"
                  : "bg-[#D4AF37] animate-pulse"
              }`}
            />
            <span className="text-xs text-white/40 uppercase tracking-[0.15em]">
              {status === "EXTRACTING" && "Analyzing Evidence..."}
              {status === "DELIBERATING" && "Council in Session"}
              {status === "JUDGING" && "Arbitrator Deliberating..."}
              {status === "COMPLETE" && "Verdict Delivered"}
            </span>
          </motion.div>
        )}

        {status === "COMPLETE" && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={deliberation.reset}
            className="text-xs px-3 py-1.5 rounded-full border border-white/[0.1] text-white/50 hover:text-white/80 hover:border-white/20 transition-all cursor-pointer"
          >
            New Proposal
          </motion.button>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 overflow-y-auto print:p-0 print:overflow-visible">
        <div className="w-full max-w-5xl mx-auto space-y-6 print:hidden">
          <AnimatePresence mode="wait">
            {/* Phase: IDLE — Show proposal form */}
            {status === "IDLE" && (
              <motion.div
                key="proposal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center pt-8"
              >
                <CouncilSelector selected={preset} onSelect={setPreset} />
                <ProposalForm
                  onSubmit={deliberation.startDeliberation}
                  isDisabled={false}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase: Deliberation Active */}
          {isDeliberating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Timeline status={status} />

              {/* Proposal Summary */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-white/30 uppercase tracking-[0.15em]">
                    Proposal Under Review
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-white/50 border border-white/[0.1]">
                    {currentPreset.name}
                  </span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
                  {deliberation.proposal}
                </p>
              </motion.div>

              {/* Evidence Board */}
              {deliberation.evidence.length > 0 && (
                <EvidenceBoard claims={deliberation.evidence} />
              )}

              {/* Similar Decisions Precedent */}
              {deliberation.similarDecisions && deliberation.similarDecisions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/[0.02]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-[#D4AF37]/60 uppercase tracking-[0.15em]">
                      Similar Historical Precedents Found
                    </span>
                  </div>
                  <div className="grid gap-2">
                    {deliberation.similarDecisions.map(d => (
                      <Link
                        key={d.decision_id}
                        href={`/decision/${d.decision_id}`}
                        target="_blank"
                        className="group flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.04] hover:border-[#D4AF37]/30 transition-colors"
                      >
                        <span className="text-xs text-white/60 group-hover:text-white/90 truncate mr-4">
                          {d.proposal}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-sm font-medium whitespace-nowrap ${
                            ["FUND", "APPROVE", "PROCEED"].includes(d.arbitrator.verdict)
                              ? "bg-[#22C55E]/10 text-[#22C55E]"
                              : ["KILL", "REJECT", "HALT"].includes(d.arbitrator.verdict)
                              ? "bg-[#FF2A2A]/10 text-[#FF2A2A]"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {d.arbitrator.verdict}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Crucible Arena */}
              {(status === "DELIBERATING" ||
                status === "JUDGING" ||
                status === "COMPLETE") && (
                <CrucibleArena
                  advocateText={deliberation.advocate.text}
                  advocateStreaming={deliberation.advocate.isStreaming}
                  advocateDone={deliberation.advocate.isDone}
                  inquisitorText={deliberation.inquisitor.text}
                  inquisitorStreaming={deliberation.inquisitor.isStreaming}
                  inquisitorDone={deliberation.inquisitor.isDone}
                  isActive={
                    status === "DELIBERATING" ||
                    status === "JUDGING" ||
                    status === "COMPLETE"
                  }
                  advocateTitle={currentPreset.advocate_title}
                  inquisitorTitle={currentPreset.inquisitor_title}
                />
              )}

              {/* Verdict Dashboard */}
              {(status === "JUDGING" || status === "COMPLETE") && (
                <VerdictDashboard
                  data={deliberation.verdictData!}
                  arbitratorText=""
                  isStreaming={status === "JUDGING"}
                  arbitratorTitle={currentPreset.arbitrator_title}
                  preset={currentPreset}
                  proposal={deliberation.proposal}
                  claims={deliberation.evidence}
                  advocateText={deliberation.advocate.text}
                  inquisitorText={deliberation.inquisitor.text}
                />
              )}

              {/* Error Display */}
              {deliberation.error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-lg border border-[#FF2A2A]/20 bg-[#FF2A2A]/[0.04] text-sm text-[#FF2A2A]/80"
                >
                  ⚠ {deliberation.error}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
