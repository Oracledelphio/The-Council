"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AGENT_CONFIG } from "@/lib/constants";

export default function LandingPage() {
  const agents = [
    {
      key: "advocate" as const,
      icon: "⚡",
      description: "Finds the asymmetric upside. Defends the opportunity.",
    },
    {
      key: "inquisitor" as const,
      icon: "🔍",
      description: "Attacks assumptions. Exposes the fatal flaw.",
    },
    {
      key: "arbitrator" as const,
      icon: "⚖️",
      description: "Evaluates the clash. Delivers the final verdict.",
    },
  ];

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-white/60 font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            Multi-Agent Deliberation Engine
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Don&apos;t Ask One AI.
          <br />
          <span className="bg-gradient-to-r from-[#00E5FF] via-white to-[#FF2A2A] bg-clip-text text-transparent">
            Ask The Council.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Submit your proposal. Watch AI experts challenge, defend, and judge
          your ideas through structured adversarial deliberation.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/crucible">
            <button
              id="cta-convene"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-[#121212] font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Convene The Council
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </Link>
        </motion.div>

        {/* Agent Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {agents.map((agent, i) => {
            const config = AGENT_CONFIG[agent.key];
            return (
              <motion.div
                key={agent.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                className="relative p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm text-left group hover:border-white/10 transition-colors duration-300"
              >
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${config.colorMuted}, transparent 70%)`,
                  }}
                />
                <div className="relative z-10">
                  <div className="text-2xl mb-3">{agent.icon}</div>
                  <h3
                    className="font-[family-name:var(--font-heading)] font-semibold text-lg mb-1"
                    style={{ color: config.color }}
                  >
                    {config.label}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {agent.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </main>
  );
}
