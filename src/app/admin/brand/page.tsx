'use client';

import React, { useState, useEffect } from 'react';
import { 
  getOrganization, 
  updateOrganization, 
  runBrandComplianceScan, 
  resolveComplianceAlert,
  type ComplianceAlert 
} from '@/app/actions';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Input,
  Select,
  Button,
  Badge
} from '@/components/ui';
import { 
  Palette, 
  Sparkles, 
  Layout, 
  Save, 
  RefreshCw,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Play,
  Check,
  Activity
} from 'lucide-react';

const PRESETS = [
  {
    name: 'Teal Clinical (Default)',
    primary: '#0f766e',
    secondary: '#1e1b4b',
    fontFamily: 'Inter',
  },
  {
    name: 'Luxury Violet (Med Spa)',
    primary: '#6d28d9',
    secondary: '#0f172a',
    fontFamily: 'Outfit',
  },
  {
    name: 'Emerald Wellness',
    primary: '#059669',
    secondary: '#111827',
    fontFamily: 'Inter',
  },
  {
    name: 'Indigo Medical Chain',
    primary: '#4f46e5',
    secondary: '#0f172a',
    fontFamily: 'Roboto',
  },
  {
    name: 'Warm Rose Care',
    primary: '#be123c',
    secondary: '#1e1b4b',
    fontFamily: 'Inter',
  }
];

