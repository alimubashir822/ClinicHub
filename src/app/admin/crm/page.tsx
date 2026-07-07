'use client';

import React, { useState, useEffect } from 'react';
import { getLeads, updateLeadStatus, createLead } from '@/app/actions';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Badge,
  Input,
  Textarea,
  Select,
  Button,
  Modal
} from '@/components/ui';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  RefreshCw, 
  ChevronRight,
  TrendingUp,
  Mail,
  Phone
} from 'lucide-react';

const STAGES = [
  { id: 'VISITOR', label: 'Website Visitors', color: 'border-slate-800 bg-slate-900/10 text-slate-400', icon: <Plus className="w-4 h-4" /> },
  { id: 'LEAD', label: 'Active Leads (Inquiries)', color: 'border-amber-900/30 bg-amber-950/5 text-amber-400', icon: <MessageSquare className="w-4 h-4 text-amber-500" /> },
  { id: 'APPOINTMENT', label: 'Scheduled Appointments', color: 'border-indigo-900/30 bg-indigo-950/5 text-indigo-400', icon: <Calendar className="w-4 h-4 text-indigo-500" /> },
  { id: 'PATIENT', label: 'Converted Patients', color: 'border-emerald-900/30 bg-emerald-950/5 text-emerald-400', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> }
];

