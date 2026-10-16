import React from "react";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/sections/Footer";
import { clientEnv } from "@/lib/env";

export const metadata = {
  title: "Privacy Policy — Super Routine",
  description:
    "How Super Routine collects, processes, and protects your personal data during the founding waitlist.",
};

export default function PrivacyPage() {
  const contactEmail = clientEnv.NEXT_PUBLIC_CONTACT_EMAIL || "privacy@superroutine.com";

  return (
    <div className="sec-l min-h-screen">
      <Header />
      <main id="main-content" className="wrap narrow" style={{ padding: "80px 22px 100px" }}>
        <p className="eyebrow">
          <b>LEGAL</b> / PRIVACY
        </p>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.03em" }}>
          Privacy Policy
        </h1>
        <p className="lead" style={{ fontSize: "1.1rem", color: "var(--t2)", marginBottom: "40px", lineHeight: 1.6 }}>
          This Privacy Policy describes how Super Routine (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
          collects, uses, and safeguards personal information when you participate in our founding-cohort waitlist
          and interactive formulation survey.
        </p>

        <section style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
            1. Information We Collect
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6, marginBottom: "12px" }}>
            We strictly limit data collection to what is necessary to operate our founding waitlist and tailor upcoming
            formulations:
          </p>
          <ul style={{ paddingLeft: "20px", color: "var(--t2)", lineHeight: 1.7, listStyleType: "disc" }}>
            <li>
              <strong>First Name:</strong> To personalize our communications and reserve your queue slot.
            </li>
            <li>
              <strong>WhatsApp Mobile Number (+91 format):</strong> To notify you about batch openings, queue status,
              and private founding invitations via WhatsApp.
            </li>
            <li>
              <strong>Survey Selections:</strong> Your preferences for packaging format, custom ingredients, and target price ranges.
            </li>
            <li>
              <strong>Consent Records:</strong> Cryptographic timestamp and text version of the affirmative opt-in consent you grant.
            </li>
            <li>
              <strong>Campaign Attribution (UTM):</strong> Optional query parameters (source, campaign, medium) indicating how you discovered our site.
            </li>
            <li>
              <strong>Salted IP Hash:</strong> A one-way, cryptographically salted SHA-256 hash of your network IP address. We use this solely for abuse prevention and sliding-window rate limiting; raw IP addresses are never saved to our database.
            </li>
            <li>
              <strong>Browser User-Agent:</strong> General technical header for responsive layout debugging and compatibility testing.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
            2. Data We Explicitly Do Not Collect
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>
            Super Routine does <strong>not</strong> collect or store government identification numbers (Aadhaar, PAN,
            passports), financial account or credit card numbers, biometric data, or medical/health diagnostic records.
          </p>
        </section>

        <section style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
            3. Purposes of Processing &amp; Legal Basis
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6, marginBottom: "12px" }}>
            We process your information exclusively based on your explicit consent granted via our waitlist opt-in
            checkbox, for the following purposes:
          </p>
          <ul style={{ paddingLeft: "20px", color: "var(--t2)", lineHeight: 1.7, listStyleType: "disc" }}>
            <li>Allocating and maintaining your verified waitlist queue position.</li>
            <li>Sending priority notifications and early-access invitations for our founding product release.</li>
            <li>Aggregating anonymous survey responses to finalize batch ingredient quantities and packaging designs.</li>
            <li>Preventing automated bot abuse and protecting service integrity.</li>
          </ul>
        </section>

        <section style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
            4. Service Providers &amp; Data Processors
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6, marginBottom: "12px" }}>
            We work with trusted infrastructure providers who process data strictly under our direction:
          </p>
          <ul style={{ paddingLeft: "20px", color: "var(--t2)", lineHeight: 1.7, listStyleType: "disc" }}>
            <li>
              <strong>Supabase Inc.:</strong> Secure PostgreSQL cloud database hosting with encrypted storage and Row Level Security isolation.
            </li>
            <li>
              <strong>Cloudflare Inc.:</strong> Cloudflare Turnstile for privacy-preserving verification that visitors are human without visual CAPTCHAs.
            </li>
            <li>
              <strong>Upstash Inc.:</strong> Distributed serverless Redis for temporary rate-limiting counters.
            </li>
            <li>
              <strong>Vercel Inc.:</strong> Application edge hosting and serverless compute infrastructure.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
            5. Retention &amp; Erasure
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>
            We retain your waitlist contact information only for the duration required to communicate founding batch releases
            or until you request deletion. You may withdraw your consent or request permanent deletion of your phone number
            and survey responses at any time. Upon receiving your deletion request, your record is purged from our database.
          </p>
        </section>

        <section style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
            6. Your Rights &amp; Contact Information
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6, marginBottom: "12px" }}>
            Under applicable data protection laws, including India&rsquo;s Digital Personal Data Protection Act framework,
            you have the right to access, verify, correct, or request erasure of your personal data.
          </p>
          <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>
            To exercise your rights or submit a privacy inquiry, please contact our team at:{" "}
            <a href={`mailto:${contactEmail}`} style={{ color: "var(--accent, #3b82f6)", textDecoration: "underline" }}>
              {contactEmail}
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
