'use client'
import { signOut } from '@/app/auth/actions'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  return (
    <button 
      onClick={() => signOut()}
      className="flex items-center gap-2 px-3 py-1.5 border border-white/5 bg-white/5 hover:bg-studio-neon/10 hover:border-studio-neon/50 hover:text-studio-neon transition-all rounded-sm group"
    >
      <LogOut size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
      <span className="text-[9px] font-black uppercase tracking-widest">Sign Out</span>
    </button>
  )
}
