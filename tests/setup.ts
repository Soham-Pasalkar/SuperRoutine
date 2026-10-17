import { vi } from "vitest";

// next/font/google is evaluated by Next.js at build time via compiler macros.
// In Node.js test environments, the package index is empty, so we provide
// a standard mock returning dummy font variables for test execution.
vi.mock("next/font/google", () => ({
  Inter: () => ({
    className: "font-inter",
    variable: "--font-inter",
    style: { fontFamily: "Inter" },
  }),
  Manrope: () => ({
    className: "font-manrope",
    variable: "--font-manrope",
    style: { fontFamily: "Manrope" },
  }),
}));
