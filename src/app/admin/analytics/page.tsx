'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLocations } from '@/app/actions';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Badge,
  Button,
  Select
} from '@/components/ui';
import { 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  Compass, 
  Target, 
  ChevronRight,
  Info,
  RefreshCw,
  Search,
  Globe,
  MapPin,
  CheckCircle
} from 'lucide-react';

const STATE_MOCK_DEMO = {
  TX: {
    area: "North Austin / Round Rock",
    demand: "95% (Extreme)",
    searchTrend: "+45% increase in 'Emergency Dental' & 'Botox Spa' queries",
    demographics: "Median household income $118k. Population grew 14% since 2024.",
    competition: "Low-Medium (Only 3 specialized practitioners in 7 miles)",
    strategy: "Deploy a mixed Dental + Med Spa branch. Search demand for cosmetic dentistry matches local income indexes."
  },
  NY: {
    area: "Downtown Brooklyn / Greenpoint",
    demand: "89% (Very High)",
    searchTrend: "+38% increase in 'Skincare Aesthetic Treatments' & 'Physician Consult' queries",
    demographics: "Median age 31. Median income $95k. Tech-savvy population profile.",
    competition: "High (12 aesthetic clinics nearby. Focus on differentiator: 24/7 Smart booking widget)",
    strategy: "Deploy a high-end Med Spa website template under the Radiant Skin brand, optimizing for digital-first booking networks."
  },
  GA: {
    area: "North Atlanta / Alpharetta",
    demand: "86% (High)",
    searchTrend: "+28% increase in 'Wellness Screening' & 'Geriatric Checkups' queries",
    demographics: "Median age 44. Median household income $125k. Family-centric neighborhoods.",
    competition: "Low (No major primary care chains inside a 5-mile radius)",
    strategy: "Launch a Family Medicine & Primary Care center linked to the Midtown Medical brand to capture local family health plans."
  },
  IL: {
    area: "West Loop Chicago / River North",
    demand: "91% (Very High)",
    searchTrend: "+42% increase in 'Urgent Illness Walk-In Care' queries",
    demographics: "Median age 28. High density of commuters and young professionals.",
    competition: "Medium (4 clinic options, but wait times average 60+ minutes)",
    strategy: "Launch a walk-in Urgent Care center featuring the live Wait-Times card to capture commuter traffic."
  }
};

