import Image from 'next/image'
import type { Product } from '@/lib/types'
import styles from './ProductCarousel.module.css'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const href = product.bookshopLink || product.affiliateLink

  return (
    <a
      href={href || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      <Image
        src={`/images/products/${product.imageSlug}.png`}
        alt={product.name}
        width={468}
        height={625}
        className={styles.cardImage}
      />
    </a>
  )
}
