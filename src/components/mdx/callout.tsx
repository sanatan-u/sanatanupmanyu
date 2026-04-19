import { Info, AlertTriangle, Lightbulb, Quote } from "lucide-react";

type Variant = "note" | "warn" | "tip" | "quote";

const styles: Record<
  Variant,
  { icon: React.ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>; border: string; label: string }
> = {
  note: { icon: Info, border: "border-accent", label: "Note" },
  warn: { icon: AlertTriangle, border: "border-signal", label: "Warning" },
  tip: { icon: Lightbulb, border: "border-accent", label: "Tip" },
  quote: { icon: Quote, border: "border-ink-3", label: "Quote" },
};

export function Callout({
  variant = "note",
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, border, label } = styles[variant];
  return (
    <aside
      role="note"
      aria-label={title ?? label}
      className={`my-8 border-l-2 ${border} bg-bg-soft pl-5 pr-4 py-4 rounded-r-md`}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-ink-2 mb-2">
        <Icon size={16} strokeWidth={1.75} aria-hidden />
        <span>{title ?? label}</span>
      </div>
      <div className="text-[15px] text-ink-2 leading-relaxed [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}
