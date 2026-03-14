import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Stake & Heap',
    short_name: 'Stake & Heap',
    description: 'A lifestyle site for makers & doers',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFBFB3',
    theme_color: '#FFBFB3',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
