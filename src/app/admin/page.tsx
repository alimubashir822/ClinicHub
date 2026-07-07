import React from 'react';
import Link from 'next/link';
import { 
  getLocations, 
  getOrganization, 
  getAppointments, 
  getLeads,
  getRegions
} from '@/app/actions';
import RegionsClient from './regions-client';
import { 
  Badge, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button
} from '@/components/ui';
import { 
  MapPin, 
  Users, 
  Calendar, 
  ShieldAlert, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  Layers,
  ArrowRight,
  ThumbsUp,
  AlertTriangle,
  Globe,
  Stethoscope
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const org = await getOrganization();
  const locations = await getLocations();
  const appointments = await getAppointments();
  const leads = await getLeads();
  const regions = await getRegions();

  // Aggregate stats
  const totalLocations = locations.length;
  const avgGrowthScore = totalLocations > 0 
    ? Math.round(locations.reduce((acc, curr) => acc + curr.growthScore, 0) / totalLocations) 
    : 80;

  // Aggregate visitor, lead, booking counts from analytics
  let totalVisitors = 0;
  let totalAnalyticsBookings = 0;
  let totalAnalyticsLeads = 0;

  locations.forEach(loc => {
    loc.analytics.forEach(an => {
      totalVisitors += an.visitors;
      totalAnalyticsBookings += an.bookings;
      totalAnalyticsLeads += an.leads;
    });
  });

  const conversionRate = totalVisitors > 0 
    ? ((totalAnalyticsBookings / totalVisitors) * 100).toFixed(1) 
    : '0.0';

  // Compliance checks / Brand Guardian Alerts
  const brandGuardianAlerts = [
    { 
      id: 1, 
      clinic: "Midtown Medical Group", 
      type: "COMPLIANCE", 
      message: "FDA disclaimer missing from new 'Preventive Wellness' service page.", 
      severity: "high" 
    },
    { 
      id: 2, 
      clinic: "Radiant Skin Med Spa", 
      type: "BRANDING", 
      message: "Using unapproved font styling 'Comic Sans' on local custom FAQ module.", 
      severity: "medium" 
    },
    { 
      id: 3, 
      clinic: "Metro Health Urgent Care", 
      type: "CONTENT", 
      message: "Outdated doctor credentials listed for NP Lucas Milligan.", 
      severity: "low" 
    }
  ];

  // Group locations by region
  const regionalGroups = regions.map(reg => {
    const regLocations = locations.filter(loc => loc.regionId === reg.id);
    const count = regLocations.length;
    
    let regVisits = 0;
    let regBookings = 0;
    let regScoreSum = 0;

    regLocations.forEach(l => {
      regScoreSum += l.growthScore;
      l.analytics.forEach(an => {
        regVisits += an.visitors;
        regBookings += an.bookings;
      });
    });

    const avgScore = count > 0 ? Math.round(regScoreSum / count) : 0;
    const rate = regVisits > 0 ? ((regBookings / regVisits) * 100).toFixed(1) : '0.0';

    return {
      id: reg.id,
      name: reg.name,
      locations: regLocations,
      count,
      avgScore,
      visits: regVisits,
      bookings: regBookings,
      rate
    };
  });

  // Locations not assigned to any region
  const unassignedLocations = locations.filter(loc => !loc.regionId);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-teal-950/40 via-slate-900/60 to-indigo-950/40 border border-slate-800/80 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="info" className="mb-2">Corporate HQ Control</Badge>
            <span className="text-xs text-indigo-400 font-semibold mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> CareFranchise OS v1.2
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            Welcome back, {org?.name || 'CareGroup Health'} Command
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            You are managing <span className="text-teal-400 font-semibold">{totalLocations} active healthcare locations</span> across <span className="text-indigo-400 font-semibold">{regions.length} regions</span>. Brand guidelines and compliance sync are fully active.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/brand">
            <Button variant="outline" className="flex items-center gap-1">
              Configure Branding
            </Button>
          </Link>
          <Link href="/admin/locations?wizard=open">
            <Button className="flex items-center gap-1.5 shadow-lg shadow-teal-500/20">
              <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
              Launch New Location
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:border-slate-700 transition">
          <CardContent className="p-5 flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Locations Launched</span>
              <Layers className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-100">{totalLocations}</h3>
              <p className="text-[10px] text-teal-400 mt-1 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping" />
                All online & active
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-700 transition">
          <CardContent className="p-5 flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Unified Pageviews</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-100">{totalVisitors}</h3>
              <p className="text-[10px] text-emerald-400 mt-1 font-bold">+12.4% vs last week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-700 transition">
          <CardContent className="p-5 flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">CRM Patient Leads</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-100">{leads.length}</h3>
              <p className="text-[10px] text-amber-400 mt-1 font-bold">{leads.filter(l => l.status === 'LEAD').length} pending inquiries</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-700 transition">
          <CardContent className="p-5 flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Network Booking Rate</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-100">{conversionRate}%</h3>
              <p className="text-[10px] text-emerald-400 mt-1 font-bold">+0.8% optimization score</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-700 transition">
          <CardContent className="p-5 flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Average Growth Score</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-100">{avgGrowthScore}%</h3>
              <p className="text-[10px] text-slate-400 mt-1">Based on local rankings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Region Accordions, Comparisons, and Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Regional Accordions & Location Lists */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400" /> Regional Operations Map
              </h3>
              <span className="text-xs text-slate-500 font-medium">{regions.length} Active Territories</span>
            </div>

            {regionalGroups.map(reg => (
              <Card key={reg.id} className="border-slate-850 hover:border-slate-800 transition overflow-hidden">
                <div className="p-5 bg-slate-900/30 border-b border-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{reg.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{reg.count} Clinic Locations online</p>
                  </div>
                  
                  {reg.count > 0 ? (
                    <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
                      <div>
                        <span className="text-slate-550">Score:</span> <span className="font-bold text-emerald-400">{reg.avgScore}%</span>
                      </div>
                      <div>
                        <span className="text-slate-550">Traffic:</span> <span className="font-bold text-slate-300">{reg.visits}</span>
                      </div>
                      <div>
                        <span className="text-slate-550">Conversion:</span> <span className="font-bold text-teal-400">{reg.rate}%</span>
                      </div>
                    </div>
                  ) : (
                    <Badge variant="neutral">Empty Region</Badge>
                  )}
                </div>

                {reg.count > 0 && (
                  <CardContent className="p-0">
                    <div className="overflow-x-auto w-full scrollbar-none">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <tbody className="divide-y divide-slate-900 text-xs text-slate-400">
                          {reg.locations.map(loc => (
                            <tr key={loc.id} className="hover:bg-slate-950/40 transition group">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-bold text-slate-200 group-hover:text-white transition text-sm">
                                    {loc.name}
                                  </p>
                                  <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3 text-slate-650" /> {loc.city}, {loc.state}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant={
                                  loc.templateType === 'DENTAL' ? 'info' :
                                  loc.templateType === 'SPA' ? 'warning' :
                                  loc.templateType === 'URGENT_CARE' ? 'error' : 'secondary'
                                } className="text-[9px]">
                                  {loc.templateType}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-teal-400">{loc.growthScore}% Growth</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Link href={`/sites/${loc.slug}`} target="_blank">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-500 hover:text-white">
                                      Visit
                                    </Button>
                                  </Link>
                                  <Link href={`/clinic?id=${loc.id}`}>
                                    <Button variant="outline" size="sm" className="h-8 px-2 text-teal-400 border-slate-800">
                                      Manage
                                    </Button>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}

            {/* Unassigned locations */}
            {unassignedLocations.length > 0 && (
              <Card className="border-dashed border-slate-800 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Unassigned Locations</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto w-full scrollbar-none">
                    <table className="w-full text-left min-w-[500px]">
                      <tbody className="divide-y divide-slate-900 text-xs text-slate-400">
                        {unassignedLocations.map(loc => (
                          <tr key={loc.id} className="hover:bg-slate-900/10">
                            <td className="px-6 py-3 font-bold text-slate-200">{loc.name}</td>
                            <td className="px-6 py-3">{loc.city}, {loc.state}</td>
                            <td className="px-6 py-3 text-right">
                              <Link href={`/clinic?id=${loc.id}`}>
                                <Button variant="outline" size="sm" className="h-7 px-2 border-slate-800 text-slate-300">Assign Region</Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Smart Booking Network & Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Recent Booking Activity
                </CardTitle>
                <CardDescription>Appointments booked across the location network.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointments.slice(0, 4).map((appt) => (
                  <div key={appt.id} className="flex items-start justify-between p-3 bg-slate-950 border border-slate-900 rounded-lg hover:border-slate-800 transition">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{appt.patientName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{appt.service.name} • {appt.location.name}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{appt.appointmentDate} at {appt.appointmentTime}</p>
                    </div>
                    <Badge variant={appt.status === 'CONFIRMED' ? 'success' : 'warning'}>
                      {appt.status}
                    </Badge>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <p className="text-xs text-center py-6 text-slate-500">No recent appointments.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5">
                  <Users className="w-5 h-5 text-indigo-400" />
                  CRM Leads Funnel
                </CardTitle>
                <CardDescription>Pipeline conversions for customer acquisition.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Funnel Stage</span>
                    <span>Count</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold">
                        <span className="text-slate-300">1. Website Visitors</span>
                        <span className="text-slate-200">{totalVisitors}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-teal-600 h-full rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold">
                        <span className="text-slate-300">2. Active Inquiries (Leads)</span>
                        <span className="text-slate-200">{leads.filter(l => l.status === 'LEAD' || l.status === 'VISITOR').length}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-full rounded-full" style={{ width: '45%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold">
                        <span className="text-slate-300">3. Scheduled Appointments</span>
                        <span className="text-slate-200">{leads.filter(l => l.status === 'APPOINTMENT').length + appointments.length}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: '25%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold">
                        <span className="text-slate-300">4. Converted Patients</span>
                        <span className="text-slate-200">{leads.filter(l => l.status === 'PATIENT').length}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: '15%' }} />
                      </div>
                    </div>
                  </div>

                  <Link href="/admin/crm" className="mt-2 text-center">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-indigo-400 hover:text-indigo-300">
                      Open Patient CRM Pipeline <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Brand Guardian & Compliance Sidebar */}
        <div className="space-y-6">
          
          {/* Access CEO Advisor Shortcut */}
          <Card className="bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-teal-950/40 border border-indigo-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-200 flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                AI CEO Advisor Portal
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Ask dynamic strategic inquiries using live region statistics.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Link href="/admin/advisor">
                <Button size="sm" className="w-full text-xs bg-indigo-650 hover:bg-indigo-500 shadow-md flex items-center justify-center gap-1.5 text-white font-bold">
                  Open Chat Console <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-rose-900/30 bg-gradient-to-b from-slate-900/60 to-rose-950/10">
            <CardHeader className="pb-3 border-b border-rose-950/20">
              <CardTitle className="flex items-center gap-1.5 text-rose-400">
                <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                AI Brand Guardian™
              </CardTitle>
              <CardDescription className="text-rose-300/60">
                Central brand alignment checks, styling monitors, and compliance regulatory audits.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {brandGuardianAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 border rounded-xl flex items-start gap-3 transition hover:scale-[1.01] ${
                    alert.severity === 'high' 
                      ? 'border-rose-800 bg-rose-950/25 text-rose-300' 
                      : alert.severity === 'medium'
                      ? 'border-amber-800 bg-amber-950/25 text-amber-300'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                    alert.severity === 'high' ? 'text-rose-400' : 'text-amber-400'
                  }`} />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold">{alert.clinic}</span>
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1 bg-slate-950/65 rounded border border-white/10">
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-[11px] mt-1 text-slate-300">{alert.message}</p>
                    <div className="mt-2 flex gap-2">
                      <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[10px] bg-slate-950 hover:bg-slate-900 text-slate-300">
                        Fix Auto
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[10px] text-slate-400">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Growth Intelligence */}
          <Card className="border-indigo-900/30 bg-gradient-to-b from-slate-900/60 to-indigo-950/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-indigo-400">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                AI Growth Intelligence
              </CardTitle>
              <CardDescription>Dynamic conversion suggestions based on user actions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2 text-xs">
                <p className="font-semibold text-slate-200">🔍 Search Demand Insight</p>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Search query volume for <span className="text-indigo-400 font-semibold">"Emergency Dentist"</span> is up 35% in Houston, TX. Recommend launching a clinic in that sector to capture search share.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2 text-xs">
                <p className="font-semibold text-slate-200">📈 Conversion recommendation</p>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Austin Dental Care has high traffic on their "Dental Implants" page, but booking rate is only 4%. AI recommends embedding the <span className="text-teal-400 font-semibold">"Insurance coverage helper"</span> module directly above the call-to-action button.
                </p>
                <Button size="sm" variant="outline" className="w-full text-[10px] h-7 border-slate-800">
                  Deploy Optimization Widget
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Regions Settings & Permission hierarchy controls */}
      <RegionsClient initialRegions={regions} />
    </div>
  );
}
