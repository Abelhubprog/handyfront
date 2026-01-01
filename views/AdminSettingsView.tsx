import React, { useState } from 'react';
import { 
  Settings, 
  Globe, 
  ShieldCheck, 
  CreditCard, 
  HardDrive, 
  Bell, 
  Users, 
  Save, 
  Check, 
  ChevronRight,
  Plus,
  Server,
  Key
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

type SettingsSection = 'general' | 'domains' | 'payments' | 'storage' | 'notifications' | 'roles';

export const AdminSettingsView = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const navItems = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'domains', label: 'Domain Branding', icon: Globe },
    { id: 'payments', label: 'Finance & Payments', icon: CreditCard },
    { id: 'storage', label: 'Storage & Vault', icon: HardDrive },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'roles', label: 'Roles & Permissions', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Settings Navigation Sidebar */}
      <div className="w-72 border-r border-zinc-200 bg-white flex flex-col shrink-0">
        <div className="p-8 border-b border-zinc-100">
          <h1 className="text-xl font-bold text-zinc-900">Admin Console</h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">Platform Settings</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as SettingsSection)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                activeSection === item.id 
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/10" 
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={activeSection === item.id ? "text-white" : "text-zinc-400 group-hover:text-zinc-900"} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ChevronRight size={14} className={cn("transition-transform", activeSection === item.id ? "rotate-90 opacity-100" : "opacity-0")} />
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-zinc-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-3 w-20 bg-zinc-200 rounded animate-pulse mb-1" />
              <div className="h-2 w-12 bg-zinc-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="px-10 py-6 bg-white border-b border-zinc-200 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 capitalize">{activeSection.replace('_', ' ')}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Configure and customize your platform behavior.</p>
          </div>
          <div className="flex items-center gap-4">
            {showSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 animate-in fade-in slide-in-from-right-2">
                <Check size={14} /> Changes Saved
              </span>
            )}
            <Button onClick={handleSave} isLoading={isSaving} className="shadow-lg shadow-zinc-900/10 h-10 px-6">
              Save Configuration
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-4xl space-y-10">
            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <Card className="p-0 overflow-hidden">
                  <div className="p-6 border-b border-zinc-100 bg-zinc-50/30">
                    <h3 className="font-bold text-zinc-900">Platform Identity</h3>
                    <p className="text-xs text-zinc-500 mt-1">Core branding and identification for the admin instance.</p>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Instance Name</label>
                        <input 
                          type="text" 
                          defaultValue="HandyWriterz Production"
                          className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Support Email</label>
                        <input 
                          type="email" 
                          defaultValue="support@handywriterz.com"
                          className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 border-dashed border-zinc-300 bg-transparent text-center">
                  <ShieldCheck size={32} className="mx-auto text-zinc-300 mb-4" />
                  <h3 className="text-sm font-bold text-zinc-900">Security Audit</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 leading-relaxed">
                    Last security audit was performed 14 days ago. All systems are operating within normal parameters.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">Run New Audit</Button>
                </Card>
              </div>
            )}

            {/* Domain Branding Settings */}
            {activeSection === 'domains' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Active Frontends</h3>
                  <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50">
                    <Plus size={16} className="mr-2" /> Add Domain
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'Main Brand', url: 'handywriterz.com', icon: 'H', status: 'live' },
                    { name: 'Nursing Hub', url: 'nursing.handywriterz.com', icon: 'N', status: 'live' },
                    { name: 'Law Desk', url: 'law.handywriterz.com', icon: 'L', status: 'maintenance' },
                  ].map((domain, i) => (
                    <Card key={i} className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-zinc-900 text-white rounded-xl flex items-center justify-center font-serif text-xl font-bold shadow-lg group-hover:scale-105 transition-transform">
                          {domain.icon}
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                          domain.status === 'live' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                        )}>
                          {domain.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-zinc-900">{domain.name}</h4>
                      <p className="text-xs text-zinc-500 mt-1">{domain.url}</p>
                      <div className="mt-6 flex gap-2">
                        <Button variant="ghost" size="sm" className="flex-1 text-[10px] uppercase font-bold tracking-wider">Appearance</Button>
                        <Button variant="ghost" size="sm" className="flex-1 text-[10px] uppercase font-bold tracking-wider">SEO</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeSection === 'payments' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <Card className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900">Stripe Connect</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">Gateway used for all platform transactions.</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                      <Check size={14} /> Connected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Platform Fee (%)</label>
                      <div className="relative">
                        <input type="number" defaultValue="15" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-lg font-bold outline-none" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">%</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">Deducted from every customer payment automatically.</p>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Writer Payout Ratio (%)</label>
                      <div className="relative">
                        <input type="number" defaultValue="60" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-lg font-bold outline-none" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">%</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">Portion of the net revenue paid out to the primary writer.</p>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-3 gap-6">
                  {[
                    { label: 'Test Mode', active: true },
                    { label: '3D Secure', active: true },
                    { label: 'Apple Pay', active: true },
                  ].map((feat, i) => (
                    <div key={i} className="p-4 border border-zinc-200 rounded-xl flex items-center justify-between bg-white">
                      <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">{feat.label}</span>
                      <div className={cn("w-10 h-5 rounded-full relative transition-colors cursor-pointer", feat.active ? "bg-zinc-900" : "bg-zinc-200")}>
                        <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all", feat.active ? "right-1" : "left-1")} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Settings */}
            {activeSection === 'storage' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <Card className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-bold text-zinc-900">Global Storage Quota</h3>
                      <p className="text-xs text-zinc-500 mt-1">Total combined storage used by the Vault.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-zinc-900">42.5 GB / 1 TB</p>
                      <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">4.2% Utilized</p>
                    </div>
                  </div>
                  <div className="h-4 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 w-[4.2%] shadow-inner" />
                  </div>
                  <div className="grid grid-cols-2 gap-12 mt-12">
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-400">
                          <Server size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900">S3 Integration</h4>
                          <p className="text-xs text-zinc-500 mt-1">Region: us-east-1 (N. Virginia)</p>
                          <Button variant="ghost" size="sm" className="h-6 px-0 text-blue-600 hover:bg-transparent mt-2">Rotate Access Keys</Button>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-400">
                          <Key size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900">Encryption</h4>
                          <p className="text-xs text-zinc-500 mt-1">AES-256 (Server Side)</p>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1 mt-2">
                            <ShieldCheck size={12} /> PCI-DSS Compliant
                          </span>
                        </div>
                     </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Roles & Permissions */}
            {activeSection === 'roles' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">System Role Matrix</h3>
                  <Button size="sm" variant="ghost" className="text-zinc-500 hover:text-zinc-900">Audit Logs</Button>
                </div>
                <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200">
                      <tr>
                        <th className="px-6 py-4 font-bold text-zinc-400 uppercase tracking-widest">Permission</th>
                        <th className="px-6 py-4 font-bold text-zinc-900 text-center">Admin</th>
                        <th className="px-6 py-4 font-bold text-zinc-900 text-center">Writer</th>
                        <th className="px-6 py-4 font-bold text-zinc-900 text-center">Support</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {[
                        { perm: 'Access Dashboard', admin: true, writer: true, support: true },
                        { perm: 'View Global Vault', admin: true, writer: false, support: true },
                        { perm: 'Assign Writers', admin: true, writer: false, support: false },
                        { perm: 'Manual Payouts', admin: true, writer: false, support: false },
                        { perm: 'Content Publishing', admin: true, writer: false, support: false },
                        { perm: 'Moderate Chat', admin: true, writer: false, support: true },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-zinc-700">{row.perm}</td>
                          <td className="px-6 py-4 text-center">
                            {row.admin && <Check size={16} className="mx-auto text-zinc-900" />}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {row.writer && <Check size={16} className="mx-auto text-zinc-900" />}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {row.support && <Check size={16} className="mx-auto text-zinc-900" />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};