import Image from 'next/image'
import SubscribeForm from '@/components/SubscribeForm/SubscribeForm'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.left}>
          <Image
            src="/images/hero-thumb.png"
            alt="Stake & Heap"
            width={145}
            height={97}
            className={styles.photo}
          />
          <p className="mono">
            an in-progress brand, pondering place and the idea of home
          </p>
        </div>
        <div className={styles.right}>
          <SubscribeForm />
        </div>
      </div>
    </section>
  )
}
