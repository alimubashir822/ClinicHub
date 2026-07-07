import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocationBySlug, getOrganization } from '@/app/actions';
import { Badge, Card, CardContent } from '@/components/ui';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Check, 
  Sparkles, 
  Calendar, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  Heart,
  ChevronRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ClinicHomepage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  const org = await getOrganization();

  if (!location) {
    notFound();
  }

  const primaryColor = org?.primaryColor || '#0f766e';
  const secondaryColor = org?.secondaryColor || '#1e1b4b';
  const fontFamily = org?.fontFamily || 'Inter';
  const type = location.templateType;

  // Local SEO schema injection
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": type === 'DENTAL' ? "Dentist" : type === 'SPA' ? "BeautySalon" : "MedicalClinic",
    "name": location.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": location.address,
      "addressLocality": location.city,
      "addressRegion": location.state,
      "postalCode": location.zip,
      "addressCountry": "US"
    },
    "telephone": location.phone,
    "email": location.email,
    "openingHours": location.hours,
    "url": `https://carefranchise.com/sites/${slug}`
  };

  // Find homepage config
  const homePage = location.pages.find(p => p.slug === 'home');
  let pageContent: any = {};
  if (homePage) {
    try {
      pageContent = JSON.parse(homePage.content);
    } catch (_) {}
  }

  // Predefined custom homepage blocks defaults
  const defaultBlocks = [
    { id: 'hero', visible: true, title: pageContent.heroTitle || location.name, subtitle: pageContent.heroSubtitle },
    { id: 'services', visible: true, title: 'Our Clinical Services' },
    { id: 'providers', visible: true, title: 'Meet Our Specialists' },
    { id: 'reviews', visible: true, title: 'What Our Patients Say' },
    { id: 'about', visible: true, title: 'About Our Clinic' }
  ];

  const activeBlocks = pageContent.blocks 
    ? (typeof pageContent.blocks === 'string' ? JSON.parse(pageContent.blocks) : pageContent.blocks)
    : defaultBlocks;

  return (
    <div className="space-y-16 pb-20 animate-in fade-in duration-300" style={{ fontFamily }}>
      {/* Local Schema markup injection */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} 
      />

      {activeBlocks.map((block: any) => {
        if (!block.visible) return null;

        switch (block.id) {
          case 'hero':
            return (
              <section key="hero" className="relative py-20 md:py-28 overflow-hidden bg-slate-950">
                {/* Glow decor background */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute top-12 left-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: primaryColor }} />
                  <div className="absolute bottom-12 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl bg-indigo-500" />
                </div>

                <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <Badge variant="info" className="border-teal-800 text-teal-400 bg-teal-950/40">
                      {type === 'DENTAL' ? '💎 Advanced Restorative Practice' : 
                       type === 'SPA' ? '✨ Luxury Skin Sanctuary' : 
                       type === 'URGENT_CARE' ? '⚡ 24/7 Walk-in Clinical Support' : '🩺 Family Wellness Practice'}
                    </Badge>

                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                      {block.title || (type === 'DENTAL' ? 'Smile Confidently with Expert Care' : 
                       type === 'SPA' ? 'Unwind. Rejuvenate. Glow.' : 
                       type === 'URGENT_CARE' ? 'Fast, Professional Urgent Medical Care' : 'Your Partner in Lifelong Wellness')}
                    </h2>

                    <p className="text-base text-slate-350 leading-relaxed max-w-lg">
                      {block.subtitle || pageContent.aboutSection || `At ${location.name}, we combine state-of-the-art clinical technology with a comfortable, welcoming environment to deliver top-tier health services in ${location.city}.`}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <Link href={`/sites/${slug}/booking`}>
                        <button 
                          className="px-6 py-3 font-semibold text-white rounded-xl shadow-lg transition duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Schedule Appointment
                        </button>
                      </Link>
                      <a href="#services-section">
                        <button className="px-6 py-3 font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition">
                          Explore Services
                        </button>
                      </a>
                    </div>

                    {/* Quick trust metrics */}
                    <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-900">
                      <div>
                        <p className="text-lg font-bold text-white">4.9 ★</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Patient Rating</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white">{location.providers.length}+</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Specialists</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white">100%</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">HIPAA Secure</p>
                      </div>
                    </div>
                  </div>

                  {/* Hero Right Visuals */}
                  <div className="relative">
                    {type === 'URGENT_CARE' ? (
                      /* Urgent Care Wait-times box */
                      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 max-w-md mx-auto relative overflow-hidden">
                        <span className="absolute top-0 right-0 py-1 px-3 bg-rose-950 text-[10px] font-bold text-rose-400 border-l border-b border-rose-900 rounded-bl uppercase">
                          Live Clinic Status
                        </span>
                        
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Current walk-in wait</p>
                          <h3 className="text-4xl font-extrabold text-white flex items-baseline gap-1">
                            12 <span className="text-sm font-semibold text-slate-400">minutes</span>
                          </h3>
                        </div>

                        <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3">
                          <p className="text-xs font-semibold text-slate-200">🏥 Skip the Waiting Room</p>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Check-in online to secure your place in queue. Walk-ins are always welcomed, but online check-in reduces waiting.
                          </p>
                          <Link href={`/sites/${slug}/booking`}>
                            <button className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition active:scale-95 shadow-md shadow-rose-950/20">
                              Check-in Online Now
                            </button>
                          </Link>
                        </div>
                      </div>
                    ) : type === 'SPA' ? (
                      /* Aesthetic Med Spa treatments box */
                      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md mx-auto space-y-4">
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Premium Treatments</p>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-850 rounded-lg">
                            <span className="font-semibold text-slate-250">HydraFacial Deluxe</span>
                            <span className="text-indigo-400 font-bold">$199</span>
                          </div>
                          <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-850 rounded-lg">
                            <span className="font-semibold text-slate-250">Botox Cosmetic (per unit)</span>
                            <span className="text-indigo-400 font-bold">$12</span>
                          </div>
                          <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-850 rounded-lg">
                            <span className="font-semibold text-slate-250">Laser Skin Resurfacing</span>
                            <span className="text-indigo-400 font-bold">$299</span>
                          </div>
                        </div>
                        <div className="p-3 bg-indigo-950/25 border border-indigo-900/40 rounded-xl flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          <span className="text-[10px] text-indigo-300">Free medical consultations for first-time guests.</span>
                        </div>
                      </div>
                    ) : (
                      /* Default Clinical Visual Box */
                      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md mx-auto space-y-4 text-xs">
                        <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> HIPAA Compliant & Safe
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex items-start gap-2.5">
                            <span className="p-1 bg-slate-950 border border-slate-800 rounded text-teal-400 shrink-0">✓</span>
                            <p className="text-slate-350">State-of-the-art medical diagnostics & scans.</p>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="p-1 bg-slate-950 border border-slate-800 rounded text-teal-400 shrink-0">✓</span>
                            <p className="text-slate-350">Board-certified doctors with decades of shared research.</p>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="p-1 bg-slate-950 border border-slate-800 rounded text-teal-400 shrink-0">✓</span>
                            <p className="text-slate-350">Convenient online scheduling and digital insurance validation.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );

          case 'services':
            return (
              <section key="services" id="services-section" className="max-w-6xl mx-auto px-6 space-y-8 scroll-mt-24">
                <div className="text-center space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Treatments & Care</p>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white">{block.title || 'Our Clinical Services'}</h3>
                  <p className="text-xs text-slate-400 max-w-lg mx-auto">
                    Choose from our specialized treatments. Click service links to view local SEO pages and details.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {location.services.map(({ service }) => (
                    <Card key={service.id} className="hover:border-slate-700 transition duration-200">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-slate-950 border border-slate-800 text-[10px]">
                            {service.category}
                          </Badge>
                          <span className="text-sm font-extrabold" style={{ color: primaryColor }}>
                            ${service.price}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-200 hover:text-white transition">
                            {service.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-900 pt-3 text-[10px]">
                          <span className="text-slate-500">Duration: {service.duration} mins</span>
                          
                          <Link href={`/sites/${slug}/booking?service=${service.id}`} className="text-xs font-semibold flex items-center gap-0.5 hover:underline" style={{ color: primaryColor }}>
                            Book <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            );

          case 'providers':
            return (
              <section key="providers" id="providers-section" className="max-w-6xl mx-auto px-6 space-y-8 scroll-mt-24">
                <div className="text-center space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Medical staff</p>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white">{block.title || 'Meet Our Specialists'}</h3>
                  <p className="text-xs text-slate-400 max-w-lg mx-auto">
                    Experienced healthcare professionals dedicated to your safety, convenience, and results.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {location.providers.map((p) => (
                    <Card key={p.id} className="hover:border-slate-700 transition duration-200 bg-slate-900/20 backdrop-blur">
                      <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                        <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shrink-0 text-slate-400 font-bold uppercase shadow-inner">
                          {p.name.split(' ').pop()?.charAt(0) || 'D'}
                        </div>
                        <div className="space-y-2">
                          <div>
                            <Link href={`/sites/${slug}/providers/${p.id}`} className="hover:underline">
                              <h4 className="text-sm font-extrabold text-slate-200 group-hover:text-teal-400 transition">
                                {p.name}, {p.title}
                              </h4>
                            </Link>
                            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{p.specialty}</p>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {p.bio}
                          </p>
                          <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                            <Link href={`/sites/${slug}/providers/${p.id}`}>
                              <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-300 transition">
                                View Biography
                              </button>
                            </Link>
                            <Link href={`/sites/${slug}/booking?provider=${p.id}`}>
                              <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white transition">
                                Schedule Care
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            );

          case 'reviews':
            return (
              <section key="reviews" id="reviews-section" className="max-w-6xl mx-auto px-6 space-y-8">
                <div className="text-center space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Patient Voices</p>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white">{block.title || 'What Our Patients Say'}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {location.reviews.map((rev, idx) => (
                    <Card key={idx} className="bg-slate-900/10 border-slate-900/80">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="font-bold text-slate-350">{rev.patientName}</span>
                          <span>{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span 
                              key={i} 
                              className={`text-sm ${
                                i < rev.rating ? 'text-amber-400' : 'text-slate-800'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-400 italic leading-relaxed">
                          "{rev.content}"
                        </p>
                        {rev.replyContent && (
                          <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-lg mt-2">
                            <p className="text-[9px] font-bold text-slate-500">Response from staff:</p>
                            <p className="text-[10px] text-slate-300 leading-relaxed mt-0.5">{rev.replyContent}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            );

          case 'about':
            return (
              <section key="about" id="about-section" className="max-w-4xl mx-auto px-6 border-t border-slate-900 pt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-slate-400">
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-200 text-sm">About Our Clinic</h4>
                  <p className="leading-relaxed">
                    We are dedicated to providing the highest quality healthcare services. Our state-of-the-art facility is located at {location.address} in {location.city}, {location.state}.
                  </p>
                  <p className="leading-relaxed">
                    Our clinic represents a localized branch of our parent healthcare brand, combining enterprise clinical protocols with patient comfort.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-200 text-sm">Patient Security & Standards</h4>
                  <p className="leading-relaxed">
                    We maintain strict HIPAA guidelines. Patient records are encrypted and protected under national health standards.
                  </p>
                  <div className="pt-2 flex gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-slate-900 border border-slate-850 rounded-lg text-[9px] font-semibold text-slate-500">✓ HIPAA Certified</span>
                    <span className="px-2.5 py-1 bg-slate-900 border border-slate-850 rounded-lg text-[9px] font-semibold text-slate-500">✓ FDA Approved Materials</span>
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
