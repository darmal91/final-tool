export type SectionType = "hero" | "services" | "reviews" | "cta";

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaHref: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface ServicesContent {
  heading: string;
  subheading: string;
  services: Service[];
}

export interface Review {
  name: string;
  role: string;
  body: string;
  rating: number;
}

export interface ReviewsContent {
  heading: string;
  reviews: Review[];
}

export interface CTAContent {
  heading: string;
  subheading: string;
  buttonText: string;
  buttonHref: string;
}

export type SectionContent = HeroContent | ServicesContent | ReviewsContent | CTAContent;

export interface Section {
  id: string;
  type: SectionType;
  content: SectionContent;
}
