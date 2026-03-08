# Stake & Heap Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page lifestyle product site at stakeandheap.com using Next.js, mpds design tokens, Notion for product data, and Kit for email subscriptions.

**Architecture:** Next.js App Router with CSS Modules consuming `@mattplays/mpds` CSS custom properties. Products fetched from Notion at build time via ISR. Kit subscription handled by a server-side API route. Deployed on Vercel.

**Tech Stack:** Next.js 15, React 19, `@mattplays/mpds`, `@notionhq/client`, CSS Modules, Vercel

**Design doc:** `docs/plans/2026-03-08-stake-and-heap-design.md`

**Figma reference:** Main comp at node `552:17`, categories at node `557:898` in file `qTzMjaYCYoIcc0j5AJQHcd`

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.npmrc`, `.gitignore`, `.env.local`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

**Step 1: Initialize Next.js**

```bash
npx create-next-app@latest . --typescript --app --eslint --no-tailwind --no-src-dir --import-alias "@/*"
```

Run from `/Users/mattplays/Documents/GitHub/stake-and-heap/`. Answer prompts: Yes to TypeScript, ESLint, App Router. No to Tailwind, `src/` directory. Yes to Turbopack.

**Step 2: Configure .npmrc for mpds**

Create `.npmrc`:
```
@mattplays:registry=https://npm.pkg.github.com
```

**Step 3: Install mpds and Notion client**

```bash
npm install @mattplays/mpds @notionhq/client
```

**Step 4: Create .env.local**

```
KIT_API_KEY=J3X2UKOqbUBdmE2y2-zg6Q
NOTION_API_KEY=<user needs to provide>
NOTION_DATABASE_ID=f8645e2669e9483d992be80b709b8bda
```

Note: We'll need a Notion integration token. Ask the user if they don't have one set up.

**Step 5: Set up globals.css with mpds + semantic tokens**

Replace `app/globals.css` with:

```css
@import '@mattplays/mpds';

:root {
  /* Fonts — loaded via next/font in layout.tsx */
  --font-display: 'Instrument Sans', sans-serif;
  --font-mono: 'Fragment Mono', monospace;

  /* Site layout */
  --site-container-width: 1920px;
  --site-padding: var(--mpds-space-80);

  /* Semantic colors */
  --color-bg: var(--mpds-color-slate-0);
  --color-surface: var(--mpds-color-slate-25);
  --color-border: var(--mpds-color-slate-100);
  --color-muted: var(--mpds-color-slate-200);
  --color-text: var(--mpds-color-slate-800);

  /* Elevation */
  --shadow-xxl:
    0 8px 16px 0 rgba(19, 32, 38, 0.02),
    0 16px 32px 0 rgba(19, 32, 38, 0.04),
    0 24px 48px 0 rgba(19, 32, 38, 0.06),
    0 32px 64px 0 rgba(19, 32, 38, 0.08),
    0 40px 80px 0 rgba(19, 32, 38, 0.1),
    0 48px 96px 0 rgba(19, 32, 38, 0.12);
}

@media (max-width: 1024px) {
  :root {
    --site-padding: var(--mpds-space-40);
  }
}

@media (max-width: 768px) {
  :root {
    --site-padding: var(--mpds-space-20);
  }
}

/* Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Shared layout utility */
.container {
  width: 100%;
  max-width: var(--site-container-width);
  margin-inline: auto;
  padding-inline: var(--site-padding);
}

/* Mono text base style (Fragment Mono) */
.mono {
  font-family: var(--font-mono);
  font-size: var(--mpds-font-size-sm);
  line-height: 1.625;
  letter-spacing: 1.68px;
  text-transform: uppercase;
  font-feature-settings: 'zero' 1;
}
```

**Step 6: Set up layout.tsx with font loading**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Instrument_Sans } from 'next/font/google'
import { Fragment_Mono } from 'next/font/google'
import './globals.css'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const fragmentMono = Fragment_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Stake & Heap',
  description: 'An in-progress lifestyle site for makers & doers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${fragmentMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

**Step 7: Stub page.tsx**

Replace `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main>
      <p className="mono" style={{ padding: 'var(--mpds-space-48)' }}>
        Stake & Heap — coming soon
      </p>
    </main>
  )
}
```

**Step 8: Verify dev server runs**

```bash
npm run dev
```

Visit `http://localhost:3000`. Confirm: slate background, Fragment Mono text renders, mpds tokens are loaded (inspect element, check CSS custom properties on `:root`).

**Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with mpds tokens and font loading"
```

---

### Task 2: Kit Subscription API Route

**Files:**
- Create: `app/api/subscribe/route.ts`

**Step 1: Write the API route**

Create `app/api/subscribe/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      )
    }

    const KIT_API_KEY = process.env.KIT_API_KEY
    if (!KIT_API_KEY) {
      console.error('KIT_API_KEY not set')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': KIT_API_KEY,
      },
      body: JSON.stringify({
        email_address: email,
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      console.error('Kit API error:', response.status, data)
      return NextResponse.json(
        { error: 'Subscription failed' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Step 2: Test manually with curl**

```bash
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Expected: `{"success":true}` (or Kit-specific response). If KIT_API_KEY is set correctly, this creates a subscriber in Kit.

**Step 3: Commit**

```bash
git add app/api/subscribe/route.ts
git commit -m "feat: add Kit subscription API route"
```

---

### Task 3: Subscribe Form Component

**Files:**
- Create: `components/SubscribeForm/SubscribeForm.tsx`
- Create: `components/SubscribeForm/SubscribeForm.module.css`

**Step 1: Create the form component**

Create `components/SubscribeForm/SubscribeForm.tsx`:

```tsx
'use client'

import { useState, FormEvent } from 'react'
import { ArrowRight } from '@mattplays/mpds/icons'
import styles from './SubscribeForm.module.css'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return

    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.wrapper}>
        <p className={`mono ${styles.label}`}>you're in — we'll be in touch</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <p className={`mono ${styles.label}`}>get pinged when it drops</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder="enter your email address"
          className={`mono ${styles.input}`}
          disabled={status === 'loading'}
          required
        />
        <button
          type="submit"
          className={styles.submit}
          disabled={status === 'loading'}
          aria-label="Subscribe"
        >
          <ArrowRight />
        </button>
      </form>
      {status === 'error' && (
        <p className={`mono ${styles.error}`}>something went wrong — try again</p>
      )}
    </div>
  )
}
```

**Step 2: Style the form**

Create `components/SubscribeForm/SubscribeForm.module.css`:

```css
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  width: 100%;
}

.label {
  color: var(--color-text);
}

.form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-block: var(--mpds-space-8);
  border-bottom: 1px solid var(--color-muted);
}

.input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: var(--mpds-font-size-sm);
  line-height: 1.625;
  letter-spacing: 1.68px;
  text-transform: uppercase;
  font-feature-settings: 'zero' 1;
}

.input::placeholder {
  color: var(--color-muted);
  text-transform: uppercase;
}

.input:disabled {
  opacity: 0.5;
}

.submit {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  width: 24px;
  height: 24px;
  padding: 0;
}

.submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit svg {
  width: 24px;
  height: 24px;
}

.error {
  color: var(--mpds-color-red-s-200);
  margin-top: var(--mpds-space-8);
  font-size: var(--mpds-font-size-xs);
}
```

**Step 3: Verify in browser**

Temporarily render `<SubscribeForm />` in `page.tsx` to visually confirm it matches the Figma spec: bottom-bordered input, arrow-right icon, mono text.

**Step 4: Test the full flow**

Submit an email through the form. Confirm it hits `/api/subscribe` and Kit receives it.

**Step 5: Commit**

```bash
git add components/SubscribeForm/
git commit -m "feat: add SubscribeForm component with Kit integration"
```

---

### Task 4: Types, Notion Client, and Product Data

**Files:**
- Create: `lib/types.ts`
- Create: `lib/notion.ts`

**Step 1: Define types**

Create `lib/types.ts`:

```ts
export interface Product {
  id: string
  name: string
  category: string
  price: number | null
  description: string
  affiliateLink: string
  bookshopLink: string
  imageSlug: string
  heroFeature: boolean
  sortOrder: number
  status: string
}

