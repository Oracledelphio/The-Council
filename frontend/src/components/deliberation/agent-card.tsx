"use client";

import { motion } from "framer-motion";
import { AGENT_CONFIG } from "@/lib/constants";
import { ThinkingIndicator } from "./thinking-indicator";
import type { AgentRole } from "@/lib/types";

interface AgentCardProps {
  role: AgentRole;
  text: string;
  isStreaming: boolean;
  isDone: boolean;
  isActive: boolean;
  title?: string;
}

export function AgentCard({
  role,
  text,
  isStreaming,
  isDone,
  isActive,
  title,
}: AgentCardProps) {
  const config = AGENT_CONFIG[role];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0.4, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col rounded-xl border backdrop-blur-sm overflow-hidden transition-all duration-500 ${
        isActive ? config.bgGlow : ""
      }`}
      style={{
        borderColor: isActive
          ? `${config.color}30`
          : "rgba(255,255,255,0.06)",
        backgroundColor: isActive
          ? config.colorMuted
          : "rgba(255,255,255,0.02)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: config.color,
              boxShadow: isStreaming
                ? `0 0 8px ${config.color}`
                : "none",
            }}
          />
          <div>
            <h3
              className="font-[family-name:var(--font-heading)] font-semibold text-sm"
              style={{ color: config.color }}
            >
              {title || config.label}
            </h3>
            <p className="text-xs text-white/30">{config.subtitle}</p>
          </div>
        </div>
        {isDone && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-white/40"
          >
            Complete
          </motion.span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-4 min-h-[140px]">
        {!text && !isStreaming && (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-white/20 italic">
              Awaiting deliberation...
            </span>
          </div>
        )}
        {!text && isStreaming && (
          <ThinkingIndicator color={config.color} label={title || config.label} />
        )}
        {text && (
          <p
            className={`text-sm leading-relaxed text-white/80 ${
              isStreaming ? "typing-cursor" : ""
            }`}
          >
            {text}
          </p>
        )}
      </div>

      {/* Bottom accent line */}
      {isActive && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-[2px] origin-left"
          style={{
            background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
          }}
        />
      )}
    </motion.div>
  );
}
