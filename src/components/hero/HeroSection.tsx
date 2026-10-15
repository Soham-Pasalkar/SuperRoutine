import React from "react";
import { HERO_CONTENT } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { HeroStage } from "./HeroStage";

export function HeroSection() {
  return (
    <section className="hero sec-l">
      <div className="wrap hero-grid">
        <div>
          <h1>
            <span className="h1a">{HERO_CONTENT.h1a}</span>
            <span className="h1b">{HERO_CONTENT.h1b}</span>
            <span className="h1c">{HERO_CONTENT.h1c}</span>
            <span className="h1d">{HERO_CONTENT.h1d}</span>
          </h1>
          <p className="lead">
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Super Routine</strong> is a
            day and night supplement system built around clean labels, exact doses, bioavailable forms
            and no filler. Eight essentials, split into a Day Pack and a Night Pack, so your routine
            is simple and every ingredient has a reason.
          </p>
          <div className="cta-row">
            <Button variant="lg" href="#join">
              {HERO_CONTENT.cta} <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
        <HeroStage />
      </div>
    </section>
  );
}