export interface Category {
  name: string
  slug: string
  image: string
}
```

**Step 2: Create Notion client and product fetcher**

Create `lib/notion.ts`:

```ts
import { Client } from '@notionhq/client'
import type { Product } from './types'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const DATABASE_ID = process.env.NOTION_DATABASE_ID!

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function getProducts(): Promise<Product[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: 'Status',
      select: {
        does_not_equal: 'Archived',
      },
    },
    sorts: [
      {
        property: 'Sort Order',
        direction: 'ascending',
      },
    ],
  })

  return response.results.map((page: any) => {
    const props = page.properties
    const name = props['Product Name']?.title?.[0]?.plain_text ?? ''

    return {
      id: page.id,
      name,
      category: props['Category']?.select?.name ?? '',
      price: props['Price']?.number ?? null,
      description: props['Short Description']?.rich_text?.[0]?.plain_text ?? '',
      affiliateLink: props['Affiliate Link']?.url ?? '',
      bookshopLink: props['Bookshop.org Link']?.url ?? '',
      imageSlug: slugify(name),
      heroFeature: props['Hero Feature']?.checkbox ?? false,
      sortOrder: props['Sort Order']?.number ?? 999,
      status: props['Status']?.select?.name ?? 'Draft',
    }
  })
}
```

**Step 3: Verify Notion connection**

This requires a Notion integration token. If the user hasn't set one up:
1. Go to https://www.notion.so/my-integrations
2. Create integration with read access
3. Share the product catalog database with the integration
4. Add the token to `.env.local` as `NOTION_API_KEY`

Test by temporarily logging products in `page.tsx`:

```tsx
import { getProducts } from '@/lib/notion'

export default async function Home() {
  const products = await getProducts()
  console.log('Products:', products.length)
  // ...
}
```

**Step 4: Commit**

```bash
git add lib/
git commit -m "feat: add types, Notion client, and product data fetcher"
```

---

### Task 5: Copy Product Images & Create Category Data

**Files:**
- Copy images to: `public/images/products/`
- Create: `data/categories.ts`

**Step 1: Copy clipped product images**

```bash
mkdir -p public/images/products
cp '/Users/mattplays/Library/CloudStorage/Dropbox/Personal/Timeless/Claude Agent/Stake & Heap/Clipped/'*.png public/images/products/
```

Rename files to match slug convention (lowercase, hyphens, no trailing " 1"):

```bash
cd public/images/products
for f in *.png; do
  newname=$(echo "$f" | sed 's/ 1\.png/.png/')
  if [ "$f" != "$newname" ]; then mv "$f" "$newname"; fi
done
```

Verify with `ls public/images/products/` — should see `airpods-pro-2.png`, `the-creative-act.png`, etc.

**Step 2: Export category images from Figma**

Use the Figma MCP to download the 13 category circle photos from node `557:898`. Save to `public/images/categories/`. Alternatively, use high-quality placeholder photos and replace later.

For now, create `public/images/categories/` directory and note which images need to be exported:
- `studio.jpg`, `photo-video.jpg`, `coffee.jpg`, `kitchen.jpg`, `home.jpg`, `workshop.jpg`, `outdoors.jpg`, `auto.jpg`, `apparel.jpg`, `tech.jpg`, `books.jpg`, `software.jpg`, `art-design.jpg`

**Step 3: Create category data**

Create `data/categories.ts`:

```ts
import type { Category } from '@/lib/types'

