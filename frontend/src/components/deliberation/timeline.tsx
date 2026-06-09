"use client";

import { motion } from "framer-motion";
import type { DeliberationState } from "@/lib/types";

interface TimelineProps {
  status: DeliberationState;
}

const STEPS = [
  { id: "IDLE", label: "Proposal Submitted" },
  { id: "EXTRACTING", label: "Claims Extracted" },
  { id: "DELIBERATING_ADV", label: "Advocate Case" },
  { id: "DELIBERATING_INQ", label: "Inquisitor Challenge" },
  { id: "JUDGING", label: "Arbitrator Review" },
  { id: "COMPLETE", label: "Verdict Delivered" },
];

export function Timeline({ status }: TimelineProps) {
  if (status === "IDLE") return null;

  let currentIndex = 0;
  if (status === "EXTRACTING") currentIndex = 1;
  else if (status === "DELIBERATING") currentIndex = 3; // Both advocate and inquisitor in parallel
  else if (status === "JUDGING") currentIndex = 4;
  else if (status === "COMPLETE") currentIndex = 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex items-center justify-between mb-8 px-4"
    >
      {STEPS.map((step, idx) => {
        const isActive = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        const isLast = idx === STEPS.length - 1;

        return (
          <div key={step.id} className="flex-1 flex items-center">
            {/* Step Node */}
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive ? "#ffffff" : "rgba(255,255,255,0.1)",
                  scale: isCurrent ? 1.2 : 1,
                  boxShadow: isCurrent ? "0 0 15px rgba(255,255,255,0.5)" : "none",
                }}
                className={`w-2.5 h-2.5 rounded-full z-10 transition-colors duration-500`}
              />
              <span
                className={`absolute top-5 text-[10px] font-medium uppercase tracking-[0.1em] w-32 text-center transition-colors duration-500 ${
                  isActive ? "text-white/80" : "text-white/20"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {!isLast && (
              <div className="flex-1 h-[1px] mx-2 bg-white/[0.05] relative overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{
                    scaleX: isActive ? 1 : 0,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-white/40 origin-left"
                />
              </div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
