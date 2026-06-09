"use client";

import { motion } from "framer-motion";
import type { VerdictData, CouncilPreset, EvidenceClaim } from "@/lib/types";
import { VerdictStamp } from "./verdict-stamp";
import { Scorecard } from "./scorecard";
import { ExecutiveReport } from "./executive-report";

interface VerdictDashboardProps {
  data: VerdictData;
  arbitratorText: string;
  isStreaming: boolean;
  arbitratorTitle?: string;
  preset: CouncilPreset;
  proposal: string;
  claims: EvidenceClaim[];
  advocateText: string;
  inquisitorText: string;
}

export function VerdictDashboard({
  data,
  arbitratorText,
  isStreaming,
  arbitratorTitle = "Arbitrator",
  preset,
  proposal,
  claims,
  advocateText,
  inquisitorText,
}: VerdictDashboardProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.02] overflow-hidden print:hidden"
      >
        {/* Streaming arbitrator text (shown while judging) */}
        {isStreaming && !data && (
          <div className="p-12 flex flex-col items-center justify-center min-h-[300px]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-sm font-medium text-[#D4AF37] uppercase tracking-[0.2em]">
                {arbitratorTitle} is deliberating...
              </span>
            </div>
            
            <div className="w-64 space-y-3 opacity-30">
              <div className="h-2 w-full bg-[#D4AF37]/40 rounded overflow-hidden relative">
                <motion.div 
                  className="absolute top-0 left-0 h-full w-1/3 bg-[#D4AF37]"
                  animate={{ left: ["-30%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                />
              </div>
              <div className="h-2 w-4/5 bg-[#D4AF37]/30 rounded mx-auto" />
              <div className="h-2 w-2/3 bg-[#D4AF37]/20 rounded mx-auto" />
            </div>
            
            <p className="mt-8 text-xs text-[#D4AF37]/50 uppercase tracking-widest text-center">
              Generating Final Verdict
              <br />
              Please wait...
            </p>
          </div>
        )}

        {/* Final verdict */}
        {data && (
          <>
            <VerdictStamp verdict={data.verdict} />
            <div className="p-6">
              <Scorecard data={data} />
              
              <div className="mt-8 flex justify-center border-t border-white/[0.05] pt-6">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 rounded border border-[#D4AF37]/30 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 text-[#D4AF37] hover:text-[#D4AF37]/90 text-sm tracking-[0.1em] font-medium transition-all uppercase flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Export Council Report
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {data && (
        <ExecutiveReport
          data={data}
          preset={preset}
          proposal={proposal}
          claims={claims}
          advocateText={advocateText}
          inquisitorText={inquisitorText}
          arbitratorText={arbitratorText}
        />
      )}
    </>
  );
}
