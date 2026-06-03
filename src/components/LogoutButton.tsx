'use client'
import { useState } from 'react'
import { signOut } from '@/app/auth/actions'
import { LogOut, Loader2 } from 'lucide-react'

export function LogoutButton() {
  const [isPending, setIsPending] = useState(false)

  const handleLogout = async () => {
    setIsPending(true)
    try {
      await signOut()
    } catch (err) {
      console.error(err)
      setIsPending(false)
    }
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 bg-[#de1a44] hover:bg-[#c21338] text-white transition-all rounded-lg group font-bold shadow-sm disabled:opacity-85 disabled:cursor-wait relative overflow-hidden"
    >
      {isPending ? (
        <>
          <Loader2 size={14} className="animate-spin text-white" />
          <span className="text-[11px] font-bold text-white tracking-wide animate-pulse">Signing Out...</span>
        </>
      ) : (
        <>
          <LogOut size={14} className="text-white transition-transform duration-300 group-hover:translate-x-1" />
          <span className="text-[11px] font-bold text-white tracking-wide">Sign Out</span>
        </>
      )}
    </button>
  )
}
