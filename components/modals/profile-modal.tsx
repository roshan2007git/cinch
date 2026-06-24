"use client";

import { useState } from "react";

import Modal from "@/components/ui/modal";
import { useModalStore } from "../../lib/stores/modal-store";

export default function ProfileModal() {
  const {
    profileOpen,
    closeProfile,
  } = useModalStore();

  const [tab, setTab] =
    useState<
      "account" |
      "measurements" |
      "designs"
    >("account");

  return (
    <Modal
      open={profileOpen}
      onClose={closeProfile}
    >
      <div className="flex gap-4 border-b border-[#E8E4DC] mb-8">
        {[
          "account",
          "measurements",
          "designs",
        ].map((item) => (
          <button
            key={item}
            onClick={() =>
              setTab(
                item as any
              )
            }
            className={`pb-4 capitalize ${
              tab === item
                ? "border-b border-[#C4974A]"
                : ""
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "account" && (
        <div>
          <h2 className="font-heading text-4xl mb-8">
            Account Information
          </h2>

          <div className="space-y-4">
            <input
              placeholder="Full Name"
              className="w-full border p-4"
            />

            <input
              placeholder="Email"
              className="w-full border p-4"
            />

            <input
              placeholder="Phone Number"
              className="w-full border p-4"
            />
          </div>

          <button className="mt-6 bg-[#C4974A] text-white px-6 py-3">
            Save Changes
          </button>
        </div>
      )}

      {tab === "measurements" && (
        <div>
          <h2 className="font-heading text-4xl mb-8">
            Measurements
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Height (cm)"
              className="border p-4"
            />

            <input
              placeholder="Weight (kg)"
              className="border p-4"
            />

            <input
              placeholder="Chest"
              className="border p-4"
            />

            <input
              placeholder="Waist"
              className="border p-4"
            />

            <input
              placeholder="Hips"
              className="border p-4"
            />

            <input
              placeholder="Shoulder Width"
              className="border p-4"
            />

            <input
              placeholder="Sleeve Length"
              className="border p-4"
            />

            <input
              placeholder="Inseam"
              className="border p-4"
            />
          </div>

          <button className="mt-6 bg-[#C4974A] text-white px-6 py-3">
            Save Measurements
          </button>
        </div>
      )}

      {tab === "designs" && (
        <div>
          <h2 className="font-heading text-4xl mb-8">
            Saved Designs
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="border border-[#E8E4DC]"
                >
                  <div className="h-48 bg-[#E8E4DC]" />

                  <div className="p-4">
                    Design {item}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}