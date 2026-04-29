import { Children, isValidElement, ReactNode } from "react";

type Column = {
  heading: ReactNode;
  rows: ReactNode[];
};

type ComparisonProps = {
  rowLabels?: ReactNode[];
  columns?: Column[];
  caption?: ReactNode;
  children?: ReactNode;
};

type ColProps = { heading: ReactNode; children?: ReactNode };
type RowProps = { label?: ReactNode; children?: ReactNode };

export function Col(_p: ColProps) {
  return null;
}

export function Row(_p: RowProps) {
  return null;
}

function collectFromChildren(children: ReactNode): {
  columns: Column[];
  rowLabels: ReactNode[];
} {
  const cols: Column[] = [];
  const rowLabels: ReactNode[] = [];
  const colChildren: ReactNode[][] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const type = (child.type as { displayName?: string; name?: string });
    const name = type?.displayName ?? type?.name;
    if (name === "Col") {
      const props = child.props as ColProps;
      cols.push({ heading: props.heading, rows: [] });
      const inner: ReactNode[] = [];
      Children.forEach(props.children, (c) => inner.push(c));
      colChildren.push(inner);
    } else if (name === "Row") {
      const props = child.props as RowProps;
      if (props.label !== undefined) rowLabels.push(props.label);
    }
  });

  // If Col-based, fill rows from each Col's child Row elements
  if (cols.length > 0) {
    cols.forEach((col, i) => {
      const items = colChildren[i] ?? [];
      const rows: ReactNode[] = [];
      Children.forEach(items, (item) => {
        if (!isValidElement(item)) return;
        const t = (item.type as { displayName?: string; name?: string });
        if ((t?.displayName ?? t?.name) === "Row") {
          const p = item.props as RowProps;
          rows.push(p.children);
          if (i === 0 && p.label !== undefined) rowLabels.push(p.label);
        }
      });
      col.rows = rows;
    });
  }

  return { columns: cols, rowLabels };
}

export function Comparison({
  rowLabels,
  columns,
  caption,
  children,
}: ComparisonProps) {
  let resolvedColumns = columns;
  let resolvedRowLabels = rowLabels;
  if ((!resolvedColumns || resolvedColumns.length === 0) && children) {
    const collected = collectFromChildren(children);
    if (collected.columns.length > 0) {
      resolvedColumns = collected.columns;
      if (!resolvedRowLabels && collected.rowLabels.length > 0) {
        resolvedRowLabels = collected.rowLabels;
      }
    }
  }

  if (!resolvedColumns || resolvedColumns.length === 0) {
    return null;
  }

  const rowCount = Math.max(...resolvedColumns.map((c) => c.rows.length));
  const hasRowLabels = Array.isArray(resolvedRowLabels) && resolvedRowLabels.length > 0;
  const gridCols = hasRowLabels
    ? `minmax(8rem,1fr) ${resolvedColumns.map(() => "minmax(0,1fr)").join(" ")}`
    : resolvedColumns.map(() => "minmax(0,1fr)").join(" ");

  return (
    <figure className="my-8">
      <div className="overflow-x-auto rounded-lg border border-rule bg-bg-soft">
        <div
          role="table"
          className="min-w-full text-[14px] text-ink-2"
          style={{ display: "grid", gridTemplateColumns: gridCols }}
        >
          {hasRowLabels && <div role="columnheader" className="px-4 py-3 border-b border-rule" />}
          {resolvedColumns.map((col, ci) => (
            <div
              key={`h-${ci}`}
              role="columnheader"
              className="px-4 py-3 border-b border-rule font-medium text-ink-1"
            >
              {col.heading}
            </div>
          ))}

          {Array.from({ length: rowCount }).map((_, ri) => (
            <div key={`row-${ri}`} className="contents">
              {hasRowLabels && (
                <div
                  role="rowheader"
                  className="px-4 py-3 border-b border-rule text-ink-3 font-medium"
                >
                  {resolvedRowLabels?.[ri]}
                </div>
              )}
              {resolvedColumns.map((col, ci) => (
                <div
                  key={`c-${ri}-${ci}`}
                  role="cell"
                  className="px-4 py-3 border-b border-rule leading-relaxed"
                >
                  {col.rows[ri]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-ink-3 leading-relaxed text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

Col.displayName = "Col";
Row.displayName = "Row";
