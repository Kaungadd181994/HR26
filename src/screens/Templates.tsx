import { usePortalState } from '@/context/PortalStateContext';
import { ClipboardList, Plus, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function Templates() {
  const { templates, addTemplate } = usePortalState();
  const [name, setName] = useState('');
  const [policy, setPolicy] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [success, setSuccess] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !policy) return;
    addTemplate(name, policy);
    setName('');
    setPolicy('');
    setShowAdd(false);
    setSuccess(`EWA cycle template "${name}" has been generated!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {success}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList size={20} className="text-emerald-500" />
            EWA Profile Templates
          </h3>
          <p className="text-sm text-slate-500 mt-1">Pre-configured corporate rule sets designed for rapid grouping of subsidiaries or specific department classes.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-emerald-600 hover:bg-emerald-505 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2 animate-fadeIn"
        >
          <Plus size={14} />
          {showAdd ? 'Close' : 'Create Template'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 max-w-md animate-fadeIn">
          <h4 className="text-sm font-bold text-slate-900">Define Configuration Template</h4>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Template Name</label>
            <input 
              type="text" 
              placeholder="Ex. Hourly Contractor Template" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
              required 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Policy Parameters</label>
            <input 
              type="text" 
              placeholder="Ex. 30% limit, Bi-weekly" 
              value={policy} 
              onChange={e => setPolicy(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
              required 
            />
          </div>
          <button type="submit" className="bg-slate-900 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all">Build Template</button>
        </form>
      )}

      {/* Templates Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {templates.map((tpl) => (
          <div key={tpl.name} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all space-y-3">
            <span className="bg-slate-100 text-slate-700 font-mono text-[9px] font-bold px-2 py-0.5 rounded">Active Profile</span>
            <h4 className="text-base font-bold text-slate-900">{tpl.name}</h4>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-50">
              Rule Parameters: <span className="font-mono font-bold text-slate-900">{tpl.policy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
