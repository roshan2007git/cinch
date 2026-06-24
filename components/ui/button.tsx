import clsx from "clsx";
import {
  ButtonHTMLAttributes,
} from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline";
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "px-8 py-4 transition-all duration-300",

        variant === "primary" &&
          "bg-[#C4974A] text-white hover:opacity-90",

        variant === "secondary" &&
          "bg-[#1A1A1A] text-white",

        variant === "outline" &&
          "border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white",

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}