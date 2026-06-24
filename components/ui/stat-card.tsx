"use client";

import { motion } from "framer-motion";

interface Props {
  value: string;
  label: string;
}

export default function StatCard({
  value,
  label,
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      className="
        border
        border-[#E8E4DC]
        bg-white
        p-10
        transition-all
      "
    >
      <h3 className="font-heading text-5xl">
        {value}
      </h3>

      <p className="mt-3 text-[#8A8880]">
        {label}
      </p>
    </motion.div>
  );
}