import React from "react";
import { FOOTER_CONTENT } from "@/lib/content";
import { clientEnv } from "@/lib/env";

export function Footer() {
  const socials = [
    { name: "Instagram", url: clientEnv.NEXT_PUBLIC_INSTAGRAM },
    { name: "LinkedIn", url: clientEnv.NEXT_PUBLIC_LINKEDIN },
    { name: "WhatsApp", url: clientEnv.NEXT_PUBLIC_WHATSAPP },
    { name: "YouTube", url: clientEnv.NEXT_PUBLIC_YOUTUBE },
  ].filter((s) => Boolean(s.url));

  return (
    <footer className="sec-l" style={{ borderTop: "1px solid var(--line)" }}>
      <div className="wrap">
        <div className="fgrid">
          <div>
            <picture>
              <source srcSet="/images/logo.avif" type="image/avif" />
              <source srcSet="/images/logo.webp" type="image/webp" />
              <img
                className="full"
                src="/images/logo.webp"
                alt="Super Routine"
                width={200}
                height={84}
              />
            </picture>
            <p className="ftag">{FOOTER_CONTENT.tagline}</p>
          </div>
          {socials.length > 0 && (
            <nav className="socials" aria-label="Social media">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  className="soc"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                >
                  <span className="sr-only">{s.name}</span>
                </a>
              ))}
            </nav>
          )}
        </div>
        <div className="legal">
          <p>{FOOTER_CONTENT.copyright}</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
