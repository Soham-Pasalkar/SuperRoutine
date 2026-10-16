import React from "react";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/sections/Footer";
import { clientEnv } from "@/lib/env";

export const metadata = {
  title: "Privacy Policy — Super Routine",
  description:
    "Interim draft privacy policy describing actual data collection for the Super Routine founding waitlist.",
};

export default function PrivacyPage() {
  const contactEmail = clientEnv.NEXT_PUBLIC_CONTACT_EMAIL;

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
        <p className="lead" style={{ fontSize: "1.05rem", color: "var(--t2)", marginBottom: "32px", lineHeight: 1.6 }}>
          <em>Notice:</em> This is an interim draft privacy statement describing the actual data collection and processing
          for the Super Routine pre-launch waitlist. It reflects current technical implementation and has not yet undergone
          formal legal review. A finalized commercial privacy policy will be published prior to full operations.
        </p>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>
            1. Information We Collect
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6, marginBottom: "12px" }}>
            Data collection during this pre-launch phase is limited to information submitted via the waitlist form:
          </p>
          <ul style={{ paddingLeft: "20px", color: "var(--t2)", lineHeight: 1.7, listStyleType: "disc" }}>
            <li>
              <strong>First Name:</strong> To address you in waitlist communications and reserve your queue slot.
            </li>
            <li>
              <strong>WhatsApp Mobile Number (+91 format):</strong> Required to verify your queue slot and deliver batch
              availability alerts, status updates, and private founding-cohort invitations via WhatsApp or SMS.
            </li>
            <li>
              <strong>Survey Selections:</strong> Your preferences for packaging format, custom ingredients, and target price ranges.
              These answers are stored linked to your waitlist entry in our database to help us evaluate formulation demand for your profile.
            </li>
            <li>
              <strong>Consent Record:</strong> A boolean opt-in confirmation, timestamp, and version identifier recorded when you check
              the consent box.
            </li>
            <li>
              <strong>Campaign Attribution (UTM):</strong> Optional query parameters (source, medium, campaign) if present in the link used to visit the site.
            </li>
            <li>
              <strong>Salted IP Hash:</strong> A one-way SHA-256 hash of your network IP address combined with a private server-side salt.
              This hash is used solely for sliding-window rate limiting to prevent form abuse; raw IP addresses are not stored in our application database.
            </li>
            <li>
              <strong>Browser User-Agent:</strong> Technical browser header captured with the submission for compatibility and troubleshooting.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>
            2. Data We Do Not Collect
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>
            Super Routine does not collect or store government identification numbers (such as Aadhaar, PAN, or passport numbers),
            payment card credentials, bank accounts, biometric information, or health/medical records.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>
            3. How Information Is Used
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6, marginBottom: "12px" }}>
            Information collected through the waitlist form is used for the following operational purposes:
          </p>
          <ul style={{ paddingLeft: "20px", color: "var(--t2)", lineHeight: 1.7, listStyleType: "disc" }}>
            <li>Allocating and maintaining your verified waitlist queue position.</li>
            <li>Sending queue status updates and priority drop notifications via WhatsApp or SMS.</li>
            <li>Evaluating aggregated and individual formulation preferences to plan production batches.</li>
            <li>Protecting the website from automated spam, bot activity, and repeated abuse.</li>
          </ul>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>
            4. Infrastructure &amp; Service Providers
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6, marginBottom: "12px" }}>
            The application relies on third-party cloud infrastructure to operate. Each service processes data according to its technical function:
          </p>
          <ul style={{ paddingLeft: "20px", color: "var(--t2)", lineHeight: 1.7, listStyleType: "disc" }}>
            <li>
              <strong>Supabase Inc.:</strong> Cloud PostgreSQL database hosting where waitlist entries (first name, phone number, consent record,
              survey answers, salted IP hash, and user-agent) are stored with Row Level Security enabled.
            </li>
            <li>
              <strong>Cloudflare Inc.:</strong> Cloudflare Turnstile token validation to verify that form submissions come from human users without CAPTCHA challenges.
            </li>
            <li>
              <strong>Upstash Inc.:</strong> Distributed serverless Redis for temporary rate-limiting counters keyed by salted IP hashes.
            </li>
            <li>
              <strong>Vercel Inc.:</strong> Application edge hosting and serverless compute infrastructure. Standard network transmission logs
              (such as HTTP request headers and network IP addresses) may be processed at the routing layer in accordance with standard infrastructure logging.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>
            5. Data Retention &amp; Removal
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6, marginBottom: "10px" }}>
            A formal statutory retention schedule has not yet been finalized by legal counsel. Waitlist records are currently retained
            for the period required to organize founding-cohort releases or until a participant requests removal.
          </p>
          <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>
            Participants may request removal from the waitlist at any time. Upon receiving a verified deletion request for a phone number,
            the corresponding entry is permanently removed from the application database via our administrative deletion capability.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>
            6. Participant Inquiries &amp; Contact
          </h2>
          <p style={{ color: "var(--t2)", lineHeight: 1.6, marginBottom: "10px" }}>
            Participants may inquire about their waitlist entry, request updates to their information, or request removal from the waitlist.
          </p>
          {contactEmail ? (
            <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>
              Contact email:{" "}
              <a href={`mailto:${contactEmail}`} style={{ color: "var(--accent, #3b82f6)", textDecoration: "underline" }}>
                {contactEmail}
              </a>
            </p>
          ) : (
            <p style={{ color: "var(--t2)", lineHeight: 1.6 }}>
              <em>Note:</em> A dedicated privacy mailbox has not yet been designated in the site configuration.
              Inquiries or removal requests may be communicated through official brand channels or directed to the site operators
              when you receive waitlist updates on WhatsApp.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
