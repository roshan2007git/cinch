"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { useModalStore } from "../../lib/stores/modal-store";

export default function HeroSection() {
  const { openAI } = useModalStore();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAF8F5]">
      {/* Fabric Texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, #1A1A1A 1px, transparent 0)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Decorative Gold Lines */}
      <div className="absolute top-0 left-0 w-full">
        <div className="h-px bg-[#C4974A]/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[#C4974A] text-xs tracking-[0.45em] uppercase mb-8"
        >
          Bespoke Fashion Reimagined
        </motion.p>

        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.1,
          }}
          className="font-heading text-[72px] md:text-[120px] leading-none tracking-[0.15em] text-[#1A1A1A]"
        >
          CINCH
        </motion.h1>

        {/* Gold Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 1,
            delay: 0.5,
          }}
          className="w-24 h-px bg-[#C4974A] mx-auto my-10 origin-center"
        />

        {/* Tagline */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.4,
          }}
          className="font-heading text-3xl md:text-5xl text-[#1A1A1A] max-w-4xl mx-auto leading-tight"
        >
          Your design.
          <br />
          Your fit.
          <br />
          Your tailor.
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
          }}
          className="max-w-2xl mx-auto mt-8 text-[#8A8880] text-lg leading-relaxed"
        >
          Describe your dream outfit, explore AI-generated
          concepts, and have it crafted by expert tailors
          across India.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.8,
          }}
          className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
        >
          <button
            onClick={openAI}
            className="
              bg-[#1A1A1A]
              text-white
              px-8
              py-4
              flex
              items-center
              justify-center
              gap-2
              hover:opacity-90
              transition
            "
          >
            Design Something
            <ArrowRight size={18} />
          </button>

          <a
            href="#pricing"
            className="
              border
              border-[#1A1A1A]
              px-8
              py-4
              hover:bg-[#1A1A1A]
              hover:text-white
              transition
            "
          >
            See Pricing
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-14 bg-[#C4974A]" />
      </motion.div>
    </section>
  );
}