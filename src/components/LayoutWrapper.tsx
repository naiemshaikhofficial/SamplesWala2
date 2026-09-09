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

  if (isAuthPage || isDashboardPage || isMaintenancePage) {
    return (
      <main className="flex-grow flex flex-col relative">
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
