"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import { useModalStore } from "../../lib/stores/modal-store";

interface Measurements {
  height: string;
  weight: string;
  chest: string;
  waist: string;
  hips: string;
  shoulderWidth: string;
  sleeveLength: string;
  inseam: string;
}

const emptyMeasurements: Measurements = {
  height: "",
  weight: "",
  chest: "",
  waist: "",
  hips: "",
  shoulderWidth: "",
  sleeveLength: "",
  inseam: "",
};

// TODO: replace with real auth
function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userId");
}

export default function ProfileModal() {
  const { profileOpen, closeProfile } = useModalStore();

  const [tab, setTab] = useState<"account" | "measurements" | "designs">("account");
  const [measurements, setMeasurements] = useState<Measurements>(emptyMeasurements);
  const [saving, setSaving] = useState(false);

  function setField(field: keyof Measurements, value: string) {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSaveMeasurements() {
    const userId = getUserId();
    if (!userId) {
      toast.error("Please log in first. (Set userId in localStorage for now.)");
      return;
    }

    // Convert non-empty strings to numbers; leave undefined if blank
    const payload = Object.fromEntries(
      Object.entries(measurements).map(([k, v]) => [
        k,
        v.trim() !== "" ? Number(v) : undefined,
      ])
    );

    setSaving(true);
    try {
      const res = await fetch("/api/measurements", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to save measurements.");
      } else {
        toast.success("Measurements saved!");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={profileOpen} onClose={closeProfile}>
      <div className="flex gap-4 border-b border-[#E8E4DC] mb-8">
        {(["account", "measurements", "designs"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`pb-4 capitalize ${
              tab === item ? "border-b border-[#C4974A]" : ""
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "account" && (
        <div>
          <h2 className="font-heading text-4xl mb-8">Account Information</h2>

          <div className="space-y-4">
            <input placeholder="Full Name" className="w-full border p-4" />
            <input placeholder="Email" className="w-full border p-4" />
            <input placeholder="Phone Number" className="w-full border p-4" />
          </div>

          <button className="mt-6 bg-[#C4974A] text-white px-6 py-3">
            Save Changes
          </button>
        </div>
      )}

      {tab === "measurements" && (
        <div>
          <h2 className="font-heading text-4xl mb-8">Measurements</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {(
              [
                ["height", "Height (cm)"],
                ["weight", "Weight (kg)"],
                ["chest", "Chest (cm)"],
                ["waist", "Waist (cm)"],
                ["hips", "Hips (cm)"],
                ["shoulderWidth", "Shoulder Width (cm)"],
                ["sleeveLength", "Sleeve Length (cm)"],
                ["inseam", "Inseam (cm)"],
              ] as [keyof Measurements, string][]
            ).map(([field, label]) => (
              <input
                key={field}
                type="number"
                placeholder={label}
                value={measurements[field]}
                onChange={(e) => setField(field, e.target.value)}
                className="border p-4"
              />
            ))}
          </div>

          <button
            onClick={handleSaveMeasurements}
            disabled={saving}
            className="mt-6 bg-[#C4974A] text-white px-6 py-3 flex items-center gap-2 disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Saving…" : "Save Measurements"}
          </button>
        </div>
      )}

      {tab === "designs" && (
        <div>
          <h2 className="font-heading text-4xl mb-8">Saved Designs</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border border-[#E8E4DC]">
                <div className="h-48 bg-[#E8E4DC]" />
                <div className="p-4">Design {item}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
