// Builds the four featured-project diagrams, each in a wide desktop layout and a
// tall phone layout.
//   npm run diagrams
//
// Output
// - src/content/project-diagrams.ts: SVG strings the homepage inlines, so the
//   diagrams inherit the site's theme tokens and fonts. Generated; do not edit.
// - review/visual-research/diagrams/: standalone copies and a review page, written
//   only when that folder exists.
//
// Shared visual language
// - Colours and fonts come from the site's CSS custom properties (--bg, --ink,
//   --accent, --signal, --font-display ...) with light-theme fallbacks, so an
//   inlined diagram follows the site theme, including the .dark class.
// - Faint dot grid on a bg-soft panel echoes the hero particle field.
// - Teal = the system and its data flow. Rust = outcomes and the things the
//   project exists to surface. Ink-3 = context and out-of-scope.
// - Every connector has a slow flowing dash, removed under reduced motion.
// - Every diagram ends in the same outcome strip carrying the existing impact
//   line verbatim from src/content.
// All labels are drawn from the project descriptions in src/content. Nothing
// here is product UI or real data.

import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const W = 1200;
const H = 720;

/* ── primitives ─────────────────────────────────────────────────────────── */

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const n = (v) => Math.round(v * 10) / 10;

function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Rough advance width for Inter Tight / Fraunces at a size, used only for
// sizing pills. Glyph-average of 0.54em is close for mixed-case labels.
const est = (s, px, k = 0.54) => s.length * px * k;

const t = (x, y, s, cls, anchor = "start") =>
  `<text x="${n(x)}" y="${n(y)}" class="${cls}"${anchor !== "start" ? ` text-anchor="${anchor}"` : ""}>${esc(s)}</text>`;

const lines = (x, y, arr, cls, lh, anchor = "start") =>
  `<text x="${n(x)}" y="${n(y)}" class="${cls}"${anchor !== "start" ? ` text-anchor="${anchor}"` : ""}>${arr
    .map((s, i) => `<tspan x="${n(x)}" dy="${i === 0 ? 0 : lh}">${esc(s)}</tspan>`)
    .join("")}</text>`;

function wrap(s, max) {
  const out = [];
  let cur = "";
  for (const w of s.split(" ")) {
    if ((cur + " " + w).trim().length > max) {
      out.push(cur.trim());
      cur = w;
    } else cur += " " + w;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const eyebrow = (x, y, s, cls = "dg-eyebrow") => t(x, y, s.toUpperCase(), cls);

function pill(x, y, label, { h = 32, px = 13, cls = "dg-label-sm", w, dot } = {}) {
  const width = w ?? Math.round(est(label, px) + 30);
  const r = h / 2;
  let s = `<rect x="${n(x)}" y="${n(y)}" width="${width}" height="${h}" rx="${r}" class="dg-pill"/>`;
  s += t(x + 15, y + h / 2 + px * 0.36, label, cls);
  if (dot === "right") s += node(x + width, y + h / 2, 3.5, true);
  return { svg: s, w: width };
}

function chip(x, y, label, { cls = "dg-chip", textCls = "dg-chip-text", h = 22, px = 11 } = {}) {
  const width = Math.round(est(label, px, 0.56) + 20);
  return {
    svg:
      `<rect x="${n(x)}" y="${n(y)}" width="${width}" height="${h}" rx="${h / 2}" class="${cls}"/>` +
      t(x + width / 2, y + h / 2 + px * 0.36, label, textCls, "middle"),
    w: width,
  };
}

function node(x, y, r = 5, halo = true, pulse = false) {
  return (
    (halo
      ? `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r * 2.2)}" class="dg-halo${pulse ? " dg-pulse" : ""}"/>`
      : "") + `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" class="dg-node"/>`
  );
}

function flow(id, d, { arrow = true, soft = false } = {}) {
  const base = soft ? "dg-edge-soft" : "dg-edge";
  return (
    `<path d="${d}" class="${base}"${arrow ? ` marker-end="url(#${id}-arrow)"` : ""}/>` +
    (soft ? "" : `<path d="${d}" class="dg-flow"/>`)
  );
}

const elabel = (x, y, s, anchor = "start") => t(x, y, s, "dg-edge-label", anchor);

function constellation(x0, y0, w, h, count, seed, { avoid, maxD = 64, big = [] } = {}) {
  const r = rng(seed);
  const pts = [];
  let guard = 0;
  while (pts.length < count && guard++ < 4000) {
    const p = { x: x0 + r() * w, y: y0 + r() * h };
    if (avoid && p.x > avoid.x && p.x < avoid.x + avoid.w && p.y > avoid.y && p.y < avoid.y + avoid.h) continue;
    if (pts.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 18)) continue;
    pts.push(p);
  }
  let links = "";
  const deg = new Array(pts.length).fill(0);
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < maxD && deg[i] < 3 && deg[j] < 3) {
        deg[i]++;
        deg[j]++;
        links += `<line x1="${n(pts[i].x)}" y1="${n(pts[i].y)}" x2="${n(pts[j].x)}" y2="${n(pts[j].y)}" class="dg-star-link"/>`;
      }
    }
  const dots = pts
    .map((p, i) =>
      big.includes(i)
        ? node(p.x, p.y, 3.2, true)
        : `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n(1.4 + (i % 3) * 0.5)}" class="dg-star"/>`
    )
    .join("");
  return links + dots;
}

/* ── shared frame and outcome strip ─────────────────────────────────────── */

