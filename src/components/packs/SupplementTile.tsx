"use client";

import React, { useState } from "react";
import { Supplement } from "@/lib/supplements";
import { Pill3D } from "./Pill3D";

interface SupplementTileProps {
  supplement: Supplement;
}

export function SupplementTile({ supplement }: SupplementTileProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sup" data-open={isOpen ? "true" : "false"}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Pill3D name={supplement.n} />
        <span className="nm">
          <strong>{supplement.n}</strong>
          <span>{supplement.dose}</span>
        </span>
        <svg
          className="row-ar"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
      <div className="sup-b">
        <div>
          <dl>
            <div>
              <dt>What it does</dt>
              <dd>{supplement.does}</dd>
            </div>
            <div>
              <dt>Why this form</dt>
              <dd>{supplement.form}</dd>
            </div>
            <div>
              <dt>On the label, look for</dt>
              <dd>{supplement.look}</dd>
            </div>
            <div>
              <dt>When to take</dt>
              <dd>{supplement.time}</dd>
            </div>
            <div>
              <dt>Evidence</dt>
              <dd>{supplement.ev}</dd>
            </div>
            <div>
              <dt>Caution</dt>
              <dd>{supplement.caution}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
