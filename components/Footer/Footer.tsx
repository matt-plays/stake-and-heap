import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className="mono">
          inspo <span className={styles.muted}>→ interviews → originals</span>
        </p>
        <p className="mono">supported by affiliate links</p>
      </div>
    </footer>
  )
}
