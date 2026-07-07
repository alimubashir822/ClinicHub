'use client';

import React, { useState } from 'react';
import { createRegion, updateRegion, deleteRegion } from '@/app/actions';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Badge,
  Input,
  Button,
  Modal
} from '@/components/ui';
import { 
  Globe, 
  Shield, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  Sparkles, 
  Lock, 
  Users, 
  UserCheck, 
  MapPin,
  RefreshCw 
} from 'lucide-react';

interface RegionItem {
  id: string;
  name: string;
  managerName?: string | null;
  managerEmail?: string | null;
}

interface RegionsClientProps {
  initialRegions: RegionItem[];
}

const ROLES_PERMISSIONS = [
  {
    role: 'Corporate Headquarters',
    color: 'border-teal-500 text-teal-400 bg-teal-950/25',
    desc: 'Full administrative access to the entire franchise network.',
    perms: [
      { action: 'Global Brand Identity Control (Colors, fonts, logos)', allowed: true },
      { action: 'Provision New Locations & Subdomains', allowed: true },
      { action: 'Global Service Catalog Pricing & Injections', allowed: true },
      { action: 'Network Booking Route Configuration', allowed: true },
      { action: 'Audit Brand Compliance Scanner', allowed: true },
      { action: 'Local Clinic Layout Editing', allowed: false, comment: 'Delegated to Clinic Managers' }
    ]
  },
  {
    role: 'Regional Manager',
    color: 'border-indigo-500 text-indigo-400 bg-indigo-950/25',
    desc: 'Manages compliance, performance, and clinics in assigned territory.',
    perms: [
      { action: 'View Regional Analytics & CRM Conversions', allowed: true },
      { action: 'Resolve Local Compliance Styling/Claim alerts', allowed: true },
      { action: 'Reroute Booking Traffic within territory', allowed: true },
      { action: 'Approve Local Content custom pages', allowed: true },
      { action: 'Global Brand Identity Control', allowed: false },
      { action: 'Provision New Locations', allowed: false }
    ]
  },
  {
    role: 'Clinic Location Manager',
    color: 'border-amber-500 text-amber-400 bg-amber-950/25',
    desc: 'Controls single-clinic details, booking slots, and review responses.',
    perms: [
      { action: 'Toggle Website Blocks & Local Headlines', allowed: true },
      { action: 'Respond to Local Patient Reviews with AI drafts', allowed: true },
      { action: 'Manage Clinic Hours & Local Announcements', allowed: true },
      { action: 'Edit Provider Rosters & Rota Schedules', allowed: true },
      { action: 'Global Branding Color override', allowed: false },
      { action: 'Change Global Service Pricing catalog', allowed: false }
    ]
  },
  {
    role: 'Healthcare Provider',
    color: 'border-slate-600 text-slate-300 bg-slate-900/40',
    desc: 'Medical practitioners and clinical staff listings.',
    perms: [
      { action: 'View Scheduled Appointment Roster', allowed: true },
      { action: 'Update Personal Biography & specialty description', allowed: true },
      { action: 'Synchronize EHR Consultation logs', allowed: true },
      { action: 'Adjust local clinic hours settings', allowed: false },
      { action: 'Publish review responses', allowed: false }
    ]
  }
];

