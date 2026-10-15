import React from "react";
import { SECTION_01_CONTENT } from "@/lib/content";
import { supplementsData } from "@/lib/supplements";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { PackCard } from "./PackCard";

export function SuperRoutineSection() {
  return (
    <section className="sec-l" id="routine">
      <div className="wrap">
        <Reveal>
          <Eyebrow
            number={SECTION_01_CONTENT.eyebrowNumber}
            text={SECTION_01_CONTENT.eyebrowText}
          />
          <h2>
            {SECTION_01_CONTENT.h2Main}
            <span className="dim">{SECTION_01_CONTENT.h2Accent}</span>
          </h2>
          <p className="lead">{SECTION_01_CONTENT.lead}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <PackCard
            type="day"
            title={SECTION_01_CONTENT.dayPack.title}
            goals={SECTION_01_CONTENT.dayPack.goals}
            supplements={supplementsData.SUPS.day}
          />
        </Reveal>
        <Reveal delay={0.16}>
          <PackCard
            type="night"
            title={SECTION_01_CONTENT.nightPack.title}
            goals={SECTION_01_CONTENT.nightPack.goals}
            supplements={supplementsData.SUPS.night}
          />
        </Reveal>
      </div>
    </section>
  );
}
