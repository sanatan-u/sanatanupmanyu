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
.dg-num-sm{font:500 12px var(--dg-display);fill:var(--dg-acc)}
.dg-num-inv-sm{font:500 12px var(--dg-display);fill:var(--dg-bg)}
.dg-seg-sig{fill:var(--dg-sig)}
.dg-seg-mid{fill:var(--dg-ink3)}
.dg-seg-acc{fill:var(--dg-acc)}
.dg-num-off{font:400 18px var(--dg-display);fill:var(--dg-ink3)}
.dg-fig{font:italic 400 36px var(--dg-display);letter-spacing:-.02em;fill:var(--dg-sig)}
.dg-impact{font:400 15px var(--dg-sans);fill:var(--dg-ink2)}
.dg-caption{font:400 11px var(--dg-sans);fill:var(--dg-ink3)}
.dg-pill{fill:var(--dg-bg);stroke:var(--dg-rule);stroke-width:1}
.dg-card-dashed{fill:var(--dg-bg);stroke:var(--dg-acc);stroke-opacity:.6;stroke-dasharray:4 4}
.dg-card-muted{fill:var(--dg-bg);stroke:var(--dg-ink3);stroke-opacity:.55;stroke-dasharray:3 3}
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

const DN_WORKFLOWS = [
  [["Target", "Discovery"], "Ranked targets", 7, false],
  [["Indication", "Discovery"], "Ranked indications", 6, false],
  [["Safety", "Assessment"], "Organ risk report", 5, false],
  [["Hypothesis", "De-risking"], "Go / no-go dossier", 6, false],
  [["Drug", "Repurposing"], "Candidate matrix", 8, true],
  [["Biomarker", "Identification"], "Biomarker panel", 4, true],
];
const DN_ENGINE = [["Query", "design"], ["KG", "retrieval"], ["Sentence-level", "validation"], ["Agent-led", "assessment"], ["Cited", "synthesis"]];
const DN_TOOLS = [
  ["Co-Pilot", "Project-aware research"],
  ["Trial Designer", "13 steps, each approved"],
  ["Network Explorer", "Uncapped graph, 2D / 3D"],
  ["Custom Reports", "Claims checked on KG"],
  ["Literature Radar", "Alerts on new papers"],
  ["Weekly Digest", "Local-morning email"],
];

function discoveryNavigator() {
  const id = "dn";
  let b = "";
  b += eyebrow(48, 64, "Start from");
  b += eyebrow(260, 64, "Six workflows");
  b += eyebrow(770, 64, "Outputs");
  b += eyebrow(980, 64, "Toolbox · same graph");

  ["A disease", "A target", "Target + disease"].forEach((s, i) => (b += pill(48, 92 + i * 44, s, { h: 34, w: 180 }).svg));
  b += t(48, 244, "AI drafts the setup", "dg-sub");
  b += flow(id, `M228,153 C242,153 244,150 254,150`);

  // Six workflow cards; the two enabled per organisation are dashed
  const gw = 152, gh = 100;
  const gx = (c) => 260 + c * (gw + 12);
  const gy = (r) => 88 + r * (gh + 24);
  DN_WORKFLOWS.forEach(([nm, out, steps, perOrg], i) => {
    const c = i % 3, r = Math.floor(i / 3), x = gx(c), y = gy(r);
    b += `<rect x="${x}" y="${y}" width="${gw}" height="${gh}" rx="14" class="${perOrg ? "dg-card-dashed" : "dg-card"}"/>`;
    b += lines(x + 14, y + 26, nm, "dg-label-sm", 16);
    b += t(x + 14, y + 64, out, "dg-sub");
    b += chip(x + 14, y + 72, `${steps} steps`, { h: 18 }).svg;
    if (perOrg) b += t(x + gw - 12, y + 20, "per org", "dg-sub", "end");
  });
  b += `<path d="M${gx(0) + 76},${gy(0) + gh + 2} L${gx(0) + 76},${gy(1) - 4}" class="dg-edge-sig" marker-end="url(#${id}-arrow-sig)"/>`;
  b += `<line x1="262" y1="${gy(1) + gh + 22}" x2="286" y2="${gy(1) + gh + 22}" class="dg-edge-sig"/>`;
  b += t(296, gy(1) + gh + 26, "Continue with… hands any result to another workflow, pre-filled", "dg-sub");

  // Shared evidence engine every workflow runs
  const ey = 398;
  b += eyebrow(260, ey - 30, "Every workflow runs the same evidence engine");
  b += `<line x1="280" y1="${ey}" x2="720" y2="${ey}" class="dg-edge"/><line x1="280" y1="${ey}" x2="720" y2="${ey}" class="dg-flow"/>`;
  DN_ENGINE.forEach((lab, i) => {
    const x = 280 + i * 110;
    b += node(x, ey, 6, true, i === 4);
    b += lines(x, ey + 24, lab, "dg-label-xs", 13, "middle");
  });
  b += eyebrow(48, 300, "Also reads");
  ["PubMed", "ClinicalTrials.gov", "Crossref", "Web search"].forEach((s, i) => (b += chip(48, 314 + i * 30, s, { h: 22 }).svg));
  b += flow(id, `M196,${ey} L268,${ey}`);
  b += elabel(204, ey - 8, "evidence");

  // Knowledge graph layer
  b += `<path d="M400,${ey + 6} C432,${ey + 14} 437,${ey + 34} 437,${ey + 50}" class="dg-edge" marker-end="url(#${id}-arrow)"/>`;
  b += `<rect x="260" y="454" width="480" height="76" rx="16" class="dg-ground"/>`;
  b += t(280, 480, "AlphaMeld Knowledge Graph API", "dg-label");
  b += t(280, 498, "492K entities · ~26M scored relationships", "dg-sub");
  b += t(280, 514, "Sentence-level evidence behind each edge", "dg-sub");
  b += constellation(552, 462, 178, 60, 16, 7, { maxD: 56, big: [3] });

  // Outputs and enterprise
  b += flow(id, `M742,150 L764,150`);
  b += `<rect x="770" y="88" width="180" height="228" rx="14" class="dg-card"/>`;
  b += t(788, 114, "Exports", "dg-label-sm");
  [["PDF", 0, 0], ["Word", 1, 0], ["Excel", 0, 1], ["PowerPoint", 1, 1], ["CSV", 0, 2]].forEach(([s, c, r]) => (b += chip(788 + c * 66, 128 + r * 30, s, { h: 22 }).svg));
  b += lines(788, 236, ["Each export carries the run ID,", "graph snapshot, and model and", "prompt versions."], "dg-sub", 16);
  b += `<rect x="770" y="336" width="180" height="100" rx="14" class="dg-card"/>`;
  b += t(788, 362, "Enterprise", "dg-label-sm");
  b += lines(788, 382, ["SSO, MFA and passkeys", "Five roles, audit log", "Per-org workflow switches"], "dg-sub", 18);

  // Toolbox
  DN_TOOLS.forEach(([name, sub], i) => {
    const y = 88 + i * 58;
    b += `<rect x="980" y="${y}" width="172" height="48" rx="12" class="dg-card"/>`;
    b += t(996, y + 21, name, "dg-label-sm") + t(996, y + 38, sub, "dg-sub");
  });
  b += `<path d="M1066,428 L1066,490 L746,490" class="dg-edge-soft" marker-end="url(#${id}-arrow)"/>`;
  b += elabel(980, 484, "same graph");

  b += outcome("Weeks → hours", "Hypothesis landscaping compressed from weeks to hours, with traceable evidence at every step.");
  b += caption("Discovery Navigator");
  return frame(
    id,
    "Discovery Navigator",
    "Discovery Navigator: a disease, a target or a hypothesis starts one of six workflows (Target Discovery, Indication Discovery, Safety Assessment, Hypothesis De-risking, Drug Repurposing, Biomarker Identification) that hand results to each other. Every workflow runs the same engine of query design, knowledge-graph retrieval, sentence-level validation, agent-led assessment and cited synthesis over the AlphaMeld Knowledge Graph API, with PubMed, ClinicalTrials.gov, Crossref and web evidence. Exports carry run provenance, and a toolbox of Co-Pilot, Trial Designer, Network Explorer, Custom Reports, Literature Radar and a weekly digest reads the same graph.",
    b
  );
}

