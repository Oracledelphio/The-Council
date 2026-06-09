"use client";

import { motion } from "framer-motion";
import type { VerdictData } from "@/lib/types";

interface ScorecardProps {
  data: VerdictData;
}

export function Scorecard({ data }: ScorecardProps) {
  const isFund = data.verdict === "FUND";
  const accentColor = isFund ? "#22C55E" : "#FF2A2A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-5"
    >
      {/* Confidence Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-white/40 uppercase tracking-[0.15em]">
            Confidence Level
          </span>
          <span
            className="text-sm font-bold font-mono"
            style={{ color: accentColor }}
          >
            {data.confidence}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.confidence}%` }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </div>

      {/* Two-Column: Fatal Flaw + Upside */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-[#FF2A2A]/20 bg-[#FF2A2A]/[0.04]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF2A2A]" />
            <span className="text-xs font-medium text-[#FF2A2A]/70 uppercase tracking-[0.12em]">
              Fatal Flaw
            </span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            {data.fatal_flaw}
          </p>
        </div>

        <div className="p-4 rounded-lg border border-[#00E5FF]/20 bg-[#00E5FF]/[0.04]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
            <span className="text-xs font-medium text-[#00E5FF]/70 uppercase tracking-[0.12em]">
              Asymmetric Upside
            </span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            {data.asymmetric_upside}
          </p>
        </div>
      </div>

      {/* Winning Argument */}
      <div className="p-4 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="text-xs font-medium text-[#D4AF37]/70 uppercase tracking-[0.12em]">
              Winning Argument
            </span>
          </div>
          <div className="text-[10px] font-bold text-[#D4AF37]/80 uppercase tracking-widest px-2 py-0.5 border border-[#D4AF37]/30 rounded-sm">
            Presented By: {data.winning_side}
          </div>
        </div>
        <p className="text-sm text-white/90 leading-relaxed font-serif italic border-l-2 border-[#D4AF37]/30 pl-3 py-1">
          &ldquo;{data.winning_argument}&rdquo;
        </p>
      </div>

      {/* Rationale */}
      <div className="p-5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-white/40 uppercase tracking-[0.15em]">
            Arbitrator&apos;s Rationale
          </span>
        </div>
        <div className="text-sm text-white/70 leading-relaxed space-y-2">
          {data.rationale.split(/(?<=\.)\s+/).map((sentence, i) => (
            <p key={i}>{sentence}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
