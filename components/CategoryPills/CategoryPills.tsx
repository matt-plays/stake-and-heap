'use client'

import { useRef, useEffect, useState } from 'react'
import { categories } from '@/data/categories'
import CategoryPill from './CategoryPill'
import styles from './CategoryPills.module.css'

export default function CategoryPills() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      // 0 when section enters bottom of viewport, 1 when it exits top
      const progress = 1 - (rect.bottom / (viewportHeight + rect.height))
      setScrollProgress(Math.max(0, Math.min(1, progress)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Split categories into two rows
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
