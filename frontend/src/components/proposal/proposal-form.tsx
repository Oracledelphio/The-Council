"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EXAMPLE_PROPOSALS } from "@/lib/constants";

interface ProposalFormProps {
  onSubmit: (proposal: string) => void;
  isDisabled: boolean;
}

export function ProposalForm({ onSubmit, isDisabled }: ProposalFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length > 0) {
      onSubmit(trimmed);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="mb-6 text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold mb-2">
          Present Your Proposal
        </h2>
        <p className="text-sm text-white/40">
          Your idea will be scrutinized by the Council. Be specific.
        </p>
      </div>

      <div className="relative">
        <Textarea
          id="proposal-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          placeholder="Describe your business idea, product decision, strategy, or proposal in detail..."
          className="min-h-[160px] bg-white/[0.03] border-white/[0.08] text-white/90 placeholder:text-white/20 text-sm leading-relaxed resize-none focus:border-white/20 focus:ring-0 rounded-xl p-5"
          disabled={isDisabled}
        />
      </div>

      {/* Example proposals */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs text-white/30 mr-1 pt-1">Try:</span>
        {EXAMPLE_PROPOSALS.map((example) => (
          <button
            key={example.title}
            onClick={() => setText(example.text)}
            disabled={isDisabled}
            className="text-xs px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-white/40 hover:text-white/70 hover:border-white/15 transition-all duration-200 cursor-pointer disabled:opacity-30"
          >
            {example.title}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          id="submit-proposal"
          onClick={handleSubmit}
          disabled={isDisabled || text.trim().length === 0}
          className="px-8 py-3 bg-white text-[#121212] font-semibold rounded-xl hover:shadow-[0_0_30px_-8px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100 cursor-pointer h-auto text-base"
        >
          Submit to The Council →
        </Button>
      </div>
    </motion.div>
  );
}
