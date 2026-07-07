'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Star, 
  TrendingUp, 
  Palette, 
  HelpCircle,
  Activity,
  Bell,
  Sparkles,
  Zap,
  Search,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active: boolean;
}

const SidebarItem = ({ href, icon, label, badge, active }: SidebarItemProps) => {
  return (
    <Link 
      href={href}
      className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
        active 
          ? 'bg-teal-950/65 text-teal-400 border-l-4 border-teal-500 shadow-inner' 
          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`transition-colors duration-200 ${active ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {badge && (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
          active 
            ? 'bg-teal-900/50 text-teal-300' 
            : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
        }`}>
          {badge}
        </span>
      )}
    </Link>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { href: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Command Center' },
    { href: '/admin/locations', icon: <MapPin className="w-5 h-5" />, label: 'Launch & Locations', badge: 'Active' },
    { href: '/admin/booking', icon: <Activity className="w-5 h-5" />, label: 'Booking Network' },
    { href: '/admin/crm', icon: <Users className="w-5 h-5" />, label: 'Patient CRM' },
    { href: '/admin/reviews', icon: <Star className="w-5 h-5" />, label: 'Reviews Reputation' },
    { href: '/admin/seo', icon: <Search className="w-5 h-5" />, label: 'SEO Command Center' },
    { href: '/admin/analytics', icon: <TrendingUp className="w-5 h-5" />, label: 'Growth Analytics' },
    { href: '/admin/brand', icon: <Palette className="w-5 h-5" />, label: 'Brand Control' },
    { href: '/admin/advisor', icon: <Sparkles className="w-5 h-5" />, label: 'AI CEO Advisor', badge: 'New' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased relative">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-900 bg-slate-950 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧬</span>
          <div>
            <h1 className="text-xs font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
              ClinicHub
            </h1>
            <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">
              HQ Dashboard
            </p>
          </div>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-slate-900 border border-slate-800 rounded-lg transition"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 p-4 border-r border-slate-900 bg-slate-950 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 md:static md:h-screen md:sticky md:top-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Logo Header (Desktop) */}
          <div className="hidden md:flex items-center gap-2 px-4 py-4 mb-6 border-b border-slate-900">
            <span className="text-2xl">🧬</span>
            <div>
              <h1 className="text-md font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
                ClinicHub
              </h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                Franchise Growth Engine
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-2">
              Main Dashboard
            </p>
            <div className="space-y-1.5">
              {menuItems.map((item) => (
                <div key={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <SidebarItem 
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                    active={pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))}
                  />
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Sidebar Footer info */}
        <div className="mt-8 border-t border-slate-900 pt-4 px-4">
          <div className="flex items-center gap-3 p-2 bg-slate-900/40 border border-slate-800/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center font-bold text-xs">
              HQ
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300">CareGroup HQ</p>
              <p className="text-[10px] text-teal-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
                Enterprise
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
            <span>v1.2.0 (Active)</span>
            <Link href="/" className="hover:text-teal-400 transition font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Live Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay Backdrop (Mobile Only) */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Sub Header Status */}
        <header className="h-14 bg-slate-950/40 backdrop-blur-md border-b border-slate-900 flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
            <span className="text-[10px] md:text-xs font-semibold text-slate-400 tracking-wide">
              SYSTEM STATUS: 100% OPERATIONAL
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick stats indicator */}
            <div className="hidden lg:flex items-center gap-4 text-xs border-r border-slate-900 pr-4">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Total Revenue</p>
                <p className="font-semibold text-slate-200">$485,250 <span className="text-emerald-500 font-bold">+18%</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Growth Rating</p>
                <p className="font-semibold text-teal-400 flex items-center gap-1 justify-end font-bold">
                  91% <Sparkles className="w-3 h-3 text-teal-400" />
                </p>
              </div>
            </div>

            {/* Notification button */}
            <button className="relative p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition">
              <Bell className="w-4 h-4 text-slate-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full" />
            </button>

            {/* Quick Access to Launch Wizard */}
            <Link href="/admin/locations?wizard=open">
              <Button size="sm" className="hidden sm:flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Launch Wizard
              </Button>
            </Link>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