const STYLE = `
.dg{--dg-bg:var(--bg,#ffffff);--dg-soft:var(--bg-soft,#f7f6f3);--dg-ink:var(--ink,#111111);--dg-ink2:var(--ink-2,#3a3a3a);--dg-ink3:var(--ink-3,#6b6b6b);--dg-rule:var(--rule,#e5e5e5);--dg-acc:var(--accent,#1b7a6f);--dg-sig:var(--signal,#a13d1e);--dg-display:var(--font-display,"Fraunces",Georgia,serif);--dg-sans:var(--font-sans,"Inter Tight","Helvetica Neue",Arial,sans-serif)}
.dg-panel{fill:var(--dg-soft)}
.dg-griddot{fill:var(--dg-ink);fill-opacity:.07}
.dg-eyebrow{font:600 11px var(--dg-sans);letter-spacing:.14em;fill:var(--dg-ink3)}
.dg-eyebrow-sig{font:600 11px var(--dg-sans);letter-spacing:.14em;fill:var(--dg-sig)}
.dg-h{font:400 21px var(--dg-display);letter-spacing:-.01em;fill:var(--dg-ink)}
.dg-label{font:500 14px var(--dg-sans);fill:var(--dg-ink)}
.dg-label-sm{font:500 13px var(--dg-sans);fill:var(--dg-ink)}
.dg-label-xs{font:500 11px var(--dg-sans);fill:var(--dg-ink)}
.dg-num-md{font:400 21px var(--dg-display);fill:var(--dg-acc)}
.dg-sub{font:400 11.5px var(--dg-sans);fill:var(--dg-ink3)}
.dg-sub-sig{font:400 11.5px var(--dg-sans);fill:var(--dg-sig)}
.dg-edge-label{font:italic 400 13px var(--dg-display);fill:var(--dg-ink3)}
.dg-num{font:500 15px var(--dg-display);fill:var(--dg-acc)}
.dg-num-inv{font:500 15px var(--dg-display);fill:var(--dg-bg)}
.dg-num-lg{font:400 26px var(--dg-display);fill:var(--dg-acc)}
.dg-num-off{font:400 18px var(--dg-display);fill:var(--dg-ink3)}
.dg-fig{font:italic 400 36px var(--dg-display);letter-spacing:-.02em;fill:var(--dg-sig)}
.dg-impact{font:400 15px var(--dg-sans);fill:var(--dg-ink2)}
.dg-caption{font:400 11px var(--dg-sans);fill:var(--dg-ink3)}
.dg-pill{fill:var(--dg-bg);stroke:var(--dg-rule);stroke-width:1}
.dg-card{fill:var(--dg-bg);stroke:var(--dg-rule);stroke-width:1}
.dg-core-stroke{stroke:var(--dg-acc);stroke-opacity:.35;stroke-width:1}
.dg-band{fill:var(--dg-acc);fill-opacity:.05;stroke:var(--dg-acc);stroke-opacity:.45;stroke-dasharray:4 4}
.dg-ground{fill:var(--dg-acc);fill-opacity:.04;stroke:var(--dg-rule)}
.dg-stop-a{stop-color:var(--dg-acc);stop-opacity:.15}
.dg-stop-b{stop-color:var(--dg-acc);stop-opacity:.04}
.dg-edge{fill:none;stroke:var(--dg-acc);stroke-width:1.4;stroke-opacity:.5}
.dg-edge-soft{fill:none;stroke:var(--dg-ink3);stroke-width:1;stroke-opacity:.45;stroke-dasharray:3 4}
.dg-edge-sig{fill:none;stroke:var(--dg-sig);stroke-width:1.2;stroke-opacity:.6;stroke-dasharray:3 4}
.dg-flow{fill:none;stroke:var(--dg-acc);stroke-width:2.2;stroke-linecap:round;stroke-dasharray:1 15;animation:dg-flow 1.5s linear infinite}
.dg-arrowhead{fill:none;stroke:var(--dg-acc);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.dg-arrowhead-sig{fill:none;stroke:var(--dg-sig);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.dg-node{fill:var(--dg-acc)}
.dg-halo{fill:var(--dg-acc);fill-opacity:.15}
.dg-ring{fill:var(--dg-bg);stroke:var(--dg-acc);stroke-width:1.5}
.dg-ring-off{fill:var(--dg-bg);stroke:var(--dg-ink3);stroke-width:1.2}
.dg-star{fill:var(--dg-acc);fill-opacity:.6}
.dg-star-link{stroke:var(--dg-acc);stroke-opacity:.25;stroke-width:1}
.dg-sig-fill{fill:var(--dg-sig)}
.dg-sig-ring{fill:var(--dg-bg);stroke:var(--dg-sig);stroke-width:1.6}
.dg-sig-rule{stroke:var(--dg-sig);stroke-opacity:.35;stroke-width:1}
.dg-rule{stroke:var(--dg-rule);stroke-width:1}
.dg-chip{fill:var(--dg-bg);stroke:var(--dg-rule)}
.dg-chip-text{font:500 11px var(--dg-sans);fill:var(--dg-ink2)}
.dg-chip-sig{fill:var(--dg-sig);fill-opacity:.1;stroke:var(--dg-sig);stroke-opacity:.5}
.dg-chip-sig-text{font:600 11px var(--dg-sans);fill:var(--dg-sig)}
.dg-tier{fill:var(--dg-acc);fill-opacity:.1;stroke:var(--dg-acc);stroke-opacity:.5;stroke-width:1}
.dg-tier-off{stroke:var(--dg-ink3);stroke-opacity:.6;stroke-width:1;stroke-dasharray:3 3}
.dg-hatch{stroke:var(--dg-ink3);stroke-opacity:.4;stroke-width:1.2}
.dg-bar{fill:var(--dg-acc)}
.dg-glyph{fill:none;stroke:var(--dg-acc);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.dg-glyph-fill{fill:var(--dg-acc)}
.dg-price{fill:none;stroke:var(--dg-ink2);stroke-width:1.8;stroke-linejoin:round;stroke-linecap:round}
.dg-price-fut{fill:none;stroke:var(--dg-ink3);stroke-width:1.5;stroke-dasharray:4 5;stroke-linecap:round}
.dg-area{fill:var(--dg-acc);fill-opacity:.07}
.dg-future{fill:var(--dg-acc);fill-opacity:.05}
.dg-axis{stroke:var(--dg-ink3);stroke-opacity:.6;stroke-width:1}
.dg-pulse{animation:dg-pulse 3.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes dg-flow{to{stroke-dashoffset:-32}}
@keyframes dg-pulse{0%,100%{fill-opacity:.12;transform:scale(1)}50%{fill-opacity:.28;transform:scale(1.4)}}
@media (prefers-reduced-motion:reduce){.dg-flow,.dg-pulse{animation:none}}
`;

