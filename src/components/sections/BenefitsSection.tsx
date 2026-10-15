import React from "react";
import { SECTION_04_CONTENT } from "@/lib/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function BenefitsSection() {
  return (
    <section className="sec-l" id="benefits">
      <div className="wrap">
        <Reveal>
          <Eyebrow
            number={SECTION_04_CONTENT.eyebrowNumber}
            text={SECTION_04_CONTENT.eyebrowText}
          />
          <h2>
            {SECTION_04_CONTENT.h2Main}
            <span className="dim">{SECTION_04_CONTENT.h2Accent}</span>
          </h2>
          <p className="lead">{SECTION_04_CONTENT.lead}</p>
        </Reveal>
        <div className="tiles">
          {SECTION_04_CONTENT.benefits.map((benefit, index) => (
            <Reveal key={benefit.num} delay={(index % 4) * 0.06}>
              <div className="tile">
                <div className="ti">{benefit.num}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
