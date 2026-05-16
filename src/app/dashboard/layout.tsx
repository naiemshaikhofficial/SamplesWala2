import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Music, 
  Settings, 
  LogOut, 
  ChevronRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

import { LogoutButton } from '@/components/dashboard/LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: { user } } = await getUser();
  const headerList = await headers();
  const fullPath = headerList.get('x-invoke-path') || '';
  const isAuthPage = fullPath.includes('/auth/');

  if (!isAuthPage && user) {
    // Strict Access Control: Check if user is an Artist or Admin
    const admin = getAdminClient();
    const [artistRes, adminRes] = await Promise.all([
      admin.from('artist_collaborations').select('id').eq('artist_id', user.id).limit(1),
      admin.from('admins').select('user_id').eq('user_id', user.id).limit(1)
    ]);

    const isAuthorized = (artistRes.data && artistRes.data.length > 0) || (adminRes.data && adminRes.data.length > 0);

    if (!isAuthorized) {
        redirect('/');
    }
  }

  const sidebarLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard }, 
    { name: 'My Collaborations', href: '/dashboard/my-packs', icon: Music },
    { name: 'Revenue & Payouts', href: '/dashboard/revenue', icon: TrendingUp },
    { name: 'Payout Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-black font-mono relative overflow-hidden">
        {/* Background Splatter Effect */}
        <div className="splatter-effect bg-studio-pink top-[-10%] left-[-10%] opacity-20" />
        <div className="splatter-effect bg-studio-neon bottom-[-10%] right-[-10%] opacity-20" />

      {/* Sidebar */}
      {!isAuthPage && (
        <aside className="w-64 border-r-4 border-black bg-studio-charcoal flex flex-col relative z-20 shadow-[4px_0_0_rgba(0,0,0,1)]">
          <div className="p-8 border-b-4 border-black">
            <Link href="/" className="block">
              <h1 className="text-2xl font-black italic uppercase leading-tight tracking-tighter">
                SAMPLES<br />
                <span className="text-studio-neon">WALA</span>
                <span className="block text-[8px] mt-1 text-white/40 tracking-[0.3em] font-black">ARTIST PORTAL</span>
              </h1>
            </Link>
          </div>

          <nav className="flex-grow p-4 space-y-4 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 p-4 border-2 border-black bg-black text-white hover:bg-studio-pink hover:text-black transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none italic font-black uppercase text-xs"
              >
                <link.icon size={18} />
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t-2 border-black">
            {user && (
              <>
                <div className="p-4 bg-white/5 border border-white/10 mb-4">
                  <p className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-1">Logged in as</p>
                  <p className="text-[10px] font-black truncate">{user.email}</p>
                </div>
                <LogoutButton />
              </>
            )}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden p-4 border-b-4 border-black bg-studio-charcoal flex items-center justify-between">
            <h1 className="text-lg font-black italic uppercase tracking-tighter">
                SAMPLES <span className="text-studio-neon">WALA</span>
            </h1>
            <button className="p-2 border-2 border-black bg-white text-black">
                <LayoutDashboard size={20} />
            </button>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-12 overflow-y-auto">
            {children}
        </div>
      </main>
    </div>
  );
}