function frame(id, name, aria, body, { w = W, h = H, rx = 24 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(aria)}" class="dg">
<title>${esc(name)}: illustrative workflow</title>
<style>${STYLE}</style>
<defs>
<pattern id="${id}-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1" class="dg-griddot"/></pattern>
<marker id="${id}-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M1.5,1.5 L8.5,5 L1.5,8.5" class="dg-arrowhead"/></marker>
<marker id="${id}-arrow-sig" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M1.5,1.5 L8.5,5 L1.5,8.5" class="dg-arrowhead-sig"/></marker>
<linearGradient id="${id}-core" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="dg-stop-a"/><stop offset="1" class="dg-stop-b"/></linearGradient>
<pattern id="${id}-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" class="dg-hatch"/></pattern>
</defs>
<rect width="${w}" height="${h}" rx="${rx}" class="dg-panel"/>
<rect width="${w}" height="${h}" rx="${rx}" fill="url(#${id}-grid)"/>
${body}
</svg>
`;
}

function outcome(fig, sentence, { figSub } = {}) {
  const y0 = 556;
  let s = `<line x1="48" y1="${y0}" x2="1152" y2="${y0}" class="dg-sig-rule"/>`;
  s += eyebrow(48, y0 + 32, "Outcome", "dg-eyebrow-sig");
  s += t(48, y0 + 80, fig, "dg-fig");
  if (figSub) s += t(48, y0 + 104, figSub, "dg-sub-sig");
  s += lines(470, y0 + 50, wrap(sentence, 86), "dg-impact", 23);
  return s;
}

function caption(name) {
  return (
    t(48, 696, "Illustrative workflow drawn from the published project description. Not a product screenshot.", "dg-caption") +
    t(1152, 696, name, "dg-caption", "end")
  );
}

/* ── 1. Discovery Navigator ─────────────────────────────────────────────── */

function discoveryNavigator() {
  const id = "dn";
  let b = "";
  b += eyebrow(48, 64, "Start from");
  b += eyebrow(340, 64, "Guided workflow");
  b += eyebrow(930, 64, "Output");

  // Four starting points converging on step 1
  const starts = ["Disease-first", "Target-first", "Indication expansion", "Combination therapy"];
  const trackY = 238;
  const xs = [370, 462, 554, 646, 738, 830];
  starts.forEach((s, i) => {
    const cy = 166 + i * 48;
    const p = pill(48, cy - 18, s, { h: 36, w: 220, dot: "right" });
    b += p.svg;
    b += flow(id, `M272,${cy} C312,${cy} 306,${trackY} ${xs[0] - 24},${trackY}`);
  });

  // Copilot band above the track, with a tick to every step
  b += `<rect x="340" y="92" width="520" height="40" rx="20" class="dg-band"/>`;
  b += `<text x="600" y="117" text-anchor="middle"><tspan class="dg-label-sm">Discovery Copilot</tspan><tspan class="dg-sub" dx="6">project-aware, alongside every step</tspan></text>`;
  xs.forEach((x) => (b += `<line x1="${x}" y1="132" x2="${x}" y2="${trackY - 22}" class="dg-edge-soft"/>`));

  // Six-step track
  const steps = ["Project", "Config", "Exploration", "Agent scoring", "Ranking", "Hypotheses"];
  for (let i = 0; i < xs.length - 1; i++) b += flow(id, `M${xs[i] + 20},${trackY} L${xs[i + 1] - 22},${trackY}`);
  xs.forEach((x, i) => {
    const last = i === xs.length - 1;
    b += `<circle cx="${x}" cy="${trackY}" r="27" class="dg-halo${last ? " dg-pulse" : ""}"/>`;
    b += `<circle cx="${x}" cy="${trackY}" r="18" class="${last ? "dg-node" : "dg-ring"}"/>`;
    b += t(x, trackY + 5, String(i + 1), last ? "dg-num-inv" : "dg-num", "middle");
    b += t(x, trackY + 44, steps[i], "dg-label-sm", "middle");
  });

  // Knowledge graph the whole workflow is built on
  b += `<rect x="340" y="314" width="520" height="104" rx="16" class="dg-ground"/>`;
  b += eyebrow(362, 342, "Built on");
  b += t(362, 364, "AlphaMeld Knowledge Graph", "dg-label");
  b += constellation(372, 326, 470, 82, 30, 7, { avoid: { x: 352, y: 322, w: 214, h: 54 }, big: [3, 17] });

  // Platform chips
  let cx = 340;
  ["Multi-tenant SaaS", "SSO", "RBAC", "Audit logging"].forEach((c) => {
    const ch = chip(cx, 444, c, { h: 24 });
    b += ch.svg;
    cx += ch.w + 8;
  });

  // Ranked hypotheses card
  b += flow(id, `M${xs[5] + 22},${trackY} L924,${trackY}`);
  b += elabel(889, trackY - 12, "ranked", "middle");
  b += `<rect x="930" y="150" width="222" height="182" rx="14" class="dg-card"/>`;
  b += t(948, 180, "Ranked hypotheses", "dg-label");
  const bars = [150, 122, 96, 70];
  const ops = [0.95, 0.72, 0.52, 0.34];
  bars.forEach((w, i) => {
    const y = 204 + i * 34;
    b += t(952, y + 10, String(i + 1), "dg-num", "middle");
    b += `<rect x="968" y="${y}" width="${w}" height="10" rx="5" class="dg-bar" fill-opacity="${ops[i]}"/>`;
    // evidence pin on each row
    b += `<circle cx="${968 + w + 10}" cy="${y + 5}" r="3" class="dg-sig-ring"/>`;
  });

  // Evidence trail back into the graph
  b += `<path d="M1086,332 C1086,396 960,392 866,388" class="dg-edge-sig" marker-end="url(#${id}-arrow-sig)"/>`;
  b += t(1006, 420, "traceable evidence", "dg-edge-label", "middle");

  b += outcome("Weeks → hours", "Hypothesis landscaping compressed from weeks to hours, with traceable evidence at every step.");
  b += caption("Discovery Navigator");

  return frame(
    id,
    "Discovery Navigator",
    "Discovery Navigator workflow: four starting points feed a six-step guided workflow (project, config, exploration, agent scoring, ranking, hypotheses) with the Discovery Copilot alongside every step, built on the AlphaMeld Knowledge Graph, producing ranked hypotheses with traceable evidence.",
    b
  );
}

/* ── 2. QuriousRI ───────────────────────────────────────────────────────── */

function quriousRI() {
  const id = "qr";
  let b = "";
  b += eyebrow(48, 64, "Agencies · 12+");
  b += eyebrow(290, 64, "Intelligence");
  b += eyebrow(790, 64, "Common Technical Document");

  // Agencies
  const agencies = ["FDA", "EMA", "PMDA", "NMPA", "Health Canada", "MHRA", "Swissmedic", "+ more"];
  const coreIn = { x: 290, y: 270 };
  agencies.forEach((a, i) => {
    const y = 92 + i * 44;
    b += pill(48, y, a, { h: 32, w: 140, dot: "right" }).svg;
    b += flow(id, `M192,${y + 16} C236,${y + 16} 244,${coreIn.y} ${coreIn.x - 6},${coreIn.y}`, { arrow: i === 3 });
  });

  // Intelligence core
  b += `<rect x="290" y="92" width="280" height="356" rx="18" fill="url(#${id}-core)" class="dg-core-stroke"/>`;
  b += t(310, 128, "Regulatory intelligence", "dg-h");
  b += lines(310, 152, ["Search, analyze, compare, and manage", "global drug and biologic approvals"], "dg-sub", 16);
  let cx = 310;
  ["Pharmaceuticals", "Biologics"].forEach((c) => {
    const ch = chip(cx, 190, c, { h: 24 });
    b += ch.svg;
    cx += ch.w + 8;
  });
  cx = 310;
  ["Biosimilars", "Generics"].forEach((c) => {
    const ch = chip(cx, 222, c, { h: 24 });
    b += ch.svg;
    cx += ch.w + 8;
  });
  b += `<line x1="310" y1="266" x2="550" y2="266" class="dg-rule"/>`;
  b += eyebrow(310, 290, "Underneath");
  ["Role-based dashboards", "Pathway and classification guides", "Centralized guidelines library", "Expert Q&A", "LLM-powered document analysis"].forEach(
    (s, i) => {
      const y = 314 + i * 22;
      b += `<circle cx="314" cy="${y - 4}" r="2" class="dg-node"/>`;
      b += t(324, y, s, "dg-sub");
    }
  );

  // CTD pyramid geometry
  const apex = { x: 960, y: 96 };
  const baseY = 470;
  const half = (y) => ((y - apex.y) * 190) / (baseY - apex.y);
  const L = (y) => apex.x - half(y);
  const R = (y) => apex.x + half(y);
  const pt = (x, y) => `${n(x)},${n(y)}`;

  // Module 1: hatched, out of scope
  b += `<polygon points="${pt(apex.x, apex.y)} ${pt(R(168), 168)} ${pt(L(168), 168)}" fill="url(#${id}-hatch)" class="dg-tier-off"/>`;
  b += t(960, 158, "1", "dg-num-off", "middle");
  b += `<line x1="992" y1="128" x2="1012" y2="128" class="dg-edge-soft"/>`;
  b += t(1018, 126, "Out of scope", "dg-label-sm");
  b += lines(1018, 142, ["Module 1 is country-", "and company-specific"], "dg-sub", 14);

  // Module 2
  b += `<polygon points="${pt(L(174), 174)} ${pt(R(174), 174)} ${pt(R(258), 258)} ${pt(L(258), 258)}" class="dg-tier"/>`;
  b += t(960, 204, "Module 2", "dg-label-sm", "middle");
  b += t(960, 220, "Summaries", "dg-sub", "middle");
  b += chip(960 - 22, 230, "QOS", { cls: "dg-chip-sig", textCls: "dg-chip-sig-text", h: 20 }).svg;

  // Modules 3, 4, 5 side by side at the base
  const topXs = [L(264), 0, 0, R(264)];
  topXs[1] = topXs[0] + (topXs[3] - topXs[0]) / 3;
  topXs[2] = topXs[0] + (2 * (topXs[3] - topXs[0])) / 3;
  const botXs = [L(baseY), 0, 0, R(baseY)];
  botXs[1] = botXs[0] + (botXs[3] - botXs[0]) / 3;
  botXs[2] = botXs[0] + (2 * (botXs[3] - botXs[0])) / 3;
  const g = 3;
  const base = [
    { num: "3", name: "Quality" },
    { num: "4", name: "Nonclinical" },
    { num: "5", name: "Clinical" },
  ];
  base.forEach((m, i) => {
    const tl = topXs[i] + (i ? g : 0);
    const tr = topXs[i + 1] - (i < 2 ? g : 0);
    const bl = botXs[i] + (i ? g : 0);
    const br = botXs[i + 1] - (i < 2 ? g : 0);
    b += `<polygon points="${pt(tl, 264)} ${pt(tr, 264)} ${pt(br, baseY)} ${pt(bl, baseY)}" class="dg-tier"/>`;
    const cxm = (tl + tr + bl + br) / 4;
    b += t(cxm, 318, m.num, "dg-num-lg", "middle");
    b += t(cxm, 340, m.name, "dg-label-sm", "middle");
  });
  // Sections tested so far inside Module 3
  const m3x = (topXs[0] + topXs[1] + botXs[0] + botXs[1]) / 4 - 8;
  [["3.2.P.1", 372], ["3.2.P.3.3", 402]].forEach(([s, y]) => {
    const w = Math.round(est(s, 11, 0.56) + 20);
    b += chip(m3x - w / 2, y, s, { cls: "dg-chip-sig", textCls: "dg-chip-sig-text", h: 20 }).svg;
  });

  // Two workstreams into Modules 2 to 5
  b += flow(id, `M570,214 L${n(L(214) - 8)},214`);
  b += t(592, 200, "Dossier authoring", "dg-label-sm");
  b += t(592, 234, "AI-assisted", "dg-sub");
  b += flow(id, `M570,384 L${n(L(384) - 8)},384`);
  b += t(592, 370, "Market-entry gap assessment", "dg-label-sm");
  b += lines(592, 404, ["Approved market vs. target market,", "module by module, section by section"], "dg-sub", 15);

  // Legend
  b += `<rect x="770" y="494" width="30" height="16" rx="8" class="dg-chip-sig"/>`;
  b += t(806, 506, "Reproducibility tested so far", "dg-sub");
  b += t(806, 526, "Both workstreams cover Modules 2 to 5", "dg-sub");
  b += `<line x1="776" y1="522" x2="800" y2="522" class="dg-edge"/>`;

  b += outcome(
    "12+ agencies",
    "Regulatory intelligence plus CTD dossier authoring and per-section market-entry gap assessment across Modules 2–5 and 12+ agencies — FDA, EMA, PMDA, NMPA, Health Canada, MHRA, Swissmedic, and more",
    { figSub: "CTD Modules 2–5" }
  );
  b += caption("QuriousRI");

  return frame(
    id,
    "QuriousRI",
    "QuriousRI workflow: approvals from 12 or more agencies feed a regulatory intelligence layer, which drives two workstreams, dossier authoring and market-entry gap assessment, across CTD Modules 2 to 5. Module 1 is out of scope.",
    b
  );
}

/* ── 3. Pipeline Alpha ──────────────────────────────────────────────────── */

function pipelineAlpha() {
  const id = "pa";
  let b = "";
  b += eyebrow(48, 64, "Sources");
  b += eyebrow(340, 64, "Sync and discovery");
  b += eyebrow(700, 64, "Catalyst calendar · small/mid-cap NASDAQ biotech");

  // Source cards
  b += `<rect x="48" y="92" width="220" height="132" rx="14" class="dg-card"/>`;
  b += t(66, 120, "Clinical-trial data", "dg-label");
  b += pill(66, 136, "ClinicalTrials.gov", { h: 28, px: 12, cls: "dg-sub" }).svg;
  b += pill(66, 172, "Clinical Navigator", { h: 28, px: 12, cls: "dg-sub" }).svg;

  b += `<rect x="48" y="248" width="220" height="132" rx="14" class="dg-card"/>`;
  b += t(66, 276, "Market data", "dg-label");
  const s1 = pill(66, 292, "Live stock", { h: 28, px: 12, cls: "dg-sub" });
  b += s1.svg;
  b += pill(66 + s1.w + 8, 292, "Financials", { h: 28, px: 12, cls: "dg-sub" }).svg;
  b += t(66, 348, "via Alpha Vantage", "dg-sub");

  // Universe of tracked drugs as a phyllotaxis field
  const U = { x: 450, y: 180, r: 74 };
  b += flow(id, `M268,158 C318,158 326,${U.y} ${U.x - U.r - 10},${U.y}`);
  b += flow(id, `M268,314 C330,314 336,${U.y + 30} ${U.x - U.r + 4},${U.y + 34}`);
  b += elabel(278, 240, "synced");
  const N = 560;
  let field = "";
  for (let i = 0; i < N; i++) {
    const rr = (U.r * Math.sqrt(i + 0.5)) / Math.sqrt(N);
    const th = i * 2.399963;
    const x = U.x + rr * Math.cos(th);
    const y = U.y + rr * Math.sin(th);
    const flagged = i % 41 === 17;
    field += flagged
      ? `<circle cx="${n(x)}" cy="${n(y)}" r="2.6" class="dg-sig-fill"/>`
      : `<circle cx="${n(x)}" cy="${n(y)}" r="1.5" class="dg-star"/>`;
  }
  b += `<circle cx="${U.x}" cy="${U.y}" r="${U.r + 8}" class="dg-halo"/>` + field;
  b += t(U.x, U.y + U.r + 30, "~10,000 drugs tracked", "dg-label", "middle");
  b += t(U.x, U.y + U.r + 46, "trial records joined to market data", "dg-sub", "middle");

  // Discovery and prediction chain
  b += flow(id, `M${U.x},${U.y + U.r + 56} L${U.x},334`);
  b += pill(350, 340, "LLM catalyst discovery", { h: 36, w: 200 }).svg;
  b += flow(id, `M${U.x},376 L${U.x},398`);
  b += pill(350, 404, "Streaming AI predictions", { h: 36, w: 200 }).svg;

  // Catalyst calendar
  const ax = { x0: 712, x1: 1140, y: 338 };
  const today = 990;
  // legend
  const legend = [
    ["circle", "Readout"],
    ["diamond", "PDUFA date"],
    ["square", "Partnership"],
    ["triangle", "Conference"],
  ];
  const shape = (kind, x, y, hollow, sig) => {
    const cls = hollow ? (sig ? "dg-sig-ring" : "dg-ring") : sig ? "dg-sig-fill" : "dg-node";
    if (kind === "circle") return `<circle cx="${x}" cy="${y}" r="6" class="${cls}"/>`;
    if (kind === "diamond") return `<polygon points="${x},${y - 7} ${x + 7},${y} ${x},${y + 7} ${x - 7},${y}" class="${cls}"/>`;
    if (kind === "square") return `<rect x="${x - 5.5}" y="${y - 5.5}" width="11" height="11" rx="1.5" class="${cls}"/>`;
    return `<polygon points="${x},${y - 7} ${x + 7},${y + 5} ${x - 7},${y + 5}" class="${cls}"/>`;
  };
  let lx = 712;
  legend.forEach(([k, s], i) => {
    b += shape(k, lx + 6, 98, false, i === 0);
    b += t(lx + 18, 102, s, "dg-sub");
    lx += est(s, 11.5) + 44;
  });
  b += `<circle cx="718" cy="124" r="5" class="dg-ring"/>`;
  b += t(730, 128, "Hollow marks are upcoming events with streaming AI predictions", "dg-sub");

  // future band
  b += `<rect x="${today}" y="150" width="${ax.x1 - today}" height="${ax.y - 150}" class="dg-future"/>`;
  b += `<line x1="${today}" y1="150" x2="${today}" y2="${ax.y + 6}" class="dg-edge-soft"/>`;
  b += t(today, ax.y + 22, "today", "dg-sub", "middle");
  b += t(today + 10, 166, "upcoming", "dg-sub");

  // illustrative price path, +50% step at the readout
  const readoutX = 920;
  const pre = [
    [712, 262], [740, 258], [766, 265], [792, 256], [818, 260], [844, 252], [870, 258], [896, 255], [readoutX - 2, 257],
  ];
  const post = [
    [readoutX + 4, 214], [946, 210], [970, 216], [today, 212],
  ];
  const pts = [...pre, ...post];
  const d = "M" + pts.map(([x, y]) => `${x},${y}`).join(" L");
  b += `<path d="${d} L${today},${ax.y} L712,${ax.y} Z" class="dg-area"/>`;
  b += `<path d="${d}" class="dg-price"/>`;
  b += `<path d="M${today},212 L1030,208 L1070,214 L1110,206 L1140,210" class="dg-price-fut"/>`;
  b += `<line x1="${ax.x0}" y1="${ax.y}" x2="${ax.x1}" y2="${ax.y}" class="dg-axis"/>`;

  // markers on the axis
  b += shape("triangle", 772, ax.y, false);
  b += shape("square", 846, ax.y, false);
  b += shape("circle", readoutX, ax.y, false, true);
  b += `<line x1="${readoutX}" y1="${ax.y - 8}" x2="${readoutX}" y2="222" class="dg-edge-sig"/>`;
  b += t(readoutX - 12, 182, "Trial readout", "dg-label-sm", "end");
  b += lines(readoutX - 12, 200, ["A single readout can", "move the stock 50%+"], "dg-sub-sig", 14, "end");
  b += shape("diamond", 1060, ax.y, true);
  b += shape("circle", 1112, ax.y, true, true);

  // predictions stream onto the upcoming events
  b += flow(id, `M550,422 L1086,422 L1086,${ax.y + 14}`);
  b += elabel(600, 412, "predicts upcoming readouts, PDUFA dates, partnerships, conferences");

  // delivered as
  b += flow(id, `M${U.x},440 L${U.x},486 L692,486`);
  b += eyebrow(700, 470, "Delivered as");
  const o1 = pill(700, 470 + 0 + 8, "Bulk catalyst briefings", { h: 32 });
  b += o1.svg;
  b += pill(700 + o1.w + 10, 478, "Interactive research chat", { h: 32 }).svg;

  b += outcome("~10,000 drugs", "Tracks ~10,000 clinical-trial drugs and AI-predicts the catalysts that move small-cap biotech stocks");
  b += caption("Pipeline Alpha");

  return frame(
    id,
    "Pipeline Alpha",
    "Pipeline Alpha workflow: clinical-trial data and live market data are synced across about 10,000 drugs, LLM catalyst discovery and streaming AI predictions flag upcoming readouts, PDUFA dates, partnerships and conferences on a catalyst calendar, delivered as bulk briefings and a research chat.",
    b
  );
}

function alphaMeldGlyph(kind, x, y) {
  if (kind === "kg")
    return (
      `<path d="M${x},${y + 20} L${x + 10},${y + 4} L${x + 22},${y + 14} L${x + 32},${y + 2} M${x + 22},${y + 14} L${x + 28},${y + 26} M${x + 10},${y + 4} L${x + 22},${y + 14}" class="dg-glyph"/>` +
      [[0, 20], [10, 4], [22, 14], [32, 2], [28, 26]].map(([a, c]) => `<circle cx="${x + a}" cy="${y + c}" r="3" class="dg-glyph-fill"/>`).join("")
    );
  if (kind === "chat")
    return `<path d="M${x + 5},${y + 2} H${x + 29} a5,5 0 0 1 5,5 V${y + 17} a5,5 0 0 1 -5,5 H${x + 14} L${x + 7},${y + 28} V${y + 22} H${x + 5} a5,5 0 0 1 -5,-5 V${y + 7} a5,5 0 0 1 5,-5 Z" class="dg-glyph"/>` +
      [10, 17, 24].map((a) => `<circle cx="${x + a}" cy="${y + 12}" r="1.8" class="dg-glyph-fill"/>`).join("");
  if (kind === "helix") {
    let p1 = "", p2 = "", rungs = "";
    for (let i = 0; i <= 34; i += 2) {
      const yy1 = y + 14 + 11 * Math.sin((i / 34) * Math.PI * 2);
      const yy2 = y + 14 - 11 * Math.sin((i / 34) * Math.PI * 2);
      p1 += `${i === 0 ? "M" : "L"}${x + i},${n(yy1)} `;
      p2 += `${i === 0 ? "M" : "L"}${x + i},${n(yy2)} `;
      if (i % 6 === 2) rungs += `<line x1="${x + i}" y1="${n(yy1)}" x2="${x + i}" y2="${n(yy2)}" class="dg-glyph" stroke-opacity=".5"/>`;
    }
    return `<path d="${p1}" class="dg-glyph"/><path d="${p2}" class="dg-glyph"/>` + rungs;
  }
  if (kind === "lit")
    return `<path d="M${x + 2},${y} H${x + 20} L${x + 28},${y + 8} V${y + 28} H${x + 2} Z M${x + 20},${y} V${y + 8} H${x + 28}" class="dg-glyph"/>` +
      [13, 18, 23].map((a) => `<line x1="${x + 7}" y1="${y + a}" x2="${x + 23}" y2="${y + a}" class="dg-glyph" stroke-opacity=".6"/>`).join("");
  return `<path d="M${x},${y + 15} H${x + 8} L${x + 12},${y + 3} L${x + 17},${y + 27} L${x + 21},${y + 15} H${x + 34}" class="dg-glyph"/>`;
}

/* ── 4. AlphaMeld Operating System ──────────────────────────────────────── */

function alphaMeld() {
  const id = "am";
  let b = "";

  // Layer gutter
  const layer = (y, title, sub) => eyebrow(48, y, title) + t(48, y + 18, sub, "dg-sub");
  b += layer(132, "Interfaces", "custom UI layer");
  b += layer(298, "ML models", "12 models");
  b += layer(448, "Data and inference", "self-hosted");
  b += `<line x1="48" y1="222" x2="1152" y2="222" class="dg-rule"/>`;
  b += `<line x1="48" y1="392" x2="1152" y2="392" class="dg-rule"/>`;

  // Interfaces
  const tiles = [
    ["Knowledge Graph", "kg"],
    ["ChatAlphaMeld", "chat"],
    ["Bioinformatics", "helix"],
    ["Literature Analysis", "lit"],
    ["AlphaClinMeld", "pulse"],
  ];
  const glyph = alphaMeldGlyph;
  const tw = 170, tg = 16, tx0 = 220;
  tiles.forEach(([name, kind], i) => {
    const x = tx0 + i * (tw + tg);
    b += `<rect x="${x}" y="92" width="${tw}" height="104" rx="14" class="dg-card"/>`;
    b += glyph(kind, x + 18, 110);
    b += t(x + 18, 176, name, "dg-label-sm");
  });

  // Model rail: 12 nodes, five named
  const railY = 296;
  b += `<line x1="230" y1="${railY}" x2="1134" y2="${railY}" class="dg-edge"/>`;
  b += `<line x1="230" y1="${railY}" x2="1134" y2="${railY}" class="dg-flow"/>`;
  const named = [
    ["NER"],
    ["RE"],
    ["Evidence", "scoring"],
    ["Digital-twin", "CT predictors"],
    ["Landscape", "assessment"],
  ];
  named.forEach((lab, i) => {
    const x = 262 + i * 116;
    b += node(x, railY, 6, true, i === 3);
    b += lines(x, railY + 30, lab, "dg-label-sm", 15, "middle");
  });
  for (let j = 0; j < 7; j++) {
    const x = 830 + j * 50;
    b += `<circle cx="${x}" cy="${railY}" r="5" class="dg-ring"/>`;
  }
  b += `<path d="M830,${railY + 18} V${railY + 24} H1130 V${railY + 18}" class="dg-edge-soft"/>`;
  b += t(980, railY + 44, "+ 7 more models", "dg-sub", "middle");

  // Interfaces fed by models
  tiles.forEach((_, i) => {
    const x = tx0 + i * (tw + tg) + tw / 2;
    b += flow(id, `M${x},${railY - 16} L${x},204`);
  });
  b += elabel(tx0 + tw / 2 + 10, 254, "powers");

  // Data and inference
  const stores = [
    ["PostgreSQL", "relational store"],
    ["Neo4j", "graph store"],
    ["Self-hosted LLM APIs", "inference"],
  ];
  const sw = (914 - 32) / 3;
  stores.forEach(([name, sub], i) => {
    const x = 220 + i * (sw + 16);
    b += `<rect x="${n(x)}" y="420" width="${n(sw)}" height="64" rx="14" fill="url(#${id}-core)" class="dg-core-stroke"/>`;
    b += t(x + sw / 2, 448, name, "dg-label", "middle");
    b += t(x + sw / 2, 466, sub, "dg-sub", "middle");
    b += flow(id, `M${n(x + sw / 2)},414 L${n(x + sw / 2)},372`);
  });
  b += elabel(220 + sw / 2 + 10, 400, "feeds");

  b += outcome("Months → weeks", "Compresses hypothesis-to-insight cycles from months to weeks, varying by disease area");
  b += caption("AlphaMeld® Operating System");

  return frame(
    id,
    "AlphaMeld Operating System",
    "AlphaMeld Operating System stack: PostgreSQL, Neo4j and self-hosted LLM APIs feed 12 ML models, including NER, relation extraction, evidence scoring, digital-twin clinical-trial predictors and landscape assessment, which power five interfaces: Knowledge Graph, ChatAlphaMeld, Bioinformatics, Literature Analysis and AlphaClinMeld.",
    b
  );
}

/* ── phone layouts ──────────────────────────────────────────────────────── */
// 380 units wide so 13px labels render near 12px on a 360px-wide phone column.
// Same marks, colours and labels as desktop, re-flowed top to bottom.

const MW = 380;
const mCaption = (h) => t(20, h - 18, "Illustrative workflow, not a product screenshot.", "dg-caption");

function flowRow(items, { x0 = 20, x1 = 360, y0, gap = 8, rowH = 36, make }) {
  let x = x0, y = y0, out = "";
  for (const it of items) {
    const probe = make(0, 0, it);
    if (x + probe.w > x1 && x > x0) {
      x = x0;
      y += rowH;
    }
    out += make(x, y, it).svg;
    x += probe.w + gap;
  }
  return { svg: out, bottom: y + rowH - gap };
}

function discoveryNavigatorMobile() {
  const id = "dnm";
  let b = "";
  b += eyebrow(20, 36, "Start from");
  ["Disease-first", "Target-first", "Indication expansion", "Combination therapy"].forEach((s, i) => {
    const right = i % 2 === 1;
    const x = right ? 198 : 20;
    const y = 50 + Math.floor(i / 2) * 44;
    b += pill(x, y, s, { h: 34, w: 162 }).svg;
    b += node(right ? 198 : 182, y + 17, 3.5, true);
  });
  const ys = [248, 302, 356, 410, 464, 518];
  b += flow(id, `M190,67 L190,${ys[0] - 22}`);

  b += eyebrow(20, 214, "Guided workflow");
  b += `<rect x="20" y="230" width="86" height="306" rx="18" class="dg-band"/>`;
  b += `<g transform="rotate(-90 63 383)">${t(63, 378, "Discovery Copilot", "dg-label-sm", "middle")}${t(63, 394, "alongside every step", "dg-sub", "middle")}</g>`;
  const steps = ["Project", "Config", "Exploration", "Agent scoring", "Ranking", "Hypotheses"];
  ys.forEach((y, i) => {
    const last = i === ys.length - 1;
    b += `<line x1="106" y1="${y}" x2="168" y2="${y}" class="dg-edge-soft"/>`;
    if (!last) b += flow(id, `M190,${y + 18} L190,${ys[i + 1] - 20}`);
    b += `<circle cx="190" cy="${y}" r="24" class="dg-halo${last ? " dg-pulse" : ""}"/>`;
    b += `<circle cx="190" cy="${y}" r="16" class="${last ? "dg-node" : "dg-ring"}"/>`;
    b += t(190, y + 5, String(i + 1), last ? "dg-num-inv" : "dg-num", "middle");
    b += t(220, y + 5, steps[i], "dg-label-sm");
  });

  b += flow(id, `M190,${ys[5] + 26} L190,588`);
  b += elabel(202, 566, "ranked");
  b += `<rect x="20" y="594" width="340" height="146" rx="14" class="dg-card"/>`;
  b += t(38, 622, "Ranked hypotheses", "dg-label");
  [230, 186, 142, 100].forEach((w, i) => {
    const y = 640 + i * 22;
    b += t(44, y + 9, String(i + 1), "dg-num", "middle");
    b += `<rect x="60" y="${y}" width="${w}" height="9" rx="4.5" class="dg-bar" fill-opacity="${[0.95, 0.72, 0.52, 0.34][i]}"/>`;
    b += `<circle cx="${60 + w + 11}" cy="${y + 4.5}" r="3" class="dg-sig-ring"/>`;
  });
  b += `<path d="M300,740 L300,788" class="dg-edge-sig" marker-end="url(#${id}-arrow-sig)"/>`;
  b += t(290, 770, "traceable evidence", "dg-edge-label", "end");

  b += `<rect x="20" y="796" width="340" height="100" rx="16" class="dg-ground"/>`;
  b += eyebrow(38, 822, "Built on");
  b += t(38, 844, "AlphaMeld Knowledge Graph", "dg-label");
  b += constellation(36, 808, 312, 80, 22, 11, { avoid: { x: 28, y: 804, w: 216, h: 52 }, maxD: 58, big: [2, 13] });
  let cx = 20;
  ["Multi-tenant SaaS", "SSO", "RBAC", "Audit logging"].forEach((c) => {
    const ch = chip(cx, 912, c, { h: 24 });
    b += ch.svg;
    cx += ch.w + 8;
  });
  const h = 976;
  b += mCaption(h);
  return frame(id, "Discovery Navigator", "Discovery Navigator workflow: four starting points feed a six-step guided workflow with the Discovery Copilot alongside every step, producing ranked hypotheses with traceable evidence back into the AlphaMeld Knowledge Graph.", b, { w: MW, h, rx: 20 });
}

function quriousRIMobile() {
  const id = "qrm";
  let b = "";
  b += eyebrow(20, 36, "Agencies · 12+");
  const ag = flowRow(["FDA", "EMA", "PMDA", "NMPA", "Health Canada", "MHRA", "Swissmedic", "+ more"], {
    y0: 50,
    make: (x, y, a) => pill(x, y, a, { h: 28 }),
  });
  b += ag.svg;
  const coreTop = ag.bottom + 46;
  b += flow(id, `M190,${ag.bottom + 8} L190,${coreTop - 6}`);
  b += elabel(202, ag.bottom + 30, "approvals");

  const ct = coreTop;
  b += `<rect x="20" y="${ct}" width="340" height="304" rx="18" fill="url(#${id}-core)" class="dg-core-stroke"/>`;
  b += t(40, ct + 36, "Regulatory intelligence", "dg-h");
  b += lines(40, ct + 58, ["Search, analyze, compare, and manage", "global drug and biologic approvals"], "dg-sub", 16);
  let cx = 40;
  ["Pharmaceuticals", "Biologics"].forEach((c) => { const ch = chip(cx, ct + 92, c, { h: 24 }); b += ch.svg; cx += ch.w + 8; });
  cx = 40;
  ["Biosimilars", "Generics"].forEach((c) => { const ch = chip(cx, ct + 124, c, { h: 24 }); b += ch.svg; cx += ch.w + 8; });
  b += `<line x1="40" y1="${ct + 166}" x2="340" y2="${ct + 166}" class="dg-rule"/>`;
  b += eyebrow(40, ct + 190, "Underneath");
  ["Role-based dashboards", "Pathway and classification guides", "Centralized guidelines library", "Expert Q&A", "LLM-powered document analysis"].forEach((s, i) => {
    const y = ct + 212 + i * 20;
    b += `<circle cx="44" cy="${y - 4}" r="2" class="dg-node"/>` + t(54, y, s, "dg-sub");
  });
  const cb = ct + 304;

  const pyTop = cb + 108;
  const baseY = pyTop + 290;
  const half = (y) => ((y - pyTop) * 150) / 290;
  const L = (y) => 190 - half(y);
  const R = (y) => 190 + half(y);
  const pt = (x, y) => `${n(x)},${n(y)}`;
  // Both arrows land on the Module 2 tier's sloped edges, labels outside them.
  const landAt = (x) => pyTop + (Math.abs(190 - x) * 290) / 150;
  b += flow(id, `M148,${cb} L148,${n(landAt(148) - 6)}`);
  b += flow(id, `M232,${cb} L232,${n(landAt(232) - 6)}`);
  b += t(138, cb + 40, "Dossier authoring", "dg-label-sm", "end");
  b += t(138, cb + 56, "AI-assisted", "dg-sub", "end");
  b += t(242, cb + 40, "Gap assessment", "dg-label-sm");
  b += t(242, cb + 56, "section by section", "dg-sub");

  const m1b = pyTop + 54;
  b += `<polygon points="${pt(190, pyTop)} ${pt(R(m1b), m1b)} ${pt(L(m1b), m1b)}" fill="url(#${id}-hatch)" class="dg-tier-off"/>`;
  b += t(190, pyTop + 46, "1", "dg-num-off", "middle");
  b += t(244, pyTop + 22, "Out of scope", "dg-label-sm");
  b += lines(244, pyTop + 38, ["Module 1 is country-", "and company-specific"], "dg-sub", 14);

  const m2t = pyTop + 60, m2b = pyTop + 136;
  b += `<polygon points="${pt(L(m2t), m2t)} ${pt(R(m2t), m2t)} ${pt(R(m2b), m2b)} ${pt(L(m2b), m2b)}" class="dg-tier"/>`;
  b += t(190, pyTop + 88, "Module 2", "dg-label-sm", "middle");
  b += t(190, pyTop + 103, "Summaries", "dg-sub", "middle");
  b += chip(190 - 21, pyTop + 111, "QOS", { cls: "dg-chip-sig", textCls: "dg-chip-sig-text", h: 18 }).svg;

  const bt = pyTop + 142;
  const top = [L(bt), 0, 0, R(bt)];
  top[1] = top[0] + (top[3] - top[0]) / 3; top[2] = top[0] + (2 * (top[3] - top[0])) / 3;
  const bot = [40, 140, 240, 340];
  const g = 3;
  [["3", "Quality"], ["4", "Nonclinical"], ["5", "Clinical"]].forEach(([num, name], i) => {
    const tl = top[i] + (i ? g : 0), tr = top[i + 1] - (i < 2 ? g : 0);
    const bl = bot[i] + (i ? g : 0), br = bot[i + 1] - (i < 2 ? g : 0);
    b += `<polygon points="${pt(tl, bt)} ${pt(tr, bt)} ${pt(br, baseY)} ${pt(bl, baseY)}" class="dg-tier"/>`;
    const c = (tl + tr + bl + br) / 4;
    b += t(c, pyTop + 184, num, "dg-num-md", "middle");
    b += t(c, pyTop + 204, name, "dg-label-xs", "middle");
  });
  const m3c = (top[0] + top[1] + bot[0] + bot[1]) / 4 - 6;
  [["3.2.P.1", pyTop + 220], ["3.2.P.3.3", pyTop + 246]].forEach(([s, y]) => {
    const w = Math.round(est(s, 11, 0.56) + 20);
    b += chip(m3c - w / 2, y, s, { cls: "dg-chip-sig", textCls: "dg-chip-sig-text", h: 18 }).svg;
  });

  b += `<rect x="20" y="${baseY + 22}" width="28" height="14" rx="7" class="dg-chip-sig"/>`;
  b += t(58, baseY + 33, "Reproducibility tested so far", "dg-sub");
  b += `<line x1="22" y1="${baseY + 50}" x2="46" y2="${baseY + 50}" class="dg-edge"/>`;
  b += t(58, baseY + 54, "Both workstreams cover Modules 2 to 5", "dg-sub");
  const h = baseY + 98;
  b += mCaption(h);
  return frame(id, "QuriousRI", "QuriousRI workflow: approvals from 12 or more agencies feed a regulatory intelligence layer, which drives dossier authoring and market-entry gap assessment across CTD Modules 2 to 5. Module 1 is out of scope.", b, { w: MW, h, rx: 20 });
}

function pipelineAlphaMobile() {
  const id = "pam";
  let b = "";
  b += eyebrow(20, 36, "Sources");
  b += `<rect x="20" y="50" width="162" height="132" rx="14" class="dg-card"/>`;
  b += t(34, 74, "Clinical-trial data", "dg-label-sm");
  b += pill(34, 88, "ClinicalTrials.gov", { h: 28, px: 12, cls: "dg-sub", w: 134 }).svg;
  b += pill(34, 124, "Clinical Navigator", { h: 28, px: 12, cls: "dg-sub", w: 134 }).svg;
  b += `<rect x="198" y="50" width="162" height="132" rx="14" class="dg-card"/>`;
  b += t(212, 74, "Market data", "dg-label-sm");
  b += pill(212, 88, "Live stock", { h: 28, px: 12, cls: "dg-sub", w: 134 }).svg;
  b += pill(212, 124, "Financials", { h: 28, px: 12, cls: "dg-sub", w: 134 }).svg;
  b += t(212, 172, "via Alpha Vantage", "dg-sub");

  const U = { x: 190, y: 296, r: 70 };
  b += flow(id, `M101,182 C101,206 150,214 ${U.x - 26},${U.y - U.r - 6}`);
  b += flow(id, `M279,182 C279,206 230,214 ${U.x + 26},${U.y - U.r - 6}`);
  b += elabel(190, 204, "synced", "middle");
  const N = 480;
  let field = `<circle cx="${U.x}" cy="${U.y}" r="${U.r + 8}" class="dg-halo"/>`;
  for (let i = 0; i < N; i++) {
    const rr = (U.r * Math.sqrt(i + 0.5)) / Math.sqrt(N);
    const th = i * 2.399963;
    const x = U.x + rr * Math.cos(th), y = U.y + rr * Math.sin(th);
    field += i % 37 === 15 ? `<circle cx="${n(x)}" cy="${n(y)}" r="2.5" class="dg-sig-fill"/>` : `<circle cx="${n(x)}" cy="${n(y)}" r="1.4" class="dg-star"/>`;
  }
  b += field;
  b += t(190, U.y + U.r + 30, "~10,000 drugs tracked", "dg-label", "middle");
  b += t(190, U.y + U.r + 46, "trial records joined to market data", "dg-sub", "middle");

  b += flow(id, `M190,${U.y + U.r + 56} L190,446`);
  b += pill(70, 452, "LLM catalyst discovery", { h: 36, w: 240 }).svg;
  b += flow(id, `M190,488 L190,508`);
  b += pill(70, 514, "Streaming AI predictions", { h: 36, w: 240 }).svg;
  b += flow(id, `M190,550 L190,588`);
  b += elabel(202, 574, "predicts upcoming events");

  b += eyebrow(20, 612, "Catalyst calendar");
  b += t(20, 628, "Small/mid-cap NASDAQ biotech", "dg-sub");
  const shape = (kind, x, y, hollow, sig) => {
    const cls = hollow ? (sig ? "dg-sig-ring" : "dg-ring") : sig ? "dg-sig-fill" : "dg-node";
    if (kind === "circle") return `<circle cx="${x}" cy="${y}" r="5.5" class="${cls}"/>`;
    if (kind === "diamond") return `<polygon points="${x},${y - 6.5} ${x + 6.5},${y} ${x},${y + 6.5} ${x - 6.5},${y}" class="${cls}"/>`;
    if (kind === "square") return `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" rx="1.5" class="${cls}"/>`;
    return `<polygon points="${x},${y - 6.5} ${x + 6.5},${y + 4.5} ${x - 6.5},${y + 4.5}" class="${cls}"/>`;
  };
  [["circle", "Readout", 26, 652, true], ["diamond", "PDUFA date", 196, 652], ["square", "Partnership", 26, 674], ["triangle", "Conference", 196, 674]].forEach(([k, s, x, y, sig]) => {
    b += shape(k, x, y, false, sig) + t(x + 14, y + 4, s, "dg-sub");
  });
  b += `<circle cx="26" cy="696" r="5" class="dg-ring"/>` + t(40, 700, "Hollow marks: upcoming, AI-predicted", "dg-sub");

  const axY = 868, today = 262, rx = 170;
  b += `<rect x="${today}" y="716" width="${360 - today}" height="${axY - 716}" class="dg-future"/>`;
  b += `<line x1="${today}" y1="716" x2="${today}" y2="${axY + 6}" class="dg-edge-soft"/>`;
  b += t(today, axY + 22, "today", "dg-sub", "middle");
  b += t(today + 8, 732, "upcoming", "dg-sub");
  const pts = [[20, 812], [40, 808], [62, 815], [84, 806], [106, 810], [128, 803], [150, 809], [rx - 2, 807], [rx + 3, 770], [192, 766], [214, 772], [238, 767], [today, 769]];
  const d = "M" + pts.map(([x, y]) => `${x},${y}`).join(" L");
  b += `<path d="${d} L${today},${axY} L20,${axY} Z" class="dg-area"/>`;
  b += `<path d="${d}" class="dg-price"/>`;
  b += `<path d="M${today},769 L290,765 L318,771 L340,764 L360,767" class="dg-price-fut"/>`;
  b += `<line x1="20" y1="${axY}" x2="360" y2="${axY}" class="dg-axis"/>`;
  b += shape("triangle", 50, axY) + shape("square", 108, axY) + shape("circle", rx, axY, false, true);
  b += `<line x1="${rx}" y1="${axY - 8}" x2="${rx}" y2="778" class="dg-edge-sig"/>`;
  b += t(rx - 10, 734, "Trial readout", "dg-label-sm", "end");
  b += lines(rx - 10, 750, ["A single readout can", "move the stock 50%+"], "dg-sub-sig", 14, "end");
  b += shape("diamond", 300, axY, true) + shape("circle", 342, axY, true, true);

  b += eyebrow(20, 924, "Delivered as");
  b += pill(20, 936, "Bulk catalyst briefings", { h: 32 }).svg;
  b += pill(20, 976, "Interactive research chat", { h: 32 }).svg;
  const h = 1044;
  b += mCaption(h);
  return frame(id, "Pipeline Alpha", "Pipeline Alpha workflow: clinical-trial and market data are synced across about 10,000 drugs; LLM catalyst discovery and streaming AI predictions flag upcoming readouts, PDUFA dates, partnerships and conferences, delivered as briefings and a research chat.", b, { w: MW, h, rx: 20 });
}

