import Image from 'next/image'
import SubscribeForm from '@/components/SubscribeForm/SubscribeForm'
import styles from './Footer.module.css'

const INSTAGRAM_URL = 'https://www.instagram.com/stakeandheap'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Echoes the hero signup, on the same 24-col grid so the thumbnail and
          the form line up with their counterparts up top. */}
      <section className={styles.signup}>
        <div className={`container ${styles.signupGrid}`}>
          <div className={styles.signupLeft}>
            <Image
              src="/images/footer-thumb.png"
              alt=""
              width={145}
              height={97}
              className={styles.thumb}
            />
            <p className="mono">
              sign up for the monthly round-up, and{' '}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                follow
              </a>{' '}
              for more
            </p>
          </div>
          <div className={styles.signupRight}>
            <SubscribeForm />
          </div>
        </div>
      </section>

      <div className={`container ${styles.inner}`}>
        <p className="mono">
          inspo <span className={styles.muted}>/ interviews / originals</span>
        </p>
        <p className="mono">made in new england</p>
        <p className="mono">
          <span className={styles.muted}>*</span> supported by affiliate links
        </p>
      </div>
    </footer>
  )
}
