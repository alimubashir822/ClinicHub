import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrganization, getLocationBySlug } from '@/app/actions';
import ChatWidget from '@/components/sites/chat-widget';
import { MapPin, Phone, Mail, Clock, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const org = await getOrganization();
  const location = await getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const primaryColor = org?.primaryColor || '#0f766e';
  const secondaryColor = org?.secondaryColor || '#1e1b4b';
  const fontFamily = org?.fontFamily || 'Inter';

  // Template branding adjustments
  const siteBrandStyle = {
    '--primary': primaryColor,
    '--secondary': secondaryColor,
    fontFamily: fontFamily,
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-teal-500 selection:text-white"
      style={siteBrandStyle}
    >
      {/* Dynamic Theme Injector style block to power tailwind classes mapping */}
      <style dangerouslySetInnerHTML={{ __html: `
        .text-brand-primary { color: ${primaryColor}; }
        .bg-brand-primary { background-color: ${primaryColor}; }
        .border-brand-primary { border-color: ${primaryColor}; }
        .hover\\:bg-brand-primary-hover:hover { background-color: ${primaryColor}dd; }
        .bg-brand-secondary { background-color: ${secondaryColor}; }
        .border-brand-secondary { border-color: ${secondaryColor}; }
        .text-brand-secondary { color: ${secondaryColor}; }
      `}} />

      {/* Public Header */}
      <header className="h-20 bg-slate-950/60 backdrop-blur-md border-b border-slate-900 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        <Link href={`/sites/${slug}`} className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:scale-110 transition duration-200">{org?.logoUrl || '🧬'}</span>
          <div>
            <h1 className="font-extrabold text-slate-100 text-xs sm:text-base leading-none group-hover:text-teal-400 transition truncate max-w-[140px] sm:max-w-none">
              {location.name}
            </h1>
            <p className="text-[8px] sm:text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
              Part of {org?.name || 'CareGroup Health'}
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href={`/sites/${slug}`} className="hover:text-white transition">Home</Link>
          <a href="#services-section" className="hover:text-white transition">Services</a>
          <a href="#providers-section" className="hover:text-white transition">Providers</a>
          <a href="#about-section" className="hover:text-white transition">About Us</a>
        </nav>

        <div>
          <Link href={`/sites/${slug}/booking`}>
            <button 
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold uppercase rounded-lg shadow-lg text-white transition hover:brightness-110 flex items-center gap-1.5 shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <Calendar className="w-3.5 h-3.5" /> Book Online
            </button>
          </Link>
        </div>
      </header>

      {/* Main Public Microsite content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Public Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-extrabold text-slate-200 flex items-center gap-2">
              <span>{org?.logoUrl || '🧬'}</span> {location.name}
            </h4>
            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
              Delivering professional, high-standard patient care. Our network coordinates shared clinical knowledge to support local health.
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <h5 className="font-bold text-slate-350 uppercase tracking-wider text-[10px]">Clinic Details</h5>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-650 mt-0.5 shrink-0" />
              <span>{location.address}<br />{location.city}, {location.state} {location.zip}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-650 shrink-0" />
              <span>{location.phone}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-650 shrink-0" />
              <span>{location.email}</span>
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <h5 className="font-bold text-slate-350 uppercase tracking-wider text-[10px]">Hours of Operation</h5>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-650 shrink-0" />
              <span>{location.hours}</span>
            </p>
            <p className="text-[10px] text-slate-500 italic mt-4">
              Authorized partner clinic under local regulatory guidelines.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-600 gap-4">
          <div>
            <p>© 2026 {location.name}. All Rights Reserved. Patient data protected.</p>
            <p className="mt-1">
              <a href="https://www.medclinicx.com/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 hover:underline transition">
                Healthcare system by Med Clinic X
              </a>
            </p>
          </div>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
            <Link href="/admin" className="hover:underline">Admin Command</Link>
          </div>
        </div>
      </footer>

      {/* Floating AI Patient Assistant Chat widget */}
      <ChatWidget 
        clinicName={location.name}
        clinicPhone={location.phone}
        clinicEmail={location.email}
        hours={location.hours}
        services={location.services.map(s => s.service.name)}
        providers={location.providers.map(p => `${p.name} (${p.title}) - ${p.specialty}`)}
        locationId={location.id}
      />
    </div>
  );
}
