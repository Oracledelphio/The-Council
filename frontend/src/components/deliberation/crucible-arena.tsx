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
  advocateTitle?: string;
  inquisitorTitle?: string;
}

export function CrucibleArena({
  advocateText,
  advocateStreaming,
  advocateDone,
  inquisitorText,
  inquisitorStreaming,
  inquisitorDone,
  isActive,
  advocateTitle = "Advocate",
  inquisitorTitle = "Inquisitor"
}: CrucibleArenaProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AgentCard
        role="advocate"
        title={advocateTitle}
        text={advocateText}
        isStreaming={advocateStreaming}
        isDone={advocateDone}
        isActive={isActive && !advocateDone}
      />
      <AgentCard
        role="inquisitor"
        title={inquisitorTitle}
        text={inquisitorText}
        isStreaming={inquisitorStreaming}
        isDone={inquisitorDone}
        isActive={isActive && advocateDone && !inquisitorDone}
      />
    </div>
  );
}