/* ── 2. QuriousRI ───────────────────────────────────────────────────────── */

const QR_SOURCES = [
  ["Agency guidance", "Guidelines and announcements"],
  ["Product registers", "National approvals"],
  ["Orange and Purple Book", "US patents and exclusivity"],
];
const QR_EXPLORE = [
  ["Intelligence", ["Regulatory Explorer", "Analytics", "Ask AI assistant", "Weekly brief"]],
  ["Databases", ["Approved products", "Market landscape", "Patents and exclusivity", "Cross-market matrix", "Company analysis"]],
  ["Reports and checkers", ["Report Builder", "Label checker", "Compliance checker"]],
];
const QR_CHAIN = [
  ["RLD Finder", ["Reference product", "per target market"]],
  ["Gap Assessment", ["Section by section", "vs. market rules"]],
  ["Dossier Authoring", ["CMC sections, live", "co-editing, eCTD"]],
];
const QR_GOLD = ["2.3.S", "3.2.P.1", "3.2.P.3.3"];
const QR_PLATFORM = ["English and Japanese", "SSO, MFA and passkeys", "Tamper-evident audit trail", "Per-org feature switches"];

function quriousRI() {
  const id = "qr";
  let b = "";
  b += eyebrow(48, 64, "Sources");
  b += eyebrow(262, 64, "Regulatory corpus");

  // Sources, public then client-side
  QR_SOURCES.forEach(([title, sub], i) => {
    const y = 88 + i * 84;
    b += `<rect x="48" y="${y}" width="182" height="72" rx="14" class="dg-card"/>`;
    b += t(64, y + 30, title, "dg-label-sm") + t(64, y + 48, sub, "dg-sub");
    b += flow(id, `M230,${y + 36} L256,${y + 36}`);
  });
  b += eyebrow(48, 354, "Client side");
  b += `<rect x="48" y="364" width="182" height="72" rx="14" class="dg-card"/>`;
  b += t(64, 394, "Your dossiers", "dg-label-sm") + t(64, 412, "OCR and eCTD tagging", "dg-sub");
  b += flow(id, `M230,400 L256,400`);

  // Corpus and agents
  b += `<rect x="262" y="88" width="238" height="348" rx="18" fill="url(#${id}-core)" class="dg-core-stroke"/>`;
  b += t(282, 120, "Central drug database", "dg-label");
  b += lines(282, 142, ["Full text, translations and", "impact summaries"], "dg-sub", 16);
  b += chip(282, 178, "Vector + keyword search", { h: 22 }).svg;
  b += chip(282, 206, "Reranked, cited answers", { h: 22 }).svg;
  b += `<line x1="282" y1="244" x2="480" y2="244" class="dg-rule"/>`;
  b += eyebrow(282, 268, "Agents");
  ["Assistant router", "Report research", "Reference-product evidence", "Gap extract and evaluate", "Authoring knowledge base"].forEach((s, i) => {
    const y = 290 + i * 20;
    b += `<circle cx="286" cy="${y - 4}" r="2" class="dg-node"/>` + t(296, y, s, "dg-sub");
  });
  b += t(282, 420, "Daily regulatory watch, weekly brief", "dg-sub-sig");

  // Explore group
  b += `<rect x="524" y="80" width="628" height="160" rx="16" class="dg-ground"/>`;
  b += eyebrow(540, 104, "Explore");
  const ew = [182, 182, 220];
  let ex = 540;
  QR_EXPLORE.forEach(([title, items], i) => {
    b += `<rect x="${ex}" y="114" width="${ew[i]}" height="118" rx="12" class="dg-card"/>`;
    b += t(ex + 14, 136, title, "dg-label-sm");
    items.forEach((s, j) => (b += `<circle cx="${ex + 18}" cy="${152 + j * 16}" r="2" class="dg-node"/>` + t(ex + 26, 156 + j * 16, s, "dg-sub")));
    ex += ew[i] + 12;
  });
  b += flow(id, `M500,160 L518,160`);

  // File and monitor group
  b += `<rect x="524" y="256" width="628" height="180" rx="16" class="dg-ground"/>`;
  b += eyebrow(540, 280, "From approval to filing");
  b += `<rect x="540" y="290" width="360" height="138" rx="12" class="dg-card"/>`;
  const cxs = [584, 704, 824];
  b += `<line x1="${cxs[0]}" y1="318" x2="${cxs[2]}" y2="318" class="dg-edge"/><line x1="${cxs[0]}" y1="318" x2="${cxs[2]}" y2="318" class="dg-flow"/>`;
  QR_CHAIN.forEach(([name, sub], i) => {
    b += `<circle cx="${cxs[i]}" cy="318" r="12" class="${i === 2 ? "dg-node" : "dg-ring"}"/>`;
    b += t(cxs[i], 322, String(i + 1), i === 2 ? "dg-num-inv-sm" : "dg-num-sm", "middle");
    b += t(cxs[i], 350, name, "dg-label-xs", "middle");
    b += lines(cxs[i], 366, sub, "dg-sub", 14, "middle");
  });
  let gx = 556;
  QR_GOLD.forEach((s) => {
    const c = chip(gx, 400, s, { cls: "dg-chip-sig", textCls: "dg-chip-sig-text", h: 18 });
    b += c.svg;
    gx += c.w + 6;
  });
  b += t(gx + 4, 413, "graded vs. gold standards", "dg-sub-sig");
  b += flow(id, `M500,360 L518,360`);
  b += `<rect x="912" y="290" width="232" height="138" rx="12" class="dg-card"/>`;
  b += t(928, 314, "My Products", "dg-label-sm");
  b += chip(928, 326, "Impacted now", { cls: "dg-chip-sig", textCls: "dg-chip-sig-text", h: 22 }).svg;
  b += chip(928, 354, "Plan ahead", { h: 22 }).svg;
  b += chip(928, 382, "Not yet", { h: 22 }).svg;
  b += lines(1040, 340, ["Every regulatory", "change, read", "against each", "product and", "market"], "dg-sub", 15);

  // Platform
  let px = 48;
  QR_PLATFORM.forEach((s) => {
    const c = chip(px, 460, s, { h: 24 });
    b += c.svg;
    px += c.w + 8;
  });

  b += outcome("Signal → submission", "Regulatory intelligence, product registers and patents in one platform, plus reference-product search, per-section gap assessment and CTD authoring for generic filings");
  b += caption("QuriousRI");
  return frame(
    id,
    "QuriousRI",
    "QuriousRI: agency guidance, national product registers, the Orange and Purple Books and the client's own dossiers feed a central drug database with hybrid search and agents. Users explore it through intelligence, databases, reports and checkers, take a product from approval to filing through RLD Finder, Gap Assessment and Dossier Authoring (graded against gold standards for 2.3.S, 3.2.P.1 and 3.2.P.3.3), and see product-aware regulatory impact in My Products.",
    b
  );
}

