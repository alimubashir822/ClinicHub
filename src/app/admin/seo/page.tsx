import React from 'react';
import { getLocations } from '@/app/actions';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Badge,
  Button
} from '@/components/ui';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  ExternalLink, 
  FileText, 
  Cpu, 
  Globe, 
  Zap, 
  Compass, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SEODashboard() {
  const locations = await getLocations();

  // Compilation helper for local SEO schema
  const seoItems = locations.map(loc => {
    const slug = loc.slug;
    const type = loc.templateType;
    const schemaCode = `{
  "@context": "https://schema.org",
  "@type": "${type === 'DENTAL' ? 'Dentist' : type === 'SPA' ? 'BeautySalon' : 'MedicalClinic'}",
  "name": "${loc.name}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "${loc.address}",
    "addressLocality": "${loc.city}",
    "addressRegion": "${loc.state}",
    "postalCode": "${loc.zip}"
  },
  "telephone": "${loc.phone}",
  "url": "https://carefranchise.com/sites/${slug}"
}`;

    // Mock keyword gaps
    const keywords = type === 'DENTAL' 
      ? [`best dentist in ${loc.city}`, `emergency dental ${loc.city}`, `teeth whitening cost ${loc.city}`]
      : type === 'SPA'
      ? [`botox injections ${loc.city}`, `hydrafacial treatment ${loc.city}`, `med spa ${loc.city} deals`]
      : type === 'URGENT_CARE'
      ? [`walk-in clinic ${loc.city}`, `urgent care near ${loc.city}`, `24/7 doctor ${loc.city}`]
      : [`family doctor ${loc.city}`, `primary physician ${loc.city}`, `annual physical ${loc.city}`];

    return {
      id: loc.id,
      name: loc.name,
      city: loc.city,
      slug,
      score: loc.seoScore || 85,
      speed: Math.floor(Math.random() * 8) + 91, // Simulated 91-99 speed score
      schema: schemaCode,
      keywords
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Search className="w-6 h-6 text-teal-400" /> Healthcare SEO Command Center
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Monitor technical Google search positions, check JSON-LD schemas, verify local indexing sitemaps, and capture high-intent medical keyword traffic.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Search Impressions</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">125.4K</h3>
              <p className="text-[10px] text-emerald-400 mt-1 font-bold">+18.5% MoM</p>
            </div>
            <div className="p-3 bg-teal-950/40 border border-teal-900/50 rounded-xl text-teal-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average CTR</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">4.8%</h3>
              <p className="text-[10px] text-slate-500 mt-1">Industry avg: 3.2%</p>
            </div>
            <div className="p-3 bg-indigo-950/40 border border-indigo-900/50 rounded-xl text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average Site Speed</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">94 / 100</h3>
              <p className="text-[10px] text-teal-400 mt-1 font-bold">Fast load rating</p>
            </div>
            <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Indexed Pages</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{seoItems.length * 5} live</h3>
              <p className="text-[10px] text-emerald-400 mt-1 font-bold">Sitemaps status: Active</p>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
              <Globe className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic SEO List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Local Clinic SEO & Speed Matrix</CardTitle>
          <CardDescription>Review PageSpeed mobile performance and technical search rankings for each digital twin.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-900/50 text-[10px] text-slate-500 font-bold uppercase border-b border-slate-900">
                  <th className="px-6 py-4">Clinic name</th>
                  <th className="px-6 py-4">SEO health Score</th>
                  <th className="px-6 py-4">PageSpeed index</th>
                  <th className="px-6 py-4">XML Sitemap Link</th>
                  <th className="px-6 py-4">Schema Integrity</th>
                  <th className="px-6 py-4 text-right">Quick actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs text-slate-400">
                {seoItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/10 transition">
                    <td className="px-6 py-4 font-bold text-slate-200">
                      <div>
                        <p>{item.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-0.5 font-medium">
                          <MapPin className="w-3 h-3" /> {item.city} sub-index
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div className="bg-teal-500 h-full rounded-full" style={{ width: `${item.score}%` }} />
                        </div>
                        <span className="font-bold text-teal-400">{item.score}% score</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-emerald-400">{item.speed} / 100</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-550 select-all">
                      /sitemaps/{item.slug}.xml
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success" className="bg-teal-950/40 text-teal-400 border-teal-900/50">
                        Valid Schema
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a href={`/sites/${item.slug}`} target="_blank">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400 hover:text-white">
                          Test Index <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* SEO Assistants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Keyword Gaps & Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-1 text-teal-400">
                <Sparkles className="w-4.5 h-4.5" />
                AI SEO Keyword & Page Advisor
              </CardTitle>
              <CardDescription>Search term suggestion crawler proposing localized content opportunities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seoItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="font-bold text-slate-200 text-xs truncate max-w-[150px]">{item.name}</span>
                      <Badge variant="secondary" className="text-[8px]">{item.city}</Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Top Keyword Opportunities</p>
                      <div className="space-y-1.5 text-xs text-slate-350">
                        {item.keywords.map((kw, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-900/30 p-2 rounded-lg border border-slate-900">
                            <span className="font-mono text-[10px] text-slate-300">{kw}</span>
                            <span className="text-[10px] text-indigo-400 font-semibold font-mono">
                              {Math.floor(Math.random() * 2000) + 800} vol/mo
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schema Code inspect box */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-1 text-indigo-400">
                <FileText className="w-4.5 h-4.5" />
                Local Business JSON-LD
              </CardTitle>
              <CardDescription>Inspect structured metadata snippet generated for Google Crawlers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <p className="text-xs text-slate-400 leading-normal">
                Structured schema markup communicates operational details directly to search engines.
              </p>
              
              <div className="relative">
                <pre className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl text-[9px] font-mono text-slate-400 overflow-x-auto max-h-64 scrollbar-thin select-all">
                  {seoItems[0]?.schema || "Loading schema context..."}
                </pre>
              </div>

              <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl text-[10px] text-indigo-300 leading-snug flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
                <span>Schema markup is provisioned dynamically upon wizard location launches.</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
