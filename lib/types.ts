export interface Product {
  id: string
  name: string
  category: string
  price: number | null
  description: string
  affiliateLink: string
  bookshopLink: string
  imageSlug: string
  heroFeature: boolean
  sortOrder: number
  status: string
}

export interface Category {
  name: string
  slug: string
  image: string
}