function alphaMeldMobile() {
  const id = "amm";
  let b = "";
  b += eyebrow(20, 36, "Interfaces");
  const tiles = [["Knowledge Graph", "kg"], ["ChatAlphaMeld", "chat"], ["Bioinformatics", "helix"], ["Literature Analysis", "lit"], ["AlphaClinMeld", "pulse"]];
  // Same glyph shapes as desktop, scaled to the row height.
  const desktop = alphaMeldGlyph;
  tiles.forEach(([name, kind], i) => {
    const y = 50 + i * 52;
    b += `<rect x="20" y="${y}" width="340" height="44" rx="12" class="dg-card"/>`;
    b += `<g transform="translate(36 ${y + 9}) scale(.8)">${desktop(kind, 0, 0)}</g>`;
    b += t(84, y + 27, name, "dg-label-sm");
  });
  [100, 190, 280].forEach((x) => (b += flow(id, `M${x},356 L${x},${310}`)));
  b += elabel(110, 338, "powers");

  b += eyebrow(20, 384, "ML models · 12");
  const named = ["NER", "RE", "Evidence scoring", "Digital-twin CT predictors", "Landscape assessment"];
  b += `<line x1="36" y1="404" x2="36" y2="530" class="dg-edge"/><line x1="36" y1="404" x2="36" y2="530" class="dg-flow"/>`;
  named.forEach((s, i) => {
    const y = 404 + i * 30;
    b += node(36, y, 5.5, true, i === 3) + t(56, y + 4.5, s, "dg-label-sm");
  });
  for (let j = 0; j < 7; j++) b += `<circle cx="${36 + j * 20}" cy="560" r="4.5" class="dg-ring"/>`;
  b += t(178, 564, "+ 7 more models", "dg-sub");

  [100, 190, 280].forEach((x) => (b += flow(id, `M${x},628 L${x},${584}`)));
  b += elabel(110, 612, "feeds");
  b += eyebrow(20, 652, "Data and inference");
  [["PostgreSQL", "relational store"], ["Neo4j", "graph store"], ["Self-hosted LLM APIs", "inference"]].forEach(([name, sub], i) => {
    const y = 666 + i * 56;
    b += `<rect x="20" y="${y}" width="340" height="46" rx="12" fill="url(#${id}-core)" class="dg-core-stroke"/>`;
    b += t(38, y + 28, name, "dg-label-sm") + t(342, y + 28, sub, "dg-sub", "end");
  });
  const h = 868;
  b += mCaption(h);
  return frame(id, "AlphaMeld Operating System", "AlphaMeld Operating System stack: PostgreSQL, Neo4j and self-hosted LLM APIs feed 12 ML models, which power five interfaces: Knowledge Graph, ChatAlphaMeld, Bioinformatics, Literature Analysis and AlphaClinMeld.", b, { w: MW, h, rx: 20 });
}

