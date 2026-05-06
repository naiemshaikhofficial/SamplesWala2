'use client'
import { signOut } from '@/app/auth/actions'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  return (
    <button 
      onClick={() => signOut()}
      className="flex items-center gap-2 hover:text-studio-neon transition-colors"
    >
      <LogOut size={14} />
      <span>Sign Out</span>
    </button>
  )
}
