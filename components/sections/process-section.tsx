"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Describe",
    description:
      "Tell us about your dream outfit or upload inspiration images.",
  },
  {
    number: "02",
    title: "Generate",
    description:
      "AI creates multiple bespoke design concepts tailored to your vision.",
  },
  {
    number: "03",
    title: "Measure",
    description:
      "Provide your measurements to ensure a perfect fit.",
  },
  {
    number: "04",
    title: "Delivered",
    description:
      "An expert tailor crafts and ships your custom piece.",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="bg-white py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <p className="text-[#C4974A] text-xs tracking-[0.4em] uppercase mb-6">
            How It Works
          </p>

          <h2 className="font-heading text-5xl md:text-6xl text-[#1A1A1A]">
            From idea to wardrobe.
          </h2>

          <div className="w-20 h-px bg-[#C4974A] mx-auto mt-8" />
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.15,
              }}
              className="border border-[#E8E4DC] p-10 group hover:border-[#C4974A] transition-colors"
            >
              <span className="text-[#C4974A] text-sm tracking-[0.2em]">
                {step.number}
              </span>

              <h3 className="font-heading text-4xl mt-4 mb-6">
                {step.title}
              </h3>

              <p className="text-[#8A8880] leading-7">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}