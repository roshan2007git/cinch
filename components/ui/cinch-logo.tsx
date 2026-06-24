import Link from "next/link";

export default function CinchLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M5 19L19 5"
          stroke="#C4974A"
          strokeWidth="2"
        />

        <circle
          cx="19"
          cy="5"
          r="2"
          fill="#C4974A"
        />
      </svg>

      <span className="font-heading text-3xl tracking-[0.15em]">
        CINCH
      </span>
    </Link>
  );
}