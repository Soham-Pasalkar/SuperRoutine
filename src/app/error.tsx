"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/sections/Footer";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely without exposing user/sensitive data
    console.error("Application error boundary caught error:", error.message);
  }, [error]);

  return (
    <div className="sec-l min-h-screen flex flex-col justify-between">
      <Header />
      <main
        id="main-content"
        className="wrap narrow flex flex-col items-center justify-center text-center my-auto"
        style={{ padding: "100px 22px 120px" }}
      >
        <p className="eyebrow" style={{ marginBottom: "16px" }}>
          <b>ERROR</b> / UNEXPECTED ISSUE
        </p>
        <h1
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            marginBottom: "16px",
            letterSpacing: "-0.03em",
          }}
        >
          Something Went Wrong
        </h1>
        <p
          className="lead"
          style={{
            fontSize: "1.05rem",
            color: "var(--t2)",
            marginBottom: "32px",
            maxWidth: "480px",
            lineHeight: 1.6,
          }}
        >
          An unexpected error occurred while loading this page. Please try again or return to the homepage.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button type="button" onClick={() => reset()} className="btn">
            Try Again
          </button>
          <Link href="/" className="btn ghost">
            Return to Homepage
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
