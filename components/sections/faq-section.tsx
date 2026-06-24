"use client";

import Accordion from "@/components/ui/accordion";

const faqs = [
  {
    title:
      "How does the AI design process work?",
    content:
      "Describe your outfit or upload inspiration images. Our AI generates multiple design concepts for you to review before selecting your favourite.",
  },
  {
    title:
      "How do I submit measurements?",
    content:
      "You can enter them manually, use our measurement guide, or visit a partner tailor for assistance.",
  },
  {
    title:
      "How long does an order take?",
    content:
      "Typical delivery is 10–14 days depending on complexity and fabric sourcing.",
  },
  {
    title:
      "Can I make changes after ordering?",
    content:
      "Minor adjustments can be requested shortly after ordering, and alteration benefits depend on your plan.",
  },
  {
    title:
      "Is my design private?",
    content:
      "Yes. Designs are treated as personal projects and shared only when needed to fulfil an order.",
  },
];

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="bg-white py-32"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#C4974A] text-xs tracking-[0.4em] uppercase mb-6">
            FAQ
          </p>

          <h2 className="font-heading text-5xl md:text-6xl">
            Questions?
            <br />
            We've got answers.
          </h2>
        </div>

        <Accordion items={faqs} />
      </div>
    </section>
  );
}