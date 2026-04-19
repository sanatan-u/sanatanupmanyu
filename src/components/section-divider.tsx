export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div
        role="separator"
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 w-screen flex items-center gap-4 text-accent/40"
      >
        <span className="h-px flex-1 bg-rule" />
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          className="shrink-0"
          aria-hidden
        >
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="11" cy="11" r="5" />
            <circle cx="11" cy="11" r="9" strokeOpacity="0.5" />
            <circle cx="11" cy="11" r="1.2" fill="currentColor" />
          </g>
        </svg>
        <span className="h-px flex-1 bg-rule" />
      </div>
      <div className="h-[22px]" aria-hidden />
    </div>
  );
}
