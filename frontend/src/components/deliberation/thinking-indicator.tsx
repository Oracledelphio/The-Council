"use client";

import { motion } from "framer-motion";

interface ThinkingIndicatorProps {
  color: string;
  label: string;
}

export function ThinkingIndicator({ color, label }: ThinkingIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/40">{label} is analyzing...</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: color }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
