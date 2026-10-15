import React from "react";
import { Header } from "@/components/header/Header";
import { HeroSection } from "@/components/hero/HeroSection";
import { SuperRoutineSection } from "@/components/packs/SuperRoutineSection";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { BuildSection } from "@/components/sections/BuildSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { FoundingAccessSection } from "@/components/sections/FoundingAccessSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="sec-l min-h-screen">
      <Header />
      <main id="main-content">
        <HeroSection />
        <SuperRoutineSection />
        <ApproachSection />
        <BuildSection />
        <BenefitsSection />
        <FoundingAccessSection />
      </main>
      <Footer />
    </div>
  );
}
