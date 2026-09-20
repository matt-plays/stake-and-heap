import Header from '@/components/Header/Header'
import Hero from '@/components/Hero/Hero'
import Quote from '@/components/Quote/Quote'
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel'
import CategoryPills from '@/components/CategoryPills/CategoryPills'
import Footer from '@/components/Footer/Footer'
import { getProducts } from '@/lib/notion'

export const revalidate = 60

export default async function Home() {
  let products: Awaited<ReturnType<typeof getProducts>> = []

  try {
    products = await getProducts()
  } catch (e) {
    console.error('Failed to fetch products from Notion:', e)
  }

  return (
    <main>
      <Header />
      <Hero />
      <Quote />
      {products.length > 0 && <ProductCarousel products={products} />}
      <CategoryPills />
      <Footer />
    </main>
  )
}