export default function RegionsClient({ initialRegions }: RegionsClientProps) {
  const [regions, setRegions] = useState<RegionItem[]>(initialRegions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<RegionItem | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // RBAC active tab
  const [activeRoleIdx, setActiveRoleIdx] = useState(0);

  const handleOpenCreate = () => {
    setEditingRegion(null);
    setName('');
    setManagerName('');
    setManagerEmail('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (reg: RegionItem) => {
    setEditingRegion(reg);
    setName(reg.name);
    setManagerName(reg.managerName || '');
    setManagerEmail(reg.managerEmail || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      if (editingRegion) {
        const res = await updateRegion(editingRegion.id, {
          name,
          managerName: managerName || undefined,
          managerEmail: managerEmail || undefined
        });
        if (res.success) {
          setRegions(prev => prev.map(r => r.id === editingRegion.id ? res.region : r));
        }
      } else {
        const res = await createRegion({
          name,
          managerName: managerName || undefined,
          managerEmail: managerEmail || undefined
        });
        if (res.success) {
          setRegions(prev => [...prev, res.region]);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save region");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this territory? All assigned locations will lose regional links.")) return;
    try {
      const res = await deleteRegion(id);
      if (res.success) {
        setRegions(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete region");
    }
  };

  const currentRole = ROLES_PERMISSIONS[activeRoleIdx];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      
      {/* 1. Regions Management Card */}
      <Card className="border-slate-850 bg-slate-950/40">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-md font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-teal-400" /> Regional Territory Matrix
            </CardTitle>
            <CardDescription className="text-xs">
              Assign Regional Managers to oversee compliance and clinic conversion rates.
            </CardDescription>
          </div>
          <Button size="sm" onClick={handleOpenCreate} className="h-8 px-2 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> New Territory
          </Button>
        </CardHeader>
        <CardContent className="p-0 max-h-96 overflow-y-auto">
          <div className="overflow-x-auto w-full scrollbar-none">
            <table className="w-full text-left border-collapse min-w-[450px]">
            <thead>
              <tr className="bg-slate-900/40 text-[9px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-900">
                <th className="px-4 py-2.5">Territory</th>
                <th className="px-4 py-2.5">Assigned Manager</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-xs text-slate-450">
              {regions.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-900/10 group">
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-200">{reg.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    {reg.managerName ? (
                      <div>
                        <p className="font-semibold text-slate-300">{reg.managerName}</p>
                        <p className="text-[10px] text-slate-550 mt-0.5">{reg.managerEmail}</p>
                      </div>
                    ) : (
                      <span className="text-slate-650 italic text-[11px]">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button 
                        onClick={() => handleOpenEdit(reg)}
                        className="p-1 hover:bg-slate-900 rounded border border-transparent hover:border-slate-800 text-slate-450 hover:text-white transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(reg.id)}
                        className="p-1 hover:bg-slate-900 rounded border border-transparent hover:border-slate-800 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {regions.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-600 italic">
                    No regions created yet. Add a territory above.
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 2. Permission Role Hierarchy Console */}
      <Card className="border-slate-850 bg-slate-950/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" /> Enterprise Access Guard (RBAC)
          </CardTitle>
          <CardDescription className="text-xs">
            Review authorized permissions hierarchy mapped across CareFranchise OS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-slate-900/60 p-1 border border-slate-850 rounded-xl">
            {ROLES_PERMISSIONS.map((rp, idx) => (
              <button
                key={rp.role}
                onClick={() => setActiveRoleIdx(idx)}
                className={`text-center py-2 text-[10px] uppercase font-bold tracking-wider rounded-lg transition select-none ${
                  activeRoleIdx === idx 
                    ? 'bg-slate-950 text-indigo-400 shadow border border-slate-850' 
                    : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                {rp.role.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-200">{currentRole.role}</h4>
                <Badge variant="neutral" className="text-[8px] uppercase tracking-wider">Hierarchy Rank {4 - activeRoleIdx}</Badge>
              </div>
              <p className="text-[11px] text-slate-450 mt-1 leading-snug">{currentRole.desc}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-900">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Capabilities Grid</p>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {currentRole.perms.map((p, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-350">
                    <span className={`shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      p.allowed ? 'bg-teal-950 text-teal-400' : 'bg-rose-950 text-rose-400'
                    }`}>
                      {p.allowed ? '✓' : '✕'}
                    </span>
                    <div>
                      <p className="font-medium text-slate-250 leading-snug">{p.action}</p>
                      {p.comment && <p className="text-[10px] text-slate-500 italic mt-0.5">{p.comment}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Territory Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRegion ? "Modify Territory Guidelines" : "Create Operational Territory"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Territory / Region Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Northeast, South California"
          />

          <div className="border-t border-slate-900 pt-4">
            <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-1">
              <UserCheck className="w-4 h-4 text-indigo-400" /> Assign Territory Manager
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                label="Manager Full Name"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="e.g. Marcus Aurelius"
              />
              <Input 
                label="Corporate Email Address"
                type="email"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
                placeholder="e.g. m.aurelius@carefranchise.com"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-400">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Deploying...' : (editingRegion ? 'Save Changes' : 'Initialize Territory')}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
