import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5]">
      <h1 className="font-heading text-8xl">
        404
      </h1>

      <p className="mt-4 text-[#8A8880]">
        Page not found
      </p>

      <Link
        href="/"
        className="mt-8 text-[#C4974A]"
      >
        Return Home
      </Link>
    </div>
  );
}