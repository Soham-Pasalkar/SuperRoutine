import React from "react";
import { SECTION_05_CONTENT } from "@/lib/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

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
            {SECTION_05_CONTENT.h2Main}
            <span className="dim">{SECTION_05_CONTENT.h2Accent}</span>
          </h2>
          <p className="lead">{SECTION_05_CONTENT.lead}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="formcard" role="region" aria-label="Waitlist Form">
            <div className="prog">
              <span>QUESTION 1 OF 4</span>
              <div className="bars">
                <span>
                  <i style={{ width: "25%" }} />
                </span>
              </div>
            </div>

            <div className="fstep on">
              <h3>Which packaging do you prefer?</h3>
              <p className="hint">Select the exterior style that fits your counter.</p>

              <div className="opts">
                <div className="opt">
                  <div className="ico" style={{ width: "62px", height: "62px" }}>
                    <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
                      <rect x="12" y="32" width="52" height="52" rx="1.5" fill="#0B2654" />
                      <polygon points="12,32 30,22 82,22 64,32" fill="#D3DCE8" />
                      <polygon points="64,32 82,22 82,74 64,84" fill="#0A1F45" />
                    </svg>
                  </div>
                  <div>
                    <strong>Info-first Pack</strong>
                    <span className="d">
                      Ingredients, forms and doses large on the front. Minimal design, like a protein tub.
                    </span>
                  </div>
                </div>

                <div className="opt">
                  <div className="ico" style={{ width: "62px", height: "62px" }}>
                    <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
                      <rect x="12" y="32" width="52" height="52" rx="1.5" fill="#FAFBFD" />
                      <polygon points="12,32 30,22 82,22 64,32" fill="#D3DCE8" />
                      <polygon points="64,32 82,22 82,74 64,84" fill="#0A1F45" />
                    </svg>
                  </div>
                  <div>
                    <strong>Designer Pack</strong>
                    <span className="d">
                      Premium look on the front, full details printed on the back.
                    </span>
                  </div>
                </div>
              </div>

              <div className="nav">
                <span className="fine text-xs text-slate-500">
                  No payment required today.
                </span>
                <button className="btn" type="button" disabled>
                  Continue <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
