import { renderResumePdf } from "./resume-document";

// Generated, ATS-friendly PDF résumé. Built on the fly from the same content
// files that drive the site, so it never goes stale. @react-pdf/renderer needs
// Node APIs, so this runs on the Node.js runtime.
export const runtime = "nodejs";

export async function GET() {
  const pdf = await renderResumePdf();
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Sanatan_Upmanyu_Resume.pdf"',
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
