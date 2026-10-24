"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

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

const staticSentence = `I build ${phrases.slice(0, -1).join(", ")}, and ${phrases.at(-1)}.`;

export function Typewriter() {
  const reduceMotion = usePrefersReducedMotion();
  const [phraseIdx, setPhraseIdx] = useState(0);
  // Start fully typed so the server render and first paint read "I build AI
  // platforms" rather than a bare "I build"; the cycle then pauses and deletes.
  const [charIdx, setCharIdx] = useState(phrases[0].length);
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

    return setTimeout(() => {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
    }, 0);
  }, [phraseIdx, charIdx, deleting]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = tick();
    return () => clearTimeout(id);
  }, [tick, reduceMotion]);

  // With reduced motion the first phrase is shown in full and never cycles.
  const text = reduceMotion ? phrases[0] : phrases[phraseIdx].slice(0, charIdx);

  return (
    <span className="display text-[clamp(1.5rem,3.5vw,2.25rem)] text-accent">
      <span className="sr-only">{staticSentence}</span>
      <span aria-hidden="true">
        I build <span>{text}</span>
        <span className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 align-middle animate-blink" />
      </span>
    </span>
  );
}
