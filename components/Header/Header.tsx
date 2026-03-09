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
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.logo}>Stake &amp; Heap</span>
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
