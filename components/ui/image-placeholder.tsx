interface Props {
  label: string;
}

export default function ImagePlaceholder({
  label,
}: Props) {
  return (
    <div
      className="
        relative
        h-full
        min-h-125
        bg-[#E8E4DC]
        overflow-hidden
      "
    >
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle,#1A1A1A 1px,transparent 1px)",
            backgroundSize:
              "30px 30px",
          }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="tracking-[0.25em] text-[#8A8880] uppercase text-sm">
          {label}
        </span>
      </div>
    </div>
  );
}