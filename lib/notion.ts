import type { Product } from './types'
import { staticProducts } from '@/data/products'

const NOTION_API_KEY = process.env.NOTION_API_KEY
const DATABASE_ID = process.env.NOTION_DATABASE_ID

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function getProducts(): Promise<Product[]> {
  if (!NOTION_API_KEY || !DATABASE_ID) {
    return staticProducts
  }

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'Status',
            select: {
              does_not_equal: 'Archived',
            },
          },
          sorts: [
            {
              property: 'Sort Order',
              direction: 'ascending',
            },
          ],
        }),
        next: { revalidate: 60 },
      }
    )

    if (!response.ok) {
      console.warn('Notion API error, falling back to static data:', response.status)
      return staticProducts
    }

    const data = await response.json()

    const products = data.results.map((page: any) => {
      const props = page.properties
      const name = props['Product Name']?.title?.[0]?.plain_text ?? ''

      return {
        id: page.id,
        name,
        category: props['Category']?.select?.name ?? '',
        price: props['Price']?.number ?? null,
        description: props['Short Description']?.rich_text?.[0]?.plain_text ?? '',
        affiliateLink: props['Affiliate Link']?.url ?? '',
        bookshopLink: props['Bookshop.org Link']?.url ?? '',
        imageSlug: slugify(name),
        heroFeature: props['Hero Feature']?.checkbox ?? false,
        sortOrder: props['Sort Order']?.number ?? 999,
        status: props['Status']?.select?.name ?? 'Draft',
      }
    })

    return products.length > 0 ? products : staticProducts
  } catch {
    console.warn('Failed to fetch from Notion, using static data')
    return staticProducts
  }
}
