import React from 'react';
import Link from 'next/link';
import { 
  getLocations 
} from '@/app/actions';
import { Badge, Card, CardContent, Button } from '@/components/ui';
import { 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  Zap,
  Layout,
  ExternalLink,
  MessageSquare,
  Lock,
  Heart,
  MapPin
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MarketingHomepage() {
  const locations = await getLocations();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased relative overflow-hidden">
      {/* Dynamic background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-teal-500/10 to-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Header */}
      <header className="h-20 border-b border-slate-900 px-6 max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧬</span>
          <div>
            <h1 className="text-md font-bold tracking-tight text-white">ClinicHub</h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Franchise Operating System</p>
          </div>
        </div>

        <Link href="/admin">
          <Button size="sm" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200">
            Access HQ Portal <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 text-center max-w-4xl mx-auto px-6 relative z-10 space-y-6">
        <Badge variant="info" className="bg-teal-950/45 text-teal-400 border-teal-800/80 px-3 py-1 text-xs">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-teal-300 animate-pulse" /> Launch, Manage, and Optimize Medical locations
        </Badge>
        
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          The Digital Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Healthcare Franchises</span>
        </h2>
        
        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          ClinicHub helps dental groups, med spas, urgent care chains, and medical networks launch clinic websites, coordinate smart booking networks, and manage reputation compliance from one dashboard.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link href="/admin">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-500 shadow-xl shadow-teal-900/30 text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-300" /> Enter HQ Command Center
            </Button>
          </Link>
          <a href="#quick-demo">
            <Button size="lg" variant="outline" className="border-slate-800 hover:bg-slate-900">
              Explore Demo Twins
            </Button>
          </a>
        </div>

        {/* Small trust banner */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-xs text-slate-500 border-t border-slate-900 mt-12">
          <div className="flex items-center gap-2 justify-center">
            <ShieldCheck className="w-4 h-4 text-teal-500" /> HIPAA Compliant Architecture
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Globe className="w-4 h-4 text-indigo-500" /> Multi-Tenant Routing
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Zap className="w-4 h-4 text-amber-500" /> Real-Time Analytics
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Lock className="w-4 h-4 text-rose-500" /> Enterprise RBAC Ready
          </div>
        </div>
      </section>

      {/* Primary Value Pillars */}
      <section className="py-16 max-w-7xl mx-auto px-6 w-full relative z-10 space-y-12">
        <div className="text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">How It Works</p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white">Built for Clinical Scale</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <Card className="hover:border-slate-850 transition">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-900 text-teal-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">1. AI Franchise Launch Engine™</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add a new location (name, address, roster), choose layout templates, and click launch. AI automatically provisions public routes, maps scheduling paths, compiles local SEO schema, and builds landing pages.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-slate-850 transition">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-900 text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">2. AI Brand Guardian & Compliance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically monitors medical claims, pricing structures, and logo usage across location sites. Corporate HQ gets alerts if local listings contain unapproved hours or non-compliant service text.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-slate-850 transition">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-900 text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">3. Growth Intelligence & Analytics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aggregates patient booking rates, review sentiment, and search engine positions. The AI Advisor checks search volume and suggests local modifications to increase booking conversions.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Clinic Demo Twin Switchboard */}
      <section id="quick-demo" className="py-16 bg-slate-900/10 border-y border-slate-900 px-6 relative z-10 scroll-mt-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Interactive Prototype sandbox</p>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">Explore Launched Clinic Digital Twins</h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Each clinic is simulated with distinct templates, booking options, reviews, and styling controls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((loc) => (
              <Card key={loc.id} className="hover:border-slate-700 transition duration-150 flex flex-col justify-between h-56 bg-slate-950/60 border-slate-850">
                <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={
                        loc.templateType === 'DENTAL' ? 'info' :
                        loc.templateType === 'SPA' ? 'warning' :
                        loc.templateType === 'URGENT_CARE' ? 'error' : 'secondary'
                      } className="text-[9px]">
                        {loc.templateType}
                      </Badge>
                      <span className="text-[10px] text-teal-400 font-bold">{loc.growthScore}% Score</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-200 leading-tight truncate">{loc.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 shrink-0" /> {loc.city}, {loc.state}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-900">
                    <a href={`/sites/${loc.slug}`} target="_blank" rel="noreferrer" className="w-full">
                      <Button variant="outline" size="sm" className="w-full text-[10px] h-8 border-slate-800 hover:bg-slate-900 text-slate-350 flex items-center justify-center gap-1">
                        Open Public Website <ExternalLink className="w-3 h-3 text-slate-500" />
                      </Button>
                    </a>
                    
                    <Link href={`/clinic?id=${loc.id}`} className="w-full">
                      <Button variant="ghost" size="sm" className="w-full text-[10px] h-8 text-indigo-400 hover:text-indigo-300">
                        Open Clinic Manager Dashboard <ArrowRight className="w-3 h-3 ml-0.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900 text-center text-xs text-slate-500 max-w-7xl mx-auto w-full relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xl">🧬</span>
          <span className="font-extrabold text-white text-sm">ClinicHub</span>
        </div>
        <p className="mb-2">Enterprise Multi-location Health Growth Platform. HIPAA Compliant.</p>
        <p>© 2026 ClinicHub. Built for healthcare franchises globally.</p>
        <p className="mt-2 text-[10px] text-slate-600">
          <a href="https://www.medclinicx.com/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 hover:underline transition">
            Healthcare system by Med Clinic X
          </a>
        </p>
      </footer>
    </div>
  );
}
