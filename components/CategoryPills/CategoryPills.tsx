'use client'

import { useRef, useEffect } from 'react'
import { categories } from '@/data/categories'
import CategoryPill from './CategoryPill'
import styles from './CategoryPills.module.css'

const MAX_OFFSET = 400 // px

export default function CategoryPills() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const section = sectionRef.current
        if (!section || !row1Ref.current || !row2Ref.current) return

        const rect = section.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        // 0 when section enters bottom of viewport, 1 when it exits top
        const progress = Math.max(0, Math.min(1, 1 - (rect.bottom / (viewportHeight + rect.height))))

        row1Ref.current.style.transform = `translateX(${-progress * MAX_OFFSET}px)`
        row2Ref.current.style.transform = `translateX(${progress * MAX_OFFSET}px)`
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  // Split categories into two rows
  const mid = Math.ceil(categories.length / 2)
  const row1 = categories.slice(0, mid)
  const row2 = categories.slice(mid)

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={row1Ref} className={styles.row}>
        {row1.map((cat) => (
          <CategoryPill key={cat.slug} category={cat} />
        ))}
      </div>
      <div ref={row2Ref} className={styles.row}>
        {row2.map((cat) => (
          <CategoryPill key={cat.slug} category={cat} />
        ))}
      </div>
    </section>
  )
}
