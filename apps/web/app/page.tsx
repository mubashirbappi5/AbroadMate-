import { HeroSection } from "@/features/home/HeroSection";
import { QuickEligibilityWidget } from "@/features/home/QuickEligibilityWidget";
import { CountryExplorerSection } from "@/features/home/CountryExplorerSection";
import { CostCalculatorPreview } from "@/features/home/CostCalculatorPreview";
import { RoadmapTimelinePreview } from "@/features/home/RoadmapTimelinePreview";
import { EthicalPledgeSection } from "@/features/home/EthicalPledgeSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <QuickEligibilityWidget />
      <CountryExplorerSection />
      <CostCalculatorPreview />
      <RoadmapTimelinePreview />
      <EthicalPledgeSection />
    </div>
  );
}
