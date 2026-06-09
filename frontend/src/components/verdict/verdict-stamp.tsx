"use client";

import { motion } from "framer-motion";
import type { VerdictData } from "@/lib/types";

interface VerdictStampProps {
  verdict: VerdictData["verdict"];
}

export function VerdictStamp({ verdict }: VerdictStampProps) {
  const isFund = verdict === "FUND";
  const color = isFund ? "#22C55E" : "#FF2A2A";
  const bgGlow = isFund
    ? "shadow-[0_0_120px_-20px_rgba(34,197,94,0.4)]"
    : "shadow-[0_0_120px_-20px_rgba(255,42,42,0.4)]";

  return (
    <motion.div
      initial={{ scale: 1.3, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 25,
        duration: 0.3,
      }}
      className={`flex items-center justify-center py-6 ${bgGlow}`}
    >
      <div className="text-center">
        <motion.div
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs font-medium text-white/40 uppercase tracking-[0.2em] mb-2"
        >
          Council Verdict
        </motion.div>
        <motion.h2
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
            delay: 0.05,
          }}
          className="font-[family-name:var(--font-heading)] text-6xl sm:text-7xl font-extrabold tracking-tight"
          style={{
            color,
            textShadow: `0 0 40px ${color}60`,
          }}
        >
          {verdict}
        </motion.h2>
      </div>
    </motion.div>
  );
}
