import { HeroContent, ServicesContent, ReviewsContent, CTAContent, Section } from "./types";

export const defaultHero: HeroContent = {
  headline: "Grow Your Local Business Online",
  subheadline: "Professional websites built for local businesses — fast, affordable, and designed to convert.",
  ctaText: "Get Started",
  ctaHref: "#contact",
};

export const defaultServices: ServicesContent = {
  heading: "What We Offer",
  subheading: "Everything your local business needs to thrive online.",
  services: [
    { title: "Web Design", description: "Beautiful, mobile-first websites tailored to your brand.", icon: "🎨" },
    { title: "SEO", description: "Rank higher on Google and get found by local customers.", icon: "📈" },
    { title: "Reviews", description: "Manage and grow your online reputation effortlessly.", icon: "⭐" },
    { title: "Support", description: "Dedicated support whenever you need help.", icon: "🛠️" },
  ],
};

export const defaultReviews: ReviewsContent = {
  heading: "What Our Clients Say",
  reviews: [
    { name: "Maria Santos", role: "Owner, Santos Bakery", body: "Our website traffic tripled in just two months. Incredible results!", rating: 5 },
    { name: "James Okafor", role: "Owner, Okafor Plumbing", body: "Finally a website that actually brings in calls. Worth every penny.", rating: 5 },
    { name: "Linda Chow", role: "Owner, Chow's Garden Center", body: "The team made the whole process so easy. Highly recommend.", rating: 5 },
  ],
};

export const defaultCTA: CTAContent = {
  heading: "Ready to Grow Your Business?",
  subheading: "Let's build something great together. No contracts, no surprises.",
  buttonText: "Contact Us Today",
  buttonHref: "#contact",
};

export const defaultSections: Section[] = [
  { id: "section-1", type: "hero", content: defaultHero },
  { id: "section-2", type: "services", content: defaultServices },
  { id: "section-3", type: "reviews", content: defaultReviews },
  { id: "section-4", type: "cta", content: defaultCTA },
];
