"use client";

import { useState, useEffect, useCallback } from "react";

const phrases = [
  "AI platforms",
  "knowledge graphs",
  "digital twins",
  "clinical trial systems",
  "drug discovery tools",
];

const TYPING_MS = 80;
const DELETING_MS = 40;
const PAUSE_MS = 2200;

export function Typewriter() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const tick = useCallback(() => {
    const current = phrases[phraseIdx];

    if (!deleting) {
      if (charIdx < current.length) {
        return setTimeout(() => setCharIdx((c) => c + 1), TYPING_MS);
      }
      return setTimeout(() => setDeleting(true), PAUSE_MS);
    }

    if (charIdx > 0) {
      return setTimeout(() => setCharIdx((c) => c - 1), DELETING_MS);
    }

    setDeleting(false);
    setPhraseIdx((i) => (i + 1) % phrases.length);
  }, [phraseIdx, charIdx, deleting]);

  useEffect(() => {
    const id = tick();
    return () => clearTimeout(id);
  }, [tick]);

  const text = phrases[phraseIdx].slice(0, charIdx);

  return (
    <span className="display text-[clamp(1.5rem,3.5vw,2.25rem)] text-accent">
      I build{" "}
      <span>{text}</span>
      <span className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 align-middle animate-blink" />
    </span>
  );
}
