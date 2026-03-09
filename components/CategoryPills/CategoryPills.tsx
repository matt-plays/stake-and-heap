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

  // Split categories into three rows
  const third = Math.ceil(categories.length / 3)
  const row1 = categories.slice(0, third)
  const row2 = categories.slice(third, third * 2)
  const row3 = categories.slice(third * 2)

  // Parallax offset: alternating directions
  const maxOffset = 200 // px
  const row1Offset = -scrollProgress * maxOffset
  const row2Offset = scrollProgress * maxOffset
  const row3Offset = -scrollProgress * maxOffset

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
      <div
        className={styles.row}
        style={{ transform: `translateX(${row3Offset}px)` }}
      >
        {row3.map((cat) => (
          <CategoryPill key={cat.slug} category={cat} />
        ))}
      </div>
    </section>
  )
}