/* ── output ─────────────────────────────────────────────────────────────── */

const diagrams = [
  { slug: "discovery-navigator", name: "Discovery Navigator", desktop: discoveryNavigator(), mobile: discoveryNavigatorMobile() },
  { slug: "quriousri", name: "QuriousRI", desktop: quriousRI(), mobile: quriousRIMobile() },
  { slug: "pipeline-alpha", name: "Pipeline Alpha", desktop: pipelineAlpha(), mobile: pipelineAlphaMobile() },
  { slug: "alphameld", name: "AlphaMeld® Operating System", desktop: alphaMeld(), mobile: alphaMeldMobile() },
];

const repo = join(here, "..");
const minify = (svg) => svg.replace(/\n/g, "").replace(/\s{2,}/g, " ");
const mod = `// Generated by scripts/build-diagrams.mjs (npm run diagrams). Do not edit by hand.
// Illustrative workflow diagrams for the homepage featured projects. Each SVG
// reads the site's CSS custom properties, so it follows the light and dark theme.

export type ProjectDiagram = { desktop: string; mobile: string };

export const projectDiagrams: Record<string, ProjectDiagram> = ${JSON.stringify(
  Object.fromEntries(diagrams.map((d) => [d.slug, { desktop: minify(d.desktop), mobile: minify(d.mobile) }])),
  null,
  2
)};
`;
writeFileSync(join(repo, "src/content/project-diagrams.ts"), mod);

