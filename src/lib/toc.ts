export type TocItem = { id: string; text: string };

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .trim();
}

export function extractToc(mdxBody: string): TocItem[] {
  const withoutFences = mdxBody.replace(/```[\s\S]*?```/g, "");
  const items: TocItem[] = [];
  const seen = new Map<string, number>();
  const re = /^##[ \t]+(.+?)\s*#*\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(withoutFences)) !== null) {
    const text = stripInlineMarkdown(m[1]);
    if (!text) continue;
    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count}`;
    items.push({ id, text });
  }
  return items;
}
