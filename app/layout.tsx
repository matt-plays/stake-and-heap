import type { Metadata } from 'next'
import { Instrument_Sans } from 'next/font/google'
import { Fragment_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider'
import './globals.css'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const fragmentMono = Fragment_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Stake & Heap',
  description: 'An in-progress lifestyle site for makers & doers',
}

const themeScript = `
(function() {
  var t = localStorage.getItem('theme');
  if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${fragmentMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
