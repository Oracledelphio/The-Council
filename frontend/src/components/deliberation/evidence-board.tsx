"use client";

import { motion } from "framer-motion";
import type { EvidenceClaim } from "@/lib/types";

interface EvidenceBoardProps {
  claims: EvidenceClaim[];
}

export function EvidenceBoard({ claims }: EvidenceBoardProps) {
  if (claims.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        <span className="text-xs font-medium text-white/40 uppercase tracking-[0.15em]">
          Evidence Board — Core Claims Extracted
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {claims.map((claim, i) => {
          const isChallenged = claim.status === "CHALLENGED";
          const isInvalidated = claim.status === "INVALIDATED";
          const isSupported = claim.status === "SUPPORTED";

          let borderClass = "border-white/[0.06]";
          let bgClass = "bg-white/[0.02]";
          let badgeColor = "text-white/40 border-white/10";
          
          if (isChallenged) {
            borderClass = "border-[#FF2A2A]/40";
            bgClass = "bg-[#FF2A2A]/[0.06]";
            badgeColor = "text-[#FF2A2A] border-[#FF2A2A]/30";
          } else if (isInvalidated) {
            borderClass = "border-[#FF2A2A]/80";
            bgClass = "bg-[#FF2A2A]/[0.1]";
            badgeColor = "text-white bg-[#FF2A2A] border-[#FF2A2A]";
          } else if (isSupported) {
            badgeColor = "text-[#00E5FF] border-[#00E5FF]/30";
          }

          return (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative p-4 rounded-lg border transition-all duration-500 ${borderClass} ${bgClass}`}
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`text-xs font-mono font-bold ${
                    isChallenged || isInvalidated ? "text-[#FF2A2A]" : "text-white/30"
                  }`}
                >
                  C{i + 1}
                </span>
                
                <div className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm border ${badgeColor}`}>
                  {claim.status}
                </div>
              </div>

              <p
                className={`text-sm leading-relaxed ${
                  isInvalidated
                    ? "text-[#FF2A2A]/90 line-through decoration-[#FF2A2A]/60"
                    : isChallenged
                    ? "text-white/80"
                    : "text-white/70"
                }`}
              >
                {claim.text}
              </p>

              {(isChallenged || isInvalidated) && claim.attackedBy && (
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-[#FF2A2A]" />
                  <span className="text-[10px] text-[#FF2A2A]/70 uppercase tracking-widest">
                    Attacked By: {claim.attackedBy}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