export const categories: Category[] = [
  { name: 'Studio', slug: 'studio', image: '/images/categories/studio.jpg' },
  { name: 'Photo & Video', slug: 'photo-video', image: '/images/categories/photo-video.jpg' },
  { name: 'Coffee', slug: 'coffee', image: '/images/categories/coffee.jpg' },
  { name: 'Kitchen', slug: 'kitchen', image: '/images/categories/kitchen.jpg' },
  { name: 'Home', slug: 'home', image: '/images/categories/home.jpg' },
  { name: 'Workshop', slug: 'workshop', image: '/images/categories/workshop.jpg' },
  { name: 'Outdoors', slug: 'outdoors', image: '/images/categories/outdoors.jpg' },
  { name: 'Auto', slug: 'auto', image: '/images/categories/auto.jpg' },
  { name: 'Apparel', slug: 'apparel', image: '/images/categories/apparel.jpg' },
  { name: 'Tech', slug: 'tech', image: '/images/categories/tech.jpg' },
  { name: 'Books', slug: 'books', image: '/images/categories/books.jpg' },
  { name: 'Software', slug: 'software', image: '/images/categories/software.jpg' },
  { name: 'Art & Design', slug: 'art-design', image: '/images/categories/art-design.jpg' },
]
```

**Step 4: Commit**

```bash
git add public/images/products/ data/ public/images/categories/
git commit -m "feat: add product images, category data, and image assets"
```

---

### Task 6: Header Component

**Files:**
- Create: `components/Header/Header.tsx`
- Create: `components/Header/Header.module.css`

**Step 1: Extract logo SVG from Figma**

Use Figma MCP `get_screenshot` or `get_jsx` on the logo node within `552:46` to get the Stake & Heap wordmark SVG. Save as an inline SVG component or as `public/images/logo.svg`.

**Step 2: Build Header component**

Create `components/Header/Header.tsx`:

```tsx
import { ArrowUpRight } from '@mattplays/mpds/icons'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.logo}>
          {/* Logo SVG goes here — extracted from Figma */}
          <img src="/images/logo.svg" alt="Stake & Heap" height={20} />
        </div>
        <nav className={styles.nav}>
          <a href="https://mattplays.co" target="_blank" rel="noopener noreferrer" className="mono">
            mattplays.co <ArrowUpRight />
          </a>
          <a href="https://instagram.com/mattplays" target="_blank" rel="noopener noreferrer" className="mono">
            Instagram <ArrowUpRight />
          </a>
        </nav>
      </div>
    </header>
  )
}
```

**Step 3: Style it**

Create `components/Header/Header.module.css`:

```css
.header {
  padding-block: var(--mpds-space-48);
  width: 100%;
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo img {
  height: 20px;
  width: auto;
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--mpds-space-48);
}

.nav a {
  display: inline-flex;
  align-items: center;
  gap: var(--mpds-space-4);
  color: var(--color-text);
  text-decoration: none;
  white-space: nowrap;
}

.nav a svg {
  width: 14px;
  height: 14px;
}
```

**Step 4: Add to page.tsx and verify**

**Step 5: Commit**

```bash
git add components/Header/
git commit -m "feat: add Header component with logo and nav links"
```

---

### Task 7: Hero Section Component

**Files:**
- Create: `components/Hero/Hero.tsx`
- Create: `components/Hero/Hero.module.css`

**Step 1: Build Hero component**

Create `components/Hero/Hero.tsx`:

```tsx
import Image from 'next/image'
import SubscribeForm from '@/components/SubscribeForm/SubscribeForm'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.left}>
          <Image
            src="/images/hero-photo.jpg"
            alt="Smuggler's Notch landscape"
            width={145}
            height={97}
            className={styles.photo}
          />
          <p className="mono">
            an in-progress lifestyle site for makers & doers
          </p>
        </div>
        <div className={styles.right}>
          <SubscribeForm />
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Style with 24-column grid**

Create `components/Hero/Hero.module.css`:

```css
.hero {
  padding-inline: var(--site-padding);
  padding-block: var(--mpds-space-240);
}

.grid {
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  gap: var(--mpds-space-16);
  max-width: var(--site-container-width);
  padding-inline: 0;
}

.left {
  grid-column: 3 / span 5;
  display: flex;
  align-items: flex-end;
  gap: var(--mpds-space-16);
}

.left p {
  width: 226px;
}

.photo {
  border-radius: var(--mpds-radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}

.right {
  grid-column: 18 / span 5;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 97px;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(12, 1fr);
  }
  .left {
    grid-column: 1 / span 5;
  }
  .right {
    grid-column: 7 / span 6;
  }
}

@media (max-width: 768px) {
  .hero {
    padding-block: var(--mpds-space-128);
  }
  .grid {
    display: flex;
    flex-direction: column;
    gap: var(--mpds-space-48);
  }
  .left {
    flex-direction: column;
    align-items: flex-start;
  }
  .left p {
    width: 100%;
  }
  .right {
    height: auto;
  }
}
```

**Step 3: Export hero photo from Figma**

The hero uses a small landscape photo (node `557:976`). Export via Figma MCP and save as `public/images/hero-photo.jpg`.

**Step 4: Add to page.tsx and verify**

**Step 5: Commit**

```bash
git add components/Hero/
git commit -m "feat: add Hero section with subscribe form and 24-col grid"
```

---

