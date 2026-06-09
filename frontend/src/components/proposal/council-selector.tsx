import { PRESETS, CouncilPresetType } from "@/lib/types";
import { motion } from "framer-motion";

interface CouncilSelectorProps {
  selected: CouncilPresetType;
  onSelect: (preset: CouncilPresetType) => void;
}

export function CouncilSelector({ selected, onSelect }: CouncilSelectorProps) {
  const presets = Object.values(PRESETS);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <h2 className="text-xs font-medium text-white/40 uppercase tracking-[0.15em] mb-4 text-center">
        Select Council Configuration
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {presets.map((preset) => {
          const isSelected = selected === preset.id;
          return (
            <motion.button
              key={preset.id}
              onClick={() => onSelect(preset.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-white/[0.05] border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/50"
                  : "bg-black/20 border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isSelected ? "text-[#D4AF37]" : "text-white/80"}`}>
                  {preset.name}
                </span>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                )}
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                {preset.purpose}
              </p>
              <div className="mt-3 pt-3 border-t border-white/[0.05] flex flex-col gap-1">
                <span className="text-[10px] text-white/40">{preset.advocate_title}</span>
                <span className="text-[10px] text-white/40">{preset.inquisitor_title}</span>
                <span className="text-[10px] text-white/40">{preset.arbitrator_title}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
