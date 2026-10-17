import React from "react";
import Link from "next/link";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/sections/Footer";

export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="sec-l min-h-screen flex flex-col justify-between">
      <Header />
      <main
        id="main-content"
        className="wrap narrow flex flex-col items-center justify-center text-center my-auto"
        style={{ padding: "100px 22px 120px" }}
      >
        <p className="eyebrow" style={{ marginBottom: "16px" }}>
          <b>404</b> / NOT FOUND
        </p>
        <h1
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            marginBottom: "16px",
            letterSpacing: "-0.03em",
          }}
        >
          Page Not Found
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
          The page you requested could not be found. It may have been moved or does not exist.
        </p>
        <Link href="/" className="btn">
          Return to Homepage
        </Link>
      </main>
      <Footer />
    </div>
  );
}
