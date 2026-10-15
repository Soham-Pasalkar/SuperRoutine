"use client";

import React, { useState, useEffect, useRef } from "react";
import { normalizePhone } from "@/lib/phone";
import { FormSvgDefs } from "./FormSvgDefs";
import { PriceSlider } from "./PriceSlider";

const CUSTOM_SUPPLEMENT_ITEMS = [
  "Zinc Picolinate",
  "Magnesium Glycinate",
  "Vitamin D3 + K2",
  "Ashwagandha KSM-66",
  "Himalayan Shilajit Gold",
  "Omega-3 Fish Oil",
  "Vitamin B12",
  "Melatonin",
] as const;

interface FormState {
  packaging: "info" | "designer" | null;
  format: "sachets" | "jars" | "either" | null;
  build: "premade" | "custom" | "unsure" | null;
  customItems: string[];
  priceMin: number;
  priceMax: number;
  priceTouched: boolean;
  firstName: string;
  phone: string;
  consent: boolean;
  hp: string;
}

const INITIAL_FORM_STATE: FormState = {
  packaging: null,
  format: null,
  build: null,
  customItems: [],
  priceMin: 1200,
  priceMax: 3300,
  priceTouched: false,
  firstName: "",
  phone: "+91 ",
  consent: false,
  hp: "",
};

