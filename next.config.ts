import type { NextConfig } from "next";

function getSecurityHeaders(isProd: boolean) {
  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} https://challenges.cloudflare.com https://app.posthog.com https://us.i.posthog.com https://eu.i.posthog.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://challenges.cloudflare.com",
    "font-src 'self' data:",
    "connect-src 'self' https://challenges.cloudflare.com https://app.posthog.com https://us.i.posthog.com https://eu.i.posthog.com",
    "frame-src https://challenges.cloudflare.com",
    "worker-src 'self' blob:",
    "child-src 'self' blob: https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  const cspHeader = cspDirectives.join("; ");

  return [
    {
      key: "Content-Security-Policy",
      value: cspHeader,
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    {
      key: "X-Frame-Options",
      value: "DENY",
    },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    },
    ...(isProd
      ? [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ]
      : []),
  ];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    return [
      {
        source: "/:path*",
        headers: getSecurityHeaders(isProd),
      },
    ];
  },
};

export default nextConfig;
