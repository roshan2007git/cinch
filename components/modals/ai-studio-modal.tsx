"use client";

import { useState, useRef, useCallback } from "react";
import { Sparkles, Upload, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import Modal from "@/components/ui/modal";
import { useModalStore } from "../../lib/stores/modal-store";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface Variation {
  _id: string;
  name: string;
  description: string;
  estimatedMeasurements: Record<string, string>;
  estimatedPriceInr: number;
}

interface GenerateResult {
  orderId: string;
  variations: Variation[];
  remaining: number | null;
}

type Step = "generate" | "variations" | "payment" | "confirmed";

// ─── Stripe payment sub-form ──────────────────────────────────────────────────

function PaymentForm({
  orderId,
  quoteAmount,
  onSuccess,
}: {
  orderId: string;
  quoteAmount: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);

  async function handlePay() {
    if (!stripe || !elements) return;
    setPaying(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message ?? "Payment failed.");
        return;
      }

      if (!paymentIntent) {
        toast.error("No payment result returned.");
        return;
      }

      // Verify server-side — never trust frontend claim alone
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          cinchOrderId: orderId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Payment verification failed.");
        return;
      }

      onSuccess();
    } finally {
      setPaying(false);
    }
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-[#FAF8F5] border border-[#E8E4DC] text-center">
        <p className="text-[#8A8880] text-sm">Amount due</p>
        <p className="font-heading text-4xl mt-1">
          ₹{quoteAmount.toLocaleString("en-IN")}
        </p>
      </div>

      <PaymentElement />

      <button
        onClick={handlePay}
        disabled={!stripe || paying}
        className="w-full mt-6 bg-[#1A1A1A] text-white py-4 flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {paying && <Loader2 size={18} className="animate-spin" />}
        {paying ? "Processing…" : "Pay Now"}
      </button>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function AIStudioModal() {
  const { aiOpen, closeAI } = useModalStore();

  const [step, setStep] = useState<Step>("generate");
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [quote, setQuote] = useState<{ amount: number; currency: string } | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setStep("generate");
    setPrompt("");
    setImages([]);
    setResult(null);
    setSelectedId(null);
    setQuote(null);
    setClientSecret(null);
  }, []);

  function handleClose() {
    closeAI();
    setTimeout(reset, 300);
  }

  async function handleGenerate() {
    if (!prompt.trim()) {
      toast.error("Please describe your design first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // TODO: upload inspiration images and pass real URLs here instead of []
        body: JSON.stringify({ prompt, inspirationImageUrls: [] }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to generate designs.");
        return;
      }
      setResult(data as GenerateResult);
      setStep("variations");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(variationId: string) {
    if (!result) return;

    setSelecting(true);
    setSelectedId(variationId);
    try {
      const res = await fetch(`/api/orders/${result.orderId}/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variationId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to select design.");
        setSelectedId(null);
        return;
      }

      // Select route now returns quote immediately — go straight to payment
      const piRes = await fetch(`/api/payment/${result.orderId}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const piData = await piRes.json();
      if (!piRes.ok) {
        toast.error(piData.error ?? "Could not create payment.");
        setSelectedId(null);
        return;
      }

      setQuote(data.quote);
      setClientSecret(piData.clientSecret);
      setStep("payment");
    } catch {
      toast.error("Network error. Please try again.");
      setSelectedId(null);
    } finally {
      setSelecting(false);
    }
  }

  return (
    <Modal open={aiOpen} onClose={handleClose}>
      {/* ── Step 1: prompt ───────────────────────────────────────────────── */}
      {step === "generate" && (
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
      )}

      {/* ── Step 2: variation grid ────────────────────────────────────────── */}
      {step === "variations" && result && (
        <div>
          <h2 className="font-heading text-5xl mb-3">Design Concepts</h2>
          <p className="text-[#8A8880] mb-10">
            Generated concepts based on your vision. Select one to proceed.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {result.variations.map((variation) => (
              <div
                key={variation._id}
                className={`border overflow-hidden group transition ${
                  selectedId === variation._id
                    ? "border-[#C4974A]"
                    : "border-[#E8E4DC]"
                }`}
              >
                <div className="h-64 bg-[#E8E4DC] transition group-hover:scale-105" />
                <div className="p-5">
                  <h3 className="font-heading text-2xl">{variation.name}</h3>
                  <p className="mt-2 text-sm text-[#8A8880] leading-6">
                    {variation.description}
                  </p>
                  {Object.keys(variation.estimatedMeasurements).length > 0 && (
                    <ul className="mt-3 text-xs text-[#8A8880] space-y-1">
                      {Object.entries(variation.estimatedMeasurements).map(
                        ([k, v]) => (
                          <li key={k}>
                            <span className="capitalize">{k}</span>: {v}
                          </li>
                        )
                      )}
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
            onClick={() => setStep("generate")}
            className="mt-8 text-sm text-[#8A8880] underline"
          >
            ← Start over
          </button>
        </div>
      )}

      {/* ── Step 3: payment (Stripe Elements) ────────────────────────────── */}
      {step === "payment" && clientSecret && quote && result && (
        <div>
          <h2 className="font-heading text-4xl mb-2">Complete Your Order</h2>
          <p className="text-[#8A8880] mb-8">
            Enter your payment details to confirm the design.
          </p>

          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#C4974A",
                  fontFamily: "inherit",
                  borderRadius: "0px",
                },
              },
            }}
          >
            <PaymentForm
              orderId={result.orderId}
              quoteAmount={quote.amount}
              onSuccess={() => setStep("confirmed")}
            />
          </Elements>

          <button
            onClick={() => setStep("variations")}
            className="mt-4 text-sm text-[#8A8880] underline"
          >
            ← Back
          </button>
        </div>
      )}

      {/* ── Step 5: confirmed ─────────────────────────────────────────────── */}
      {step === "confirmed" && (
        <div className="text-center py-8">
          <CheckCircle className="mx-auto text-[#C4974A]" size={48} />
          <h2 className="font-heading text-4xl mt-6">Order Confirmed</h2>
          <p className="mt-4 text-[#8A8880] max-w-sm mx-auto leading-7">
            Payment received. Your custom garment is now in production. We'll
            keep you updated at every step.
          </p>
          <button
            onClick={handleClose}
            className="mt-10 bg-[#1A1A1A] text-white px-10 py-4"
          >
            Done
          </button>
        </div>
      )}
    </Modal>
  );
}
