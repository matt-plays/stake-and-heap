import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className="mono">a wip project by matt plays</p>
        <p className="mono">made in new england</p>
      </div>
    </footer>
  )
}
