"use client";

import React from "react";
import { useWaitlistCount } from "@/lib/use-waitlist-count";

export function FormCounterStats() {
  const { count, isVisible } = useWaitlistCount();

  return (
    <div className="stats">
      <div id="joinedStat" hidden={!isVisible || count === null}>
        Joined <b id="joinedNum">{count ?? ""}</b>
      </div>
    </div>
  );
}
