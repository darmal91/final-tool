import { Section } from "@/lib/types";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import CTASection from "@/components/sections/CTASection";
import { HeroContent, ServicesContent, ReviewsContent, CTAContent } from "@/lib/types";

export default function SectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case "hero":
      return <HeroSection content={section.content as HeroContent} />;
    case "services":
      return <ServicesSection content={section.content as ServicesContent} />;
    case "reviews":
      return <ReviewsSection content={section.content as ReviewsContent} />;
    case "cta":
      return <CTASection content={section.content as CTAContent} />;
  }
}
