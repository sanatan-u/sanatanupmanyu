import { Children, isValidElement } from "react";
import { ArrowUp } from "lucide-react";

export type Reference = {
  id: string;
  children: React.ReactNode;
  url?: string;
};

type RefProps = { id: string; url?: string; children: React.ReactNode };

export function Ref(_props: RefProps) {
  return null;
}

export function References({
  items,
  children,
}: {
  items?: Reference[];
  children?: React.ReactNode;
}) {
  const collected: Reference[] = items ?? [];
  if (!items && children) {
    Children.forEach(children, (child) => {
      if (isValidElement<RefProps>(child)) {
        const { id, url, children: inner } = child.props;
        if (id) collected.push({ id, url, children: inner });
      }
    });
  }
  return (
    <section aria-labelledby="references" className="mt-12 pt-8 border-t border-rule">
      <h2
        id="references"
        className="text-sm uppercase tracking-wider text-ink-3 font-medium mb-4"
      >
        References
      </h2>
      <ol className="space-y-3 list-none pl-0">
        {collected.map((ref, i) => (
          <li
            key={ref.id}
            id={`ref-${ref.id}`}
            className="text-[14px] text-ink-2 leading-relaxed grid grid-cols-[2ch_1fr] gap-2"
          >
            <span className="text-ink-3 tabular-nums">{i + 1}.</span>
            <span>
              {ref.url ? (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 decoration-rule hover:text-accent hover:decoration-accent"
                >
                  {ref.children}
                </a>
              ) : (
                ref.children
              )}{" "}
              <a
                href={`#cite-${ref.id}`}
                aria-label="Back to citation"
                className="inline-flex items-center text-ink-3 hover:text-accent"
              >
                <ArrowUp size={12} strokeWidth={1.75} aria-hidden />
              </a>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Cite({
  id,
  n,
}: {
  id: string;
  n: number;
}) {
  return (
    <sup id={`cite-${id}`} className="ml-0.5">
      <a
        href={`#ref-${id}`}
        className="text-accent hover:text-accent-ink no-underline tabular-nums"
        aria-label={`See reference ${n}`}
      >
        [{n}]
      </a>
    </sup>
  );
}
