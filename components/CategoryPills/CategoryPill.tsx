import Image from 'next/image'
import type { Category } from '@/lib/types'
import styles from './CategoryPills.module.css'

interface CategoryPillProps {
  category: Category
}

export default function CategoryPill({ category }: CategoryPillProps) {
  return (
    <div className={styles.pill}>
      <div className={styles.pillImage}>
        <Image
          src={category.image}
          alt={category.name}
          width={240}
          height={240}
          className={styles.pillPhoto}
        />
      </div>
      <span className={styles.pillName}>{category.name}</span>
    </div>
  )
}
