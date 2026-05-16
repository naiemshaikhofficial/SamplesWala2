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
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { LogoutButton } from '@/components/dashboard/LogoutButton';

import { getAdminClient } from "@/lib/supabase/admin";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: { user } } = await getUser();

  if (!user) {
    const loginUrl = process.env.NODE_ENV === 'production' 
      ? 'https://sampleswala.com/auth/login' 
      : '/auth/login';
    redirect(loginUrl);
  }

  // Strict Access Control: Check if user is an Artist or Admin
  const admin = getAdminClient();
  const [artistRes, adminRes] = await Promise.all([
    admin.from('artist_collaborations').select('id').eq('artist_id', user.id).limit(1),
    admin.from('admins').select('user_id').eq('user_id', user.id).limit(1)
  ]);

  const isAuthorized = (artistRes.data && artistRes.data.length > 0) || (adminRes.data && adminRes.data.length > 0);

  if (!isAuthorized) {
    // If not authorized, send back to main site
    redirect('/');
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
      <aside className="w-64 border-r-4 border-black bg-studio-charcoal hidden md:flex flex-col z-20">
        <div className="p-8 border-b-4 border-black">
          <Link href="/" className="group">
            <h1 className="text-2xl font-black italic uppercase leading-none tracking-tighter">
                SAMPLES<br />
                <span className="text-studio-neon group-hover:text-studio-pink transition-colors">WALA</span>
                <span className="block text-[10px] mt-1 text-white/40 tracking-[0.3em] font-black">ARTIST PORTAL</span>
            </h1>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 p-4 font-black uppercase text-xs border-2 border-transparent hover:border-black hover:bg-studio-neon hover:text-black transition-all group"
            >
              <link.icon size={18} className="group-hover:scale-110 transition-transform" />
              {link.name}
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t-4 border-black">
          <div className="p-4 bg-white/5 border border-white/10 mb-4">
            <p className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-1">Logged in as</p>
            <p className="text-[10px] font-black truncate">{user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>

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
