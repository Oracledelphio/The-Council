"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/constants";
import type { DecisionRecord } from "@/lib/types";
import { PRESETS } from "@/lib/types";

export function MemorySidebar() {
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const pathname = usePathname();

  const fetchDecisions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/decisions?limit=15`);
      if (res.ok) {
        const data = await res.json();
        setDecisions(data);
      }
    } catch (e) {
      console.error("Failed to fetch decisions", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/decisions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDecisions(prev => prev.filter(d => d.decision_id !== id));
        setDeleteModalId(null);
        // Dispatch event so Analytics can update
        window.dispatchEvent(new Event('decisionDeleted'));
      }
    } catch (e) {
      console.error("Failed to delete decision", e);
    }
  };

  useEffect(() => {
    fetchDecisions();
    // Poll every 10 seconds to keep the sidebar updated
    const interval = setInterval(fetchDecisions, 10000);
    
    const onRefresh = () => fetchDecisions();
    window.addEventListener('decisionAdded', onRefresh);
    window.addEventListener('decisionDeleted', onRefresh);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('decisionAdded', onRefresh);
      window.removeEventListener('decisionDeleted', onRefresh);
    };
  }, []);

  // Group decisions by council type
  const groupedDecisions = decisions.reduce((acc, d) => {
    if (!acc[d.council_type]) acc[d.council_type] = [];
    acc[d.council_type].push(d);
    return acc;
  }, {} as Record<string, DecisionRecord[]>);

  return (
    <>
      <aside className="w-64 border-r border-white/[0.06] bg-[#121212] flex flex-col h-full print:hidden">
        <div className="p-4 border-b border-white/[0.06] flex flex-col gap-3">
          <Link
            href="/"
            className="font-[family-name:var(--font-heading)] font-semibold text-white/90 text-lg hover:text-white transition-colors"
          >
            Council AI
          </Link>
          <div className="flex flex-col gap-2">
            <Link
              href="/crucible"
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 text-white/80 text-sm font-medium hover:bg-white/20 transition-colors"
            >
              <span className="text-white/50">+</span> New Deliberation
            </Link>
            <Link
              href="/analytics"
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/[0.1] text-white/60 text-sm font-medium hover:text-white/80 hover:bg-white/[0.05] transition-colors"
            >
              <span className="text-white/50">📊</span> Executive Analytics
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
              Institutional Memory
            </h2>
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-10 bg-white/[0.02] rounded" />
                <div className="h-10 bg-white/[0.02] rounded" />
                <div className="h-10 bg-white/[0.02] rounded" />
              </div>
            ) : decisions.length === 0 ? (
              <div className="p-4 rounded border border-white/[0.04] bg-white/[0.02] text-center">
                <p className="text-xs text-white/40 italic">No decisions recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.keys(PRESETS).map((presetKey) => {
                  const presetName = PRESETS[presetKey as keyof typeof PRESETS].name;
                  const docs = groupedDecisions[presetName] || [];
                  if (docs.length === 0) return null;

                  return (
                    <div key={presetName} className="space-y-2">
                      <h3 className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
                        {presetName}
                      </h3>
                      <div className="flex flex-col gap-1">
                        {docs.map((d) => {
                          const isActive = pathname === `/decision/${d.decision_id}`;
                          
                          return (
                            <div key={d.decision_id} className="relative group">
                              <Link
                                href={`/decision/${d.decision_id}`}
                                className={`block p-2 rounded border transition-colors ${
                                  isActive
                                    ? "bg-white/[0.08] border-white/20"
                                    : "bg-white/[0.02] border-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] text-white/40 font-mono">
                                    {d.decision_id.split("-").slice(1).join("-")}
                                  </span>
                                  <span
                                    className={`text-[9px] px-1.5 py-0.5 rounded-sm font-medium ${
                                      ["FUND", "APPROVE", "PROCEED"].includes(d.arbitrator.verdict)
                                        ? "bg-[#22C55E]/10 text-[#22C55E]"
                                        : ["KILL", "REJECT", "HALT"].includes(d.arbitrator.verdict)
                                        ? "bg-[#FF2A2A]/10 text-[#FF2A2A]"
                                        : "bg-white/10 text-white/60"
                                    }`}
                                  >
                                    {d.arbitrator.verdict}
                                  </span>
                                </div>
                                <p className="text-xs text-white/70 truncate text-ellipsis overflow-hidden pr-6 group-hover:text-white transition-colors">
                                  {d.proposal}
                                </p>
                              </Link>
                              
                              {/* Trash icon */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDeleteModalId(d.decision_id);
                                }}
                                className="absolute bottom-2 right-2 p-1 rounded hover:bg-[#FF2A2A]/20 text-white/20 hover:text-[#FF2A2A] opacity-0 group-hover:opacity-100 transition-all"
                                title="Delete Decision"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-heading)]">Delete Decision?</h3>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">
                This action cannot be undone. This decision and all its deliberation history will be permanently removed from Institutional Memory.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="px-4 py-2 rounded text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModalId)}
                  className="px-4 py-2 rounded bg-[#FF2A2A]/10 text-[#FF2A2A] text-sm font-medium hover:bg-[#FF2A2A]/20 transition-colors"
                >
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
