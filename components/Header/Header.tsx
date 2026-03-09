'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useTheme } from '@/components/ThemeProvider/ThemeProvider'
import styles from './Header.module.css'

function ArrowUpRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  )
}

function Moon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

function Sun() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export default function Header() {
  const { theme, toggle } = useTheme()
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltip({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTooltip(null)
  }, [])

  return (
    <>
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

          {/* Desktop nav */}
          <nav className={styles.nav}>
            <a href="https://mattplays.co" target="_blank" rel="noopener noreferrer" className="mono">
              mattplays.co <ArrowUpRight />
            </a>
            <a href="https://www.instagram.com/stakeandheap" target="_blank" rel="noopener noreferrer" className="mono">
              Instagram <ArrowUpRight />
            </a>
            <button
              className={styles.themeToggle}
              onClick={toggle}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon /> : <Sun />}
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            className={styles.menuButton}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className={styles.overlay}>
          <button
            className={styles.overlayClose}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <XIcon />
          </button>
          <nav className={styles.overlayNav}>
            <a href="https://mattplays.co" target="_blank" rel="noopener noreferrer" className="mono" onClick={() => setMenuOpen(false)}>
              mattplays.co <ArrowUpRight />
            </a>
            <a href="https://www.instagram.com/stakeandheap" target="_blank" rel="noopener noreferrer" className="mono" onClick={() => setMenuOpen(false)}>
              Instagram <ArrowUpRight />
            </a>
            <button
              className={styles.themeToggle}
              onClick={toggle}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon /> : <Sun />}
            </button>
          </nav>
        </div>
      )}
    </>
  )
}
