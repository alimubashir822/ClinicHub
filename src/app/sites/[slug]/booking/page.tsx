'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { getLocationBySlug, createAppointment } from '@/app/actions';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Badge,
  Input,
  Textarea,
  Button
} from '@/components/ui';
import { 
  Calendar, 
  User, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  ArrowLeft,
  RefreshCw,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TIMESLOTS = [
  '09:00 AM',
  '10:30 AM',
  '11:15 AM',
  '01:00 PM',
  '02:30 PM',
  '03:45 PM',
  '04:15 PM'
];

function BookingPageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const initialServiceId = searchParams.get('service');
  const initialProviderId = searchParams.get('provider');

  const [location, setLocation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1); // 1: Service, 2: Provider, 3: Date/Time, 4: Info, 5: Confirmed

  // Selection state
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Patient details state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadClinic() {
      setLoading(true);
      const data = await getLocationBySlug(slug);
      if (data) {
        setLocation(data);
        
        // Auto-select initial query params if present
        if (initialServiceId) {
          const s = data.services.find((x: any) => x.serviceId === initialServiceId)?.service;
          if (s) setSelectedService(s);
        }
        if (initialProviderId) {
          const p = data.providers.find((x: any) => x.id === initialProviderId);
          if (p) setSelectedProvider(p);
        }

        // If both present, fast track to Step 3 (Date selection)
        if (initialServiceId && initialProviderId) {
          setBookingStep(3);
        } else if (initialServiceId) {
          setBookingStep(2);
        }
      }
      setLoading(false);
    }
    loadClinic();
  }, [slug, initialServiceId, initialProviderId]);

  const handleSelectService = (s: any) => {
    setSelectedService(s);
    setBookingStep(2);
  };

  const handleSelectProvider = (p: any) => {
    setSelectedProvider(p);
    setBookingStep(3);
  };

  const handleSelectSlot = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setBookingStep(4);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert("Please fill in contact credentials.");
      return;
    }
    setSubmitting(true);
    try {
      await createAppointment({
        patientName: name,
        patientEmail: email,
        patientPhone: phone,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        serviceId: selectedService.id,
        providerId: selectedProvider.id,
        locationId: location.id,
        notes
      });

      // Confetti splash!
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });

      setBookingStep(5);
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-950">
        <RefreshCw className="w-8 h-8 text-teal-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading scheduler engine...</span>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-950 text-slate-400">
        Clinic location not found.
      </div>
    );
  }

  // Pre-generate next 4 business dates (excluding Sunday)
  const getAvailableDates = () => {
    const dates = [];
    let d = new Date();
    while (dates.length < 4) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) { // Skip Sundays
        dates.push({
          val: d.toISOString().split('T')[0],
          label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        });
      }
    }
    return dates;
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-in fade-in duration-200">
      
      {/* Header Info */}
      <div className="text-center mb-10 space-y-2">
        <Badge variant="info" className="bg-teal-950/45 text-teal-400 border-teal-800">
          Smart Booking Network
        </Badge>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">Schedule Clinical Care</h2>
        <p className="text-xs text-slate-400">Secure your appointment in real time at {location.name}.</p>
      </div>

      {/* Step Indicators */}
      {bookingStep < 5 && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-900 mb-8 text-[11px] text-slate-400 font-medium">
          <span className={bookingStep >= 1 ? 'text-teal-400 font-bold' : ''}>1. Service</span>
          <ArrowRight className="w-3 h-3 text-slate-700" />
          <span className={bookingStep >= 2 ? 'text-teal-400 font-bold' : ''}>2. Practitioner</span>
          <ArrowRight className="w-3 h-3 text-slate-700" />
          <span className={bookingStep >= 3 ? 'text-teal-400 font-bold' : ''}>3. Time Slot</span>
          <ArrowRight className="w-3 h-3 text-slate-700" />
          <span className={bookingStep >= 4 ? 'text-teal-400 font-bold' : ''}>4. Details</span>
        </div>
      )}

      {/* Step 1: Select Service */}
      {bookingStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Choose Treatment Service</h3>
          <div className="grid grid-cols-1 gap-3">
            {location.services.map(({ service }: any) => (
              <div 
                key={service.id}
                onClick={() => handleSelectService(service)}
                className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 rounded-xl cursor-pointer hover:border-slate-700 transition duration-150 flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <Badge variant="secondary" className="bg-slate-950 text-[10px]">{service.category}</Badge>
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition mt-1">{service.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{service.description}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-extrabold text-white">${service.price}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{service.duration} mins</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select Provider */}
      {bookingStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Select Medical Specialist</h3>
            <button onClick={() => setBookingStep(1)} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-0.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Services
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {location.providers.map((prov: any) => (
              <div 
                key={prov.id}
                onClick={() => handleSelectProvider(prov)}
                className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 rounded-xl cursor-pointer hover:border-slate-700 transition duration-150 flex gap-4 items-start group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center font-bold text-slate-400 shrink-0 text-sm">
                  {prov.name.split(' ').pop()?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition">{prov.name}, {prov.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{prov.specialty}</p>
                  <p className="text-[10px] text-slate-450 mt-2 line-clamp-2">{prov.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Choose Date & Time */}
      {bookingStep === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Select Date & Time</h3>
            <button onClick={() => {
              if (initialServiceId && initialProviderId) {
                setBookingStep(1); // can reset both
              } else {
                setBookingStep(2);
              }
            }} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-0.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Selected Summary Card */}
            <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-xl space-y-4 h-fit text-xs text-slate-400">
              <p className="font-bold text-slate-300">Appointment Selection</p>
              
              <div className="space-y-1 border-b border-slate-950 pb-3">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Selected Service</p>
                <p className="font-semibold text-slate-250">{selectedService?.name}</p>
                <p className="text-[10px] text-teal-400 font-bold">${selectedService?.price} • {selectedService?.duration} mins</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Selected Specialist</p>
                <p className="font-semibold text-slate-250">{selectedProvider?.name}, {selectedProvider?.title}</p>
                <p className="text-[10px] text-slate-500">{selectedProvider?.specialty}</p>
              </div>
            </div>

            {/* Date and Time Selector columns */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">1. Select Appointment Date</p>
                <div className="grid grid-cols-2 gap-2">
                  {getAvailableDates().map((d) => (
                    <button
                      key={d.val}
                      onClick={() => {
                        setSelectedDate(d.val);
                        setSelectedTime(''); // reset time slot
                      }}
                      className={`p-3 text-xs font-semibold rounded-lg border text-center transition ${
                        selectedDate === d.val 
                          ? 'bg-teal-950/40 border-teal-500 text-teal-300' 
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div className="animate-in fade-in duration-150">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">2. Select Time Slot</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {TIMESLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleSelectSlot(selectedDate, time)}
                        className="p-2.5 text-xs font-medium rounded-lg bg-slate-900/60 hover:bg-slate-950 border border-slate-800 hover:border-teal-500 text-slate-350 hover:text-white transition flex items-center justify-center gap-1"
                      >
                        <Clock className="w-3 h-3 text-slate-500" /> {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Step 4: Patient Info Form */}
      {bookingStep === 4 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Patient Contact credentials</h3>
            <button onClick={() => setBookingStep(3)} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-0.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Time Slots
            </button>
          </div>

          <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Form Fields */}
            <div className="md:col-span-2 space-y-4">
              <Input 
                label="Full Patient Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Sarah Connor"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. sarah@connor.com"
                />
                <Input 
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="e.g. (512) 555-1984"
                />
              </div>

              <Textarea 
                label="Appointment Notes / Symptoms (Optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Routine consultation check-up."
              />

              <div className="pt-2 flex items-center justify-between border-t border-slate-900">
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Patient data protected under HIPAA compliance regulations.
                </p>
                
                <Button type="submit" disabled={submitting} className="shadow-lg shadow-teal-500/25">
                  {submitting ? 'Confirming Appointment...' : 'Schedule Appointment'}
                </Button>
              </div>
            </div>

            {/* Selection Summary */}
            <div className="bg-slate-900/50 p-4 border border-slate-850 rounded-xl space-y-4 h-fit text-xs text-slate-400">
              <p className="font-bold text-slate-350">Booking summary</p>
              
              <div className="space-y-1.5 pb-3 border-b border-slate-950">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Clinic Location</p>
                <p className="font-semibold text-slate-200">{location.name}</p>
                <p className="text-[10px] text-slate-550">{location.address}, {location.city}</p>
              </div>

              <div className="space-y-1 pb-3 border-b border-slate-950">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Scheduled Appointment</p>
                <p className="font-semibold text-teal-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {selectedDate}
                </p>
                <p className="font-semibold text-teal-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" /> {selectedTime}
                </p>
              </div>

              <div className="space-y-1 text-slate-400">
                <p className="text-slate-300"><span className="font-bold text-slate-200">Doctor:</span> {selectedProvider?.name}</p>
                <p className="text-slate-300 mt-1"><span className="font-bold text-slate-200">Service:</span> {selectedService?.name}</p>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* Step 5: Confirmed view */}
      {bookingStep === 5 && (
        <Card className="max-w-md mx-auto text-center border-teal-800 bg-gradient-to-b from-slate-900/60 to-teal-950/10 shadow-2xl p-8 relative overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Confetti decoration circles */}
          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-teal-500/10 blur-xl" />
          <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl" />

          <CardContent className="space-y-6 pt-6">
            <div className="w-16 h-16 rounded-full bg-teal-950 border border-teal-800 flex items-center justify-center mx-auto text-teal-400 text-2xl shadow-lg shadow-teal-950/50">
              ✓
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Appointment Confirmed!</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Thank you, <span className="font-bold text-slate-250">{name}</span>. Your appointment has been secured in our system at <span className="font-bold text-slate-250">{location.name}</span>.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl text-xs text-left space-y-2 text-slate-400">
              <p><span className="text-slate-500">Practitioner:</span> <span className="font-bold text-slate-300">{selectedProvider?.name}, {selectedProvider?.title}</span></p>
              <p><span className="text-slate-500">Service:</span> <span className="font-bold text-slate-300">{selectedService?.name}</span></p>
              <p><span className="text-slate-500">Date/Time:</span> <span className="font-bold text-teal-400">{selectedDate} at {selectedTime}</span></p>
            </div>

            <p className="text-[10px] text-slate-500 italic leading-relaxed">
              We've dispatched a HIPAA-secure text/email confirmation and reminder alerts for your schedule slot.
            </p>

            <div className="pt-2">
              <Button onClick={() => router.replace(`/sites/${slug}`)} className="w-full">
                Return to Clinic Home
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-950">
        <RefreshCw className="w-8 h-8 text-teal-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading scheduler engine...</span>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}
