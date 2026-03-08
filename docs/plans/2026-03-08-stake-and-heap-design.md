# Stake & Heap — Site Design

**Date:** 2026-03-08
**Status:** Approved

## Overview

Single-page lifestyle product site for makers & doers. React/Next.js App Router, styled with CSS Modules consuming `@mattplays/mpds` design tokens. Deployed on Vercel.

## Architecture

- **Framework:** Next.js (App Router)
- **Styling:** CSS Modules + mpds CSS custom properties
- **Data:** Notion API at build time (ISR, 60s revalidation)
- **Email:** Custom form → Next.js API route → Kit API (key: server-side env var)
- **Hosting:** Vercel
- **Fonts:** Instrument Sans (display), Fragment Mono (mono/UI)

## Project Structure

```
stake-and-heap/
├── app/
│   ├── layout.tsx              # Root layout, font loading, mpds import
│   ├── page.tsx                # Single page, composes all sections
│   ├── globals.css             # mpds import + semantic token layer
│   └── api/
│       └── subscribe/
│           └── route.ts        # Kit API proxy (POST)
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.module.css
│   ├── Hero/
│   │   ├── Hero.tsx
│   │   └── Hero.module.css
│   ├── ProductCarousel/
│   │   ├── ProductCarousel.tsx
│   │   ├── ProductCard.tsx
│   │   └── ProductCarousel.module.css
│   ├── CategoryPills/
│   │   ├── CategoryPills.tsx
│   │   ├── CategoryPill.tsx
│   │   └── CategoryPills.module.css
│   ├── SubscribeForm/
│   │   ├── SubscribeForm.tsx
│   │   └── SubscribeForm.module.css
│   └── Footer/
│       ├── Footer.tsx
│       └── Footer.module.css
├── lib/
│   ├── notion.ts               # Notion SDK client, product fetcher
│   └── types.ts                # Product, Category types
├── data/
│   └── categories.ts           # Category metadata (name, image path)
└── public/
    └── images/
        ├── products/           # Clipped product photos
        └── categories/         # Category circle photos
```

## Semantic Token Layer

```css
@import '@mattplays/mpds';

:root {
  --font-display: 'Instrument Sans', sans-serif;
  --font-mono: 'Fragment Mono', monospace;

  --site-container-width: 1920px;
  --site-padding-desktop: var(--mpds-space-80);
  --site-padding-tablet: var(--mpds-space-40);
  --site-padding-mobile: var(--mpds-space-20);

  --color-bg: var(--mpds-color-slate-0);
  --color-surface: var(--mpds-color-slate-25);
  --color-border: var(--mpds-color-slate-100);
  --color-muted: var(--mpds-color-slate-200);
  --color-text: var(--mpds-color-slate-800);

  --shadow-xxl:
    0 8px 16px 0 rgba(19,32,38,0.02),
    0 16px 32px 0 rgba(19,32,38,0.04),
    0 24px 48px 0 rgba(19,32,38,0.06),
    0 32px 64px 0 rgba(19,32,38,0.08),
    0 40px 80px 0 rgba(19,32,38,0.1),
    0 48px 96px 0 rgba(19,32,38,0.12);
}
```

## Grid System

24-column CSS grid at desktop, max-width 1920px. Responsive padding:

| Breakpoint | Padding | Grid |
|---|---|---|
| Desktop (>1024px) | `var(--mpds-space-80)` = 80px | 24-col |
| Tablet (768–1024px) | `var(--mpds-space-40)` = 40px | 12-col |
| Mobile (<768px) | `var(--mpds-space-20)` = 20px | Stack |

## Data Flow

### Products (build time)

```
Notion "Stake & Heap — Product Catalog" DB
  → @notionhq/client query (filter: Status !== 'Archived', sort: Sort Order)
  → Product[] { name, category, price, description, affiliateLink, bookshopLink, imageSlug, heroFeature }
  → ISR revalidation every 60 seconds
```

Data source ID: `b91fbdfb-6b53-411b-9955-11b9455a2a2e`

### Product Images

Clipped product photos from Dropbox export → copied into `public/images/products/`.
Filename convention: `{slug}.png` (e.g., `airpods-pro-2.png`, `the-creative-act.png`).
Notion `Image File` field or product name slugified maps to the filename.

### Categories

