"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-[#FAF8F5] py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left */}
          <motion.div
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
              duration: 0.7,
            }}
          >
            <p className="text-[#C4974A] text-xs tracking-[0.4em] uppercase mb-6">
              About Cinch
            </p>

            <h2 className="font-heading text-5xl md:text-6xl leading-tight text-[#1A1A1A]">
              Fashion made for you,
              not the other way around.
            </h2>

            <div className="w-20 h-px bg-[#C4974A] my-8" />

            <div className="space-y-6 text-[#8A8880] leading-8">
              <p>
                Cinch was born from a simple frustration:
                great clothing is expensive, ill-fitting
                clothes are everywhere, and finding a
                skilled tailor shouldn’t be this difficult.
              </p>

              <p>
                We combine AI-assisted design with a
                curated network of expert tailors,
                allowing anyone to create custom clothing
                tailored to their vision.
              </p>

              <p>
                From inspiration to delivery, every step
                is designed around individuality,
                craftsmanship, and fit.
              </p>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
            }}
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 border border-[#C4974A] w-full h-full" />

              {/* TODO: replace with <Image src="/brand-photo.jpg" ... /> once uploaded */}
              <div className="relative bg-[#1A1A1A] h-[520px] flex flex-col items-center justify-center gap-6">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M5 19L19 5" stroke="#C4974A" strokeWidth="1.5" />
                  <circle cx="19" cy="5" r="3" fill="#C4974A" />
                </svg>
                <span className="font-heading text-5xl tracking-[0.25em] text-white">CINCH</span>
                <p className="text-[#8A8880] text-sm tracking-widest uppercase">Tailored by AI. Made by hand.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            {
              value: "2,400+",
              label: "Designs Created",
            },
            {
              value: "180+",
              label: "Tailors",
            },
            {
              value: "4.8★",
              label: "Average Rating",
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              className="border border-[#E8E4DC] p-10"
            >
              <h3 className="font-heading text-5xl text-[#1A1A1A]">
                {item.value}
              </h3>

              <p className="mt-3 text-[#8A8880]">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}