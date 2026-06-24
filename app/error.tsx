"use client";

export default function ErrorPage({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="heading-font text-6xl">
        Oops.
      </h1>

      <button
        onClick={reset}
        className="mt-6 bg-[#C4974A] text-white px-6 py-3"
      >
        Try Again
      </button>
    </div>
  );
}