const reviewDir = join(repo, "review/visual-research/diagrams");
if (existsSync(reviewDir)) {
  for (const d of diagrams) {
    writeFileSync(join(reviewDir, `${d.slug}.svg`), d.desktop);
    writeFileSync(join(reviewDir, `${d.slug}-mobile.svg`), d.mobile);
  }
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Featured diagrams</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;1,400&family=Inter+Tight:wght@400;500;600&display=swap">
<style>:root{--bg:#ffffff;--bg-soft:#f7f6f3;--ink:#111111;--ink-2:#3a3a3a;--ink-3:#6b6b6b;--rule:#e5e5e5;--accent:#1b7a6f;--accent-ink:#155e56;--signal:#a13d1e;--font-display:"Fraunces",Georgia,serif;--font-sans:"Inter Tight","Helvetica Neue",Arial,sans-serif;color-scheme:light}
.dark{--bg:#0e1110;--bg-soft:#181c1b;--ink:#f2efe9;--ink-2:#c9c6bf;--ink-3:#8a8782;--rule:#2a2d2c;--accent:#7fb3ae;--accent-ink:#a8cfcb;--signal:#e28460;color-scheme:dark}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-sans)}main{max-width:1240px;margin:0 auto;padding:40px 16px 80px}
h1{font:400 40px var(--font-display);margin:0 0 24px}h2{font:400 26px var(--font-display);margin:56px 0 16px}button{font:500 14px var(--font-sans);padding:8px 16px;border-radius:8px;border:1px solid var(--rule);background:var(--bg);color:var(--ink);cursor:pointer}
.pair{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:32px;align-items:start}@media(max-width:900px){.pair{grid-template-columns:1fr}}svg{display:block;width:100%;height:auto}</style></head>
<body><main><h1>Featured project diagrams</h1><button id="theme" type="button">Toggle dark</button>
${diagrams.map((d) => `<section id="${d.slug}"><h2>${d.name}</h2><div class="pair"><div>${d.desktop}</div><div id="${d.slug}-mobile">${d.mobile}</div></div></section>`).join("\n")}
</main><script>document.getElementById("theme").addEventListener("click",()=>document.documentElement.classList.toggle("dark"));if(location.hash==="#dark")document.documentElement.classList.add("dark");</script></body></html>`;
  writeFileSync(join(reviewDir, "index.html"), html);
}
console.log("wrote src/content/project-diagrams.ts" + (existsSync(reviewDir) ? " and review copies" : ""));
