"use client";

import { useState, useEffect } from "react";

export function useWaitlistCount(minThreshold = 25) {
  const [count, setCount] = useState<number>(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchCount() {
      try {
        const res = await fetch("/api/waitlist/count");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && typeof data.count === "number") {
            setCount(data.count);
          }
        }
      } catch {
        // Silently fail, keep count 0
      } finally {
        if (isMounted) setHasLoaded(true);
      }
    }

    fetchCount();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    count,
    hasLoaded,
    isVisible: count >= minThreshold,
  };
}
