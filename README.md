# sanatanupmanyu.com

Personal/professional website for Sanatan Upmanyu — Next.js 16 + TypeScript, deployed as a Docker container.

See [`docs/PRD.md`](docs/PRD.md) for product requirements and [`docs/Design System.html`](docs/Design%20System.html) for visual tokens.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 with design tokens wired from the design system
- Fraunces (display) / Inter Tight (body) / JetBrains Mono (mono) via `next/font`
- Content as typed TS modules under `src/content/`
- Contact form → `/api/contact` → Resend (configurable)

## Develop

```bash
npm install
cp .env.example .env.local   # fill in RESEND_API_KEY if you want email delivery
npm run dev                  # http://localhost:3000
```

## Build & test production locally

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t sanatanupmanyu .
docker run -p 3000:3000 --env-file .env.local sanatanupmanyu
```

The image is multi-stage, uses Next.js `output: 'standalone'`, runs as non-root, and listens on `:3000`. Deployable to any container host (Cloud Run, Fly.io, Railway, self-hosted).

## Content updates

Edit files under `src/content/` — no layout changes required for most updates.

- `site.ts` — identity, contact, stats, nav
- `services.ts` — four service pillars
- `platforms.ts` — flagship platforms
- `products.ts` — shipped products
- `experience.ts` — career timeline + education
- `publications.ts` — publications + patents
- `speaking.ts` — talks and panels
