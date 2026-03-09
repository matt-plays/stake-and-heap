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