### Task 8: Product Card & Carousel

**Files:**
- Create: `components/ProductCarousel/ProductCard.tsx`
- Create: `components/ProductCarousel/ProductCarousel.tsx`
- Create: `components/ProductCarousel/ProductCarousel.module.css`

**Step 1: Build ProductCard**

Create `components/ProductCarousel/ProductCard.tsx`:

```tsx
import Image from 'next/image'
import type { Product } from '@/lib/types'
import styles from './ProductCarousel.module.css'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const href = product.bookshopLink || product.affiliateLink

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      <Image
        src={`/images/products/${product.imageSlug}.png`}
        alt={product.name}
        width={468}
        height={625}
        className={styles.cardImage}
      />
    </a>
  )
}
```

**Step 2: Build ProductCarousel with auto-scroll and loop**

Create `components/ProductCarousel/ProductCarousel.tsx`:

```tsx
'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import type { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import styles from './ProductCarousel.module.css'

interface ProductCarouselProps {
  products: Product[]
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const animationRef = useRef<number | null>(null)
  const scrollSpeedRef = useRef(0.5) // px per frame

  // Duplicate products for seamless loop
  const displayProducts = [...products, ...products]

  const scroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || isPaused) {
      animationRef.current = requestAnimationFrame(scroll)
      return
    }

    el.scrollLeft += scrollSpeedRef.current

    // Reset to beginning when we've scrolled past the first set
    const halfWidth = el.scrollWidth / 2
    if (el.scrollLeft >= halfWidth) {
      el.scrollLeft -= halfWidth
    }

    animationRef.current = requestAnimationFrame(scroll)
  }, [isPaused])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(scroll)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [scroll])

  return (
    <section className={styles.section}>
      <div
        ref={scrollRef}
        className={styles.track}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {displayProducts.map((product, i) => (
          <ProductCard key={`${product.id}-${i}`} product={product} />
        ))}
      </div>
    </section>
  )
}
```

**Step 3: Style carousel and cards**

Create `components/ProductCarousel/ProductCarousel.module.css`:

```css
.section {
  padding-top: var(--mpds-space-48);
  padding-bottom: var(--mpds-space-160);
  width: 100%;
  overflow: hidden;
}

.track {
  display: flex;
  gap: var(--mpds-space-16);
  overflow-x: hidden;
  width: 100%;
  justify-content: center;
  cursor: grab;
}

.card {
  flex-shrink: 0;
  width: 468px;
  height: 625px;
  background-color: var(--color-surface);
  border-radius: var(--mpds-radius-2xl);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  text-decoration: none;
}

.card:hover {
  box-shadow: var(--shadow-xxl);
  transform: translateY(-4px);
}

.cardImage {
  object-fit: contain;
  max-width: 85%;
  max-height: 85%;
  width: auto;
  height: auto;
}

@media (max-width: 768px) {
  .track {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    padding-inline: var(--site-padding);
  }
  .card {
    width: 300px;
    height: 400px;
    scroll-snap-align: center;
  }
}
```

**Step 4: Wire into page.tsx with Notion data**

```tsx
import { getProducts } from '@/lib/notion'
import Header from '@/components/Header/Header'
import Hero from '@/components/Hero/Hero'
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel'

export const revalidate = 60

export default async function Home() {
  const products = await getProducts()

  return (
    <main>
      <Header />
      <Hero />
      <ProductCarousel products={products} />
    </main>
  )
}
```

**Step 5: Verify carousel auto-scrolls, pauses on hover, XXL shadow appears**

**Step 6: Commit**

```bash
git add components/ProductCarousel/ app/page.tsx
git commit -m "feat: add ProductCarousel with auto-scroll, loop, and hover shadow"
```

---

### Task 9: Category Pills with Scroll Animation

**Files:**
- Create: `components/CategoryPills/CategoryPill.tsx`
- Create: `components/CategoryPills/CategoryPills.tsx`
- Create: `components/CategoryPills/CategoryPills.module.css`

**Step 1: Build CategoryPill**

Create `components/CategoryPills/CategoryPill.tsx`:

