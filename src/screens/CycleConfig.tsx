import { usePortalState } from '@/context/PortalStateContext';
import { CalendarCheck, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function CycleConfig() {
  const { cycleConfigs, addLog } = usePortalState();
  const [configs, setConfigs] = useState(cycleConfigs);
  const [success, setSuccess] = useState('');

  const handleEdit = (configName: string, currentVal: string) => {
    const nextVal = prompt(`Update parameter [${configName}]:`, currentVal);
    if (!nextVal) return;
    setConfigs(prev => prev.map(c => c.config === configName ? { ...c, value: nextVal } : c));
    addLog(`Changed cycle config [${configName}] to ${nextVal}`);
    setSuccess(`Cycle parameter for "${configName}" modified to ${nextVal}`);
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
          <CalendarCheck size={20} className="text-emerald-500" />
          Cycle Configuration
        </h3>
        <p className="text-sm text-slate-500 mt-1">Manage core financial schedule settings, run bounds, and grace calendars governing wage withdrawals.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {configs.map((row) => (
          <div key={row.config} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-slate-200 transition-all">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Payroll Calendar</span>
              <h4 className="text-sm font-bold text-slate-900">{row.config}</h4>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-900 bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg font-bold">
                {row.value}
              </span>
              <button 
                onClick={() => handleEdit(row.config, row.value)}
                className="text-stone-500 hover:text-emerald-600 text-xs font-semibold border border-stone-200 hover:border-emerald-200 px-3 py-1.5 rounded-lg transition"
              >
                Change Value
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
