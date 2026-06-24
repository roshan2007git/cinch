"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactSection() {
  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      toast.success(
        "Message received."
      );

      setLoading(false);
    }, 1000);
  }

  return (
    <section
      id="contact"
      className="bg-[#FAF8F5] py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <p className="text-[#C4974A] text-xs tracking-[0.4em] uppercase mb-6">
              Contact
            </p>

            <h2 className="font-heading text-5xl md:text-6xl leading-tight">
              We'd love to hear
              from you.
            </h2>

            <div className="mt-10 space-y-4 text-[#8A8880]">
              <p>
                hello@cinch.in
              </p>

              <p>
                +91 98765 43210
              </p>

              <p>
                Bengaluru,
                Karnataka,
                India
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              placeholder="Name"
              required
              className="w-full border border-[#E8E4DC] p-4 bg-transparent"
            />

            <input
              placeholder="Email"
              type="email"
              required
              className="w-full border border-[#E8E4DC] p-4 bg-transparent"
            />

            <textarea
              placeholder="Message"
              rows={6}
              required
              className="w-full border border-[#E8E4DC] p-4 bg-transparent"
            />

            <button
              disabled={loading}
              className="bg-[#C4974A] text-white px-8 py-4"
            >
              {loading
                ? "Sending..."
                : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}