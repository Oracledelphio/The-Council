"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Consumes a ReadableStream from a fetch response and returns
 * accumulated text as it arrives, updating state on each chunk.
 */
export function useStreamReader() {
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const accumulatedRef = useRef("");

  const reset = useCallback(() => {
    setText("");
    setIsStreaming(false);
    setIsDone(false);
    accumulatedRef.current = "";
  }, []);

  const startStream = useCallback(async (response: Response) => {
    if (!response.body) {
      throw new Error("No response body");
    }

    setIsStreaming(true);
    setIsDone(false);
    accumulatedRef.current = "";

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedRef.current += chunk;
        setText(accumulatedRef.current);
      }
    } finally {
      setIsStreaming(false);
      setIsDone(true);
    }

    return accumulatedRef.current;
  }, []);

  return { text, isStreaming, isDone, startStream, reset, accumulatedRef };
}
