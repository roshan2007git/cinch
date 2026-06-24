"use client";

import {
  ChevronDown,
} from "lucide-react";

import { useState } from "react";

interface AccordionItem {
  title: string;
  content: string;
}

interface Props {
  items: AccordionItem[];
}

export default function Accordion({
  items,
}: Props) {
  const [active, setActive] =
    useState<number | null>(0);

  return (
    <div className="border-t border-[#E8E4DC]">
      {items.map((item, index) => (
        <div
          key={item.title}
          className="border-b border-[#E8E4DC]"
        >
          <button
            onClick={() =>
              setActive(
                active === index
                  ? null
                  : index
              )
            }
            className="w-full py-6 flex items-center justify-between text-left"
          >
            <span>
              {item.title}
            </span>

            <ChevronDown
              className={`transition-transform ${
                active === index
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {active === index && (
            <div className="pb-6 text-[#8A8880]">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}