export default function CRMPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLead, setActiveLead] = useState<any | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStatus, setNewStatus] = useState('LEAD');
  const [newSource, setNewSource] = useState('WEBSITE');
  const [newNotes, setNewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadLeads() {
    setLoading(true);
    const data = await getLeads();
    setLeads(data);
    setLoading(false);
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const handleStageChange = async (leadId: string, newStage: string) => {
    try {
      await updateLeadStatus(leadId, newStage);
      loadLeads();
      if (activeLead && activeLead.id === leadId) {
        setActiveLead((prev: any) => ({ ...prev, status: newStage }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createLead({
        name: newName,
        email: newEmail,
        phone: newPhone,
        status: newStatus,
        source: newSource,
        notes: newNotes
      });
      setIsAddOpen(false);
      // Reset form
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      setNewStatus('LEAD');
      setNewSource('WEBSITE');
      setNewNotes('');
      loadLeads();
    } catch (err) {
      console.error(err);
      alert("Failed to create lead");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-teal-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading patient CRM database...</span>
      </div>
    );
  }

  // Group leads by status
  const groupedLeads: Record<string, any[]> = {
    VISITOR: [],
    LEAD: [],
    APPOINTMENT: [],
    PATIENT: []
  };
  leads.forEach(l => {
    if (groupedLeads[l.status]) {
      groupedLeads[l.status].push(l);
    } else {
      groupedLeads.LEAD.push(l); // fallback
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-400" /> Patient Acquisition CRM
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track lead status from initial clinic website visit to scheduled appointment, check-in, and conversion.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Manual Lead
        </Button>
      </div>

      {/* Funnel Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/30 p-4 border border-slate-900 rounded-xl">
        {STAGES.map((st) => (
          <div key={st.id} className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{st.label}</p>
              <h4 className="text-xl font-bold text-slate-200 mt-1">{groupedLeads[st.id].length} patients</h4>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg">
              {st.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {STAGES.map((stage) => {
          const stageLeads = groupedLeads[stage.id] || [];
          return (
            <div key={stage.id} className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" style={{
                    backgroundColor: stage.id === 'VISITOR' ? '#475569' :
                                     stage.id === 'LEAD' ? '#d97706' :
                                     stage.id === 'APPOINTMENT' ? '#4f46e5' : '#10b981'
                  }} />
                  <span className="text-xs font-bold text-slate-300">{stage.label}</span>
                </div>
                <Badge variant="secondary" className="px-1.5 py-0">
                  {stageLeads.length}
                </Badge>
              </div>

              {/* Leads Card Container */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {stageLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    onClick={() => setActiveLead(lead)}
                    className="p-4 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition duration-150 group relative overflow-hidden"
                  >
                    {/* Source badge indicator */}
                    <span className="absolute top-0 right-0 text-[8px] font-bold uppercase px-1.5 py-0.5 bg-slate-950 border-l border-b border-slate-800 rounded-bl text-slate-500">
                      {lead.source}
                    </span>

                    <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition">
                      {lead.name}
                    </h4>

                    <div className="mt-2 space-y-1 text-[11px] text-slate-400">
                      <p className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" /> {lead.email}
                      </p>
                      {lead.phone && (
                        <p className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" /> {lead.phone}
                        </p>
                      )}
                    </div>

                    {lead.notes && (
                      <p className="text-[10px] text-slate-500 italic mt-2.5 truncate">
                        "{lead.notes}"
                      </p>
                    )}

                    {/* Progress action */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-950 pt-2.5">
                      <span className="text-[9px] text-slate-500">
                        Added {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                      
                      {stage.id !== 'PATIENT' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextStage = stage.id === 'VISITOR' ? 'LEAD' :
                                              stage.id === 'LEAD' ? 'APPOINTMENT' : 'PATIENT';
                            handleStageChange(lead.id, nextStage);
                          }}
                          className="text-[9px] font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-0.5"
                        >
                          Promote <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="py-8 text-center border border-dashed border-slate-900 rounded-xl text-slate-600 text-xs">
                    No patients at this stage.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details / Action Modal */}
      {activeLead && (
        <Modal 
          isOpen={true} 
          onClose={() => setActiveLead(null)} 
          title="Patient Lead Profile"
          size="md"
        >
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold text-slate-100">{activeLead.name}</h4>
                <Badge variant={
                  activeLead.status === 'PATIENT' ? 'success' :
                  activeLead.status === 'APPOINTMENT' ? 'info' :
                  activeLead.status === 'LEAD' ? 'warning' : 'neutral'
                }>
                  Stage: {activeLead.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">Lead ID: {activeLead.id}</p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Credentials</h5>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500">Email Address</p>
                  <p className="font-semibold text-slate-200 mt-0.5">{activeLead.email}</p>
                </div>
                <div>
                  <p className="text-slate-500">Phone Number</p>
                  <p className="font-semibold text-slate-200 mt-0.5">{activeLead.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Marketing Source</p>
                  <p className="font-semibold text-slate-200 mt-0.5 uppercase">{activeLead.source}</p>
                </div>
                <div>
                  <p className="text-slate-500">Inquiry Date</p>
                  <p className="font-semibold text-slate-200 mt-0.5">{new Date(activeLead.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient History & AI Notes</label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 min-h-16">
                {activeLead.notes || "No custom logs recorded. Patient initiated session via public site template."}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-5 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                {activeLead.status !== 'VISITOR' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const prevMap: Record<string, string> = { LEAD: 'VISITOR', APPOINTMENT: 'LEAD', PATIENT: 'APPOINTMENT' };
                      handleStageChange(activeLead.id, prevMap[activeLead.status]);
                    }}
                  >
                    Demote Stage
                  </Button>
                )}
                {activeLead.status !== 'PATIENT' && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => {
                      const nextMap: Record<string, string> = { VISITOR: 'LEAD', LEAD: 'APPOINTMENT', APPOINTMENT: 'PATIENT' };
                      handleStageChange(activeLead.id, nextMap[activeLead.status]);
                    }}
                  >
                    Promote Stage
                  </Button>
                )}
              </div>

              <Button variant="ghost" size="sm" onClick={() => setActiveLead(null)} className="text-slate-400 hover:text-white">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Manual Lead Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Patient Lead"
        size="md"
      >
        <form onSubmit={handleAddLeadSubmit} className="space-y-4">
          <Input 
            label="Patient Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            placeholder="e.g. John Miller"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              placeholder="e.g. john@miller.com"
            />
            <Input 
              label="Phone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="e.g. (512) 555-0922"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Initial Funnel Stage"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              options={[
                { value: 'VISITOR', label: 'Website Visitor' },
                { value: 'LEAD', label: 'Active Lead' },
                { value: 'APPOINTMENT', label: 'Scheduled Appointment' },
                { value: 'PATIENT', label: 'Converted Patient' }
              ]}
            />
            <Select 
              label="Marketing Source"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              options={[
                { value: 'WEBSITE', label: 'Public Site Form' },
                { value: 'CHAT', label: 'AI Chatbot Inquire' },
                { value: 'BOOKING', label: 'Direct Online Schedule' },
                { value: 'MANUAL', label: 'HQ Call In' }
              ]}
            />
          </div>

          <Textarea 
            label="Inquiry / Symptoms Notes"
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            placeholder="e.g. Inquiring about dental implants pricing plan."
          />

          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="text-slate-400">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Adding...' : 'Create Lead record'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
