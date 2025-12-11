import type { AppProps } from 'next/app'
import { I18nProvider } from '@/components/I18nProvider'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <Component {...pageProps} />
    </I18nProvider>
  )
}

