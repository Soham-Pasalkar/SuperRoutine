import React from "react";
import { HEADER_CTA_LABEL } from "@/lib/content";

export function Header() {
  return (
    <header className="pill">
      <a className="brand" href="#main-content" aria-label="Super Routine">
        <picture>
          <source srcSet="/images/logo.avif" type="image/avif" />
          <source srcSet="/images/logo.webp" type="image/webp" />
          <img src="/images/logo.webp" alt="Super Routine" width={140} height={58} />
        </picture>
      </a>
      <a className="btn sm" href="#join">
        {HEADER_CTA_LABEL}
      </a>
    </header>
  );
}
