"use client";

import { useState } from "react";
import { Sparkles, Upload } from "lucide-react";

import Modal from "@/components/ui/modal";
import { useModalStore } from "../../lib/stores/modal-store";

const mockDesigns = [
  "Modern Linen Dress",
  "Tailored Evening Gown",
  "Minimal Silk Co-ord",
  "Contemporary Fusion Wear",
  "Classic Structured Dress",
];

export default function AIStudioModal() {
  const { aiOpen, closeAI } =
    useModalStore();

  const [generated, setGenerated] =
    useState(false);

  const [prompt, setPrompt] =
    useState("");

  return (
    <Modal
      open={aiOpen}
      onClose={closeAI}
    >
      {!generated ? (
        <div>
          <div className="text-center mb-10">
            <Sparkles
              className="mx-auto text-[#C4974A]"
              size={40}
            />

            <h2 className="font-heading text-5xl mt-4">
              AI Design Studio
            </h2>

            <p className="mt-4 text-[#8A8880]">
              Describe your dream outfit and explore
              custom concepts.
            </p>
          </div>

          <textarea
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value)
            }
            rows={6}
            placeholder="Example: A minimalist ivory evening dress with structured shoulders and a flowing silhouette."
            className="w-full border border-[#E8E4DC] p-5 resize-none"
          />

          <div className="mt-6 border-2 border-dashed border-[#E8E4DC] p-12 text-center">
            <Upload
              className="mx-auto text-[#C4974A]"
              size={32}
            />

            <p className="mt-4 text-[#8A8880]">
              Upload inspiration images
            </p>
          </div>

          <button
            onClick={() =>
              setGenerated(true)
            }
            className="w-full mt-8 bg-[#1A1A1A] text-white py-4"
          >
            Generate Concepts
          </button>
        </div>
      ) : (
        <div>
          <h2 className="font-heading text-5xl mb-3">
            Design Concepts
          </h2>

          <p className="text-[#8A8880] mb-10">
            Generated concepts based on your vision.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {mockDesigns.map((design) => (
              <div
                key={design}
                className="
                  border
                  border-[#E8E4DC]
                  overflow-hidden
                  group
                "
              >
                <div
                  className="
                    h-64
                    bg-[#E8E4DC]
                    transition
                    group-hover:scale-105
                  "
                />

                <div className="p-5">
                  <h3 className="font-heading text-2xl">
                    {design}
                  </h3>

                  <button className="mt-4 text-[#C4974A]">
                    Select Design →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}