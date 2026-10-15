import React from "react";
import { SECTION_05_CONTENT } from "@/lib/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { FormCounterStats } from "@/components/ui/FormCounterStats";
import { WaitlistForm } from "@/components/form/WaitlistForm";

export function FoundingAccessSection() {
  return (
    <section className="sec-d joinsec" id="join">
      <div className="wrap narrow">
        <Reveal>
          <Eyebrow
            number={SECTION_05_CONTENT.eyebrowNumber}
            text={SECTION_05_CONTENT.eyebrowText}
          />
          <h2>
            {SECTION_05_CONTENT.h2Main}{" "}
            <span className="dim">{SECTION_05_CONTENT.h2Accent}</span>
          </h2>
          <p className="lead">{SECTION_05_CONTENT.lead}</p>
          <FormCounterStats />
        </Reveal>

        <Reveal delay={0.1}>
          <WaitlistForm />
        </Reveal>
      </div>
    </section>
  );
}
