import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import MobileNav from '@/components/MobileNav'
import CartProvider from '@/components/CartProvider'
import CartDrawer from '@/components/CartDrawer'
import LocationProvider from '@/components/LocationProvider'
import { I18nProvider } from '@/components/I18nProvider'
import AdminProvider from '@/components/AdminProvider'
import AuthProvider from '@/components/AuthProvider'
import AuthSessionProvider from '@/components/AuthSessionProvider'
import { Toaster } from '@/components/ui/sonner'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://rasss.com'),
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

import { PageTransition } from '../components/PageTransition'

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
          <AuthSessionProvider>
            <AuthProvider>
              <AdminProvider>
                <LocationProvider>
                  <CartProvider>
                    <PageTransition>
                      {children}
                    </PageTransition>
                    <CartDrawer />
                    <MobileNav />
                  </CartProvider>
                </LocationProvider>
              </AdminProvider>
            </AuthProvider>
          </AuthSessionProvider>
        </I18nProvider>
        <Toaster position="bottom-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
