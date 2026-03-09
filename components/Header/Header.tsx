'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import styles from './Header.module.css'

function ArrowUpRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  )
}

export default function Header() {
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltip({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTooltip(null)
  }, [])

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div
          className={styles.logoGroup}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <span className={styles.statusDot} />
          <Image
            src="/images/sh-logo.svg"
            alt="Stake & Heap"
            width={120}
            height={24}
            className={styles.logo}
            priority
          />
          {tooltip && (
            <span
              className={styles.statusTooltip}
              style={{ left: tooltip.x, top: tooltip.y + 16 }}
            >
              MVP Mode, stay tuned
            </span>
          )}
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
