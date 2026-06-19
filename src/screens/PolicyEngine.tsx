import { usePortalState } from '@/context/PortalStateContext';
import { Settings, Plus, CheckCircle2, Sliders } from 'lucide-react';
import { useState } from 'react';

export function PolicyEngine() {
  const { policies, savePolicy } = usePortalState();
  const [ruleName, setRuleName] = useState('');
  const [ruleVal, setRuleVal] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName || !ruleVal) return;
    savePolicy(ruleName, ruleVal);
    setRuleName('');
    setRuleVal('');
    setShowAdd(false);
    setSuccess('Corporate policy parameters updated successfully!');
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
            <Sliders size={20} className="text-emerald-500" />
            Corporate Policy Engine
          </h3>
          <p className="text-sm text-slate-500 mt-1">Configure global rule ceilings, monthly allowance windows, and parameters governing wage advance transactions.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-emerald-600 hover:bg-emerald-505 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
        >
          <Plus size={14} />
          {showAdd ? 'Close' : 'Add Custom Rule'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 animate-fadeIn">
          <h4 className="text-sm font-bold text-slate-900">Define Custom Control Rule</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Rule Name</label>
              <input 
                type="text" 
                placeholder="Ex. Hourly Contractor Limit"
                value={ruleName} 
                onChange={e => setRuleName(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
                required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Rule Threshold Value</label>
              <input 
                type="text" 
                placeholder="Ex. 15% Max"
                value={ruleVal} 
                onChange={e => setRuleVal(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
                required 
              />
            </div>
          </div>
          <button type="submit" className="bg-slate-900 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all">Save Changes</button>
        </form>
      )}

      {/* Corporate Policy Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {policies.map((p) => (
          <div key={p.rule} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-slate-200 transition-all">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Policy Control</span>
              <h4 className="text-sm font-bold text-slate-900">{p.rule}</h4>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg font-bold">
                {p.value}
              </span>
              <button 
                onClick={() => {
                  const newVal = prompt(`Edit value for rule "${p.rule}":`, p.value);
                  if (newVal) savePolicy(p.rule, newVal);
                }}
                className="text-stone-400 hover:text-emerald-600 text-xs font-semibold px-2 py-1 rounded"
              >
                Edit Threshold
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
