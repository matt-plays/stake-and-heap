'use client'

import { useRef, useEffect, useCallback } from 'react'
import type { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import styles from './ProductCarousel.module.css'

interface ProductCarouselProps {
  products: Product[]
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr]
  let s = seed
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647
    const j = s % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const scrollSpeedRef = useRef(0.5) // px per frame

  // Shuffle to mix categories, then duplicate for seamless loop
  const shuffled = seededShuffle(products, 42)
  const displayProducts = [...shuffled, ...shuffled]

  const scroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) {
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
  }, [])

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
      <div ref={scrollRef} className={styles.track}>
        {displayProducts.map((product, i) => (
          <ProductCard key={`${product.id}-${i}`} product={product} />
        ))}
      </div>
    </section>
  )
}
