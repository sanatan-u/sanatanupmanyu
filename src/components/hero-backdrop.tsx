export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-x-12 -inset-y-6 overflow-hidden -z-10"
    >
      <svg
        viewBox="0 0 1200 720"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full text-accent"
      >
        <defs>
          <radialGradient id="hero-glow" cx="70%" cy="35%" r="55%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.14" />
            <stop offset="55%" stopColor="currentColor" stopOpacity="0.04" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hero-fade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-bg)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="1" />
          </linearGradient>
        </defs>

        <rect width="1200" height="720" fill="url(#hero-glow)" />

        <g
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1"
        >
          <circle cx="880" cy="300" r="120" />
          <circle cx="880" cy="300" r="200" />
          <circle cx="880" cy="300" r="290" />
          <circle cx="880" cy="300" r="400" />
        </g>

        <g fill="currentColor" fillOpacity="0.55">
          <circle cx="760" cy="300" r="4" />
          <circle cx="1080" cy="300" r="3" />
          <circle cx="880" cy="100" r="3" />
          <circle cx="680" cy="300" r="3" />
          <circle cx="880" cy="590" r="2.5" />
          <circle cx="1170" cy="300" r="2.5" />
        </g>

        <g
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="1"
          strokeDasharray="2 6"
        >
          <path d="M 60 620 C 260 540, 420 640, 620 560" fill="none" />
          <path d="M 60 660 C 320 600, 460 700, 760 640" fill="none" />
        </g>

        <rect
          x="0"
          y="480"
          width="1200"
          height="240"
          fill="url(#hero-fade)"
        />
      </svg>
    </div>
  );
}
