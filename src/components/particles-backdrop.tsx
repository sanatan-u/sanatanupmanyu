"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const options: ISourceOptions = {
  background: { color: { value: "transparent" } },
  fullScreen: { enable: false },
  detectRetina: true,
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "grab" },
      resize: { enable: true },
    },
    modes: {
      grab: { distance: 160, links: { opacity: 0.35 } },
    },
  },
  particles: {
    number: { value: 70, density: { enable: true, width: 1600, height: 720 } },
    color: { value: "#2f5d5a" },
    links: {
      enable: true,
      color: "#2f5d5a",
      distance: 140,
      opacity: 0.18,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.45,
      direction: "none",
      outModes: { default: "out" },
      random: false,
      straight: false,
    },
    opacity: {
      value: { min: 0.2, max: 0.5 },
      animation: { enable: true, speed: 0.6, sync: false },
    },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 2.5 } },
  },
};

const darkOptions: ISourceOptions = {
  ...options,
  particles: {
    ...options.particles,
    color: { value: "#7fb3ae" },
    links: { ...options.particles!.links!, color: "#7fb3ae", opacity: 0.22 },
  },
};

export function ParticlesBackdrop() {
  const [ready, setReady] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (!ready) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[-1.5rem] w-screen h-[calc(100%+3rem)] overflow-hidden -z-10"
    >
      <Particles
        id="hero-particles"
        className="absolute inset-0 h-full w-full"
        options={isDark ? darkOptions : options}
      />
    </div>
  );
}
