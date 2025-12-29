import Header from "@/components/Header";
import Footer from "@/components/Footer";

import HeroSection from "@/components/home/HeroSection";
import WhoWeAre from "@/components/home/WhoWeAre";
import OngoingInitiatives from "@/components/home/OngoingInitiatives";
import CriticalCases from "@/components/home/CriticalCases";
import ImpactSection from "@/components/home/ImpactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <WhoWeAre />
      <OngoingInitiatives />
      <CriticalCases />
      <ImpactSection />
      <Footer />
    </div>
  );
};

export default Index;