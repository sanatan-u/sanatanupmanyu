export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[-1.5rem] w-screen h-[calc(100%+3rem)] overflow-hidden -z-10"
    >
      <svg
        viewBox="0 0 1600 720"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full text-accent"
      >
        <defs>
          <radialGradient id="hero-glow-right" cx="75%" cy="40%" r="45%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
            <stop offset="55%" stopColor="currentColor" stopOpacity="0.04" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-glow-left" cx="15%" cy="70%" r="40%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hero-fade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-bg)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="1" />
          </linearGradient>
        </defs>

        <rect width="1600" height="720" fill="url(#hero-glow-right)" />
        <rect width="1600" height="720" fill="url(#hero-glow-left)" />

        {/* Orbit system anchored near the portrait on the right */}
        <g
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1"
        >
          <circle cx="1200" cy="320" r="130" />
          <circle cx="1200" cy="320" r="220" />
          <circle cx="1200" cy="320" r="330" />
          <circle cx="1200" cy="320" r="460" />
          <circle cx="1200" cy="320" r="620" />
        </g>

        {/* Orbit nodes */}
        <g fill="currentColor" fillOpacity="0.55">
          <circle cx="1070" cy="320" r="4" />
          <circle cx="1420" cy="320" r="3" />
          <circle cx="1200" cy="100" r="3" />
          <circle cx="980" cy="320" r="3" />
          <circle cx="1200" cy="650" r="2.5" />
          <circle cx="1530" cy="320" r="2.5" />
          <circle cx="1200" cy="780" r="2" />
        </g>

        {/* Left-side subtle graph motif */}
        <g
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.16"
          strokeWidth="1"
        >
          <line x1="60" y1="520" x2="220" y2="440" />
          <line x1="220" y1="440" x2="360" y2="500" />
          <line x1="360" y1="500" x2="500" y2="420" />
          <line x1="220" y1="440" x2="300" y2="320" />
          <line x1="300" y1="320" x2="460" y2="300" />
        </g>
        <g fill="currentColor" fillOpacity="0.4">
          <circle cx="60" cy="520" r="3" />
          <circle cx="220" cy="440" r="4" />
          <circle cx="360" cy="500" r="3" />
          <circle cx="500" cy="420" r="3" />
          <circle cx="300" cy="320" r="3" />
          <circle cx="460" cy="300" r="2.5" />
        </g>

        {/* Sweeping dashed flow lines across the full width */}
        <g
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="1"
          strokeDasharray="2 7"
          fill="none"
        >
          <path d="M -40 600 C 260 540, 620 660, 900 580 S 1400 520, 1660 620" />
          <path d="M -40 660 C 320 600, 660 720, 1000 640 S 1400 580, 1660 680" />
        </g>

        {/* Bottom fade into page background */}
        <rect
          x="0"
          y="480"
          width="1600"
          height="240"
          fill="url(#hero-fade)"
        />
      </svg>
    </div>
  );
}
