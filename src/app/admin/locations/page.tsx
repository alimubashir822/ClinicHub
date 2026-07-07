'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getLocations, getGlobalServices, launchLocation, getRegions } from '@/app/actions';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Badge,
  Input,
  Select,
  Button,
  Modal
} from '@/components/ui';
import { 
  MapPin, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Globe, 
  Compass, 
  Users, 
  ShieldCheck,
  TrendingUp,
  Layout,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

function LocationsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wizardOpenParam = searchParams.get('wizard') === 'open';

  const [locations, setLocations] = useState<any[]>([]);
  const [globalServices, setGlobalServices] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Wizard Step State
  const [step, setStep] = useState(1); // 1: Info, 2: Services, 3: Providers, 4: Launching Simulation

  // Form Fields
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hours, setHours] = useState('Mon - Fri: 9:00 AM - 5:00 PM');
  const [templateType, setTemplateType] = useState('DENTAL');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [providers, setProviders] = useState<{ name: string; title: string; specialty: string; email: string }[]>([
    { name: '', title: '', specialty: '', email: '' }
  ]);

  // Simulation State
  const [simLog, setSimLog] = useState<string[]>([]);
  const [simProgress, setSimProgress] = useState(0);
  const [createdSlug, setCreatedSlug] = useState('');
  const [generatedCampaign, setGeneratedCampaign] = useState<any>(null);

  async function loadData() {
    setLoading(true);
    const locs = await getLocations();
    const servs = await getGlobalServices();
    const regs = await getRegions();
    setLocations(locs);
    setGlobalServices(servs);
    setRegions(regs);
    if (regs.length > 0) {
      setSelectedRegionId(regs[0].id);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    if (wizardOpenParam) {
      setIsWizardOpen(true);
    }
  }, [wizardOpenParam]);

  const handleOpenWizard = () => {
    setStep(1);
    setIsWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
    // Reset wizard
    setStep(1);
    setName('');
    setCity('');
    setState('');
    setAddress('');
    setZip('');
    setPhone('');
    setEmail('');
    setHours('Mon - Fri: 9:00 AM - 5:00 PM');
    setTemplateType('DENTAL');
    setSelectedServices([]);
    setProviders([{ name: '', title: '', specialty: '', email: '' }]);
    setSimLog([]);
    setSimProgress(0);
    router.replace('/admin/locations'); // strip param
  };

  const handleToggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAddProviderRow = () => {
    setProviders(prev => [...prev, { name: '', title: '', specialty: '', email: '' }]);
  };

  const handleProviderChange = (idx: number, field: string, val: string) => {
    setProviders(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleRemoveProviderRow = (idx: number) => {
    setProviders(prev => prev.filter((_, i) => i !== idx));
  };

  // Run AI Launch Simulation
  const handleLaunchSubmit = async () => {
    setStep(4);
    
    const logs = [
      "🔄 Initializing multi-tenant workspace routing context...",
      "🌐 Binding local subdomain slug /sites/" + name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      "🧩 Compiling healthcare site template layouts...",
      "🩺 Establishing localized SEO schemas: LocalBusiness, MedicalBusiness, Physician...",
      "✍️ AI content generator crafting local landing pages...",
      "🔍 Creating search optimization slugs: /dentist-" + city.toLowerCase() + ", /services...",
      "💬 Seeding clinic AI Assistant knowledge models...",
      "🚀 Activating smart booking engine calendars...",
      "🧬 Database entries validated. Launching site live!"
    ];

    let currentLogIndex = 0;
    
    // Simulate progression
    const timer = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setSimLog(prev => [...prev, logs[currentLogIndex]]);
        setSimProgress(Math.min(((currentLogIndex + 1) / logs.length) * 100, 100));
        currentLogIndex++;
      } else {
        clearInterval(timer);
        finalizeLaunch();
      }
    }, 450);
  };

  const finalizeLaunch = async () => {
    try {
      const activeProviders = providers.filter(p => p.name.trim() !== '');
      const res = await launchLocation({
        name,
        city,
        state,
        address,
        zip,
        phone,
        email,
        hours,
        templateType,
        services: selectedServices,
        providers: activeProviders,
        regionId: selectedRegionId || undefined
      });

      if (res && res.slug) {
        setCreatedSlug(res.slug);
      }

      // Pre-compile campaign copy
      const campaignName = `${name} Grand Opening Launch Campaign`;
      const emailText = `Subject: Welcome to the brand new ${name} in ${city}! \n\nDear neighbor,\nWe are proud to announce the grand opening of our brand new, state-of-the-art facility at ${address}. Under our parent network CareFranchise OS, we have established premium clinical guidelines to serve the ${city} community. \n\nBook your opening week consultation online today: https://carefranchise.com/sites/${res.slug}/booking. \n\nWarm regards,\nThe team at ${name}`;
      
      const socialPost = `✨ We are officially LIVE! ✨\n\nCareFranchise OS is thrilled to welcome our newest clinic twin: ${name}! Located in the heart of ${city} at ${address}.\n\nSchedule your appointment in 60 seconds: https://carefranchise.com/sites/${res.slug}/booking\n\n#HealthCare #NewClinic #${city}Health`;

      const searchAd = `Headline 1: Top Rated ${templateType === 'DENTAL' ? 'Dentistry' : templateType === 'SPA' ? 'Med Spa' : 'Clinic'} in ${city}\nHeadline 2: Book Online at ${name}\nDescription: Now open in ${city}, TX! Offering specialized health services, board-certified doctors, and secure online scheduling. Visit our new clinic today!`;

      setGeneratedCampaign({
        name: campaignName,
        email: emailText,
        social: socialPost,
        ad: searchAd
      });

      // Confetti fire!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      setStep(5);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Launch error. Please check inputs.");
      setStep(3); // go back to providers step
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-teal-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading clinic locations directory...</span>
      </div>
    );
  }

  // Filter service template categories based on selected Type
  const filteredGlobalServices = globalServices.filter(s => {
    if (templateType === 'DENTAL') return s.id.includes('dental') || s.id.includes('whitening');
    if (templateType === 'SPA') return s.id.includes('facial') || s.id.includes('botox') || s.id.includes('whitening');
    if (templateType === 'URGENT_CARE') return s.id.includes('acute') || s.id.includes('testing');
    if (templateType === 'MEDICAL') return s.id.includes('general') || s.id.includes('wellness');
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-6 h-6 text-teal-400" /> Clinic Locations & Launch Center
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Deploy local clinic microsites in seconds using the AI-powered Franchise Launch Wizard.
          </p>
        </div>
        <Button onClick={handleOpenWizard} className="flex items-center gap-1.5 shadow-lg shadow-teal-500/20">
          <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
          AI Launch New Location
        </Button>
      </div>

      {/* Locations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Franchise Ecosystem ({locations.length} Locations)</CardTitle>
          <CardDescription>View status, local SEO rating scores, and direct management links for each digital twin.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-900">
                  <th className="px-6 py-4">Clinic Details</th>
                  <th className="px-6 py-4">Website Layout</th>
                  <th className="px-6 py-4">Phone / Contact</th>
                  <th className="px-6 py-4">SEO Score</th>
                  <th className="px-6 py-4">Staff Providers</th>
                  <th className="px-6 py-4 text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs">
                {locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-900/10 transition group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-200 group-hover:text-white transition text-sm">
                          {loc.name}
                        </p>
                        <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-600" /> {loc.address}, {loc.city}, {loc.state}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        loc.templateType === 'DENTAL' ? 'info' :
                        loc.templateType === 'SPA' ? 'warning' :
                        loc.templateType === 'URGENT_CARE' ? 'error' : 'secondary'
                      }>
                        {loc.templateType} Layout
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <div>
                        <p className="font-medium text-slate-300">{loc.phone}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{loc.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-teal-400 font-bold">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {loc.growthScore}% Score
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-500" /> {loc.providers.length} Providers
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a href={`/sites/${loc.slug}`} target="_blank" rel="noreferrer">
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400 hover:text-white">
                            Visit Site
                          </Button>
                        </a>
                        <a href={`/clinic?id=${loc.id}`}>
                          <Button variant="outline" size="sm" className="h-8 px-2 text-teal-400 hover:text-teal-300 border-slate-800/80">
                            Dashboard
                          </Button>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
                {locations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No locations found. Use the Launch Wizard to generate a clinic now.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Multi-step Launch Wizard Modal */}
      <Modal
        isOpen={isWizardOpen}
        onClose={handleCloseWizard}
        title="AI Franchise Launch Engine™"
        size={step === 4 ? 'md' : 'lg'}
      >
        {/* Step Indicator Headers */}
        {step < 4 && (
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 text-xs text-slate-400 font-medium">
            <span className={step === 1 ? 'text-teal-400 font-bold' : ''}>1. Clinic Credentials</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className={step === 2 ? 'text-teal-400 font-bold' : ''}>2. Local Services</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className={step === 3 ? 'text-teal-400 font-bold' : ''}>3. Staff Providers</span>
          </div>
        )}

        {/* Step 1: Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input 
                label="New Clinic Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Elite Dental Austin"
              />
              <Select 
                label="Clinic Specialty Template"
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                options={[
                  { value: 'DENTAL', label: 'Dental Clinic' },
                  { value: 'SPA', label: 'Medical Spa' },
                  { value: 'URGENT_CARE', label: 'Urgent Care Walk-In' },
                  { value: 'MEDICAL', label: 'Family Medical Center' }
                ]}
              />
              <Select 
                label="Territory Assignment"
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                options={regions.map(r => ({ value: r.id, label: r.name }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Input 
                  label="Street Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="e.g. 506 Congress Ave"
                />
              </div>
              <Input 
                label="Zip Code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                required
                placeholder="e.g. 78701"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="e.g. Austin"
              />
              <Input 
                label="State (Abbr.)"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                placeholder="e.g. TX"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                label="Clinic Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="e.g. (512) 555-0911"
              />
              <Input 
                label="Clinic Email (Public)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. info@elitedentalaustin.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <Input 
                label="Operational Hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
                placeholder="e.g. Mon - Fri: 8 AM - 5 PM"
                className="mb-0"
              />
              <div className="text-right">
                <Button 
                  onClick={() => {
                    if (!name || !city || !state || !address || !zip || !phone || !email) {
                      alert("Please fill in all clinical credentials.");
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full sm:w-auto"
                >
                  Continue to Services <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Choose Services */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Select Local Services</h4>
              <p className="text-xs text-slate-500 mt-1">
                Enable global services on this location. Localized landing pages and SEO queries will be generated for each checked service.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1 bg-slate-950 border border-slate-900 rounded-xl">
              {filteredGlobalServices.map((service) => (
                <div 
                  key={service.id}
                  onClick={() => handleToggleService(service.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition flex items-start gap-3 select-none ${
                    selectedServices.includes(service.id) 
                      ? 'border-teal-500 bg-teal-950/20 text-slate-100 shadow-md' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900/30 text-slate-400'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    selectedServices.includes(service.id) ? 'bg-teal-600 border-teal-500 text-white' : 'border-slate-700'
                  }`}>
                    {selectedServices.includes(service.id) && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">{service.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{service.description}</p>
                    <p className="text-[10px] text-teal-400 font-bold mt-1">${service.price} • {service.duration} mins</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t border-slate-800 pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => {
                  if (selectedServices.length === 0) {
                    alert("Please enable at least one clinical service.");
                    return;
                  }
                  setStep(3);
                }}
              >
                Continue to Providers <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Define Providers */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Assign Clinic Providers</h4>
              <p className="text-xs text-slate-500 mt-1">
                Add doctors and practitioners assigned to this location. Bio pages and online appointment booking paths are created for each.
              </p>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto p-1">
              {providers.map((p, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-slate-900 rounded-xl relative space-y-3">
                  {providers.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveProviderRow(idx)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 text-xs"
                    >
                      Delete
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input 
                      label="Doctor Name"
                      value={p.name}
                      onChange={(e) => handleProviderChange(idx, 'name', e.target.value)}
                      placeholder="e.g. Sarah Miller"
                      required
                      className="mb-0"
                    />
                    <Input 
                      label="Title Credentials"
                      value={p.title}
                      onChange={(e) => handleProviderChange(idx, 'title', e.target.value)}
                      placeholder="e.g. DDS, MD, LMT"
                      required
                      className="mb-0"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input 
                      label="Bio Specialty"
                      value={p.specialty}
                      onChange={(e) => handleProviderChange(idx, 'specialty', e.target.value)}
                      placeholder="e.g. Cosmetic Dentistry"
                      required
                      className="mb-0"
                    />
                    <Input 
                      label="Doctor Email"
                      type="email"
                      value={p.email}
                      onChange={(e) => handleProviderChange(idx, 'email', e.target.value)}
                      placeholder="e.g. s.miller@clinic.com"
                      required
                      className="mb-0"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-slate-800 pt-4">
              <Button type="button" variant="outline" onClick={() => handleAddProviderRow()} className="text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Another Provider
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={handleLaunchSubmit}
                  className="bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold"
                >
                  <Sparkles className="w-4 h-4 mr-1 animate-pulse" /> Launch Location Online
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: AI Launching Simulation Compilation logs */}
        {step === 4 && (
          <div className="space-y-6 text-center py-6">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center bg-slate-900 border border-slate-800 rounded-full shadow-2xl overflow-hidden">
              <div className="absolute inset-0 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-bold text-slate-100">AI Launch Engine Compiling...</h4>
              <p className="text-xs text-slate-500">Synthesizing location digital twin assets.</p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-950 border border-slate-900 h-2.5 rounded-full overflow-hidden max-w-sm mx-auto">
              <div 
                className="bg-gradient-to-r from-teal-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${simProgress}%` }}
              />
            </div>

            {/* Simulation Logger */}
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 text-[10px] font-mono text-left space-y-1.5 max-h-40 overflow-y-auto max-w-md mx-auto shadow-inner">
              {simLog.map((log, i) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-teal-500">✔</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: AI Asset Reviewer */}
        {step === 5 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <span className="text-3xl">🎉</span>
              <h4 className="text-md font-bold text-slate-100 flex items-center gap-1 justify-center">
                <Sparkles className="w-5 h-5 text-teal-400 animate-pulse" /> Location Deployed & Live!
              </h4>
              <p className="text-xs text-slate-500">Review AI-generated digital twin workspace assets.</p>
            </div>

            <div className="space-y-4">
              {/* Site URL Card */}
              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2.5 text-xs">
                <p className="font-bold text-slate-350">🌍 Public Subdomain Access</p>
                <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-900 rounded-lg">
                  <span className="font-mono text-teal-400 select-all">/sites/{createdSlug}</span>
                  <a href={`/sites/${createdSlug}`} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="h-6 text-[10px] border-slate-800 hover:bg-slate-900">
                      Open Website
                    </Button>
                  </a>
                </div>
              </div>

              {/* Technical SEO schema */}
              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2.5 text-xs">
                <p className="font-bold text-slate-350">🩺 Local Business Schema (JSON-LD)</p>
                <div className="relative">
                  <pre className="p-3 bg-slate-950 border border-slate-900 rounded-lg text-[9px] font-mono text-slate-400 overflow-x-auto max-h-24">
{`{
  "@context": "https://schema.org",
  "@type": "${templateType === 'DENTAL' ? 'Dentist' : templateType === 'SPA' ? 'BeautySalon' : 'MedicalClinic'}",
  "name": "${name}",
  "address": "${address}, ${city}, ${state} ${zip}",
  "telephone": "${phone}",
  "email": "${email}"
}`}
                  </pre>
                </div>
              </div>

              {/* Suggested Launch Marketing campaign */}
              {generatedCampaign && (
                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3 text-xs">
                  <p className="font-bold text-slate-350 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Launch Campaign Suite
                  </p>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-lg">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Email Newsletter Flyer</p>
                      <pre className="text-[9px] font-sans text-slate-400 whitespace-pre-wrap leading-relaxed">
                        {generatedCampaign.email}
                      </pre>
                    </div>

                    <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-lg">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Social Media Post Copy</p>
                      <pre className="text-[9px] font-sans text-slate-400 whitespace-pre-wrap leading-relaxed">
                        {generatedCampaign.social}
                      </pre>
                    </div>

                    <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-lg">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Google Adwords Template</p>
                      <pre className="text-[9px] font-sans text-slate-400 whitespace-pre-wrap leading-relaxed">
                        {generatedCampaign.ad}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-4 text-right">
              <Button onClick={handleCloseWizard} className="w-full sm:w-auto">
                Close & Enter Dashboard
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function LocationsPage() {
  return (
    <Suspense fallback={
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-teal-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading locations panel...</span>
      </div>
    }>
      <LocationsPageContent />
    </Suspense>
  );
}
