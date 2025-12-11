import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import MobileNav from '@/components/MobileNav'
import CartProvider from '@/components/CartProvider'
import CartDrawer from '@/components/CartDrawer'
import LocationProvider from '@/components/LocationProvider'
import { I18nProvider } from '@/components/I18nProvider'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Rasss',
  description: 'Created with v0',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
      },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var l=localStorage.getItem('lang');if(l){document.documentElement.setAttribute('lang', l==='ur'?'ur':'en');document.documentElement.setAttribute('dir', l==='ur'?'rtl':'ltr');}}catch{}})()",
          }}
        />
        <I18nProvider>
          <LocationProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <MobileNav />
            </CartProvider>
          </LocationProvider>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
