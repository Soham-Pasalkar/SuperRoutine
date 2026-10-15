import { HEADER_CTA_LABEL } from "@/lib/content";

export default function Home() {
  return (
    <div className="sec-l min-h-screen">
      <header className="pill">
        <a className="brand" href="#main-content" aria-label="Super Routine">
          <picture>
            <source srcSet="/images/logo.avif" type="image/avif" />
            <source srcSet="/images/logo.webp" type="image/webp" />
            <img src="/images/logo.webp" alt="Super Routine" width={140} height={58} />
          </picture>
        </a>
        <a className="btn sm" href="#join">
          {HEADER_CTA_LABEL}
        </a>
      </header>
      <main id="main-content">
        <section className="hero sec-l">
          <div className="wrap hero-grid">
            <div>
              <p className="eyebrow">
                <b>00</b> / SETUP COMPLETE
              </p>
              <h1>
                <span className="h1a">Complete Day &amp; Night Supplement System.</span>
              </h1>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
