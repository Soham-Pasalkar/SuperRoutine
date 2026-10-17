"use client";

import { useState, useEffect } from "react";

export function useWaitlistCount(minThreshold = 25) {
  const [count, setCount] = useState<number | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchCount() {
      try {
        const res = await fetch("/api/waitlist/count");
        if (!res.ok) {
          if (isMounted) {
            setIsError(true);
            setCount(null);
          }
          return;
        }
        const data = await res.json();
        if (isMounted) {
          if (data.ok && typeof data.count === "number") {
            setCount(data.count);
            setIsError(false);
          } else {
            setIsError(true);
            setCount(null);
          }
        }
      } catch {
        if (isMounted) {
          setIsError(true);
          setCount(null);
        }
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
    isError,
    isVisible: !isError && count !== null && count >= minThreshold,
  };
}
