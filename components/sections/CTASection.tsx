import { CTAContent } from "@/lib/types";

export default function CTASection({ content }: { content: CTAContent }) {
  return (
    <section className="bg-indigo-600 py-20 px-6">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">{content.heading}</h2>
        <p className="text-indigo-100 text-lg">{content.subheading}</p>
        <a
          href={content.buttonHref}
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-lg shadow-md"
        >
          {content.buttonText}
        </a>
      </div>
    </section>
  );
}
