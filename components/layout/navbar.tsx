"use client";

import { useState } from "react";
import { Menu, X, User } from "lucide-react";

import CinchLogo from "@/components/ui/cinch-logo";
import { useModalStore } from "../../lib/stores/modal-store";

const links = [
  {
    label: "About",
    href: "#about",
  },
  {
    label: "How It Works",
    href: "#process",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
  {
    label: "Contact",
    href: "#contact",
  },
  {
    label: "FAQ",
    href: "#faq",
  },
];

export default function Navbar() {
  const [open, setOpen] =
    useState(false);

  const { openProfile } =
    useModalStore();

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[rgba(250,248,245,0.92)] border-b border-[#E8E4DC]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <CinchLogo />

          <nav className="hidden lg:flex items-center gap-10">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm tracking-wide hover:text-[#C4974A] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={openProfile}
              className="w-10 h-10 border border-[#E8E4DC] rounded-full flex items-center justify-center hover:border-[#C4974A] transition-colors"
            >
              <User size={18} />
            </button>

            <button
              onClick={() =>
                setOpen(!open)
              }
              className="lg:hidden"
            >
              {open ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 bg-[#FAF8F5] z-40 pt-28 px-8 lg:hidden">
          <div className="flex flex-col gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() =>
                  setOpen(false)
                }
                className="font-heading text-4xl"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}