export default function AnalyticsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<'TX' | 'NY' | 'GA' | 'IL'>('TX');
  const [analyzing, setAnalyzing] = useState(false);
  const [showAnalysisResult, setShowAnalysisResult] = useState(false);
  
  async function loadLocations() {
    setLoading(true);
    const data = await getLocations();
    setLocations(data);
    setLoading(false);
  }

  useEffect(() => {
    loadLocations();
  }, []);

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setShowAnalysisResult(false);
    setTimeout(() => {
      setAnalyzing(false);
      setShowAnalysisResult(true);
    }, 1200); // simulated scanning
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-teal-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading growth analytics suite...</span>
      </div>
    );
  }

  // Calculate best/lowest performing clinics
  const performance = locations.map(loc => {
    const visits = loc.analytics.reduce((acc: number, cur: any) => acc + cur.visitors, 0);
    const bookings = loc.analytics.reduce((acc: number, cur: any) => acc + cur.bookings, 0);
    const rate = visits > 0 ? (bookings / visits) * 100 : 0;
    
    return {
      id: loc.id,
      name: loc.name,
      city: loc.city,
      visits,
      bookings,
      rate,
      score: loc.growthScore,
      seo: loc.seoScore,
      booking: loc.bookingScore,
      review: loc.reviewScore,
      content: loc.contentScore,
      patient: loc.patientScore
    };
  });

  const bestClinic = [...performance].sort((a, b) => b.rate - a.rate)[0];
  const lowestClinic = [...performance].sort((a, b) => a.rate - b.rate)[0];

  const targetData = STATE_MOCK_DEMO[selectedState];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-teal-400" /> Franchise Growth & Location Expansion
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Perform comparative analysis across clinics using sub-health scores and deploy automated growth optimizations proposed by the AI Growth Advisor.
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-emerald-900/30 bg-gradient-to-r from-slate-900/40 to-emerald-950/5">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="p-3 bg-emerald-950/55 border border-emerald-900/50 rounded-xl text-emerald-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Top Network Performer</p>
              <h4 className="text-md font-bold text-slate-200 mt-1">
                {bestClinic?.name || 'Austin Dental Care'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Boasts a network-highest booking conversion rate of <span className="text-emerald-400 font-semibold">{bestClinic?.rate.toFixed(1) || '14.5'}%</span>. Strong call-to-actions and local SEO faq structures drive patient decisions.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-900/30 bg-gradient-to-r from-slate-900/40 to-indigo-950/5">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="p-3 bg-indigo-950/55 border border-indigo-900/50 rounded-xl text-indigo-400">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Growth Focus Area</p>
              <h4 className="text-md font-bold text-slate-200 mt-1">
                {lowestClinic?.name || 'Midtown Medical Group'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Currently tracking at a conversion rate of <span className="text-indigo-400 font-semibold">{lowestClinic?.rate.toFixed(1) || '4.2'}%</span>. High bounce rates on the provider page indicate missing scheduling indicators.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics & Health Scores Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>AI Franchise Health Score™ Breakdown</CardTitle>
          <CardDescription>Detailed sub-metrics monitoring SEO, bookings conversion, review sentiment, and page qualities.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-900">
                  <th className="px-6 py-4">Clinic Location</th>
                  <th className="px-6 py-4 text-center">SEO Rank (20)</th>
                  <th className="px-6 py-4 text-center">Booking Conv (20)</th>
                  <th className="px-6 py-4 text-center">Reviews (20)</th>
                  <th className="px-6 py-4 text-center">Content Quality (20)</th>
                  <th className="px-6 py-4 text-center">Patient Growth (20)</th>
                  <th className="px-6 py-4 text-right">Aggregate Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs text-slate-400">
                {performance.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/10 transition">
                    <td className="px-6 py-4 font-bold text-slate-200">{c.name}</td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-slate-350">{c.seo}%</span>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-slate-350">{c.booking}%</span>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-slate-350">{c.review}%</span>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-slate-350">{c.content}%</span>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-slate-350">{c.patient}%</span>
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-teal-400">
                      {c.score}% Health
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Location Expansion Advisor & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Expansion Input config */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5">
                <Globe className="w-5 h-5 text-teal-400" />
                Territory Expansion Engine
              </CardTitle>
              <CardDescription>Run AI analysis on target expansion territories using real-time search volume gaps.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <Select 
                label="Target Search Region (State)"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value as any)}
                options={[
                  { value: 'TX', label: 'Texas (Austin/Houston)' },
                  { value: 'NY', label: 'New York (Brooklyn/NYC)' },
                  { value: 'GA', label: 'Georgia (Atlanta/Suburbs)' },
                  { value: 'IL', label: 'Illinois (Chicago/Loop)' }
                ]}
              />

              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2 text-[11px] text-slate-450 leading-relaxed">
                <p className="font-bold text-slate-300">📈 Active Scanners Config:</p>
                <p>✓ Demographics Population analysis (growth path)</p>
                <p>✓ Google Search Console regional keyword density</p>
                <p>✓ Direct competitor proximity mappings (within 10mi)</p>
              </div>

              <Button 
                onClick={handleRunAnalysis} 
                disabled={analyzing} 
                className="w-full bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-1.5" /> Scanning demographics...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-1.5" /> Run Expansion Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Expansion Output Screen */}
        <div className="lg:col-span-2">
          <Card className="h-full bg-slate-900/20 relative overflow-hidden min-h-[300px]">
            {analyzing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-20 space-y-4">
                <RefreshCw className="w-10 h-10 text-teal-400 animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-200">Evaluating Patient Demand Gaps...</p>
                  <p className="text-xs text-slate-500 mt-1">Cross-referencing medical listings in {selectedState}.</p>
                </div>
              </div>
            ) : null}

            {!showAnalysisResult && !analyzing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-500 z-10 space-y-3">
                <Compass className="w-12 h-12 text-slate-700 animate-pulse" />
                <div>
                  <p className="text-sm font-semibold">No active scan selected.</p>
                  <p className="text-xs text-slate-600 max-w-sm mt-1">Select a state on the left and run analysis to scan for local healthcare expansion opportunities.</p>
                </div>
              </div>
            ) : null}

            {showAnalysisResult && !analyzing && (
              <div className="p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                  <div>
                    <Badge variant="info" className="mb-1 text-[9px]">Expansion recommendation</Badge>
                    <h3 className="text-lg font-extrabold text-white flex items-center gap-1.5">
                      <MapPin className="w-5 h-5 text-indigo-400" /> {targetData.area}
                    </h3>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Demand Rating</p>
                    <p className="text-sm font-extrabold text-emerald-400">{targetData.demand}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Search queries trend</p>
                      <p className="text-slate-250 leading-relaxed font-semibold">{targetData.searchTrend}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Regional Demographics</p>
                      <p className="text-slate-250 leading-relaxed">{targetData.demographics}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Competitor Density rating</p>
                      <p className="text-slate-250 leading-relaxed">{targetData.competition}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Proposed Launch Strategy</p>
                      <p className="text-indigo-300 leading-relaxed">{targetData.strategy}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Demographics evaluation completed.
                  </span>
                  
                  <Link href={`/admin/locations?wizard=open&state=${selectedState}`}>
                    <Button className="flex items-center gap-1 text-xs">
                      Provision Clinic Workspace <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
