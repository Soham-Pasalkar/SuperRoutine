import React from "react";
import { SECTION_03_CONTENT } from "@/lib/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function BuildSection() {
  return (
    <section className="sec-l" id="build">
      <div className="wrap">
        <Reveal>
          <Eyebrow
            number={SECTION_03_CONTENT.eyebrowNumber}
            text={SECTION_03_CONTENT.eyebrowText}
          />
          <h2>
            {SECTION_03_CONTENT.h2Main}
            <span className="dim">{SECTION_03_CONTENT.h2Accent}</span>
          </h2>
          <p className="lead">{SECTION_03_CONTENT.lead}</p>
        </Reveal>
        <div className="tl">
          {SECTION_03_CONTENT.steps.map((step, index) => (
            <Reveal key={step.num} delay={index * 0.06}>
              <div className={`step ${step.on ? "on" : ""}`.trim()}>
                <div className="dot">{step.num}</div>
                <div>
                  <h3>{step.title}</h3>
                  <span className="mono">{step.status}</span>
                  <p>{step.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
