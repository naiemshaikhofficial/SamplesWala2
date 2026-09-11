'use client'
import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header'
import { LaunchOffer } from '@/components/LaunchOffer'
import { Footer } from '@/components/Footer'
import { FloatingMusicNotes } from '@/components/FloatingMusicNotes'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')
  const isDashboardPage = pathname?.startsWith('/dashboard')
  const isMaintenancePage = pathname?.startsWith('/maintenance') || pathname?.startsWith('/maintance')
  const isThankYouPage = pathname?.startsWith('/thank-you') || pathname?.startsWith('/confirmation')
  const isCheckoutPage = pathname?.startsWith('/checkout')

  if (isThankYouPage) {
    return (
      <main className="h-screen h-[100dvh] max-h-[100dvh] w-full max-w-full overflow-hidden flex flex-col">
        {children}
      </main>
    )
  }

  if (isAuthPage || isDashboardPage || isMaintenancePage || isCheckoutPage) {
    return (
      <main className="flex-grow flex flex-col relative w-full max-w-full overflow-x-hidden">
        {children}
      </main>
    )
  }

  return (
    <>
      <FloatingMusicNotes />
      <LaunchOffer />
      <Header />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </>
  )
}
