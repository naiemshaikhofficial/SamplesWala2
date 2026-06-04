'use client'
import { signOut } from '@/app/auth/actions'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error signing out on client:', err)
    }
    await signOut()
  }

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-[#de1a44] hover:bg-[#c21338] text-white transition-all rounded-lg group font-bold shadow-sm"
    >
      <LogOut size={14} className="text-white" />
      <span className="text-[11px] font-bold text-white tracking-wide">Sign Out</span>
    </button>
  )
}
