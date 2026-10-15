import React from "react";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/sections/Footer";

export default function TermsPage() {
  return (
    <div className="sec-l min-h-screen">
      <Header />
      <main className="wrap narrow" style={{ padding: "80px 22px" }}>
        <p className="eyebrow">
          <b>LEGAL</b> / TERMS
        </p>
        <h1>Terms of Service</h1>
        <p className="lead">
          [TODO: Legal Review Required] By participating in the Super Routine founding waitlist, you
          agree that access to drops is subject to availability and batch releases.
        </p>
      </main>
      <Footer />
    </div>
  );
}
