export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center rounded-full border border-ink"
      style={{
        width: size,
        height: size,
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: size * 0.52,
        lineHeight: 1,
        letterSpacing: "-0.04em",
        paddingBottom: size * 0.03,
      }}
    >
      su
    </span>
  );
}