export function WaitlistForm() {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submissionResult, setSubmissionResult] = useState<{
    position: number;
    duplicate: boolean;
  } | null>(null);

  const formCardRef = useRef<HTMLDivElement>(null);

  // Restore draft from sessionStorage on mount (excluding phone number)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("sr_waitlist_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({
          ...prev,
          packaging: parsed.packaging ?? null,
          format: parsed.format ?? null,
          build: parsed.build ?? null,
          customItems: Array.isArray(parsed.customItems) ? parsed.customItems : [],
          priceMin: typeof parsed.priceMin === "number" ? parsed.priceMin : 1200,
          priceMax: typeof parsed.priceMax === "number" ? parsed.priceMax : 3300,
          priceTouched: Boolean(parsed.priceTouched),
          firstName: typeof parsed.firstName === "string" ? parsed.firstName : "",
        }));
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  // Save draft answers to sessionStorage (never save phone)
  useEffect(() => {
    try {
      const draft = {
        packaging: form.packaging,
        format: form.format,
        build: form.build,
        customItems: form.customItems,
        priceMin: form.priceMin,
        priceMax: form.priceMax,
        priceTouched: form.priceTouched,
        firstName: form.firstName,
      };
      sessionStorage.setItem("sr_waitlist_draft", JSON.stringify(draft));
    } catch {
      // Ignore sessionStorage errors
    }
  }, [
    form.packaging,
    form.format,
    form.build,
    form.customItems,
    form.priceMin,
    form.priceMax,
    form.priceTouched,
    form.firstName,
  ]);

  // Analytics helper
  const trackEvent = (event: string, properties?: Record<string, unknown>) => {
    if (typeof window !== "undefined" && (window as unknown as { posthog?: { capture: (e: string, p?: Record<string, unknown>) => void } }).posthog) {
      (window as unknown as { posthog: { capture: (e: string, p?: Record<string, unknown>) => void } }).posthog.capture(event, properties);
    }
  };

  useEffect(() => {
    trackEvent("waitlist_step_viewed", { step });
  }, [step]);

  // Step validation
  const isStepValid = (s: number): boolean => {
    switch (s) {
      case 1:
        return form.packaging !== null;
      case 2:
        return form.format !== null;
      case 3:
        if (form.build === "custom") {
          return form.customItems.length > 0;
        }
        return form.build !== null;
      case 4:
        return form.priceTouched;
      case 5: {
        const norm = normalizePhone(form.phone);
        return (
          form.firstName.trim().length >= 1 &&
          norm.isValid &&
          form.consent === true
        );
      }
      default:
        return true;
    }
  };

  const scrollToCard = () => {
    if (!formCardRef.current || typeof window === "undefined") return;
    const y =
      formCardRef.current.getBoundingClientRect().top +
      window.scrollY -
      90;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({
      top: y,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const handleNext = async () => {
    if (!isStepValid(step)) return;

    if (step < 5) {
      setStep((prev) => prev + 1);
      setErrorMessage("");
      scrollToCard();
      return;
    }

    // Submit step 5
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        firstName: form.firstName.trim(),
        phone: form.phone.trim(),
        consent: true,
        answers: {
          packaging: form.packaging,
          format: form.format,
          build: form.build,
          customItems: form.customItems,
          priceMin: form.priceMin,
          priceMax: form.priceMax,
        },
        utm: {
          source: typeof document !== "undefined" ? document.referrer || "direct" : "direct",
          page: typeof location !== "undefined" ? location.href : "",
        },
        hp: form.hp,
      };

      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          data.error ||
            "We could not save your answers. Check your connection and try again."
        );
        trackEvent("waitlist_error", { error: data.error, status: res.status });
        setIsSubmitting(false);
        return;
      }

      setSubmissionResult({
        position: data.position ?? 1,
        duplicate: Boolean(data.duplicate),
      });
      trackEvent("waitlist_submitted", {
        position: data.position,
        duplicate: data.duplicate,
      });

      // Clear draft on success
      try {
        sessionStorage.removeItem("sr_waitlist_draft");
      } catch {
        // Ignore
      }

      setStep(6);
      scrollToCard();
    } catch (err) {
      console.error("Submission failed:", err);
      setErrorMessage(
        "We could not save your answers. Check your connection and try again."
      );
      trackEvent("waitlist_error", { error: "Network or client failure" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 6) {
      setStep((prev) => prev - 1);
      setErrorMessage("");
      scrollToCard();
    }
  };

  const handleCustomPillToggle = (item: string) => {
    setForm((prev) => {
      const exists = prev.customItems.includes(item);
      const nextItems = exists
        ? prev.customItems.filter((i) => i !== item)
        : [...prev.customItems, item];
      return { ...prev, customItems: nextItems };
    });
  };

  // Progress Bar labels and widths
  let progressLabel = "Question 1 of 4";
  let bar1Width = "0%";
  let bar2Width = "0%";

  if (step <= 4) {
    progressLabel = `Question ${step} of 4`;
    bar1Width = `${((step - 1) / 4) * 100}%`;
    bar2Width = "0%";
  } else if (step === 5) {
    progressLabel = "Your details";
    bar1Width = "100%";
    bar2Width = "50%";
  } else {
    progressLabel = "Done";
    bar1Width = "100%";
    bar2Width = "100%";
  }

  const shareText = encodeURIComponent(
    `I just joined the Super Routine founding list. Day and night supplements with every dose declared. ${
      typeof location !== "undefined"
        ? location.origin + "?utm_source=share"
        : "https://superroutine.in?utm_source=share"
    }`
  );
  const shareUrl = `https://wa.me/?text=${shareText}`;

  return (
    <div
      className="formcard"
      ref={formCardRef}
      role="region"
      aria-label="Waitlist Form"
    >
      <FormSvgDefs />

      <div className="prog">
        <span id="stepLbl">{progressLabel}</span>
        <div className="bars">
          <span>
            <i id="bar1" style={{ width: bar1Width }} />
          </span>
          <span>
            <i id="bar2" style={{ width: bar2Width }} />
          </span>
        </div>
      </div>

      {/* Step 1: Packaging */}
      <div className={`fstep ${step === 1 ? "on" : ""}`} data-s="1">
        <h3>Which packaging do you prefer?</h3>
        <div className="opts">
          <label className="opt">
            <input
              type="radio"
              name="packaging"
              value="info"
              checked={form.packaging === "info"}
              onChange={() => setForm((prev) => ({ ...prev, packaging: "info" }))}
            />
            <svg className="ico" viewBox="0 0 96 96" aria-hidden="true">
              <use href="#i-box1" />
            </svg>
            <div>
              <strong>Info-first pack</strong>
              <span className="d">
                Ingredients, forms and doses large on the front. Minimal design, like a protein tub.
              </span>
            </div>
          </label>

          <label className="opt">
            <input
              type="radio"
              name="packaging"
              value="designer"
              checked={form.packaging === "designer"}
              onChange={() =>
                setForm((prev) => ({ ...prev, packaging: "designer" }))
              }
            />
            <svg className="ico" viewBox="0 0 96 96" aria-hidden="true">
              <use href="#i-box2" />
            </svg>
            <div>
              <strong>Designer pack</strong>
              <span className="d">
                Premium look on the front, full details printed on the back.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Step 2: Format */}
      <div className={`fstep ${step === 2 ? "on" : ""}`} data-s="2">
        <h3>How would you like your supplements?</h3>
        <div className="opts">
          <label className="opt">
            <input
              type="radio"
              name="format"
              value="sachets"
              checked={form.format === "sachets"}
              onChange={() => setForm((prev) => ({ ...prev, format: "sachets" }))}
            />
            <svg className="ico" viewBox="0 0 96 96" aria-hidden="true">
              <use href="#i-sachets" />
            </svg>
            <div>
              <strong>Day and Night sachets</strong>
              <span className="d">
                One sachet for the day, one for the night. A 30-day pack.
              </span>
            </div>
          </label>

          <label className="opt">
            <input
              type="radio"
              name="format"
              value="jars"
              checked={form.format === "jars"}
              onChange={() => setForm((prev) => ({ ...prev, format: "jars" }))}
            />
            <svg className="ico" viewBox="0 0 96 96" aria-hidden="true">
              <use href="#i-jars" />
            </svg>
            <div>
              <strong>Separate jars</strong>
              <span className="d">One bottle per supplement.</span>
            </div>
          </label>

          <label className="opt">
            <input
              type="radio"
              name="format"
              value="either"
              checked={form.format === "either"}
              onChange={() => setForm((prev) => ({ ...prev, format: "either" }))}
            />
            <svg className="ico" viewBox="0 0 96 96" aria-hidden="true">
              <use href="#i-either" />
            </svg>
            <div>
              <strong>Either, depends on price</strong>
              <span className="d">I would pick the better value.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Step 3: Sachet Build */}
      <div className={`fstep ${step === 3 ? "on" : ""}`} data-s="3">
        <h3>How should your sachets be made?</h3>
        <div className="opts">
          <label className="opt">
            <input
              type="radio"
              name="build"
              value="premade"
              checked={form.build === "premade"}
              onChange={() => setForm((prev) => ({ ...prev, build: "premade" }))}
            />
            <svg className="ico" viewBox="0 0 96 96" aria-hidden="true">
              <use href="#i-sachets" />
            </svg>
            <div>
              <strong>Pre-made</strong>
              <span className="d">
                All 8 supplements split into 2 sachets, Day and Night.
              </span>
            </div>
          </label>

          <label className="opt">
            <input
              type="radio"
              name="build"
              value="custom"
              checked={form.build === "custom"}
              onChange={() => setForm((prev) => ({ ...prev, build: "custom" }))}
            />
            <svg className="ico" viewBox="0 0 96 96" aria-hidden="true">
              <use href="#i-custom" />
            </svg>
            <div>
              <strong>Custom</strong>
              <span className="d">
                I choose which supplements go in my sachets.
              </span>
            </div>
          </label>

          <label className="opt">
            <input
              type="radio"
              name="build"
              value="unsure"
              checked={form.build === "unsure"}
              onChange={() => setForm((prev) => ({ ...prev, build: "unsure" }))}
            />
            <svg className="ico" viewBox="0 0 96 96" aria-hidden="true">
              <use href="#i-q" />
            </svg>
            <div>
              <strong>Not sure yet</strong>
              <span className="d">Show me more first.</span>
            </div>
          </label>
        </div>

        {/* Custom Supplements Selector */}
        <div className={`custom ${form.build === "custom" ? "on" : ""}`} id="customPick">
          <p className="hint" style={{ marginBottom: "12px" }}>
            Which would you want in your sachets?
          </p>
          <div className="pills" id="customPills">
            {CUSTOM_SUPPLEMENT_ITEMS.map((item) => {
              const isChecked = form.customItems.includes(item);
              return (
                <label key={item} className="pill-o">
                  <input
                    type="checkbox"
                    name="cust"
                    value={item}
                    checked={isChecked}
                    onChange={() => handleCustomPillToggle(item)}
                  />
                  <span>{item}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step 4: Price Slider */}
      <div className={`fstep ${step === 4 ? "on" : ""}`} data-s="4">
        <h3>What monthly price feels right for a full Day and Night routine?</h3>
        <PriceSlider
          min={form.priceMin}
          max={form.priceMax}
          touched={form.priceTouched}
          onChange={({ min, max, touched }) =>
            setForm((prev) => ({
              ...prev,
              priceMin: min,
              priceMax: max,
              priceTouched: touched,
            }))
          }
        />
      </div>

      {/* Step 5: Contact Details */}
      <div className={`fstep ${step === 5 ? "on" : ""}`} data-s="5">
        <h3>Where should we send your Drop 01 access on WhatsApp?</h3>

        {/* Hidden Honeypot field */}
        <input
          type="text"
          name="hp"
          value={form.hp}
          onChange={(e) => setForm((prev) => ({ ...prev, hp: e.target.value }))}
          tabIndex={-1}
          autoComplete="off"
          style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
          aria-hidden="true"
        />

        <div className="fld">
          <label htmlFor="fname">First name</label>
          <input
            className="inp"
            id="fname"
            type="text"
            autoComplete="given-name"
            placeholder="Shubham"
            value={form.firstName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, firstName: e.target.value }))
            }
          />
        </div>

        <div className="fld">
          <label htmlFor="fphone">WhatsApp number</label>
          <input
            className="inp"
            id="fphone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </div>

        <label className="consent">
          <input
            type="checkbox"
            id="fconsent"
            checked={form.consent}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, consent: e.target.checked }))
            }
          />
          <span>
            I agree to be contacted about Super Routine and to my answers being used to shape the product. We use your details only for this and never sell them.
          </span>
        </label>
      </div>

      {/* Step 6: Success */}
      <div className={`fstep ${step === 6 ? "on" : ""}`} data-s="6">
        <div className="done">
          <div className="check" aria-hidden="true">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </div>
          <h3>You&apos;re in.</h3>
          <p id="doneMsg">
            {form.firstName.trim() ? `${form.firstName.trim()}, y` : "Y"}ou&apos;re on the Super Routine founding list. We&apos;ll message you on WhatsApp when Drop 01 opens.
          </p>

          {submissionResult && (
            <div
              style={{
                marginTop: "18px",
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: "999px",
                background: "color-mix(in srgb, var(--a) 12%, transparent)",
                color: "var(--a)",
                font: "600 0.85rem var(--font-mono, monospace)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {submissionResult.duplicate
                ? `Founding member #${submissionResult.position}`
                : `Founding member #${submissionResult.position}`}
            </div>
          )}

          <p style={{ margin: "26px 0 0" }}>
            <a
              className="btn sm"
              id="shareBtn"
              target="_blank"
              rel="noopener noreferrer"
              href={shareUrl}
            >
              Share on WhatsApp
            </a>
          </p>
        </div>
      </div>

      {/* Error container */}
      <div className="err" id="err" role="alert">
        {errorMessage}
      </div>

      {/* Nav buttons (hidden on done) */}
      {step < 6 && (
        <div className="nav" id="nav">
          <button
            className="back"
            id="backBtn"
            type="button"
            hidden={step === 1}
            onClick={handleBack}
          >
            ← Back
          </button>
          <button
            className="btn"
            id="nextBtn"
            type="button"
            disabled={!isStepValid(step) || isSubmitting}
            onClick={handleNext}
          >
            {isSubmitting
              ? "Saving..."
              : step === 5
              ? <>Claim founding access <span aria-hidden="true">→</span></>
              : <>Continue <span aria-hidden="true">→</span></>}
          </button>
        </div>
      )}
    </div>
  );
}
