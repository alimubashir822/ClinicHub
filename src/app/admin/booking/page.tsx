'use client';

import React, { useState, useEffect } from 'react';
import { getLocations, createAppointment, getGlobalServices } from '@/app/actions';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Badge,
  Input,
  Select,
  Button
} from '@/components/ui';
import { 
  Calendar, 
  Activity, 
  Search, 
  Users, 
  Clock, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Navigation,
  CheckCircle,
  RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SmartBookingNetwork() {
  const [locations, setLocations] = useState<any[]>([]);
  const [globalServices, setGlobalServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Patient Simulator States
  const [serviceId, setServiceId] = useState('');
  const [zipInput, setZipInput] = useState('');
  const [matchingClinics, setMatchingClinics] = useState<any[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<any | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  async function loadData() {
    setLoading(true);
    const locs = await getLocations();
    const servs = await getGlobalServices();
    setLocations(locs);
    setGlobalServices(servs);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSearchClinics = () => {
    if (!serviceId) {
      alert("Please select a specialty treatment first.");
      return;
    }

    // Filter clinics that offer this service
    const filtered = locations.filter(loc => 
      loc.services.some((s: any) => s.serviceId === serviceId)
    );
    setMatchingClinics(filtered);
    setSelectedClinic(null);
    setSelectedProvider(null);
  };

  const handleSelectClinic = (clinic: any) => {
    setSelectedClinic(clinic);
    setSelectedProvider(null);
  };

  const handleSelectProvider = (prov: any) => {
    setSelectedProvider(prov);
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientEmail || !patientPhone || !selectedDate || !selectedTime) {
      alert("Please complete appointment slot & details.");
      return;
    }
    setSubmittingBooking(true);
    try {
      const res = await createAppointment({
        patientName,
        patientEmail,
        patientPhone,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        serviceId,
        providerId: selectedProvider.id,
        locationId: selectedClinic.id
      });

      if (res.success) {
        confetti({
          particleCount: 120,
          spread: 60,
          origin: { y: 0.7 }
        });
        setBookingSuccess(true);
        loadData(); // reload statistics
      }
    } catch (err) {
      console.error(err);
      alert("Booking simulation failed.");
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleResetSimulator = () => {
    setServiceId('');
    setZipInput('');
    setMatchingClinics([]);
    setSelectedClinic(null);
    setSelectedProvider(null);
    setSelectedDate('');
    setSelectedTime('');
    setPatientName('');
    setPatientEmail('');
    setPatientPhone('');
    setBookingSuccess(false);
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-teal-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading booking network engine...</span>
      </div>
    );
  }

  // Calculate network totals
  let networkAppointmentsCount = 0;
  locations.forEach(l => {
    networkAppointmentsCount += l.appointments.length;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-6 h-6 text-teal-400" /> Smart Booking Network
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Simulate multi-clinic availability load, configure specialty search parameters, and analyze routing conversions.
        </p>
      </div>

      {/* Network KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-4 bg-teal-950/45 border border-teal-900/50 rounded-xl text-teal-400">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Network Bookings</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-0.5">{networkAppointmentsCount} Scheduled</h3>
              <p className="text-[10px] text-slate-400 mt-1">Across {locations.length} active locations</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-4 bg-indigo-950/45 border border-indigo-900/50 rounded-xl text-indigo-400">
              <Navigation className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Proximity Match Rate</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-0.5">92.4%</h3>
              <p className="text-[10px] text-emerald-400 mt-1 font-bold">Optimal ZIP codes mapping</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-4 bg-emerald-950/45 border border-emerald-900/50 rounded-xl text-emerald-400">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Scheduling Utilization</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-0.5">64% Capacity</h3>
              <p className="text-[10px] text-slate-400 mt-1">Available roster slots</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Booking Flow Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Simulator Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-teal-900/35 bg-gradient-to-b from-slate-900/40 to-teal-950/5">
            <CardHeader>
              <CardTitle className="text-md font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" /> Patient Routing Simulator
              </CardTitle>
              <CardDescription className="text-xs">
                Simulate optimal location search and bookings routing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              
              {bookingSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                  <div>
                    <h4 className="text-lg font-bold text-white">Simulation Booking Confirmed!</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      The patient request was routed to <strong>{selectedClinic.name}</strong> under <strong>Dr. {selectedProvider.name}</strong>. Database analytics record created.
                    </p>
                  </div>
                  <Button onClick={handleResetSimulator}>Run Another Booking Simulation</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Step 1: Specialty & ZIP */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2">
                      <Select
                        label="1. Choose Specialty Treatment Service"
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        options={globalServices.map(s => ({ value: s.id, label: `${s.category}: ${s.name} ($${s.price})` }))}
                      />
                    </div>
                    <div>
                      <Input
                        label="Location ZIP Code (Opt)"
                        value={zipInput}
                        onChange={(e) => setZipInput(e.target.value)}
                        placeholder="e.g. 78701"
                        className="mb-0"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <Button onClick={handleSearchClinics} size="sm" className="flex items-center gap-1">
                      <Search className="w-4 h-4" /> Locate Providers & Clinics
                    </Button>
                  </div>

                  {/* Step 2: Clinic Location match list */}
                  {matchingClinics.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-slate-900 animate-in fade-in duration-200">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">2. Nearest Clinic Match Recommendations</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {matchingClinics.map((clinic) => {
                          const active = selectedClinic?.id === clinic.id;
                          return (
                            <div 
                              key={clinic.id}
                              onClick={() => handleSelectClinic(clinic)}
                              className={`p-3 border rounded-xl cursor-pointer transition select-none flex flex-col justify-between ${
                                active 
                                  ? 'border-teal-500 bg-teal-950/20 text-slate-100 shadow' 
                                  : 'border-slate-800 hover:border-slate-750 bg-slate-900/30 text-slate-400'
                              }`}
                            >
                              <div>
                                <h4 className="text-xs font-bold text-slate-200 truncate">{clinic.name}</h4>
                                <p className="text-[10px] text-slate-500 mt-1">{clinic.address}, {clinic.city}</p>
                              </div>
                              <div className="mt-3 flex items-center justify-between border-t border-slate-950 pt-2 text-[10px]">
                                <span className="font-semibold text-teal-400">Score: {clinic.growthScore}%</span>
                                <span>{clinic.providers.length} Doctors</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Provider selection */}
                  {selectedClinic && (
                    <div className="space-y-3 pt-4 border-t border-slate-900 animate-in fade-in duration-200">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">3. Select Doctor & Compare Schedules</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedClinic.providers.map((p: any) => {
                          const active = selectedProvider?.id === p.id;
                          return (
                            <div
                              key={p.id}
                              onClick={() => handleSelectProvider(p)}
                              className={`p-3 border rounded-xl cursor-pointer transition flex gap-3 items-center select-none ${
                                active ? 'border-teal-500 bg-teal-950/20 shadow' : 'border-slate-800 bg-slate-900/30'
                              }`}
                            >
                              <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs shrink-0 text-slate-350">
                                {p.name.split(' ').pop()?.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-200">{p.name}, {p.title}</h4>
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{p.specialty}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Schedule slot & Details form */}
                  {selectedProvider && (
                    <form onSubmit={handleBookSubmit} className="space-y-4 pt-4 border-t border-slate-900 animate-in fade-in duration-200">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">4. Patient details & Schedule slot</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input 
                          label="Appointment Date" 
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          required
                        />
                        <Select 
                          label="Available Hours Slot"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          options={[
                            { value: '09:00 AM', label: '09:00 AM' },
                            { value: '10:30 AM', label: '10:30 AM' },
                            { value: '01:00 PM', label: '01:00 PM' },
                            { value: '02:30 PM', label: '02:30 PM' },
                            { value: '04:15 PM', label: '04:15 PM' }
                          ]}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Input 
                          label="Patient Name"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          required
                          placeholder="John Connor"
                        />
                        <Input 
                          label="Patient Email"
                          type="email"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          required
                          placeholder="john@connor.com"
                        />
                        <Input 
                          label="Patient Phone"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          required
                          placeholder="(512) 555-1984"
                        />
                      </div>

                      <div className="text-right border-t border-slate-950 pt-4">
                        <Button type="submit" disabled={submittingBooking}>
                          {submittingBooking ? 'Routing...' : 'Confirm Simulation Appointment'}
                        </Button>
                      </div>

                    </form>
                  )}

                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Network Load Monitor */}
        <div className="space-y-6">
          
          {/* load balancer widget */}
          <Card>
            <CardHeader>
              <CardTitle>Network Availability Load Monitor</CardTitle>
              <CardDescription>Reroute incoming search demands to clinics with lower roster load.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {locations.map((loc) => {
                const apptsCount = loc.appointments.length;
                const loadPercent = Math.min((apptsCount / 12) * 100, 100);
                
                return (
                  <div key={loc.id} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-350">
                      <span className="truncate max-w-[170px]">{loc.name}</span>
                      <span className={loadPercent > 80 ? 'text-rose-400' : loadPercent > 40 ? 'text-amber-400' : 'text-emerald-400'}>
                        {apptsCount} Slots ({Math.round(loadPercent)}% Load)
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 border border-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-350 ${
                        loadPercent > 80 ? 'bg-rose-600' : loadPercent > 40 ? 'bg-amber-600' : 'bg-emerald-600'
                      }`} style={{ width: `${loadPercent}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}
