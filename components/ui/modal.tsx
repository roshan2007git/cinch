"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  children,
}: ModalProps) {
  useEffect(() => {
    function handleEscape(
      e: KeyboardEvent
    ) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      document.body.style.overflow =
        "hidden";

      window.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-999 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          relative
          bg-white
          w-full
          max-w-4xl
          rounded-none
          md:rounded-xl
          p-8
          max-h-[90vh]
          overflow-y-auto
        "
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6"
        >
          <X size={24} />
        </button>

        {children}
      </div>
    </div>
  );
}