Static data in `data/categories.ts`. Each category has:
- `name`: Display name (e.g., "Photo & Video")
- `slug`: URL-safe slug
- `image`: Path to circular category photo (exported from Figma)

13 categories: Studio, Photo & Video, Coffee, Kitchen, Home, Workshop, Outdoors, Auto, Apparel, Tech, Books, Software, Art & Design.

### Kit Subscription (runtime)

```
Client form (email input)
  → POST /api/subscribe { email }
  → Server: fetch Kit API with API key from env
  → Response: success/error
```

Kit API key stored in `KIT_API_KEY` env var (Vercel environment variables).

## Component Specs

### Header
- Full-width flex container, `padding-block: var(--mpds-space-48)`
- Left: Stake & Heap logo (SVG, extracted from Figma)
- Right: "mattplays.co" and "Instagram" links with arrow-up-right icons
- Font: Fragment Mono, `--mpds-font-size-sm`, uppercase, tracking 1.68px
- Font features: `'zero' 1`

### Hero
- 24-column grid, large vertical padding (`--mpds-space-240` top/bottom)
- Left (cols 3–7): Small landscape photo + tagline "an in-progress lifestyle site for makers & doers"
- Right (cols 18–22): "get pinged when it drops" label + email input with bottom border + arrow-right submit icon
- All text: Fragment Mono, sm, uppercase

### ProductCarousel
- Horizontal scroll container, `overflow-x: auto`, snap optional
- Cards: 468×625px, `--mpds-radius-2xl` (16px), `--color-surface` bg, `--mpds-space-16` gap
- Auto-scroll via `requestAnimationFrame`, continuous loop (clone card set, reset scroll at boundary)
- Hover: pause scroll, apply `--shadow-xxl`, slight scale lift
- Section padding: `--mpds-space-48` top, `--mpds-space-160` bottom
- Product images centered within card, sized per product type (books taller, tech wider, etc.)

### CategoryPills
- Two rows, each full-width
- Each pill: `--mpds-radius-full` border, `--color-border` 1px stroke, horizontal flex
- Circle photo: 322px, `--mpds-radius-full`, object-cover
- Category name: Instrument Sans Regular, `--mpds-font-size-12xl` (160px), tracking -4.8px
- Font features: `'ss01' 1, 'ss04' 1, 'ss05' 1, 'ss07' 1, 'ss08' 1, 'ss09' 1`
- Scroll-driven animation: Row 1 translates left, Row 2 translates right as section scrolls into view
- Uses `IntersectionObserver` + CSS transforms (progressive enhancement with `animation-timeline: scroll()` where supported)
- Gap between pills and between rows: `--mpds-space-24`

### Footer
- Full-width flex, justify-between, `padding-block: var(--mpds-space-48)`
- Left: "a wip project by matt plays"
- Right: "made in new england"
- Font: Fragment Mono, sm, uppercase

### SubscribeForm (used in Hero)
- Client component ('use client')
- Controlled email input, POST to /api/subscribe on submit
- States: idle, loading (disabled), success ("you're in"), error (retry)
- Styled as bottom-bordered input matching Figma spec

## Responsive Behavior

### Tablet (768–1024px)
- Grid collapses to 12 columns
- Carousel shows 2–3 cards
- Category pill text scales to ~96px
- Padding switches to `--site-padding-tablet`

### Mobile (<768px)
- Grid stacks to single column
- Hero: tagline and email form stack vertically
- Carousel: single card visible, swipe-enabled, no auto-scroll
- Category pills: smaller (48px text), horizontal scroll or vertical stack
- Padding switches to `--site-padding-mobile`

## Dependencies

| Package | Purpose |
|---|---|
| `next` | Framework (App Router) |
| `react`, `react-dom` | UI |
| `@mattplays/mpds` | Design tokens + icons |
| `@notionhq/client` | Build-time product data |

No Tailwind. No CSS-in-JS. No animation libraries.

## Environment Variables

| Var | Where | Purpose |
|---|---|---|
| `KIT_API_KEY` | Vercel env | Kit subscription API key |
| `NOTION_API_KEY` | Vercel env | Notion integration token |
| `NOTION_DATABASE_ID` | Vercel env | Product catalog DB ID (`f8645e2669e9483d992be80b709b8bda`) |
