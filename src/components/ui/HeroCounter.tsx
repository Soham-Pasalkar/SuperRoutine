"use client";

import React from "react";
import { useWaitlistCount } from "@/lib/use-waitlist-count";

export function HeroCounter() {
  const { count, isVisible } = useWaitlistCount();

  if (!isVisible || count === null) {
    return <div id="counterWrap" />;
  }

  return (
    <div id="counterWrap">
      <div className="counter">
        <i aria-hidden="true" />
        <strong>{count}</strong>
        <span>Founding members already in</span>
      </div>
    </div>
  );
}
