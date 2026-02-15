import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { TechStack } from "@/components/TechStack";
import { DemoSection } from "@/components/DemoSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main>
        <Hero />
        <TechStack />
        <ProblemSection />
        <SolutionSection />
        <Features />
        <HowItWorks />
        <DemoSection />
      </main>
      <Footer />
    </div>
  );
}
