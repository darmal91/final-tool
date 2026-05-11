export interface HeroContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaHref: string;
  trustBadges: string[];
  heroImageId?: string;
  imageUrl?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export interface ServicesContent {
  heading: string;
  subheading: string;
  services: ServiceItem[];
}

export interface ReviewItem {
  name: string;
  role: string;
  body: string;
  rating: number;
}

export interface ReviewsContent {
  heading: string;
  subheading: string;
  reviews: ReviewItem[];
}

export interface CTAContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  buttonText: string;
  buttonHref: string;
  microcopy: string;
}

export type SectionContent =
  | HeroContent
  | ServicesContent
  | ReviewsContent
  | CTAContent;
