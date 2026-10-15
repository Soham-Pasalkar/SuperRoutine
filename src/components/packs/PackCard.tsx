"use client";

import React, { useState } from "react";
import { Supplement } from "@/lib/supplements";
import { SupplementTile } from "./SupplementTile";

interface PackCardProps {
  type: "day" | "night";
  title: string;
  goals: string;
  supplements: Supplement[];
}

export function PackCard({ type, title, goals, supplements }: PackCardProps) {
  const [openSupplement, setOpenSupplement] = useState<string | null>(null);
  const isDay = type === "day";

  const handleToggle = (name: string) => {
    setOpenSupplement((prev) => (prev === name ? null : name));
  };

  return (
    <div className={`box ${type}`}>
      <div className="boxh">
        {isDay ? (
          <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="#0B2654"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="24" cy="24" r="8" />
            <path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.6 10.6l4.2 4.2M33.2 33.2l4.2 4.2M10.6 37.4l4.2-4.2M33.2 14.8l4.2-4.2" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="#F4F7FC"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M38 28.5A15 15 0 0 1 19.5 10 15 15 0 1 0 38 28.5Z" />
          </svg>
        )}
        <div>
          <h3>{title}</h3>
          <p className="grp">{goals}</p>
        </div>
      </div>
      <div className="supgrid">
        {supplements.map((sup) => (
          <SupplementTile
            key={sup.n}
            supplement={sup}
            isOpen={openSupplement === sup.n}
            onToggle={() => handleToggle(sup.n)}
          />
        ))}
      </div>
    </div>
  );
}
