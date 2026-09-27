'use client'
import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FloatingMusicNotes } from '@/components/FloatingMusicNotes'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')
  const isDashboardPage = pathname?.startsWith('/dashboard')
  const isMaintenancePage = pathname?.startsWith('/maintenance') || pathname?.startsWith('/maintance')
  const isThankYouPage = pathname?.startsWith('/thank-you') || pathname?.startsWith('/confirmation')
  const isCheckoutPage = pathname?.startsWith('/checkout')
  const isUnsubscribePage = pathname?.startsWith('/unsubscribe')
  const isSupportPage = pathname === '/support' || pathname?.startsWith('/support')

  if (isSupportPage) {
    return (
      <div className="h-[100dvh] max-h-[100dvh] w-full max-w-full overflow-hidden flex flex-col bg-[#07080a]">
        <Header />
        <main className="flex-1 min-h-0 w-full overflow-hidden flex flex-col">
          {children}
        </main>
      </div>
    )
  }

  if (isThankYouPage || isUnsubscribePage) {
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
      <Header />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </>
  )
}
