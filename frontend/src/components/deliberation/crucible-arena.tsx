"use client";

import { AgentCard } from "./agent-card";

interface CrucibleArenaProps {
  advocateText: string;
  advocateStreaming: boolean;
  advocateDone: boolean;
  inquisitorText: string;
  inquisitorStreaming: boolean;
  inquisitorDone: boolean;
  isActive: boolean;
}

export function CrucibleArena({
  advocateText,
  advocateStreaming,
  advocateDone,
  inquisitorText,
  inquisitorStreaming,
  inquisitorDone,
  isActive,
}: CrucibleArenaProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AgentCard
        role="advocate"
        text={advocateText}
        isStreaming={advocateStreaming}
        isDone={advocateDone}
        isActive={isActive}
      />
      <AgentCard
        role="inquisitor"
        text={inquisitorText}
        isStreaming={inquisitorStreaming}
        isDone={inquisitorDone}
        isActive={isActive}
      />
    </div>
  );
}
