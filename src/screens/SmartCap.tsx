import { usePortalState } from '@/context/PortalStateContext';
import { BarChart3, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export function SmartCap() {
  const { smartCaps, addLog } = usePortalState();
  const [caps, setCaps] = useState(smartCaps);
  const [success, setSuccess] = useState('');

  const handleEditLimit = (tier: string, current: string) => {
    const val = prompt(`Change salary limit % for tier [${tier}]:`, current);
    if (!val) return;
    setCaps(prev => prev.map(c => c.tier === tier ? { ...c, limit: val } : c));
    addLog(`Modified Smart Cap limit for Tier ${tier} to ${val}`);
    setSuccess(`Successfully allocated ${val} ceiling to ${tier} tier!`);
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

      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 size={20} className="text-emerald-500" />
          Smart Cap & Tenure Tiers
        </h3>
        <p className="text-sm text-slate-500 mt-1">Safeguard employee liquidity by limiting maximum withdrawals based on corporate tenure guidelines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {caps.map((c) => (
          <div key={c.tier} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-slate-200 transition-all">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Tenure Band</span>
              <h4 className="text-base font-bold text-slate-900">{c.tier}</h4>
              <p className="text-[11px] text-slate-500">Applies automatic ceiling deduction rules.</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-950 font-mono">{c.limit}</span>
                <span className="text-xs text-slate-400 font-semibold">of gross pay</span>
              </div>
              <button 
                onClick={() => handleEditLimit(c.tier, c.limit)}
                className="text-stone-500 hover:text-emerald-600 text-xs font-semibold border border-stone-200 hover:border-emerald-200 px-3 py-1.5 rounded-lg transition"
              >
                Change Cap
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex gap-4 text-xs">
        <ShieldCheck className="text-emerald-400 flex-shrink-0" size={20} />
        <div>
          <h5 className="font-bold text-white">Dynamic Safeguards Enabled</h5>
          <p className="text-slate-400 leading-normal mt-1">Smart Cap boundaries prevent employees from drawing excessive wages, completely shielding them from debt-spiral risks prior to final monthly payroll reconciliation.</p>
        </div>
      </div>
    </div>
  );
}