```tsx
import Image from 'next/image'
import type { Category } from '@/lib/types'
import styles from './CategoryPills.module.css'

interface CategoryPillProps {
  category: Category
}

export default function CategoryPill({ category }: CategoryPillProps) {
  return (
    <div className={styles.pill}>
      <div className={styles.pillImage}>
        <Image
          src={category.image}
          alt={category.name}
          width={322}
          height={322}
          className={styles.pillPhoto}
        />
      </div>
      <span className={styles.pillName}>{category.name}</span>
    </div>
  )
}
```

**Step 2: Build CategoryPills with scroll-driven parallax**

Create `components/CategoryPills/CategoryPills.tsx`:

```tsx
'use client'

import { useRef, useEffect, useState } from 'react'
import { categories } from '@/data/categories'
import CategoryPill from './CategoryPill'
import styles from './CategoryPills.module.css'

export default function CategoryPills() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const handleScroll = () => {
            const rect = section.getBoundingClientRect()
            const viewportHeight = window.innerHeight
            // 0 when section enters bottom, 1 when it exits top
            const progress = 1 - (rect.bottom / (viewportHeight + rect.height))
            setScrollProgress(Math.max(0, Math.min(1, progress)))
          }
          window.addEventListener('scroll', handleScroll, { passive: true })
          return () => window.removeEventListener('scroll', handleScroll)
        }
      },
      { threshold: 0 }
    )

    observer.observe(section)

    // Also listen to scroll while section is visible
    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const progress = 1 - (rect.bottom / (viewportHeight + rect.height))
      setScrollProgress(Math.max(0, Math.min(1, progress)))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Split categories into two rows
  // Row 1: first ~half, Row 2: rest
  const mid = Math.ceil(categories.length / 2)
  const row1 = categories.slice(0, mid)
  const row2 = categories.slice(mid)

  // Parallax offset: Row 1 moves left, Row 2 moves right
  const maxOffset = 200 // px
  const row1Offset = -scrollProgress * maxOffset
  const row2Offset = scrollProgress * maxOffset

  return (
    <section ref={sectionRef} className={styles.section}>
      <div
        className={styles.row}
        style={{ transform: `translateX(${row1Offset}px)` }}
      >
        {row1.map((cat) => (
          <CategoryPill key={cat.slug} category={cat} />
        ))}
      </div>
      <div
        className={styles.row}
        style={{ transform: `translateX(${row2Offset}px)` }}
      >
        {row2.map((cat) => (
          <CategoryPill key={cat.slug} category={cat} />
        ))}
      </div>
    </section>
  )
}
```

**Step 3: Style pills**

Create `components/CategoryPills/CategoryPills.module.css`:

```css
.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--mpds-space-24);
  padding-bottom: var(--mpds-space-160);
  overflow: hidden;
  width: 100%;
}

.row {
  display: flex;
  gap: var(--mpds-space-24);
  align-items: center;
  justify-content: center;
  will-change: transform;
  transition: transform 0.05s linear;
}

.pill {
  display: flex;
  align-items: center;
  gap: var(--mpds-space-80);
  padding: var(--mpds-space-24);
  padding-right: var(--mpds-space-96);
  border: 1px solid var(--color-border);
  border-radius: var(--mpds-radius-full);
  flex-shrink: 0;
}

.pillImage {
  width: 322px;
  height: 322px;
  border-radius: var(--mpds-radius-full);
  overflow: hidden;
  flex-shrink: 0;
}

.pillPhoto {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pillName {
  font-family: var(--font-display);
  font-size: var(--mpds-font-size-12xl);
  font-weight: 400;
  line-height: 1.625;
  letter-spacing: -4.8px;
  white-space: nowrap;
  color: var(--color-text);
  font-feature-settings: 'ss01' 1, 'ss04' 1, 'ss05' 1, 'ss07' 1, 'ss08' 1, 'ss09' 1;
}

@media (max-width: 1024px) {
  .pillImage {
    width: 160px;
    height: 160px;
  }
  .pillName {
    font-size: var(--mpds-font-size-10xl);
    letter-spacing: -2px;
  }
  .pill {
    gap: var(--mpds-space-40);
    padding-right: var(--mpds-space-48);
  }
}

@media (max-width: 768px) {
  .pillImage {
    width: 80px;
    height: 80px;
  }
  .pillName {
    font-size: var(--mpds-font-size-7xl);
    letter-spacing: -1px;
  }
  .pill {
    gap: var(--mpds-space-20);
    padding: var(--mpds-space-12);
    padding-right: var(--mpds-space-24);
  }
}
```