/* ── 3. Pipeline Alpha ──────────────────────────────────────────────────── */

function pipelineAlpha() {
  const id = "pa";
  let b = "";
  b += eyebrow(48, 64, "Sources");
  b += eyebrow(290, 64, "Nightly sync · 9 stages");
  b += eyebrow(616, 64, "Prediction engine · on demand");
  b += eyebrow(948, 64, "Product");

  // Sources
  const card = (y, h, title, sub) =>
    `<rect x="48" y="${y}" width="210" height="${h}" rx="14" class="dg-card"/>` +
    t(66, y + 26, title, "dg-label") +
    t(66, y + 44, sub, "dg-sub");
  b += card(92, 70, "Clinical Navigator", "Companies, assets, events");
  b += card(176, 70, "ClinicalTrials.gov", "Trial status and dates");
  b += card(260, 176, "Market data", "First provider that answers");
  ["Alpha Vantage", "Yahoo Finance", "Finnhub", "SerpAPI"].forEach((s, i) => {
    const y = 318 + i * 28;
    b += chip(66, y, s, { h: 22 }).svg;
    if (i < 3) b += `<line x1="78" y1="${y + 22}" x2="78" y2="${y + 28}" class="dg-edge-soft"/>`;
  });

  // Nightly sync: nine stages in order, the two LLM stages filled
  const stages = ["Sync entities", "Sync asset events", "Merge trials", "Seed trial catalysts", "Sync stock prices", "Catalyst discovery", "Milestone predictions", "Generate signals", "Run simulations"];
  const sy = (i) => 104 + i * 36;
  b += `<line x1="306" y1="${sy(0)}" x2="306" y2="${sy(8)}" class="dg-edge"/><line x1="306" y1="${sy(0)}" x2="306" y2="${sy(8)}" class="dg-flow"/>`;
  stages.forEach((s, i) => {
    const llm = i === 5 || i === 6;
    b += `<circle cx="306" cy="${sy(i)}" r="11" class="${llm ? "dg-node" : "dg-ring"}"/>`;
    b += t(306, sy(i) + 4, String(i + 1), llm ? "dg-num-inv-sm" : "dg-num-sm", "middle");
    b += t(328, sy(i) + 4.5, s, "dg-label-sm");
    if (llm) b += chip(488, sy(i) - 10, "LLM", { h: 20 }).svg;
  });
  b += lines(290, sy(8) + 34, ["Daily at 02:00. A failed critical stage", "skips the stages that depend on it."], "dg-sub", 15);
  b += flow(id, `M258,127 C276,127 276,${sy(0)} 292,${sy(0)}`);
  b += flow(id, `M258,211 C276,211 276,${sy(2)} 292,${sy(2)}`);
  b += flow(id, `M258,300 C276,300 276,${sy(4)} 292,${sy(4)}`);

  // Prediction engine
  const ex = 616, ew = 296, cx = ex + ew / 2;
  b += flow(id, `M534,${sy(6)} C574,${sy(6)} 578,300 ${ex - 6},300`);
  b += lines(548, sy(6) + 26, ["enriched", "catalysts"], "dg-edge-label", 14);
  b += `<rect x="${ex}" y="88" width="${ew}" height="432" rx="18" fill="url(#${id}-core)" class="dg-core-stroke"/>`;
  b += t(ex + 18, 114, "Four specialists", "dg-label-sm");
  [["Clinical", 0, 0], ["Competitive", 1, 0], ["Regulatory", 0, 1], ["Financial", 1, 1]].forEach(([s, c, r]) => {
    b += chip(ex + 18 + c * 134, 124 + r * 30, s, { h: 24 }).svg;
  });
  b += flow(id, `M${cx},182 L${cx},202`);
  b += pill(cx - 110, 206, "Critic · counter-thesis", { h: 32, w: 220 }).svg;
  b += flow(id, `M${cx},238 L${cx},258`);
  b += elabel(cx, 282, "≤ 2 rounds", "middle");
  b += `<path d="M${cx - 40},296 L${cx + 40},296" class="dg-edge" marker-start="url(#${id}-arrow)" marker-end="url(#${id}-arrow)"/>`;
  b += `<circle cx="${cx - 64}" cy="296" r="21" class="dg-ring"/>` + t(cx - 64, 300, "Bull", "dg-label-xs", "middle");
  b += `<circle cx="${cx + 64}" cy="296" r="21" class="dg-sig-ring"/>` + t(cx + 64, 300, "Bear", "dg-label-xs", "middle");
  const mem = chip(0, 0, "Prediction memory", { h: 22 });
  b += chip(cx - mem.w / 2, 330, "Prediction memory", { h: 22 }).svg;
  b += `<path d="M${cx - mem.w / 2 + 10},330 L${cx - 64},317" class="dg-edge-soft"/><path d="M${cx + mem.w / 2 - 10},330 L${cx + 64},317" class="dg-edge-soft"/>`;
  b += flow(id, `M${cx},356 L${cx},378`);
  b += pill(cx - 110, 382, "Judge · verdict", { h: 32, w: 220 }).svg;
  b += flow(id, `M${cx},414 L${cx},432`);
  const segs = [["dg-seg-sig", 0.8], ["dg-seg-sig", 0.4], ["dg-seg-mid", 0.3], ["dg-seg-acc", 0.45], ["dg-seg-acc", 0.85]];
  const sx = ex + 18, sw = (ew - 36 - 8) / 5;
  segs.forEach(([c, o], i) => (b += `<rect x="${n(sx + i * (sw + 2))}" y="440" width="${n(sw)}" height="12" rx="3" class="${c}" fill-opacity="${o}"/>`));
  const mk = sx + 3 * (sw + 2) + sw / 2;
  b += `<polygon points="${n(mk - 5)},430 ${n(mk + 5)},430 ${n(mk)},437" class="dg-node"/>`;
  b += t(sx, 470, "Strong sell", "dg-sub");
  b += t(cx, 470, "Hold", "dg-sub", "middle");
  b += t(ex + ew - 18, 470, "Strong buy", "dg-sub", "end");
  b += t(cx, 498, "Five-tier outlook and per-event predictions", "dg-label-xs", "middle");

  // Product surface
  const tiles = [
    ["Catalyst calendar", "Readouts, PDUFA, partners"],
    ["Bulk briefings", "Critic-reviewed, retryable"],
    ["Screener", "Scouts, filters, ranking"],
    ["Smart Money", "VC and Congress trades"],
    ["Simulation", "AI paper trading"],
    ["Projections", "Graded on real price moves"],
  ];
  tiles.forEach(([name, sub], i) => {
    const y = 92 + i * 58;
    b += `<rect x="948" y="${y}" width="204" height="48" rx="12" class="dg-card"/>`;
    b += t(966, y + 21, name, "dg-label-sm") + t(966, y + 38, sub, "dg-sub");
    b += flow(id, `M${ex + ew},300 C${ex + ew + 20},300 ${926},${y + 24} 942,${y + 24}`, { arrow: i === 0 || i === 5 });
  });
  // Feedback loop: projections grade predictions against what the price did
  b += `<path d="M1050,430 C1050,500 960,512 ${ex + ew + 6},476" class="dg-edge-sig" marker-end="url(#${id}-arrow-sig)"/>`;
  b += t(1000, 512, "accuracy feeds back", "dg-edge-label");

  b += outcome("~10,000 drugs", "Tracks ~10,000 clinical-trial drugs and AI-predicts the catalysts that move small-cap biotech stocks");
  b += caption("Pipeline Alpha");
  return frame(
    id,
    "Pipeline Alpha",
    "Pipeline Alpha: Clinical Navigator, ClinicalTrials.gov and market data feed a nightly nine-stage sync with LLM catalyst discovery and milestone prediction. On demand, four specialist agents feed a critic, a bull/bear debate with memory and a judge, producing a five-tier outlook and per-event predictions, which power the catalyst calendar, bulk briefings, screener, smart-money tracking, simulation and a projections hub that grades predictions against real price moves.",
    b
  );
}

