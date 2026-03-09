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

const AUTO_SPEED = 0.5   // px per frame
const FRICTION = 0.95    // velocity decay per frame
const MIN_VELOCITY = 0.5 // threshold to stop inertia

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const isDragging = useRef(false)
  const velocity = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const dragStartX = useRef(0)
  const dragStartScrollLeft = useRef(0)

  const shuffled = seededShuffle(products, 42)
  const displayProducts = [...shuffled, ...shuffled]

  const wrapScroll = useCallback((el: HTMLDivElement) => {
    const halfWidth = el.scrollWidth / 2
    if (el.scrollLeft >= halfWidth) {
      el.scrollLeft -= halfWidth
    } else if (el.scrollLeft < 0) {
      el.scrollLeft += halfWidth
    }
  }, [])

  const tick = useCallback(() => {
    const el = scrollRef.current
    if (!el) {
      animationRef.current = requestAnimationFrame(tick)
      return
    }

    if (!isDragging.current) {
      if (Math.abs(velocity.current) > MIN_VELOCITY) {
        // Inertia phase: apply decaying velocity
        el.scrollLeft += velocity.current
        velocity.current *= FRICTION
      } else {
        // Auto-scroll phase
        velocity.current = 0
        el.scrollLeft += AUTO_SPEED
      }
    }

    wrapScroll(el)
    animationRef.current = requestAnimationFrame(tick)
  }, [wrapScroll])

  const wasDragged = useRef(false)

  const onDocPointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current || !scrollRef.current) return
    const now = Date.now()
    const dx = e.clientX - lastX.current
    const dt = Math.max(now - lastTime.current, 1)

    scrollRef.current.scrollLeft -= dx
    velocity.current = (-dx / dt) * 16

    lastX.current = e.clientX
    lastTime.current = now
  }, [])

  const onDocPointerUp = useCallback((e: PointerEvent) => {
    if (!isDragging.current) return
    isDragging.current = false

    const dragDist = Math.abs(e.clientX - dragStartX.current)
    wasDragged.current = dragDist > 5
    if (!wasDragged.current) {
      velocity.current = 0
    }

    document.removeEventListener('pointermove', onDocPointerMove)
    document.removeEventListener('pointerup', onDocPointerUp)
  }, [onDocPointerMove])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current
    if (!el) return
    isDragging.current = true
    velocity.current = 0
    lastX.current = e.clientX
    lastTime.current = Date.now()
    dragStartX.current = e.clientX
    dragStartScrollLeft.current = el.scrollLeft

    document.addEventListener('pointermove', onDocPointerMove)
    document.addEventListener('pointerup', onDocPointerUp)
  }, [onDocPointerMove, onDocPointerUp])

  const onClickCapture = useCallback((e: React.MouseEvent) => {
    // Prevent link navigation if user was dragging
    if (wasDragged.current) {
      e.preventDefault()
      e.stopPropagation()
      wasDragged.current = false
    }
  }, [])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(tick)

    const el = scrollRef.current
    if (el) {
      const onWheel = (e: WheelEvent) => {
        // Only capture horizontal scroll — let vertical scroll pass through
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
        if (e.deltaX === 0) return
        e.preventDefault()
        velocity.current = e.deltaX * 0.5
      }
      el.addEventListener('wheel', onWheel, { passive: false })
      return () => {
        el.removeEventListener('wheel', onWheel)
        if (animationRef.current) cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [tick])

  return (
    <section className={styles.section}>
      <div
        ref={scrollRef}
        className={styles.track}
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
      >
        {displayProducts.map((product, i) => (
          <ProductCard key={`${product.id}-${i}`} product={product} />
        ))}
      </div>
    </section>
  )
}
