import { HeroContent } from "@/lib/types";

export default function HeroSection({ content }: { content: HeroContent }) {
  return (
    <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-24 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
          {content.headline}
        </h1>
        <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto">
          {content.subheadline}
        </p>
        <a
          href={content.ctaHref}
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-lg shadow-md"
        >
          {content.ctaText}
        </a>
      </div>
    </section>
  );
}
