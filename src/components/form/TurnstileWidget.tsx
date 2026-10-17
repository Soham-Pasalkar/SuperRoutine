"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { clientEnv } from "@/lib/env";

interface TurnstileWidgetProps {
  onTokenChange: (token: string) => void;
  onStatusChange?: (
    status: "loading" | "ready" | "success" | "expired" | "error"
  ) => void;
  resetSignal?: number;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "error-callback"?: (error?: unknown) => void;
          "expired-callback"?: () => void;
          "timeout-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export function TurnstileWidget({
  onTokenChange,
  onStatusChange,
  resetSignal = 0,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [status, setStatus] = useState<
    "loading" | "ready" | "success" | "expired" | "error"
  >("loading");

  const isProduction = process.env.NODE_ENV === "production";
  const siteKey =
    clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    (isProduction ? "" : "1x00000000000000000000AA");

  const onTokenChangeRef = useRef(onTokenChange);
  const onStatusChangeRef = useRef(onStatusChange);

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
    onStatusChangeRef.current = onStatusChange;
  });

  // Check if window.turnstile was already loaded previously
  useEffect(() => {
    if (typeof window !== "undefined" && window.turnstile) {
      setScriptLoaded(true);
    }
  }, []);

  // Render or re-render widget
  useEffect(() => {
    if (
      !scriptLoaded ||
      typeof window === "undefined" ||
      !window.turnstile ||
      !containerRef.current
    ) {
      return;
    }

    // Clean up previous widget instance if exists
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // Ignore cleanup errors
      }
      widgetIdRef.current = null;
    }

    try {
      const id = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "dark",
        callback: (token: string) => {
          setStatus("success");
          onStatusChangeRef.current?.("success");
          onTokenChangeRef.current(token);
        },
        "expired-callback": () => {
          setStatus("expired");
          onStatusChangeRef.current?.("expired");
          onTokenChangeRef.current("");
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current);
          }
        },
        "error-callback": () => {
          setStatus("error");
          onStatusChangeRef.current?.("error");
          onTokenChangeRef.current("");
        },
      });

      widgetIdRef.current = id;
      setStatus("ready");
      onStatusChangeRef.current?.("ready");
    } catch {
      setStatus("error");
      onStatusChangeRef.current?.("error");
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [scriptLoaded, siteKey, resetSignal]);

  return (
    <div
      style={{
        margin: "14px 0 6px",
        minHeight: "65px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      <div
        ref={containerRef}
        aria-label="Cloudflare Turnstile Verification"
        role="region"
      />
      {status === "error" && (
        <p
          role="alert"
          style={{
            color: "var(--err, #ef4444)",
            fontSize: "0.8rem",
            marginTop: "6px",
          }}
        >
          Security check error. Please refresh the page to retry.
        </p>
      )}
      {status === "expired" && (
        <p
          style={{
            color: "var(--t2, #a1a1aa)",
            fontSize: "0.8rem",
            marginTop: "6px",
          }}
        >
          Security check expired. Refreshing verification...
        </p>
      )}
    </div>
  );
}
