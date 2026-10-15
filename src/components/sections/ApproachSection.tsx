import React from "react";
import { SECTION_02_CONTENT } from "@/lib/content";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function ApproachSection() {
  return (
    <section className="sec-l" id="approach">
      <div className="wrap">
        <Eyebrow
          number={SECTION_02_CONTENT.eyebrowNumber}
          text={SECTION_02_CONTENT.eyebrowText}
        />
        <h2>
          {SECTION_02_CONTENT.h2Main}
          <span className="dim">{SECTION_02_CONTENT.h2Accent}</span>
        </h2>
        <div className="pairs">
          {SECTION_02_CONTENT.items.map((item) => (
            <div key={item.title} className="pair">
              <i aria-hidden="true" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
