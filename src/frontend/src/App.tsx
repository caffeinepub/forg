import { Community } from "@/components/Community";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { HowToBuy } from "@/components/HowToBuy";
import { Navbar } from "@/components/Navbar";
import { PFPGenerator } from "@/components/PFPGenerator";
import { PondEcosystem } from "@/components/PondEcosystem";
import { Roadmap } from "@/components/Roadmap";
import { Tokenomics } from "@/components/Tokenomics";
import { Toaster } from "@/components/ui/sonner";
import { useRegisterVisit } from "@/hooks/useQueries";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const queryClient = new QueryClient();

function AppContent() {
  const registerVisit = useRegisterVisit();
  const mutateRef = useRef(registerVisit.mutate);

  useEffect(() => {
    mutateRef.current();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <PondEcosystem />
        <PFPGenerator />
        <Tokenomics />
        <HowToBuy />
        <Roadmap />
        <Community />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
