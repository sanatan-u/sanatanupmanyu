"use client";

import { Printer, Download } from "lucide-react";

// Print / download toolbar for the résumé page. Hidden when printing
// (`print:hidden`) so it never lands in the saved PDF.
export function ResumeActions() {
  return (
    <div className="print:hidden flex flex-wrap items-center gap-3">
      <a href="/resume.pdf" className="btn-primary" download="Sanatan_Upmanyu_Resume.pdf">
        <Download size={16} strokeWidth={1.75} aria-hidden />
        Download PDF
      </a>
      <button type="button" onClick={() => window.print()} className="btn-outline">
        <Printer size={16} strokeWidth={1.75} aria-hidden />
        Print
      </button>
    </div>
  );
}
