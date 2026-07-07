import React from 'react';
import { getLocations, getOrganization, getReviews, getAppointments } from '@/app/actions';
import AdvisorClient from './advisor-client';

export const dynamic = 'force-dynamic';

export default async function AdvisorPage() {
  const org = await getOrganization();
  const locations = await getLocations();
  const reviews = await getReviews();
  const appointments = await getAppointments();

  // Prepare database summaries to seed the client-side mock-ai engine
  const clinicsSummary = locations.map(l => {
    const visits = l.analytics.reduce((acc, curr) => acc + curr.visitors, 0);
    const bookings = l.analytics.reduce((acc, curr) => acc + curr.bookings, 0);
    const rate = visits > 0 ? ((bookings / visits) * 100).toFixed(1) : '0';
    return {
      name: l.name,
      city: l.city,
      regionName: l.region?.name || 'Unassigned',
      visits,
      bookings,
      rate,
      score: l.growthScore,
      seo: l.seoScore,
      bookingScore: l.bookingScore,
      reviewScore: l.reviewScore,
      contentScore: l.contentScore,
      patientScore: l.patientScore
    };
  });

  const reviewsSummary = reviews.slice(0, 10).map(r => ({
    clinic: r.location.name,
    patient: r.patientName,
    rating: r.rating,
    content: r.content
  }));

  const appointmentsSummary = appointments.slice(0, 10).map(a => ({
    clinic: a.location.name,
    patient: a.patientName,
    service: a.service.name,
    status: a.status
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <span>🧬</span> AI Franchise CEO Advisor
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Ask strategic, executive-level questions about clinic performances, regional conversion disparities, and expansion opportunities.
        </p>
      </div>

      <AdvisorClient 
        orgName={org?.name || 'CareGroup Health'}
        clinics={clinicsSummary}
        reviews={reviewsSummary}
        appointments={appointmentsSummary}
      />
    </div>
  );
}
