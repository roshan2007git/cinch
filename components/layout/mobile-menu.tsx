"use client";

import { motion } from "framer-motion";

interface Props {
  open: boolean;
  links: {
    label: string;
    href: string;
  }[];
  onClose: () => void;
}

export default function MobileMenu({
  open,
  links,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <motion.div
      initial={{
        x: "100%",
      }}
      animate={{
        x: 0,
      }}
      exit={{
        x: "100%",
      }}
      className="
        fixed
        inset-0
        bg-[#FAF8F5]
        z-40
        pt-28
        px-8
      "
    >
      <div className="flex flex-col gap-8">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="
              font-heading
              text-5xl
            "
          >
            {link.label}
          </a>
        ))}
      </div>
    </motion.div>
  );
}