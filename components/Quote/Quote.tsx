'use client'

import { useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { quote } from '@/data/quote'
import styles from './Quote.module.css'

/**
 * How many words are mid-transition at any moment. Higher = softer, more
 * gradual edge; 1 would snap each word on individually.
 */
const FEATHER = 4

function toWords(text: string): string[] {
  return text.trim().split(/\s+/)
}

export default function Quote() {
  const quoteRef = useRef<HTMLQuoteElement>(null)
  const wordRefs = useRef<HTMLSpanElement[]>([])

  const { words, highlightStart } = useMemo(() => {
    const body = toWords(quote.text)
    const highlight = toWords(quote.highlight)
    return { words: [...body, ...highlight], highlightStart: body.length }
  }, [])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (prefersReduced.matches) return

    let rafId: number | null = null
    const total = wordRefs.current.length

    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const el = quoteRef.current
        if (!el) return

        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        // Starts when the quote's top passes 85% of the viewport, completes
        // once its bottom reaches the halfway line.
        const progress = Math.max(
          0,
          Math.min(1, (vh * 0.85 - rect.top) / (vh * 0.35 + rect.height))
        )

        // Advance a notional "read head" across the words, feathering the edge.
        const head = progress * (total + FEATHER)
        for (let i = 0; i < total; i++) {
          const reveal = Math.max(0, Math.min(1, (head - i) / FEATHER))
          wordRefs.current[i]?.style.setProperty('--reveal', reveal.toFixed(3))
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section className={styles.section}>
      {/* Both backgrounds render so the inactive theme's image is already
          fetched — swapping themes is instant with no flash of empty bg. */}
      <div className={styles.background} aria-hidden="true">
        <Image
          src="/images/quote-bg.webp"
          alt=""
          fill
          sizes="100vw"
          className={`${styles.backgroundImage} ${styles.backgroundLight}`}
          priority
        />
        <Image
          src="/images/quote-bg-dark.webp"
          alt=""
          fill
          sizes="100vw"
          className={`${styles.backgroundImage} ${styles.backgroundDark}`}
          priority
        />
        <div className={styles.backgroundFade} />
      </div>

      <figure className={`container ${styles.grid}`}>
        <blockquote ref={quoteRef} className={styles.quote}>
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              ref={(node) => {
                if (node) wordRefs.current[i] = node
              }}
              className={i >= highlightStart ? styles.highlight : styles.word}
            >
              {word}{' '}
            </span>
          ))}
        </blockquote>
        <figcaption className={`mono ${styles.attribution}`}>
          {quote.attribution}
        </figcaption>
      </figure>
    </section>
  )
}
