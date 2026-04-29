import { ServicesContent } from "@/lib/types";

export default function ServicesSection({ content }: { content: ServicesContent }) {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{content.heading}</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">{content.subheading}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.services.map((service, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl p-6 space-y-3 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <span className="text-3xl">{service.icon}</span>
              <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
