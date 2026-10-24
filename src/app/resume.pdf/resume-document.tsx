import path from "node:path";
import {
  Document,
  Page,
  View,
  Text,
  Link,
  Font,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { site } from "@/content/site";
import {
  resumeContact,
  resumeSummary,
  resumeScope,
  resumeCompetencies,
  resumeToolset,
  resumeSelectedWork,
  experience,
  education,
  publications,
  patents,
  talks,
} from "@/content/resume";

// ── Fonts ───────────────────────────────────────────────────────────────────
// On-brand with the website: Fraunces (the serif used for site headings) for
// the name and section titles, Inter Tight (the site body sans) for everything
// else. These are real embedded fonts shipped by @fontsource (.woff), so the
// text layer stays fully selectable/extractable — ATS-safe.
//
// Paths are built at runtime from process.cwd() rather than imported, so the
// bundler treats them as plain filesystem strings (not modules — importing a
// .woff fails Turbopack with "Unknown module type"). @react-pdf/renderer is an
// external server package, so it reads these files with native fs at render.
const fontPath = (rel: string) =>
  path.join(process.cwd(), "node_modules", rel);

Font.register({
  family: "Inter Tight",
  fonts: [
    {
      src: fontPath(
        "@fontsource/inter-tight/files/inter-tight-latin-400-normal.woff",
      ),
      fontWeight: 400,
    },
    {
      src: fontPath(
        "@fontsource/inter-tight/files/inter-tight-latin-600-normal.woff",
      ),
      fontWeight: 600,
    },
  ],
});

Font.register({
  family: "Fraunces",
  fonts: [
    {
      src: fontPath("@fontsource/fraunces/files/fraunces-latin-400-normal.woff"),
      fontWeight: 400,
    },
    {
      src: fontPath("@fontsource/fraunces/files/fraunces-latin-600-normal.woff"),
      fontWeight: 600,
    },
  ],
});

// Keep long words intact (no hyphenation) for clean line breaks.
Font.registerHyphenationCallback((word) => [word]);

// ── ATS-friendliness notes ─────────────────────────────────────────────────
// This PDF is built to parse cleanly in Applicant Tracking Systems:
//   • Single column, top-to-bottom reading order (no multi-column layout).
//   • Real, selectable text in embedded fonts (always extractable, never
//     rasterised to an image).
//   • Plain section headings ATS parsers recognise (Summary, Experience, Skills,
//     Education, Publications…).
//   • Simple hyphen/bullet markers and a parseable date format.
//   • Special characters (™, ®, em-dashes, middots, arrows) sanitised to ASCII
//     so no glyph silently drops to blank and no token confuses the parser.

/** Replace characters that ATS parsers / the base font handle poorly. */
function s(input: string): string {
  return input
    .replace(/[‘’]/g, "'") // curly single quotes
    .replace(/[“”]/g, '"') // curly double quotes
    .replace(/[–—]/g, "-") // en / em dash
    .replace(/→/g, "->") // arrow
    .replace(/\s*[·•]\s*/g, " | ") // middot / bullet separators
    .replace(/[™®]/g, "") // trademark / registered
    .replace(/\s{2,}/g, " ")
    .trim();
}

const C = {
  ink: "#1a1a1a",
  ink2: "#3a3a3a",
  ink3: "#5a5a5a",
  accent: "#155e56",
  rule: "#bdbdbd",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 38,
    paddingBottom: 40,
    paddingHorizontal: 44,
    fontFamily: "Inter Tight",
    fontSize: 9.3,
    lineHeight: 1.4,
    color: C.ink2,
  },
  name: {
    fontFamily: "Fraunces",
    fontWeight: 600,
    fontSize: 23,
    color: C.ink,
    lineHeight: 1.1,
    marginBottom: 5,
  },
  label: { fontSize: 8.6, color: C.ink3, lineHeight: 1.3, marginBottom: 5 },
  contact: { fontSize: 8.4, color: C.ink2, lineHeight: 1.3, marginTop: 3 },
  link: { color: C.ink2, textDecoration: "none" },

  sectionTitle: {
    fontFamily: "Fraunces",
    fontWeight: 600,
    fontSize: 10,
    color: C.accent,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 15,
    marginBottom: 5,
    paddingBottom: 2,
    borderBottomWidth: 0.7,
    borderBottomColor: C.rule,
  },

  summary: { fontSize: 9.3, color: C.ink2, lineHeight: 1.45 },

  entry: { marginBottom: 8 },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  company: {
    fontFamily: "Inter Tight",
    fontWeight: 600,
    fontSize: 10,
    color: C.ink,
  },
  period: { fontSize: 8.4, color: C.ink3 },
  roleLine: { fontSize: 8.8, color: C.ink3, marginBottom: 2, marginTop: 0.5 },

  bulletRow: { flexDirection: "row", marginBottom: 1.5 },
  bulletMark: { width: 9, fontSize: 9 },
  bulletText: { flex: 1, fontSize: 9, color: C.ink2 },

  skillsLine: { fontSize: 8.2, color: C.ink3, marginTop: 2.5 },
  skillsLabel: { fontFamily: "Inter Tight", fontWeight: 600, color: C.ink2 },

  compRow: { marginBottom: 2.5 },
  compLabel: {
    fontFamily: "Inter Tight",
    fontWeight: 600,
    fontSize: 9,
    color: C.ink,
  },

  platformName: {
    fontFamily: "Inter Tight",
    fontWeight: 600,
    fontSize: 9.3,
    color: C.ink,
  },
  platformImpact: { fontSize: 8.8, color: C.accent },
  platformDesc: { fontSize: 8.6, color: C.ink2, marginTop: 0.5 },

  eduInst: {
    fontFamily: "Inter Tight",
    fontWeight: 600,
    fontSize: 9.3,
    color: C.ink,
  },
  small: { fontSize: 8.6, color: C.ink2 },
  smaller: { fontSize: 8.2, color: C.ink2, marginBottom: 2.5 },
});

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow} wrap={false}>
      <Text style={styles.bulletMark}>-</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function ResumeDocument() {
  return (
    <Document
      title={`${resumeContact.name} - Resume`}
      author={resumeContact.name}
      subject="Resume"
      keywords={resumeToolset.join(", ")}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.name}>{resumeContact.name}</Text>
        <Text style={styles.label}>{s(resumeContact.label)}</Text>
        <Text style={styles.contact}>
          {resumeContact.location} | {resumeContact.email} |{" "}
          <Link style={styles.link} src={resumeContact.linkedin}>
            {site.linkedinLabel}
          </Link>{" "}
          |{" "}
          <Link style={styles.link} src={resumeContact.website}>
            sanatanupmanyu.com
          </Link>
        </Text>

        {/* Executive summary */}
        <SectionTitle>Executive Summary</SectionTitle>
        <Text style={styles.summary}>{s(resumeSummary)}</Text>

        {/* Scope at a glance */}
        <SectionTitle>Scope at a Glance</SectionTitle>
        {resumeScope.map((sc) => (
          <Text key={sc.label} style={styles.compRow}>
            <Text style={styles.compLabel}>{sc.label}: </Text>
            <Text style={styles.small}>{s(sc.value)}</Text>
          </Text>
        ))}

        {/* Core competencies & skills */}
        <SectionTitle>Core Competencies &amp; Skills</SectionTitle>
        {resumeCompetencies.map((c) => (
          <Text key={c.label} style={styles.compRow}>
            <Text style={styles.compLabel}>{c.label}: </Text>
            <Text style={styles.small}>{c.items.map(s).join(", ")}</Text>
          </Text>
        ))}
        <Text style={styles.compRow}>
          <Text style={styles.compLabel}>Technical Toolset: </Text>
          <Text style={styles.small}>{resumeToolset.join(", ")}</Text>
        </Text>

        {/* Experience */}
        <SectionTitle>Leadership Experience</SectionTitle>
        {/* Entries wrap across pages (some now run 6 bullets); the header block
            is kept intact and given lookahead so a company name is never
            stranded alone at the foot of a page. */}
        {experience.map((r, i) => (
          <View key={`${r.company}-${i}`} style={styles.entry}>
            <View wrap={false} minPresenceAhead={44}>
              <View style={styles.entryHeader}>
                <Text style={styles.company}>{s(r.company)}</Text>
                <Text style={styles.period}>{s(r.period)}</Text>
              </View>
              <Text style={styles.roleLine}>
                {s(r.title)} | {s(r.location)}
              </Text>
            </View>
            {r.bullets.map((b, j) => (
              <Bullet key={j}>{s(b)}</Bullet>
            ))}
            {r.skills && r.skills.length > 0 ? (
              <Text style={styles.skillsLine}>
                <Text style={styles.skillsLabel}>Skills: </Text>
                {r.skills.map(s).join(", ")}
              </Text>
            ) : null}
          </View>
        ))}

        {/* Selected platforms & business impact */}
        <SectionTitle>Selected Platforms &amp; Business Impact</SectionTitle>
        {resumeSelectedWork.map((p) => (
          <View key={p.name} style={styles.entry} wrap={false}>
            <Text style={styles.platformName}>
              {s(p.name)}
              {p.stage ? (
                <Text style={styles.period}> {"  "}({p.stage})</Text>
              ) : null}
            </Text>
            {p.impact ? (
              <Text style={styles.platformImpact}>{s(p.impact)}</Text>
            ) : null}
            <Text style={styles.platformDesc}>{s(p.description)}</Text>
          </View>
        ))}

        {/* Education */}
        <SectionTitle>Education</SectionTitle>
        {education.map((e) => (
          <View key={e.institution} style={{ marginBottom: 4 }} wrap={false}>
            <Text style={styles.eduInst}>{e.institution}</Text>
            <Text style={styles.small}>
              {s(e.degree)} | {e.year}
            </Text>
          </View>
        ))}

        {/* Publications */}
        <SectionTitle>Publications</SectionTitle>
        {publications.map((pub, i) => (
          <Text key={pub.citation} style={styles.smaller}>
            {i + 1}. {s(pub.citation)} {s(pub.venue)}.
          </Text>
        ))}

        {/* Patents */}
        <SectionTitle>Patents</SectionTitle>
        {patents.map((p) => (
          <Bullet key={p.number}>
            {`${s(p.title)} (${p.number}, ${p.office})`}
          </Bullet>
        ))}

        {/* Speaking */}
        <SectionTitle>Selected Speaking &amp; Panels</SectionTitle>
        {talks.map((t) => (
          <Bullet key={`${t.event}-${t.date}`}>
            {`${s(t.event)} - ${s(t.role)}: ${s(t.topic)} (${s(t.location)}, ${t.date})`}
          </Bullet>
        ))}
      </Page>
    </Document>
  );
}

/** Render the résumé to a PDF buffer. Called from the /resume.pdf route. */
export async function renderResumePdf(): Promise<Buffer> {
  return renderToBuffer(<ResumeDocument />);
}
