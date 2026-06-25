"use client";

import { useState, useRef } from "react";
import { Sparkles, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import { useModalStore } from "../../lib/stores/modal-store";

interface Variation {
  _id: string;
  name: string;
  description: string;
  estimatedMeasurements: Record<string, string>;
}

interface GenerateResult {
  orderId: string;
  variations: Variation[];
  remaining: number | null;
}

// TODO: replace with real auth — reads userId from localStorage for now
function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userId");
}

export default function AIStudioModal() {
  const { aiOpen, closeAI } = useModalStore();

  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleClose() {
    closeAI();
    // Reset state after close animation
    setTimeout(() => {
      setPrompt("");
      setImages([]);
      setResult(null);
      setSelectedId(null);
    }, 300);
  }

  async function handleGenerate() {
    if (!prompt.trim()) {
      toast.error("Please describe your design first.");
      return;
    }

    const userId = getUserId();
    if (!userId) {
      toast.error("Please log in first. (Set userId in localStorage for now.)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          prompt,
          // Image upload to cloud storage not yet implemented — pass empty for now
          inspirationImageUrls: [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to generate designs.");
        return;
      }

      setResult(data as GenerateResult);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(variationId: string) {
    if (!result) return;
    const userId = getUserId();
    if (!userId) return;

    setSelecting(true);
    setSelectedId(variationId);
    try {
      const res = await fetch(`/api/orders/${result.orderId}/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ variationId }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to select design.");
        setSelectedId(null);
      } else {
        toast.success("Design selected! A quote will be prepared for you.");
        handleClose();
      }
    } catch {
      toast.error("Network error. Please try again.");
      setSelectedId(null);
    } finally {
      setSelecting(false);
    }
  }

  return (
    <Modal open={aiOpen} onClose={handleClose}>
      {!result ? (
        <div>
          <div className="text-center mb-10">
            <Sparkles className="mx-auto text-[#C4974A]" size={40} />
            <h2 className="font-heading text-5xl mt-4">AI Design Studio</h2>
            <p className="mt-4 text-[#8A8880]">
              Describe your dream outfit and explore custom concepts.
            </p>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            placeholder="Example: A minimalist ivory evening dress with structured shoulders and a flowing silhouette."
            className="w-full border border-[#E8E4DC] p-5 resize-none"
          />

          <div
            className="mt-6 border-2 border-dashed border-[#E8E4DC] p-12 text-center cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="mx-auto text-[#C4974A]" size={32} />
            <p className="mt-4 text-[#8A8880]">
              {images.length > 0
                ? `${images.length} image${images.length > 1 ? "s" : ""} selected`
                : "Upload inspiration images"}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => setImages(Array.from(e.target.files ?? []))}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-8 bg-[#1A1A1A] text-white py-4 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Generating…" : "Generate Concepts"}
          </button>
        </div>
      ) : (
        <div>
          <h2 className="font-heading text-5xl mb-3">Design Concepts</h2>
          <p className="text-[#8A8880] mb-10">Generated concepts based on your vision.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {result.variations.map((variation) => (
              <div
                key={variation._id}
                className="border border-[#E8E4DC] overflow-hidden group"
              >
                <div className="h-64 bg-[#E8E4DC] transition group-hover:scale-105" />

                <div className="p-5">
                  <h3 className="font-heading text-2xl">{variation.name}</h3>
                  <p className="mt-2 text-sm text-[#8A8880] leading-6">
                    {variation.description}
                  </p>

                  {Object.keys(variation.estimatedMeasurements).length > 0 && (
                    <ul className="mt-3 text-xs text-[#8A8880] space-y-1">
                      {Object.entries(variation.estimatedMeasurements).map(([k, v]) => (
                        <li key={k}>
                          <span className="capitalize">{k}</span>: {v}
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    onClick={() => handleSelect(variation._id)}
                    disabled={selecting}
                    className="mt-4 text-[#C4974A] disabled:opacity-50"
                  >
                    {selecting && selectedId === variation._id
                      ? "Selecting…"
                      : "Select Design →"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setResult(null)}
            className="mt-8 text-sm text-[#8A8880] underline"
          >
            ← Start over
          </button>
        </div>
      )}
    </Modal>
  );
}
