"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/constants";
import type { AnalyticsMetrics } from "@/lib/types";

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/analytics`)
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/50">
        Failed to load analytics.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-[family-name:var(--font-heading)] font-bold mb-2">
              Executive Analytics
            </h1>
            <p className="text-white/40 text-sm">
              Institutional overview of all Council decisions.
            </p>
          </div>
          <Link
            href="/crucible"
            className="px-4 py-2 rounded-lg bg-white text-[#121212] font-semibold text-sm hover:bg-white/90 transition-colors"
          >
            New Deliberation
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Decisions */}
          <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">
              Total Decisions
            </h3>
            <p className="text-5xl font-bold text-white">
              {metrics.total_decisions}
            </p>
          </div>

          {/* Fund Rate */}
          <div className="p-6 rounded-xl border border-[#22C55E]/20 bg-[#22C55E]/[0.02]">
            <h3 className="text-sm font-semibold text-[#22C55E]/60 uppercase tracking-wider mb-2">
              Approval Rate
            </h3>
            <p className="text-5xl font-bold text-[#22C55E]">
              {metrics.fund_rate}%
            </p>
          </div>

          {/* Kill Rate */}
          <div className="p-6 rounded-xl border border-[#FF2A2A]/20 bg-[#FF2A2A]/[0.02]">
            <h3 className="text-sm font-semibold text-[#FF2A2A]/60 uppercase tracking-wider mb-2">
              Rejection Rate
            </h3>
            <p className="text-5xl font-bold text-[#FF2A2A]">
              {metrics.kill_rate}%
            </p>
          </div>
        </div>

        {/* Council Usage */}
        <div className="space-y-4">
          <h2 className="text-xl font-[family-name:var(--font-heading)] font-semibold border-b border-white/[0.06] pb-2">
            Council Utilization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.council_usage.map((usage) => (
              <div
                key={usage.type}
                className="p-4 rounded-lg border border-white/[0.06] bg-[#1A1A1A] flex items-center justify-between"
              >
                <span className="text-sm text-white/70 font-medium">
                  {usage.type}
                </span>
                <span className="text-lg font-bold text-white/90">
                  {usage.count}
                </span>
              </div>
            ))}
            {metrics.council_usage.length === 0 && (
              <div className="col-span-3 text-sm text-white/40">
                No data available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
