import { site } from "@/content/site";
import { MapPin } from "lucide-react";

export function AtAGlance() {
  return (
    <div className="rounded-2xl border border-rule bg-bg-soft/40 px-6 py-6">
      <h3 className="text-xs uppercase tracking-widest text-ink-3 mb-4">
        At a glance
      </h3>

      <dl className="space-y-3 text-sm">
        {site.currentRoles.map((r) => (
          <div key={r.org} className="flex flex-col">
            <dt className="font-medium text-ink">{r.role}</dt>
            <dd className="text-ink-3">{r.org}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 pt-4 border-t border-rule flex items-center gap-2 text-sm text-ink-3">
        <MapPin size={14} strokeWidth={1.5} />
        {site.location}
      </div>
    </div>
  );
}
