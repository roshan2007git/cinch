"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { useModalStore } from "../../lib/stores/modal-store";

const plans = [
  {
    name: "Explore",
    subtitle: "Free",
    price: "₹0",
    description:
      "Perfect for discovering custom fashion and experimenting with designs.",
    features: [
      "5 AI generations/month",
      "Up to 3 variations",
      "3 saved projects",
      "Standard tailor access",
      "Standard turnaround",
    ],
    featured: false,
  },
  {
    name: "Atelier",
    subtitle: "Most Popular",
    price: "₹399",
    yearly: "₹2,999/year",
    description:
      "For fashion lovers who regularly create custom pieces.",
    features: [
      "Unlimited generations",
      "5 variations per design",
      "Unlimited projects",
      "Premium tailor access",
      "Priority turnaround",
      "1 free alteration",
      "Fit guarantee",
    ],
    featured: true,
  },
  {
    name: "Label",
    subtitle: "Professional",
    price: "₹1,499",
    yearly: "₹11,999/year",
    description:
      "For creators, boutiques, and brands producing at scale.",
    features: [
      "Everything in Atelier",
      "Wholesale pricing",
      "Dedicated account manager",
      "White-label shipping",
      "Priority QC",
      "Unlimited alterations",
    ],
    featured: false,
  },
];

export default function PricingSection() {
  const { openAI } = useModalStore();

  return (
    <section
      id="pricing"
      className="bg-[#FAF8F5] py-32"
    >
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
          className="text-center mb-20"
        >
          <p className="text-[#C4974A] text-xs tracking-[0.4em] uppercase mb-6">
            Pricing
          </p>

          <h2 className="font-heading text-5xl md:text-6xl text-[#1A1A1A]">
            Pick your plan.
            <br />
            Wear your vision.
          </h2>

          <p className="text-[#8A8880] mt-8 max-w-xl mx-auto">
            Start free and upgrade whenever you're ready.
            No commitments. No hidden fees.
          </p>

          <button
            onClick={openAI}
            className="mt-10 inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-8 py-4"
          >
            Start Designing
            <ArrowRight size={18} />
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
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
              className={`
                relative
                border
                p-10
                transition-all
                duration-500

                ${
                  plan.featured
                    ? "border-[#C4974A] bg-white scale-[1.03]"
                    : "border-[#E8E4DC] bg-white"
                }
              `}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-8">
                  <span className="bg-[#C4974A] text-white text-xs uppercase tracking-[0.15em] px-4 py-2">
                    Most Popular
                  </span>
                </div>
              )}

              <p className="text-[#C4974A] text-xs tracking-[0.3em] uppercase">
                {plan.subtitle}
              </p>

              <h3 className="font-heading text-5xl mt-4">
                {plan.name}
              </h3>

              <div className="mt-8">
                <span className="font-heading text-6xl">
                  {plan.price}
                </span>

                <span className="text-[#8A8880] ml-2">
                  /month
                </span>
              </div>

              {plan.yearly && (
                <p className="mt-3 text-[#8A8880]">
                  {plan.yearly}
                </p>
              )}

              <p className="mt-8 text-[#8A8880] leading-7">
                {plan.description}
              </p>

              <div className="w-full h-px bg-[#E8E4DC] my-8" />

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-[#1A1A1A]"
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={openAI}
                className={`
                  w-full
                  mt-10
                  py-4
                  transition

                  ${
                    plan.featured
                      ? "bg-[#C4974A] text-white"
                      : "border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
                  }
                `}
              >
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}