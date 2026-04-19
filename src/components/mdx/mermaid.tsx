"use client";

import { useEffect, useRef, useState } from "react";

function currentTheme(): "dark" | "default" {
  if (typeof document === "undefined") return "default";
  return document.documentElement.classList.contains("dark") ? "dark" : "default";
}

export function Mermaid({ chart, caption }: { chart: string; caption?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        const theme = currentTheme();
        mermaid.initialize({
          startOnLoad: false,
          theme,
          fontFamily: "var(--font-sans)",
          securityLevel: "strict",
        });
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, chart.trim());
        if (!cancelled) setSvg(svg);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to render diagram");
      }
    }

    render();
    const observer = new MutationObserver(render);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [chart]);

  if (error) {
    return (
      <pre className="text-signal text-sm my-6 p-3 border border-signal/40 rounded">
        {error}
      </pre>
    );
  }

  return (
    <figure className="my-8">
      <div
        ref={ref}
        className="flex justify-center overflow-x-auto rounded-lg border border-rule bg-bg-soft p-4"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && (
        <figcaption className="mt-3 text-sm text-ink-3 leading-relaxed text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
