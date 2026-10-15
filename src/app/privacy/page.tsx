import React from "react";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/sections/Footer";

export default function PrivacyPage() {
  return (
    <div className="sec-l min-h-screen">
      <Header />
      <main className="wrap narrow" style={{ padding: "80px 22px" }}>
        <p className="eyebrow">
          <b>LEGAL</b> / PRIVACY
        </p>
        <h1>Privacy Policy</h1>
        <p className="lead">
          [TODO: Legal Review Required] Super Routine is committed to protecting your privacy. We only
          collect your first name and WhatsApp phone number with your explicit consent to notify you
          about founding drops and to shape formulation.
        </p>
      </main>
      <Footer />
    </div>
  );
}