export default function BrandControlPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [name, setName] = useState('CareGroup Health');
  const [logoUrl, setLogoUrl] = useState('🧬');
  const [primaryColor, setPrimaryColor] = useState('#0f766e');
  const [secondaryColor, setSecondaryColor] = useState('#1e1b4b');
  const [fontFamily, setFontFamily] = useState('Inter');

  // Compliance Scanner State
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrg() {
      const org = await getOrganization();
      if (org) {
        setName(org.name);
        setLogoUrl(org.logoUrl || '🧬');
        setPrimaryColor(org.primaryColor);
        setSecondaryColor(org.secondaryColor);
        setFontFamily(org.fontFamily);
      }
      // Load initial compliance alerts
      const initialAlerts = await runBrandComplianceScan();
      setComplianceAlerts(initialAlerts);
      
      setLoading(false);
    }
    loadOrg();
  }, []);

  const handleTriggerAudit = async () => {
    setScanning(true);
    setScanProgress(10);
    setScanLogs(["🔄 Initializing FDA regulatory text parser..."]);
    
    const logs = [
      "🔍 Checking clinical descriptions for non-compliant claims...",
      "🔍 Auditing provider rosters credentials...",
      "🔍 Validating FDA disclaimer placements on public pages...",
      "🔍 Testing location subdomains styles & themes mapping...",
      "🧬 Compliance checks finished. Compiling audit dashboard..."
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logs.length) {
        setScanLogs(prev => [...prev, logs[currentLog]]);
        setScanProgress(p => Math.min(p + 18, 90));
        currentLog++;
      } else {
        clearInterval(interval);
        completeAudit();
      }
    }, 350);
  };

  const completeAudit = async () => {
    try {
      const alerts = await runBrandComplianceScan();
      setComplianceAlerts(alerts);
      setScanProgress(100);
      setHasScanned(true);
      setTimeout(() => {
        setScanning(false);
        setScanProgress(0);
      }, 700);
    } catch (err) {
      console.error(err);
      setScanning(false);
    }
  };

  const handleResolveAlert = async (alertItem: ComplianceAlert) => {
    setResolvingId(alertItem.id);
    try {
      const res = await resolveComplianceAlert(alertItem.id, alertItem.locationId, alertItem.targetTable, alertItem.targetId);
      if (res.success) {
        setComplianceAlerts(prev => prev.filter(a => a.id !== alertItem.id));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to auto-correct compliance alert");
    } finally {
      setResolvingId(null);
    }
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setFontFamily(preset.fontFamily);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updateOrganization({
        name,
        logoUrl: logoUrl || '🧬',
        primaryColor,
        secondaryColor,
        fontFamily
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save organization brand settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-teal-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading organization settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Palette className="w-6 h-6 text-teal-400" /> Global Brand Control System
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          HQ sets logo, primary colors, and font styling. Dynamic location layouts will render instantly with the synchronized theme.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Brand controls form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave}>
            <Card>
              <CardHeader>
                <CardTitle>Branding & Identity System</CardTitle>
                <CardDescription>Configure colors, names, and fonts applied across the clinic websites network.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Franchise Brand Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  
                  <Input 
                    label="Corporate Logo Emoji / Character"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="e.g. 🧬, 🩺, 🏥"
                  />
                </div>

                <div className="border-t border-slate-900 pt-6">
                  <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Preset Brand Themes</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="p-3 text-left bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition"
                      >
                        <p className="text-xs font-bold text-slate-200">{preset.name}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-white/10" 
                            style={{ backgroundColor: preset.primary }} 
                          />
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-white/10" 
                            style={{ backgroundColor: preset.secondary }} 
                          />
                          <span className="text-[10px] text-slate-500 font-mono">{preset.fontFamily}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Primary Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 bg-transparent border-0 rounded cursor-pointer"
                      />
                      <Input 
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="mb-0 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Secondary Base Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-10 h-10 bg-transparent border-0 rounded cursor-pointer"
                      />
                      <Input 
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="mb-0 font-mono"
                      />
                    </div>
                  </div>

                  <Select 
                    label="Primary Typography font"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    options={[
                      { value: 'Inter', label: 'Inter (Clean & Professional)' },
                      { value: 'Outfit', label: 'Outfit (Modern & Premium)' },
                      { value: 'Roboto', label: 'Roboto (Standard Medical)' },
                      { value: 'Geist', label: 'Geist (Sleek developer look)' },
                    ]}
                  />
                </div>

                <div className="flex items-center justify-between border-t border-slate-900 pt-6">
                  {savedSuccess ? (
                    <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                      HQ Settings Saved and Deployed to Network!
                    </span>
                  ) : <span />}
                  <Button 
                    type="submit" 
                    disabled={saving} 
                    className="flex items-center gap-1.5 shadow-lg shadow-teal-500/20"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Brand Configuration
                      </>
                    )}
                  </Button>
                </div>

              </CardContent>
            </Card>
          </form>
        </div>

        {/* Brand Preview Panel */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader className="bg-slate-900/50">
              <CardTitle className="flex items-center gap-1 text-teal-400">
                <Layout className="w-4.5 h-4.5" /> Core UI Realtime Preview
              </CardTitle>
              <CardDescription>See how location subpages render the corporate brand settings.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-slate-950 space-y-6">
              
              {/* Header preview */}
              <div className="p-3 bg-white text-slate-900 rounded-lg shadow-md border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{logoUrl}</span>
                    <span className="text-xs font-bold text-slate-800" style={{ fontFamily }}>
                      Austin Clinic
                    </span>
                  </div>
                  <span className="text-[9px] text-white px-2 py-0.5 rounded font-bold" style={{ backgroundColor: primaryColor, fontFamily }}>
                    Book Online
                  </span>
                </div>
                <div className="pt-2 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Our Specialty Services</p>
                  <div className="flex justify-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                    <span className="w-2 h-2 rounded-full opacity-50" style={{ backgroundColor: primaryColor }} />
                    <span className="w-2 h-2 rounded-full opacity-20" style={{ backgroundColor: primaryColor }} />
                  </div>
                </div>
              </div>

              {/* Call-to-action preview */}
              <div className="p-4 rounded-xl text-center border text-white relative overflow-hidden" style={{ backgroundColor: secondaryColor }}>
                {/* Floating decor */}
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10 blur-xl" style={{ backgroundColor: primaryColor }} />
                
                <h4 className="text-sm font-bold" style={{ fontFamily }}>Need Urgent Care?</h4>
                <p className="text-[10px] text-slate-300 mt-1 max-w-[200px] mx-auto">Get in-office treatments in Chicago. Open 24/7.</p>
                <div className="mt-3">
                  <button className="text-[10px] px-3 py-1.5 rounded-md font-semibold text-white transition hover:brightness-110 shadow-lg" style={{ backgroundColor: primaryColor, fontFamily }}>
                    Book Appointment
                  </button>
                </div>
              </div>

              {/* Button preview variants */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Button Renderings</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button className="text-xs px-3 py-1.5 rounded-lg text-white font-medium" style={{ backgroundColor: primaryColor, fontFamily }}>
                    Accent Primary
                  </button>
                  <button className="text-xs px-3 py-1.5 rounded-lg border font-medium bg-transparent" style={{ borderColor: primaryColor, color: primaryColor, fontFamily }}>
                    Accent Outline
                  </button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Brand Compliance Monitor Panel */}
      <Card className="border-slate-850 bg-slate-950/40 relative overflow-hidden mt-8">
        {scanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-20 space-y-4">
            <RefreshCw className="w-10 h-10 text-teal-400 animate-spin" />
            <div className="text-center">
              <p className="text-sm font-bold text-slate-200">Running AI Compliance Audit...</p>
              <p className="text-xs text-slate-500 mt-1">Inspecting all public pages and rosters.</p>
            </div>
            <div className="w-full max-w-xs bg-slate-900 border border-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-teal-500 h-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
            </div>
            <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-3 text-[10px] font-mono text-left space-y-1 w-full max-w-sm max-h-24 overflow-y-auto">
              {scanLogs.map((log, i) => (
                <div key={i} className="text-slate-400">✓ {log}</div>
              ))}
            </div>
          </div>
        )}

        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-900/60 pb-4">
          <div>
            <CardTitle className="text-md font-bold text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              AI Brand Guardian & Compliance Monitor™
            </CardTitle>
            <CardDescription className="text-xs">
              Corporate audit scanner checking medical claims, HIPAA disclaimers, outdated details, and style guidelines across location sites.
            </CardDescription>
          </div>
          <Button 
            onClick={handleTriggerAudit} 
            disabled={scanning} 
            className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/80 flex items-center gap-1.5 text-xs h-9"
          >
            <Play className="w-3.5 h-3.5 fill-rose-300" /> Run Brand Audit
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left overview */}
            <div className="lg:col-span-1 p-4 bg-slate-900/20 border border-slate-900 rounded-xl flex flex-col justify-between h-fit gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Scanners Status</p>
                <p className="text-xs text-slate-200 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" /> 5 Active Crawlers Online
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Violations Found</p>
                <p className="text-xl font-bold text-rose-400">{complianceAlerts.length} Active Warnings</p>
              </div>
              <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-900 pt-3 space-y-1 bg-transparent">
                <p>⚠️ High: FDA claim warnings</p>
                <p>🎨 Medium: Branding font breaches</p>
                <p>📋 Low: Roster credential lag</p>
              </div>
            </div>

            {/* Right Alerts List */}
            <div className="lg:col-span-3 space-y-4">
              {complianceAlerts.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {complianceAlerts.map((alertItem) => (
                    <div 
                      key={alertItem.id}
                      className={`p-4 border rounded-xl flex flex-col sm:flex-row items-stretch sm:items-start gap-4 transition hover:border-slate-800 ${
                        alertItem.severity === 'high' 
                          ? 'border-rose-900/60 bg-rose-950/15' 
                          : alertItem.severity === 'medium'
                          ? 'border-amber-900/60 bg-amber-950/15'
                          : 'border-slate-850 bg-slate-900/20'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                          alertItem.severity === 'high' ? 'text-rose-400' : alertItem.severity === 'medium' ? 'text-amber-400' : 'text-slate-400'
                        }`} />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-200">{alertItem.clinicName}</span>
                              <Badge variant="secondary" className="text-[8px] uppercase px-1.5 py-px border border-white/5 tracking-wide">
                                {alertItem.type}
                              </Badge>
                            </div>
                            
                            <span className={`text-[9px] uppercase font-extrabold tracking-wider font-mono ${
                              alertItem.severity === 'high' ? 'text-rose-400' : alertItem.severity === 'medium' ? 'text-amber-400' : 'text-slate-500'
                            }`}>
                              {alertItem.severity} priority
                            </span>
                          </div>

                          <p className="text-xs text-slate-350">{alertItem.message}</p>
                          
                          <div className="bg-slate-950/65 border border-slate-900/80 p-2.5 rounded-lg text-[10px] text-slate-400 leading-relaxed">
                            <span className="font-bold text-slate-300">Action Recommended:</span> {alertItem.recommendedFix}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center justify-end pt-2 sm:pt-0 border-t border-slate-900/40 sm:border-t-0">
                        <Button 
                          onClick={() => handleResolveAlert(alertItem)}
                          disabled={resolvingId === alertItem.id}
                          className="w-full sm:w-auto h-8 text-[11px] bg-slate-900 hover:bg-slate-850 text-emerald-400 border border-emerald-900/50 hover:border-emerald-800 flex items-center justify-center gap-1"
                        >
                          {resolvingId === alertItem.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" /> Resolving
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" /> Fix Auto
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border border-dashed border-slate-900 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <CheckCircle className="w-10 h-10 text-emerald-500/80 animate-pulse" />
                  <div>
                    <h5 className="text-sm font-semibold text-slate-200">Ecosystem Safe & Compliant</h5>
                    <p className="text-xs text-slate-500 mt-1">All {hasScanned ? "inspected" : "polled"} locations comply with corporate branding guidelines and FDA disclaimers.</p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </CardContent>
      </Card>
    </div>
  );
}
