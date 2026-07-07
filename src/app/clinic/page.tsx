'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getLocations, submitReviewReply, saveWebsiteBlocks } from '@/app/actions';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Badge,
  Input,
  Textarea,
  Button,
  Modal
} from '@/components/ui';
import { 
  MapPin, 
  Calendar, 
  Star, 
  Clock, 
  Users, 
  Activity, 
  TrendingUp, 
  MessageSquare, 
  ChevronRight,
  RefreshCw,
  ArrowLeft,
  ThumbsUp,
  Inbox,
  Eye,
  Award,
  ArrowUp,
  ArrowDown,
  EyeOff,
  Save,
  Sparkles,
  Check
} from 'lucide-react';

function ClinicManagerPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'appointments' | 'reviews' | 'providers' | 'builder' | 'settings'>('appointments');
  
  // Review reply states
  const [draftReply, setDraftReply] = useState('');
  const [replyingReview, setReplyingReview] = useState<any | null>(null);
  const [submittingReply, setSubmittingReply] = useState(false);

  // Block builder states
  const [blocks, setBlocks] = useState<any[]>([]);
  const [savingBlocks, setSavingBlocks] = useState(false);
  const [saveBlocksSuccess, setSaveBlocksSuccess] = useState(false);

  useEffect(() => {
    if (selectedLocation) {
      const homePage = selectedLocation.pages?.find((p: any) => p.slug === 'home');
      let pageContent: any = {};
      if (homePage) {
        try {
          pageContent = JSON.parse(homePage.content);
        } catch (_) {}
      }
      
      const defaultBlocks = [
        { id: 'hero', visible: true, title: pageContent.heroTitle || selectedLocation.name, subtitle: pageContent.heroSubtitle },
        { id: 'services', visible: true, title: 'Our Clinical Services' },
        { id: 'providers', visible: true, title: 'Meet Our Specialists' },
        { id: 'reviews', visible: true, title: 'What Our Patients Say' },
        { id: 'about', visible: true, title: 'About Our Clinic' }
      ];

      const loadedBlocks = pageContent.blocks
        ? (typeof pageContent.blocks === 'string' ? JSON.parse(pageContent.blocks) : pageContent.blocks)
        : defaultBlocks;
      
      setBlocks(loadedBlocks);
    }
  }, [selectedLocation]);

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setBlocks(updated);
  };

  const toggleBlockVisibility = (index: number) => {
    setBlocks(prev => prev.map((b, i) => i === index ? { ...b, visible: !b.visible } : b));
  };

  const handleBlockTitleChange = (index: number, val: string) => {
    setBlocks(prev => prev.map((b, i) => i === index ? { ...b, title: val } : b));
  };

  const handleBlockSubtitleChange = (index: number, val: string) => {
    setBlocks(prev => prev.map((b, i) => i === index ? { ...b, subtitle: val } : b));
  };

  const handleSaveBlocks = async () => {
    if (!selectedLocation) return;
    setSavingBlocks(true);
    setSaveBlocksSuccess(false);
    try {
      const homePage = selectedLocation.pages?.find((p: any) => p.slug === 'home');
      let pageContent: any = {};
      if (homePage) {
        try {
          pageContent = JSON.parse(homePage.content);
        } catch (_) {}
      }

      const updatedContent = {
        ...pageContent,
        heroTitle: blocks.find(b => b.id === 'hero')?.title || pageContent.heroTitle || selectedLocation.name,
        heroSubtitle: blocks.find(b => b.id === 'hero')?.subtitle || pageContent.heroSubtitle || '',
        blocks: blocks
      };

      const res = await saveWebsiteBlocks(selectedLocation.id, 'home', JSON.stringify(updatedContent));
      if (res.success) {
        setSaveBlocksSuccess(true);
        // Refresh local locations
        const updatedLocs = await getLocations();
        setLocations(updatedLocs);
        const match = updatedLocs.find(x => x.id === selectedLocation.id);
        if (match) setSelectedLocation(match);
        setTimeout(() => setSaveBlocksSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save website blocks configuration");
    } finally {
      setSavingBlocks(false);
    }
  };

  async function loadData() {
    setLoading(true);
    const data = await getLocations();
    setLocations(data);
    
    if (locationId) {
      const match = data.find(x => x.id === locationId);
      if (match) setSelectedLocation(match);
    } else if (data.length > 0) {
      setSelectedLocation(data[0]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [locationId]);

  const handleReplyClick = (review: any) => {
    const greeting = `Hi ${review.patientName}, thank you for your feedback regarding ${selectedLocation.name}.`;
    const body = review.rating >= 4 
      ? ` We are thrilled that you had a comfortable clinical experience. We look forward to seeing you at your next visit!`
      : ` We are very sorry to hear that your experience did not meet expectations. We would appreciate the chance to address your concerns directly. Please contact our office manager.`;
    setDraftReply(`${greeting}${body}`);
    setReplyingReview(review);
  };

  const handleSendReply = async () => {
    if (!replyingReview || !draftReply.trim()) return;
    setSubmittingReply(true);
    try {
      await submitReviewReply(replyingReview.id, draftReply);
      setReplyingReview(null);
      setDraftReply('');
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to submit reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-teal-500 animate-spin" />
        <span className="ml-3 text-slate-400">Opening clinic manager dashboard...</span>
      </div>
    );
  }

  if (!selectedLocation) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-450 gap-4 text-center">
        <p>No clinics created yet. Go to Command Center to launch one.</p>
        <Button onClick={() => router.replace('/admin')}>Go to HQ Command Center</Button>
      </div>
    );
  }

  // Calculate local stats
  const appointmentsCount = selectedLocation.appointments.length;
  const reviewsCount = selectedLocation.reviews.length;
  const avgRating = reviewsCount > 0
    ? (selectedLocation.reviews.reduce((acc: number, cur: any) => acc + cur.rating, 0) / reviewsCount).toFixed(1)
    : '5.0';

  const weeklyVisits = selectedLocation.analytics.reduce((acc: number, cur: any) => acc + cur.visitors, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Clinic Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/admin')}
            className="p-2 bg-slate-950 hover:bg-slate-855 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white">{selectedLocation.name}</h2>
              <Badge variant="neutral">Local Portal</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> {selectedLocation.address}, {selectedLocation.city}, {selectedLocation.state}
            </p>
          </div>
        </div>

        {/* Quick Clinic Switcher dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Switch Clinic:</label>
          <select 
            value={selectedLocation.id}
            onChange={(e) => {
              const match = locations.find(x => x.id === e.target.value);
              if (match) setSelectedLocation(match);
            }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-300 focus:outline-none focus:border-teal-500"
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main content grid */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
        
        {/* Local KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-teal-950/40 border border-teal-900/50 rounded-xl text-teal-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Bookings</p>
                <h4 className="text-xl font-bold text-slate-200 mt-0.5">{appointmentsCount} Appointments</h4>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-amber-950/40 border border-amber-900/50 rounded-xl text-amber-400 shrink-0">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reputation</p>
                <h4 className="text-xl font-bold text-slate-200 mt-0.5">{avgRating} ★ ({reviewsCount} reviews)</h4>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-950/40 border border-indigo-900/50 rounded-xl text-indigo-400 shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Traffic</p>
                <h4 className="text-xl font-bold text-slate-200 mt-0.5">{weeklyVisits} Visits (7d)</h4>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-emerald-400 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Local SEO Rank</p>
                <h4 className="text-xl font-bold text-slate-200 mt-0.5">{selectedLocation.growthScore}% Growth</h4>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-900 pb-px overflow-x-auto whitespace-nowrap scrollbar-none">
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition shrink-0 ${
              activeTab === 'appointments' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-350'
            }`}
          >
            Schedules & Appointments
          </button>
          
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition shrink-0 ${
              activeTab === 'reviews' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-350'
            }`}
          >
            Local Reviews ({reviewsCount})
          </button>

          <button 
            onClick={() => setActiveTab('providers')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition shrink-0 ${
              activeTab === 'providers' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-350'
            }`}
          >
            Provider Reputation Engine
          </button>
          
          <button 
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition shrink-0 ${
              activeTab === 'builder' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-350'
            }`}
          >
            Website Block Builder
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition shrink-0 ${
              activeTab === 'settings' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-350'
            }`}
          >
            Clinic Settings
          </button>
        </div>

        {/* Tab contents */}
        <div className="space-y-6">
          
          {/* Website Block Builder UI */}
          {activeTab === 'builder' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
              
              {/* Blocks Editor */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div>
                      <CardTitle className="text-md font-bold text-slate-100 flex items-center gap-1.5">
                        <Sparkles className="w-5 h-5 text-teal-400" /> Clinic Website Block Editor
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Configure clinic-specific homepage blocks layout, toggle visibility, and rewrite headlines.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-3">
                      {blocks.map((block, idx) => (
                        <div 
                          key={block.id}
                          className={`p-4 bg-slate-950 border rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 transition ${
                            block.visible ? 'border-slate-800' : 'border-slate-900/60 opacity-60 bg-slate-950/45'
                          }`}
                        >
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                                {block.id} Block
                              </span>
                              <Badge variant={block.visible ? 'success' : 'neutral'}>
                                {block.visible ? 'Visible' : 'Hidden'}
                              </Badge>
                            </div>

                            {block.id === 'hero' && block.visible && (
                              <div className="grid grid-cols-1 gap-2 pt-1">
                                <Input 
                                  label="Custom Hero Main Headline"
                                  value={block.title || ''}
                                  onChange={(e) => handleBlockTitleChange(idx, e.target.value)}
                                  placeholder="e.g. Smile Confidently with Expert Care"
                                  className="mb-0"
                                />
                                <Textarea 
                                  label="Hero Subtitle / Description"
                                  value={block.subtitle || ''}
                                  onChange={(e) => handleBlockSubtitleChange(idx, e.target.value)}
                                  placeholder="e.g. Providing premium restorative and preventive dentistry."
                                />
                              </div>
                            )}

                            {block.id !== 'hero' && block.visible && (
                              <div className="pt-1">
                                <Input 
                                  label="Section Headline Text"
                                  value={block.title || ''}
                                  onChange={(e) => handleBlockTitleChange(idx, e.target.value)}
                                  placeholder="Section title"
                                  className="mb-0"
                                />
                              </div>
                            )}
                          </div>

                          <div className="shrink-0 flex items-center justify-end gap-1.5 border-t sm:border-t-0 sm:border-l border-slate-900 pt-3 sm:pt-0 sm:pl-4">
                            <button
                              type="button"
                              onClick={() => toggleBlockVisibility(idx)}
                              className="p-2 hover:bg-slate-900 rounded border border-slate-850 text-slate-400 hover:text-white transition"
                              title={block.visible ? 'Hide block' : 'Show block'}
                            >
                              {block.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => moveBlock(idx, 'up')}
                              disabled={idx === 0}
                              className="p-2 hover:bg-slate-900 rounded border border-slate-850 text-slate-400 hover:text-white transition disabled:opacity-30"
                              title="Move up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => moveBlock(idx, 'down')}
                              disabled={idx === blocks.length - 1}
                              className="p-2 hover:bg-slate-900 rounded border border-slate-850 text-slate-400 hover:text-white transition disabled:opacity-30"
                              title="Move down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-900 pt-4">
                      {saveBlocksSuccess ? (
                        <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                          <Check className="w-4 h-4" /> Website blocks saved & updated!
                        </span>
                      ) : <span />}
                      
                      <Button 
                        onClick={handleSaveBlocks} 
                        disabled={savingBlocks}
                        className="flex items-center gap-1.5 text-xs shadow-lg shadow-teal-500/20"
                      >
                        {savingBlocks ? 'Saving...' : (
                          <>
                            <Save className="w-3.5 h-3.5" /> Save Layout Changes
                          </>
                        )}
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              </div>

              {/* Realtime Layout Visualizer */}
              <div className="space-y-4">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">Layout Preview Structure</CardTitle>
                    <CardDescription className="text-[10px]">Inspect page flow rendering on public domain.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 bg-slate-950 space-y-3">
                    <div className="border border-slate-900 rounded-lg p-2.5 text-center text-[10px] text-slate-500 font-bold bg-slate-900/10">
                      🧬 Navigation Menu
                    </div>

                    {blocks.map((block) => {
                      if (!block.visible) return null;
                      return (
                        <div 
                          key={block.id} 
                          className="border border-slate-850 bg-slate-900/30 rounded-xl p-3 text-center space-y-1 hover:border-slate-800 transition shadow"
                        >
                          <p className="text-[10px] uppercase font-bold text-slate-450 tracking-wide font-mono">{block.id} section</p>
                          <p className="text-[11px] text-slate-200 truncate font-semibold">"{block.title || 'Untitled Section'}"</p>
                        </div>
                      );
                    })}

                    <div className="border border-slate-900 rounded-lg p-2.5 text-center text-[10px] text-slate-500 font-bold bg-slate-900/10">
                      🩺 Footer Information
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          )}
          
          {/* 1. Appointments list */}
          {activeTab === 'appointments' && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Consultations & Appointments</CardTitle>
                <CardDescription>Managed schedule requests booked directly online.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/50 text-[10px] text-slate-500 font-bold uppercase border-b border-slate-900">
                        <th className="px-6 py-4">Patient Name</th>
                        <th className="px-6 py-4">Treatment / Service</th>
                        <th className="px-6 py-4">Assigned Doctor</th>
                        <th className="px-6 py-4">Date & Time</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-xs text-slate-400">
                      {selectedLocation.appointments.map((appt: any) => (
                        <tr key={appt.id} className="hover:bg-slate-900/10 transition">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-slate-200">{appt.patientName}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{appt.patientPhone} • {appt.patientEmail}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-slate-350">{appt.service.name}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-400">
                            <span>Dr. {appt.provider.name.split(' ').pop()} ({appt.provider.title})</span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-slate-200">{appt.appointmentDate}</p>
                              <p className="text-[10px] text-teal-400 font-medium">{appt.appointmentTime}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={appt.status === 'CONFIRMED' ? 'success' : 'warning'}>
                              {appt.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                      {selectedLocation.appointments.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            No appointments scheduled at this location.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 2. Reviews Reply list */}
          {activeTab === 'reviews' && (
            <Card>
              <CardHeader>
                <CardTitle>Patient Feedback Reputation Review</CardTitle>
                <CardDescription>Reply to reviews specific to {selectedLocation.name}.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-900">
                  {selectedLocation.reviews.map((rev: any) => (
                    <div key={rev.id} className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                      <div className="space-y-2 max-w-3xl">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-slate-200">{rev.patientName}</span>
                          <span className="text-slate-500">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400 text-xs">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <span key={idx}>{idx < rev.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-350 italic">
                          "{rev.content}"
                        </p>
                        {rev.replyContent && (
                          <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg mt-2">
                            <p className="text-[9px] font-bold text-slate-500">Staff Response:</p>
                            <p className="text-[10px] text-slate-300 leading-relaxed mt-0.5">{rev.replyContent}</p>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0">
                        {!rev.replyContent ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleReplyClick(rev)}
                            className="text-xs border-slate-800 text-teal-400 hover:bg-teal-950/20"
                            variant="outline"
                          >
                            Respond to Feedback
                          </Button>
                        ) : (
                          <Badge variant="success">Replied</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {selectedLocation.reviews.length === 0 && (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      No reviews found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3. Provider Reputation Engine */}
          {activeTab === 'providers' && (
            <Card>
              <CardHeader>
                <CardTitle>Provider Reputation & Performance Index</CardTitle>
                <CardDescription>Track local physician directory view volume, scheduled conversions, and patient rating metrics.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedLocation.providers.map((p: any) => {
                    const docAppts = selectedLocation.appointments.filter((a: any) => a.providerId === p.id);
                    const apptsCount = docAppts.length;
                    
                    // Simulated profile views conversion math
                    const views = p.profileViews || 120;
                    const convRate = views > 0 ? ((apptsCount / views) * 100).toFixed(1) : '0';

                    return (
                      <div key={p.id} className="p-5 bg-slate-950 border border-slate-900 rounded-xl space-y-4 hover:border-slate-800 transition">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-slate-900 border border-slate-850 rounded-full flex items-center justify-center font-bold text-slate-300 text-sm">
                            {p.name.split(' ').pop()?.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-200">{p.name}, {p.title}</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{p.specialty}</p>
                            <Badge variant="info" className="mt-2 text-[9px] bg-indigo-950/40 text-indigo-400 border-indigo-900/50">
                              Active Listing
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-900">
                          <div className="p-2 bg-slate-900/50 rounded-lg">
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 justify-center">
                              <Eye className="w-3 h-3 text-slate-550" /> Views
                            </p>
                            <p className="text-sm font-bold text-slate-200 mt-1">{views}</p>
                          </div>
                          
                          <div className="p-2 bg-slate-900/50 rounded-lg">
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 justify-center">
                              <Calendar className="w-3 h-3 text-slate-550" /> Bookings
                            </p>
                            <p className="text-sm font-bold text-slate-200 mt-1">{apptsCount}</p>
                          </div>

                          <div className="p-2 bg-slate-900/50 rounded-lg">
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 justify-center">
                              <Award className="w-3 h-3 text-slate-550" /> Conv. Rate
                            </p>
                            <p className="text-sm font-bold text-teal-400 mt-1">{convRate}%</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 4. Settings adjust */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Local Clinical Settings</CardTitle>
                  <CardDescription>Adjust clinic-level parameters. Central templates scale branding details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Clinic Email" value={selectedLocation.email} disabled />
                    <Input label="Clinic Phone" value={selectedLocation.phone} disabled />
                  </div>
                  <Input label="Street Address" value={selectedLocation.address} disabled />
                  <Input label="Operational Hours" value={selectedLocation.hours} disabled />
                  <p className="text-[10px] text-slate-500 italic mt-2.5">
                    Note: To edit physical addresses, pricing structures, or add services, contact headquarters branding controllers via Command Center.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Clinical Practitioner Roster</CardTitle>
                  <CardDescription>Active specialists scheduled at this clinic.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedLocation.providers.map((p: any) => (
                    <div key={p.id} className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs">
                        {p.name.split(' ').pop()?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">{p.name}, {p.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{p.specialty}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </main>

      {/* Reply response editor Modal */}
      {replyingReview && (
        <Modal
          isOpen={true}
          onClose={() => setReplyingReview(null)}
          title="Compose Clinic Response"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg text-xs text-slate-400 italic">
              "{replyingReview.content}"
            </div>
            
            <Textarea 
              label="Staff response reply"
              value={draftReply}
              onChange={(e) => setDraftReply(e.target.value)}
              rows={4}
            />

            <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
              <Button variant="ghost" onClick={() => setReplyingReview(null)} className="text-slate-400">
                Cancel
              </Button>
              <Button onClick={handleSendReply} disabled={submittingReply}>
                {submittingReply ? 'Sending...' : 'Publish Response'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}

export default function ClinicManagerPortal() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-teal-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading clinic manager portal...</span>
      </div>
    }>
      <ClinicManagerPortalContent />
    </Suspense>
  );
}
