import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocationBySlug, incrementProviderViews } from '@/app/actions';
import { Badge, Card, CardContent, Button } from '@/components/ui';
import { ArrowLeft, Calendar, ShieldCheck, Mail, Sparkles, Heart, Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProviderBioPage({
  params,
}: {
  params: Promise<{ slug: string; providerId: string }>;
}) {
  const { slug, providerId } = await params;
  const location = await getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const provider = location.providers.find(p => p.id === providerId);
  if (!provider) {
    notFound();
  }

  // Increment profile view count on page render (Server-side increment!)
  const updatedProvider = await incrementProviderViews(providerId);
  const profileViews = updatedProvider ? updatedProvider.profileViews : provider.profileViews;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-in fade-in duration-200">
      
      {/* Back button */}
      <div>
        <Link href={`/sites/${slug}`} className="text-xs text-slate-500 hover:text-slate-350 flex items-center gap-1.5 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Clinic Home
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card left */}
        <div className="md:col-span-1 space-y-4">
          <Card className="text-center p-6 bg-slate-900/40 border-slate-800">
            <CardContent className="space-y-4 pt-4">
              <div className="w-24 h-24 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center mx-auto text-3xl text-slate-400 font-bold uppercase shadow-inner">
                {provider.name.split(' ').pop()?.charAt(0)}
              </div>
              
              <div>
                <h3 className="text-md font-extrabold text-white">{provider.name}</h3>
                <p className="text-xs text-slate-400 font-medium">{provider.title} • Specialist</p>
                <Badge variant="info" className="mt-2 text-[9px] bg-teal-950/40 text-teal-400 border-teal-900/50">
                  {provider.specialty}
                </Badge>
              </div>

              <div className="pt-3 border-t border-slate-900 text-slate-500 text-[10px] flex items-center justify-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-600" /> {profileViews} Views
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> Verified
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="p-4 text-xs text-slate-500 bg-slate-900/10">
            <p className="flex items-center gap-1.5 font-semibold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-teal-500" /> HIPAA Secure Scheduling
            </p>
            <p className="mt-1 leading-relaxed text-[10px]">
              Direct provider booking is encrypted. Personal medical records are fully decoupled from local scheduling logs.
            </p>
          </Card>
        </div>

        {/* Biography Content right */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 md:p-8 bg-slate-900/30">
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Biography & Clinical Background</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {provider.bio}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Dr. {provider.name.split(' ').pop()} has a long-standing history of medical achievement and leads clinical protocols for {provider.specialty} at our {location.city} clinic. He participates in annual medical network forums hosted by {location.name}'s parent corporate brand CareGroup Health.
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-900">
                <h4 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Practice Focus & Specialties</h4>
                <div className="flex gap-2 flex-wrap text-xs text-slate-400">
                  <span className="px-2.5 py-1 bg-slate-950 border border-slate-850 rounded-lg">✓ Patient Consultation</span>
                  <span className="px-2.5 py-1 bg-slate-950 border border-slate-850 rounded-lg">✓ Diagnostics & Treatment</span>
                  <span className="px-2.5 py-1 bg-slate-950 border border-slate-850 rounded-lg">✓ Local Health Education</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-450">
                  <p className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-650" /> {provider.email}
                  </p>
                </div>
                
                <Link href={`/sites/${slug}/booking?provider=${provider.id}`}>
                  <button className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-teal-900/20">
                    <Calendar className="w-4 h-4" /> Book Appointment with {provider.name.split(' ').pop()}
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