/* ── 4. AlphaMeld Operating System ──────────────────────────────────────── */

const AM_TOOLS = ["find_entity", "get_evidence", "find_connection", "assess_safety"];

function alphaMeld() {
  const id = "am";
  let b = "";
  b += eyebrow(48, 64, "Daily literature pipeline");
  b += eyebrow(310, 64, "Three graphs · DozerDB (Neo4j)");
  b += eyebrow(600, 64, "Access");
  b += eyebrow(880, 64, "Consumers");

  // Pipeline stations
  const st = (y, h, title, subs) =>
    `<rect x="48" y="${y}" width="220" height="${h}" rx="14" class="dg-card"/>` + t(64, y + 26, title, "dg-label-sm") + lines(64, y + 44, subs, "dg-sub", 15);
  b += st(88, 62, "Sources", ["PubMed · PMC · Semantic Scholar"]);
  b += st(170, 62, "Ingest and split", ["Articles into sentences, PostgreSQL"]);
  b += st(252, 76, "Evidence level", ["PubMedBERT classifier: clinical,", "in vivo or in vitro"]);
  b += `<rect x="48" y="348" width="220" height="114" rx="14" class="dg-card"/>`;
  b += t(64, 374, "NLP workers", "dg-label-sm") + t(150, 374, "on RabbitMQ", "dg-sub");
  ["NER · 9 entity types", "Linking · 3.3M concepts", "Relations · 24 types"].forEach((s, i) => (b += chip(64, 384 + i * 25, s, { h: 21 }).svg));
  [[150, 170], [232, 252], [328, 348]].forEach(([a, c]) => (b += flow(id, `M158,${a} L158,${c - 4}`)));

  // Three graphs
  const db = (y, h, title, cadence, subs, cls = "dg-card") =>
    `<rect x="310" y="${y}" width="250" height="${h}" rx="14" class="${cls}"/>` +
    `<ellipse cx="334" cy="${y + 22}" rx="10" ry="4" class="dg-glyph"/><path d="M324,${y + 22} V${y + 34} a10,4 0 0 0 20,0 V${y + 22}" class="dg-glyph"/>` +
    t(354, y + 28, title, "dg-label-sm") +
    chip(500, y + 14, cadence, { h: 20 }).svg +
    lines(326, y + 54, subs, "dg-sub", 15);
  b += db(88, 96, "Evidence graph", "daily", ["Every sentence and relation,", "~2.5B relationships"]);
  b += db(208, 80, "Aggregated graph", "weekly", ["One edge per entity pair"]);
  b += `<rect x="310" y="312" width="250" height="124" rx="14" fill="url(#${id}-core)" class="dg-core-stroke"/>`;
  b += `<ellipse cx="334" cy="334" rx="10" ry="4" class="dg-glyph"/><path d="M324,334 V346 a10,4 0 0 0 20,0 V334" class="dg-glyph"/>`;
  b += t(354, 340, "Scored graph", "dg-label-sm") + chip(500, 326, "weekly", { h: 20 }).svg;
  b += lines(326, 366, ["Direct, association and direction", "scores, predicted mechanism"], "dg-sub", 15);
  b += t(326, 416, "492K entities · ~26M relationships", "dg-label-xs");
  b += flow(id, `M268,405 C292,405 284,136 304,136`);
  b += elabel(274, 268, "daily");
  b += flow(id, `M435,184 L435,204`);
  b += flow(id, `M435,288 L435,308`);

  // Access layer
  b += `<rect x="600" y="88" width="240" height="150" rx="14" class="dg-card"/>`;
  b += t(618, 114, "Knowledge Graph API", "dg-label-sm") + t(618, 132, "Read-only REST", "dg-sub");
  b += flowRow(["Nodes", "Search", "Traversal", "Analytics", "Evidence", "GraphRAG context"], { x0: 618, x1: 828, y0: 144, rowH: 28, make: (x, y, s) => chip(x, y, s, { h: 21 }) }).svg;
  b += `<rect x="600" y="254" width="240" height="182" rx="14" fill="url(#${id}-core)" class="dg-core-stroke"/>`;
  b += t(618, 280, "MCP server", "dg-label-sm") + t(618, 298, "16 read-only tools for AI agents", "dg-sub");
  b += flowRow([...AM_TOOLS, "+12 more"], { x0: 618, x1: 834, y0: 310, rowH: 26, make: (x, y, s) => chip(x, y, s, { h: 20 }) }).svg;
  b += t(618, 424, "Tiered eval gate on every deploy", "dg-sub-sig");
  b += flow(id, `M560,136 L594,136`);
  b += elabel(566, 128, "evidence");
  b += flow(id, `M560,360 C578,360 576,200 594,200`);
  b += flow(id, `M560,380 L594,380`);
  b += elabel(566, 398, "ranking");

  // Consumers
  b += `<rect x="880" y="88" width="272" height="86" rx="14" fill="url(#${id}-core)" class="dg-core-stroke"/>`;
  b += t(898, 116, "Discovery Navigator", "dg-label") + t(898, 136, "Flagship: six workflows, Co-Pilot,", "dg-sub") + t(898, 152, "Trial Designer", "dg-sub");
  const cons = (y, h, title, subs, cls = "dg-card") => `<rect x="880" y="${y}" width="272" height="${h}" rx="14" class="${cls}"/>` + t(898, y + 26, title, "dg-label-sm") + lines(898, y + 44, subs, "dg-sub", 15);
  b += cons(186, 62, "AI agents", ["Through the MCP server"]);
  b += cons(260, 62, "Rediscovery", ["Repurposing for essential tremor"]);
  b += cons(334, 102, "Original platform modules", ["Knowledge Graph · ChatAlphaMeld", "Bioinformatics · Literature Analysis", "AlphaClinMeld"], "dg-card-muted");
  b += flow(id, `M840,150 C860,150 860,131 874,131`);
  b += flow(id, `M840,190 C862,190 858,291 874,291`, { arrow: true });
  b += flow(id, `M840,220 C866,220 856,385 874,385`, { arrow: true });
  b += flow(id, `M840,330 C860,330 858,217 874,217`);

  // Next-generation graph, R&D
  b += `<rect x="48" y="474" width="1104" height="58" rx="14" class="dg-band"/>`;
  b += t(68, 498, "Next-generation graph · R&D", "dg-label-sm");
  b += t(68, 518, "Whole-article extraction into span-grounded, Biolink-aligned claims over 41.7M documents and 607K trials", "dg-sub");

  b += outcome("Months → weeks", "Compresses hypothesis-to-insight cycles from months to weeks, varying by disease area");
  b += caption("AlphaMeld® Operating System");
  return frame(
    id,
    "AlphaMeld Operating System",
    "AlphaMeld Operating System: a daily pipeline ingests PubMed, PMC and Semantic Scholar, splits sentences, classifies evidence level and runs NER, entity linking and relation extraction on RabbitMQ workers into a daily evidence graph; weekly builds aggregate and score it into a 492K-entity, ~26M-relationship graph on DozerDB. A read-only Knowledge Graph API and a 16-tool MCP server serve it to Discovery Navigator, AI agents, Rediscovery and the original platform modules. A next-generation graph is in R&D.",
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
  b += flowRow(["A disease", "A target", "Target + disease"], { y0: 50, rowH: 40, make: (x, y, s) => pill(x, y, s, { h: 32 }) }).svg;
  b += t(20, 104, "AI drafts the setup", "dg-sub");
  b += flow(id, `M190,112 L190,134`);

  b += eyebrow(20, 160, "Six workflows");
  DN_WORKFLOWS.forEach(([nm, out, steps, perOrg], i) => {
    const x = i % 2 ? 198 : 20, y = 172 + Math.floor(i / 2) * 108;
    b += `<rect x="${x}" y="${y}" width="162" height="96" rx="14" class="${perOrg ? "dg-card-dashed" : "dg-card"}"/>`;
    b += lines(x + 14, y + 26, nm, "dg-label-sm", 16);
    b += t(x + 14, y + 62, out, "dg-sub");
    b += chip(x + 14, y + 70, `${steps} steps`, { h: 18 }).svg;
    if (perOrg) b += t(x + 150, y + 20, "per org", "dg-sub", "end");
  });
  const ly = 172 + 3 * 108 + 8;
  b += `<line x1="22" y1="${ly}" x2="46" y2="${ly}" class="dg-edge-sig"/>`;
  b += lines(58, ly + 4, ["Continue with… hands any result to", "another workflow, pre-filled."], "dg-sub", 15);

  const es = ly + 56;
  b += eyebrow(20, es, "The same evidence engine");
  const labels = ["Query design", "KG retrieval", "Sentence-level validation", "Agent-led assessment", "Cited synthesis"];
  const ny = (i) => es + 24 + i * 30;
  b += `<line x1="36" y1="${ny(0)}" x2="36" y2="${ny(4)}" class="dg-edge"/><line x1="36" y1="${ny(0)}" x2="36" y2="${ny(4)}" class="dg-flow"/>`;
  labels.forEach((s, i) => (b += node(36, ny(i), 5.5, true, i === 4) + t(56, ny(i) + 4.5, s, "dg-label-sm")));

  const kg = ny(4) + 30;
  b += `<rect x="20" y="${kg}" width="340" height="86" rx="16" class="dg-ground"/>`;
  b += t(36, kg + 26, "AlphaMeld Knowledge Graph API", "dg-label-sm");
  b += t(36, kg + 44, "492K entities · ~26M relationships", "dg-sub");
  b += t(36, kg + 60, "Sentence-level evidence per edge", "dg-sub");
  b += constellation(262, kg + 12, 88, 62, 9, 5, { maxD: 46, big: [2] });
  b += eyebrow(20, kg + 116, "Also reads");
  const ar = flowRow(["PubMed", "ClinicalTrials.gov", "Crossref", "Web search"], { y0: kg + 128, rowH: 30, make: (x, y, s) => chip(x, y, s, { h: 22 }) });
  b += ar.svg;

  const ex = ar.bottom + 30;
  b += eyebrow(20, ex, "Outputs");
  b += `<rect x="20" y="${ex + 12}" width="340" height="104" rx="14" class="dg-card"/>`;
  b += flowRow(["PDF", "Word", "Excel", "PowerPoint", "CSV"], { x0: 36, x1: 344, y0: ex + 26, rowH: 30, make: (x, y, s) => chip(x, y, s, { h: 22 }) }).svg;
  b += lines(36, ex + 76, ["Each export carries the run ID, graph", "snapshot, and model and prompt versions."], "dg-sub", 15);

  const tb = ex + 146;
  b += eyebrow(20, tb, "Toolbox · same graph");
  DN_TOOLS.forEach(([name, sub], i) => {
    const x = i % 2 ? 198 : 20, y = tb + 12 + Math.floor(i / 2) * 62;
    b += `<rect x="${x}" y="${y}" width="162" height="54" rx="12" class="dg-card"/>`;
    b += t(x + 14, y + 23, name, "dg-label-sm") + t(x + 14, y + 40, sub, "dg-sub");
  });
  const en = tb + 12 + 3 * 62 + 22;
  b += t(20, en, "SSO, MFA and passkeys · five roles · audit log", "dg-sub");
  const h = en + 46;
  b += mCaption(h);
  return frame(id, "Discovery Navigator", "Discovery Navigator: six workflows that hand results to each other, one shared evidence engine over the AlphaMeld Knowledge Graph API, provenance-stamped exports, and a toolbox of Co-Pilot, Trial Designer, Network Explorer, Custom Reports, Literature Radar and a weekly digest.", b, { w: MW, h, rx: 20 });
}

function quriousRIMobile() {
  const id = "qrm";
  let b = "";
  b += eyebrow(20, 36, "Sources");
  [...QR_SOURCES, ["Your dossiers", "OCR and eCTD tagging"]].forEach(([title, sub], i) => {
    const x = i % 2 ? 198 : 20, y = 50 + Math.floor(i / 2) * 70;
    b += `<rect x="${x}" y="${y}" width="162" height="60" rx="12" class="${i === 3 ? "dg-card-dashed" : "dg-card"}"/>`;
    b += t(x + 12, y + 26, title.replace("Orange and Purple Book", "Orange, Purple Book"), "dg-label-sm") + t(x + 12, y + 43, sub.replace("US patents and exclusivity", "US patents").replace("Guidelines and announcements", "Guidelines, notices"), "dg-sub");
  });
  b += flow(id, `M190,190 L190,212`);

  const ct = 218;
  b += `<rect x="20" y="${ct}" width="340" height="226" rx="18" fill="url(#${id}-core)" class="dg-core-stroke"/>`;
  b += t(38, ct + 30, "Central drug database", "dg-label");
  b += t(38, ct + 50, "Full text, translations, impact summaries", "dg-sub");
  b += flowRow(["Vector + keyword search", "Reranked, cited answers"], { x0: 38, x1: 344, y0: ct + 62, rowH: 30, make: (x, y, s) => chip(x, y, s, { h: 22 }) }).svg;
  b += eyebrow(38, ct + 136, "Agents");
  b += lines(38, ct + 158, ["Assistant router · report research", "Reference-product evidence · gap", "extract and evaluate · authoring"], "dg-sub", 16);
  b += t(38, ct + 214, "Daily regulatory watch, weekly brief", "dg-sub-sig");
  b += flow(id, `M190,${ct + 232} L190,${ct + 254}`);

  let y = ct + 282;
  b += eyebrow(20, y, "Explore");
  y += 12;
  QR_EXPLORE.forEach(([title, items]) => {
    b += `<rect x="20" y="${y}" width="340" height="${30 + Math.ceil(items.length / 2) * 18 + 10}" rx="12" class="dg-card"/>`;
    b += t(34, y + 24, title, "dg-label-sm");
    items.forEach((s, j) => {
      const ix = j % 2 ? 196 : 34, iy = y + 44 + Math.floor(j / 2) * 18;
      b += `<circle cx="${ix + 4}" cy="${iy - 4}" r="2" class="dg-node"/>` + t(ix + 12, iy, s, "dg-sub");
    });
    y += 30 + Math.ceil(items.length / 2) * 18 + 10 + 10;
  });

  y += 20;
  b += eyebrow(20, y, "From approval to filing");
  const sy = (i) => y + 26 + i * 50;
  b += `<line x1="36" y1="${sy(0)}" x2="36" y2="${sy(2)}" class="dg-edge"/><line x1="36" y1="${sy(0)}" x2="36" y2="${sy(2)}" class="dg-flow"/>`;
  QR_CHAIN.forEach(([name, sub], i) => {
    b += `<circle cx="36" cy="${sy(i)}" r="11" class="${i === 2 ? "dg-node" : "dg-ring"}"/>`;
    b += t(36, sy(i) + 4, String(i + 1), i === 2 ? "dg-num-inv-sm" : "dg-num-sm", "middle");
    b += t(58, sy(i) + 4.5, name, "dg-label-sm") + t(58, sy(i) + 21, sub.join(" "), "dg-sub");
  });
  let gx = 20;
  const gy = sy(2) + 40;
  QR_GOLD.forEach((s) => {
    const c = chip(gx, gy, s, { cls: "dg-chip-sig", textCls: "dg-chip-sig-text", h: 18 });
    b += c.svg;
    gx += c.w + 6;
  });
  b += t(20, gy + 38, "Graded against expert gold standards", "dg-sub-sig");

  const mp = gy + 66;
  b += eyebrow(20, mp, "My Products");
  b += flowRow(["Impacted now", "Plan ahead", "Not yet"], { y0: mp + 12, rowH: 30, make: (x, yy, s) => chip(x, yy, s, s === "Impacted now" ? { cls: "dg-chip-sig", textCls: "dg-chip-sig-text", h: 22 } : { h: 22 }) }).svg;
  b += t(20, mp + 58, "Each regulatory change, per product and market", "dg-sub");

  const pl = mp + 86;
  const pr = flowRow(QR_PLATFORM, { y0: pl, rowH: 30, make: (x, yy, s) => chip(x, yy, s, { h: 22 }) });
  b += pr.svg;
  const h = pr.bottom + 46;
  b += mCaption(h);
  return frame(id, "QuriousRI", "QuriousRI: public regulatory sources and client dossiers feed a central drug database with agents; users explore intelligence, databases, reports and checkers, move from approval to filing through RLD Finder, Gap Assessment and Dossier Authoring, and track product-aware impact.", b, { w: MW, h, rx: 20 });
}

function pipelineAlphaMobile() {
  const id = "pam";
  let b = "";
  b += eyebrow(20, 36, "Sources");
  const card = (y, h, title, sub) =>
    `<rect x="20" y="${y}" width="340" height="${h}" rx="14" class="dg-card"/>` +
    t(36, y + 25, title, "dg-label-sm") +
    t(36, y + 42, sub, "dg-sub");
  b += card(50, 58, "Clinical Navigator", "Companies, assets, events");
  b += card(116, 58, "ClinicalTrials.gov", "Trial status and dates");
  b += card(182, 108, "Market data", "First provider that answers");
  b += flowRow(["Alpha Vantage", "Yahoo Finance", "Finnhub", "SerpAPI"], { x0: 36, x1: 344, y0: 228, rowH: 28, make: (x, y, s) => chip(x, y, s, { h: 22 }) }).svg;
  b += flow(id, `M190,292 L190,318`);
  b += elabel(202, 310, "nightly");

  b += eyebrow(20, 344, "Nightly sync · 9 stages");
  const stages = ["Sync entities", "Sync asset events", "Merge trials", "Seed trial catalysts", "Sync stock prices", "Catalyst discovery", "Milestone predictions", "Generate signals", "Run simulations"];
  const sy = (i) => 368 + i * 30;
  b += `<line x1="36" y1="${sy(0)}" x2="36" y2="${sy(8)}" class="dg-edge"/><line x1="36" y1="${sy(0)}" x2="36" y2="${sy(8)}" class="dg-flow"/>`;
  stages.forEach((s, i) => {
    const llm = i === 5 || i === 6;
    b += `<circle cx="36" cy="${sy(i)}" r="10" class="${llm ? "dg-node" : "dg-ring"}"/>`;
    b += t(36, sy(i) + 4, String(i + 1), llm ? "dg-num-inv-sm" : "dg-num-sm", "middle");
    b += t(58, sy(i) + 4.5, s, "dg-label-sm");
    if (llm) b += chip(250, sy(i) - 10, "LLM", { h: 20 }).svg;
  });
  b += t(20, sy(8) + 32, "Daily at 02:00", "dg-sub");
  b += flow(id, `M190,${sy(8) + 42} L190,${sy(8) + 66}`);
  b += elabel(202, sy(8) + 58, "enriched catalysts");

  const pt = sy(8) + 72;
  b += `<rect x="20" y="${pt}" width="340" height="430" rx="18" fill="url(#${id}-core)" class="dg-core-stroke"/>`;
  b += eyebrow(38, pt + 26, "Prediction engine · on demand");
  b += t(38, pt + 50, "Four specialists", "dg-label-sm");
  [["Clinical", 0, 0], ["Competitive", 1, 0], ["Regulatory", 0, 1], ["Financial", 1, 1]].forEach(([s, c, r]) => {
    b += chip(38 + c * 152, pt + 60 + r * 30, s, { h: 24 }).svg;
  });
  b += flow(id, `M190,${pt + 118} L190,${pt + 138}`);
  b += pill(80, pt + 142, "Critic · counter-thesis", { h: 32, w: 220 }).svg;
  b += flow(id, `M190,${pt + 174} L190,${pt + 194}`);
  b += elabel(190, pt + 214, "≤ 2 rounds", "middle");
  const dy = pt + 228;
  b += `<path d="M150,${dy} L230,${dy}" class="dg-edge" marker-start="url(#${id}-arrow)" marker-end="url(#${id}-arrow)"/>`;
  b += `<circle cx="126" cy="${dy}" r="21" class="dg-ring"/>` + t(126, dy + 4, "Bull", "dg-label-xs", "middle");
  b += `<circle cx="254" cy="${dy}" r="21" class="dg-sig-ring"/>` + t(254, dy + 4, "Bear", "dg-label-xs", "middle");
  const mem = chip(0, 0, "Prediction memory", { h: 22 });
  b += chip(190 - mem.w / 2, dy + 34, "Prediction memory", { h: 22 }).svg;
  b += flow(id, `M190,${dy + 60} L190,${dy + 80}`);
  b += pill(80, dy + 84, "Judge · verdict", { h: 32, w: 220 }).svg;
  b += flow(id, `M190,${dy + 116} L190,${dy + 134}`);
  const segs = [["dg-seg-sig", 0.8], ["dg-seg-sig", 0.4], ["dg-seg-mid", 0.3], ["dg-seg-acc", 0.45], ["dg-seg-acc", 0.85]];
  const sw = (304 - 8) / 5, ys = dy + 142;
  segs.forEach(([c, o], i) => (b += `<rect x="${n(38 + i * (sw + 2))}" y="${ys}" width="${n(sw)}" height="12" rx="3" class="${c}" fill-opacity="${o}"/>`));
  b += t(38, ys + 30, "Strong sell", "dg-sub") + t(190, ys + 30, "Hold", "dg-sub", "middle") + t(342, ys + 30, "Strong buy", "dg-sub", "end");
  b += t(190, ys + 56, "Five-tier outlook and per-event predictions", "dg-label-xs", "middle");

  const pb = pt + 430;
  b += flow(id, `M190,${pb + 6} L190,${pb + 30}`);
  b += eyebrow(20, pb + 54, "Product");
  const tiles = [["Catalyst calendar", "Readouts and PDUFA"], ["Bulk briefings", "Critic-reviewed"], ["Screener", "Scouts to ranking"], ["Smart Money", "VC and Congress"], ["Simulation", "AI paper trading"], ["Projections", "Graded on price"]];
  tiles.forEach(([name, sub], i) => {
    const x = i % 2 ? 198 : 20, y = pb + 66 + Math.floor(i / 2) * 62;
    b += `<rect x="${x}" y="${y}" width="162" height="54" rx="12" class="dg-card"/>`;
    b += t(x + 14, y + 23, name, "dg-label-sm") + t(x + 14, y + 40, sub, "dg-sub");
  });
  const fy = pb + 66 + 3 * 62 + 18;
  b += `<line x1="22" y1="${fy}" x2="46" y2="${fy}" class="dg-edge-sig"/>`;
  b += lines(58, fy + 4, ["Projections grade every prediction against", "the real price move, closing the loop."], "dg-sub", 15);
  const h = fy + 60;
  b += mCaption(h);
  return frame(id, "Pipeline Alpha", "Pipeline Alpha: sources feed a nightly nine-stage sync; an on-demand engine of four specialists, a critic, a bull/bear debate and a judge produces a five-tier outlook; outputs include the catalyst calendar, briefings, screener, smart money, simulation and projections that grade predictions against real price moves.", b, { w: MW, h, rx: 20 });
}

function alphaMeldMobile() {
  const id = "amm";
  let b = "";
  b += eyebrow(20, 36, "Daily literature pipeline");
  const st = (y, title, sub) => `<rect x="20" y="${y}" width="340" height="56" rx="12" class="dg-card"/>` + t(36, y + 24, title, "dg-label-sm") + t(36, y + 41, sub, "dg-sub");
  b += st(50, "Sources", "PubMed · PMC · Semantic Scholar");
  b += st(118, "Ingest and split", "Articles into sentences, PostgreSQL");
  b += st(186, "Evidence level", "PubMedBERT: clinical, in vivo, in vitro");
  b += `<rect x="20" y="254" width="340" height="96" rx="12" class="dg-card"/>`;
  b += t(36, 278, "NLP workers", "dg-label-sm") + t(132, 278, "on RabbitMQ", "dg-sub");
  b += flowRow(["NER · 9 entity types", "Relations · 24 types", "Linking · 3.3M concepts"], { x0: 36, x1: 344, y0: 290, rowH: 28, make: (x, y, s) => chip(x, y, s, { h: 21 }) }).svg;
  b += flow(id, `M190,356 L190,380`);
  b += elabel(202, 372, "daily");

  b += eyebrow(20, 404, "Three graphs · DozerDB (Neo4j)");
  const db = (y, h, title, cadence, subs, core) =>
    (core ? `<rect x="20" y="${y}" width="340" height="${h}" rx="14" fill="url(#${id}-core)" class="dg-core-stroke"/>` : `<rect x="20" y="${y}" width="340" height="${h}" rx="14" class="dg-card"/>`) +
    t(36, y + 25, title, "dg-label-sm") + chip(296, y + 11, cadence, { h: 20 }).svg + lines(36, y + 44, subs, "dg-sub", 15);
  b += db(416, 66, "Evidence graph", "daily", ["Every sentence and relation, ~2.5B edges"]);
  b += flow(id, `M190,482 L190,498`);
  b += db(502, 52, "Aggregated graph", "weekly", ["One edge per entity pair"]);
  b += flow(id, `M190,554 L190,570`);
  b += db(574, 86, "Scored graph", "weekly", ["Direct, association, direction, mechanism"], true);
  b += t(36, 646, "492K entities · ~26M relationships", "dg-label-xs");
  b += flow(id, `M190,666 L190,690`);

  b += eyebrow(20, 714, "Access");
  b += `<rect x="20" y="726" width="340" height="104" rx="14" class="dg-card"/>`;
  b += t(36, 750, "Knowledge Graph API", "dg-label-sm") + t(196, 750, "read-only REST", "dg-sub");
  b += flowRow(["Nodes", "Search", "Traversal", "Analytics", "Evidence", "GraphRAG context"], { x0: 36, x1: 344, y0: 762, rowH: 28, make: (x, y, s) => chip(x, y, s, { h: 21 }) }).svg;
  b += `<rect x="20" y="842" width="340" height="132" rx="14" fill="url(#${id}-core)" class="dg-core-stroke"/>`;
  b += t(36, 866, "MCP server", "dg-label-sm") + t(126, 866, "16 tools for AI agents", "dg-sub");
  b += flowRow([...AM_TOOLS, "+12 more"], { x0: 36, x1: 344, y0: 878, rowH: 26, make: (x, y, s) => chip(x, y, s, { h: 20 }) }).svg;
  b += t(36, 962, "Tiered eval gate on every deploy", "dg-sub-sig");
  b += flow(id, `M190,980 L190,1004`);

  b += eyebrow(20, 1028, "Consumers");
  b += `<rect x="20" y="1040" width="340" height="66" rx="14" fill="url(#${id}-core)" class="dg-core-stroke"/>`;
  b += t(36, 1066, "Discovery Navigator", "dg-label-sm") + t(36, 1084, "Flagship: six workflows, Co-Pilot", "dg-sub");
  [["AI agents", "Through MCP"], ["Rediscovery", "Essential tremor"]].forEach(([n1, s1], i) => {
    const x = i ? 198 : 20;
    b += `<rect x="${x}" y="1116" width="162" height="56" rx="12" class="dg-card"/>` + t(x + 14, 1140, n1, "dg-label-sm") + t(x + 14, 1157, s1, "dg-sub");
  });
  b += `<rect x="20" y="1182" width="340" height="74" rx="12" class="dg-card-muted"/>`;
  b += t(36, 1206, "Original platform modules", "dg-label-sm");
  b += lines(36, 1224, ["Knowledge Graph · ChatAlphaMeld · Bioinformatics", "Literature Analysis · AlphaClinMeld"], "dg-sub", 15);

  b += `<rect x="20" y="1272" width="340" height="80" rx="14" class="dg-band"/>`;
  b += t(36, 1296, "Next-generation graph · R&D", "dg-label-sm");
  b += lines(36, 1314, ["Span-grounded, Biolink-aligned claims over", "41.7M documents and 607K trials"], "dg-sub", 15);
  const h = 1396;
  b += mCaption(h);
  return frame(id, "AlphaMeld Operating System", "AlphaMeld Operating System: a daily literature pipeline feeds evidence, aggregated and scored graphs on DozerDB; a read-only API and a 16-tool MCP server serve Discovery Navigator, AI agents, Rediscovery and the original modules; a next-generation graph is in R&D.", b, { w: MW, h, rx: 20 });
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
