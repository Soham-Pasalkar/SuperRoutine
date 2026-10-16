import React from "react";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/sections/Footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Interim draft terms governing participation in the Super Routine founding waitlist and preference survey.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service — Super Routine",
    description:
      "Interim draft terms governing participation in the Super Routine founding waitlist and preference survey.",
    url: "/terms",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service — Super Routine",
    description:
      "Interim draft terms governing participation in the Super Routine founding waitlist and preference survey.",
  },
};

export default function TermsPage() {
  return (
    <div className="sec-l min-h-screen">
      <Header />
      <main id="main-content" className="wrap narrow" style={{ padding: "80px 22px 100px" }}>
        <p className="eyebrow">
          <b>LEGAL</b> / TERMS
        </p>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.03em" }}>
          Terms of Service
        </h1>
        <p className="lead" style={{ fontSize: "1.05rem", color: "var(--t2)", marginBottom: "32px", lineHeight: 1.6 }}>
          <em>Notice:</em> This is an interim draft governing participation in the Super Routine pre-launch waitlist
          and interactive survey. It has been prepared for operational clarity and has not yet received formal legal review.
          Commercial terms will be established prior to product availability and payment processing.
        </p>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>
            1. Waitlist Participation
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>
            Participation in the Super Routine founding waitlist is voluntary and free of charge. Submitting your details
            and survey answers registers your interest in early batch releases and reserves a queue position. Joining the waitlist
            does not create a contract of sale, a financial obligation, or a guarantee of product allocation.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>
            2. Availability &amp; Batch Releases
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>
            Founding-cohort access and release schedules are subject to formulation timelines, ingredient sourcing, and production capacity.
            Super Routine reserves the right to manage batch sizes and invitation schedules at its discretion. Placement on the waitlist
            does not guarantee that an offer to purchase will be made.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>
            3. Survey Selections &amp; Pricing Indications
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>
            Preferences submitted in the waitlist survey (including preferred formats, custom ingredients, and indicative price ranges)
            are collected solely for research and product planning. They do not constitute a fixed price quotation, binding order,
            or customized manufacturing agreement.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>
            4. Payments Disabled
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>
            No financial transactions or payment processing occur on this website during the waitlist phase. Super Routine will never
            request payment details, bank credentials, or card information during waitlist registration.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>
            5. Communications &amp; Cancellation
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>
            By opting into the waitlist, you consent to receive queue updates, survey follow-ups, and founding release announcements
            via WhatsApp or SMS at the Indian mobile number provided. You may request removal from the waitlist at any time by
            contacting our team through official channels.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>
            6. Intellectual Property
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>
            All content on this site, including brand marks, logos, packaging visuals, text, and 3D assets, is the property of
            Super Routine and protected by applicable copyright and trademark laws.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