**Step 4: Verify scroll animation works**

Scroll page — Row 1 should shift left, Row 2 should shift right as the section scrolls into view.

**Step 5: Commit**

```bash
git add components/CategoryPills/ data/
git commit -m "feat: add CategoryPills with scroll-driven parallax animation"
```

---

### Task 10: Footer Component

**Files:**
- Create: `components/Footer/Footer.tsx`
- Create: `components/Footer/Footer.module.css`

**Step 1: Build Footer**

Create `components/Footer/Footer.tsx`:

```tsx
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className="mono">a wip project by matt plays</p>
        <p className="mono">made in new england</p>
      </div>
    </footer>
  )
}
```

**Step 2: Style Footer**

Create `components/Footer/Footer.module.css`:

```css
.footer {
  padding-block: var(--mpds-space-48);
  width: 100%;
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .inner {
    flex-direction: column;
    gap: var(--mpds-space-16);
    align-items: flex-start;
  }
}
```

**Step 3: Commit**

```bash
git add components/Footer/
git commit -m "feat: add Footer component"
```

---

### Task 11: Assemble Full Page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Wire all components together**

Update `app/page.tsx`:

```tsx
import { getProducts } from '@/lib/notion'
import Header from '@/components/Header/Header'
import Hero from '@/components/Hero/Hero'
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel'
import CategoryPills from '@/components/CategoryPills/CategoryPills'
import Footer from '@/components/Footer/Footer'

export const revalidate = 60

export default async function Home() {
  const products = await getProducts()

  return (
    <main>
      <Header />
      <Hero />
      <ProductCarousel products={products} />
      <CategoryPills />
      <Footer />
    </main>
  )
}
```

**Step 2: Full visual review**

Compare against Figma comp `552:17`. Check:
- Header alignment and spacing
- Hero 24-col grid positions
- Carousel card sizing and hover behavior
- Category pill proportions and scroll animation
- Footer placement
- Background color matches `--mpds-color-slate-0`

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble full page with all sections"
```

---

### Task 12: Responsive Polish & Final QA

**Files:**
- Modify: Various `.module.css` files as needed

**Step 1: Test at all breakpoints**

- Desktop (1440px+): Full 24-col grid, all elements at design spec sizes
- Tablet (768–1024px): 12-col grid, scaled-down pills, 2-3 carousel cards
- Mobile (<768px): Stacked layout, single carousel card, small pills

**Step 2: Fix any spacing/alignment issues found**

**Step 3: Add next.config.ts image configuration**

If using `next/image` with external domains or specific image patterns:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
```

**Step 4: Commit**

```bash
git add -A
git commit -m "fix: responsive polish and final QA adjustments"
```

---

### Task 13: Deploy to Vercel

**Step 1: Set up Vercel project**

Use Vercel CLI or the Vercel MCP tools:

```bash
npx vercel link
```

**Step 2: Set environment variables on Vercel**

```bash
npx vercel env add KIT_API_KEY
npx vercel env add NOTION_API_KEY
npx vercel env add NOTION_DATABASE_ID
```

**Step 3: Deploy**

```bash
npx vercel --prod
```

Or use the Vercel MCP `deploy_to_vercel` tool.

**Step 4: Verify production deployment**

- Visit the deployment URL
- Test email subscription
- Check product images load
- Verify carousel and scroll animation work
- Test responsive behavior

**Step 5: Commit any config changes**

```bash
git add -A
git commit -m "chore: add Vercel configuration"
```

---

## Summary

| Task | Description | Estimated effort |
|------|-------------|-----------------|
| 1 | Scaffold Next.js + mpds + fonts | Foundation |
| 2 | Kit API route | Backend |
| 3 | SubscribeForm component | Component |
| 4 | Types + Notion client | Data layer |
| 5 | Product images + category data | Assets |
| 6 | Header component | Component |
| 7 | Hero section | Component |
| 8 | Product carousel | Component (complex) |
| 9 | Category pills + scroll animation | Component (complex) |
| 10 | Footer | Component (simple) |
| 11 | Assemble full page | Integration |
| 12 | Responsive polish | QA |
| 13 | Deploy to Vercel | Deploy |
