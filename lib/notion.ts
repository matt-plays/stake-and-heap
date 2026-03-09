import { Client } from '@notionhq/client'
import type { Product } from './types'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const DATABASE_ID = process.env.NOTION_DATABASE_ID!

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function getProducts(): Promise<Product[]> {
  const response = await notion.dataSources.query({
    data_source_id: DATABASE_ID,
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
  })

  return response.results.map((page: any) => {
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
}
