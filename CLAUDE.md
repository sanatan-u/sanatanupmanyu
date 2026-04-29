@AGENTS.md

## Blog posts

### Hero image (always)

At the end of every new blog post, include:

1. **Image filename** — e.g. `public/blog/<slug>.png` (1200x630px, PNG format).
2. **Image generation prompt** — a detailed prompt the user can paste into an AI image generator to create the hero/OG image. The prompt should be tailored to the post's content, leverage modern LLM image generation capabilities (including legible text rendering), and follow the editorial style used across the site (clean, professional, diagrammatic — not photorealistic).

### Rich Markdown is required, not optional

Walls of prose are not acceptable. Every post must use the available MDX components and Markdown features to break up text and carry meaning visually. Aim for at least one non-text element per ~300 words of prose.

**Required minimums for any non-trivial post (>500 words):**

- **At least one diagram** — `<Mermaid>` for flows/architectures/decision trees, or `<Figure>` for an authored image. If the post argues about a process, system, or comparison, the diagram is mandatory, not decorative.
- **At least one `<Callout>`** — use `note` for context, `warn` for pitfalls, `tip` for actionable guidance, `quote` for pull-quotes from cited work.
- **At least one structured element** — a table, a `<Comparison>`, or a list. If you're contrasting two things ("X vs Y", "before/after", "naive vs robust"), use `<Comparison>` or a Markdown table. Do not bury a comparison inside paragraph prose.

**`<Comparison>` API (children-based, not props-based):**

```mdx
<Comparison caption="Optional caption.">
  <Col heading="Column A">
    <Row label="Row label 1">Cell content for column A, row 1</Row>
    <Row label="Row label 2">Cell content for column A, row 2</Row>
  </Col>
  <Col heading="Column B">
    <Row>Cell content for column B, row 1</Row>
    <Row>Cell content for column B, row 2</Row>
  </Col>
</Comparison>
```

Only the *first* `<Col>` needs `<Row label="...">` — those labels become the row-header column. Subsequent `<Col>` children only need bare `<Row>...</Row>` cells in the same order.

**Use the full Markdown vocabulary:**

- Headings (`##`, `###`) to make the post navigable. A post longer than ~80 lines without subheadings is a smell.
- **Bold** for key terms on first use; *italics* for emphasis sparingly.
- Lists for any enumeration of three or more items.
- Tables for any structured comparison, dataset summary, or "what each thing proves" framing.
- Blockquotes (`>`) or `<Callout variant="quote">` for direct quotes from cited sources.
- Inline `code` for technical terms, file paths, identifiers.

Long-form text still matters — keep substantive paragraphs where the argument requires them. The rule is: visualisations and structure carry as much weight as prose, not less.

### Citations

- Cite with `<Cite id="<short-id>" />` inline and define the source in a single `<References>` block at the end with `<Ref id="<short-id>" url="...">...</Ref>` entries.
- **Do not pass an `n` prop** — citation numbers are derived automatically from the order of first occurrence in the body. Manual numbering drifts whenever references are reordered.
- Citations must be specific — `[3]` should jump to and visually highlight reference 3, not dump the reader at the top of the reference list. The `:target` styling on `#ref-...` and `#cite-...` anchors handles this; rely on it rather than working around it.
- Use `<Cite>` only when there is a real source. Do not fabricate references to look authoritative.

### MDX gotchas

- **Avoid complex JSX expression props.** `<Comp items={[{...}, {...}]} />` with object/array literals tends to fail silently in `next-mdx-remote/rsc` — the prop arrives as `undefined`. Prefer children-based component APIs (see `<Comparison>` above). Simple expression props like `n={1}` and template-literal strings (`chart={\`...\`}`) work fine.
- **Don't apostrophe-escape inside MDX.** Use straight quotes `"..."` rather than typographic apostrophes inside attribute values, and avoid `&#39;` HTML entities — they tend to confuse the parser.

### Before declaring a post done

- Run the dev server and read the post in the browser. Click every citation; confirm the number renders and the target reference is highlighted on jump.
- Confirm any `<Mermaid>` diagram renders (it's a client component — easy to typo into a parse error).
- Re-read the post for the rich-Markdown minimums above. If it's still mostly paragraphs, add structure before shipping.
- Run `npm run build` — production builds catch MDX errors that `npm run dev` lets through.
