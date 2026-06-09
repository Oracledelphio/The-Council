"use client";

import { motion } from "framer-motion";
import type { VerdictData } from "@/lib/types";
import { VerdictStamp } from "./verdict-stamp";
import { Scorecard } from "./scorecard";

interface VerdictDashboardProps {
  data: VerdictData;
  arbitratorText: string;
  isStreaming: boolean;
}

export function VerdictDashboard({
  data,
  arbitratorText,
  isStreaming,
}: VerdictDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.02] overflow-hidden"
    >
      {/* Streaming arbitrator text (shown while judging) */}
      {isStreaming && !data && (
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-xs font-medium text-[#D4AF37]/70 uppercase tracking-[0.15em]">
              The Arbitrator is deliberating...
            </span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed typing-cursor">
            {arbitratorText}
          </p>
        </div>
      )}

      {/* Final verdict */}
      {data && (
        <>
          <VerdictStamp verdict={data.verdict} />
          <div className="p-6">
            <Scorecard data={data} />
          </div>
        </>
      )}
    </motion.div>
  );
}
