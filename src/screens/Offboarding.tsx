import { usePortalState } from '@/context/PortalStateContext';
import { DoorOpen, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function Offboarding() {
  const { offboardingList, performClearance } = usePortalState();
  const [successMsg, setSuccessMsg] = useState('');

  const handleClear = (id: string, name: string) => {
    performClearance(id);
    setSuccessMsg(`Final settlement and clearance approved for ${name} successfully!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {successMsg}
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <DoorOpen size={20} className="text-emerald-500" />
          Offboarding & Clearance
        </h3>
        <p className="text-sm text-slate-500 mt-1">Review leaving staff with outstanding wage balances. Recapture arrears through clean payroll deduction.</p>
      </div>

      {offboardingList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center max-w-xl">
          <CheckCircle2 className="text-emerald-500 mx-auto mb-3" size={36} />
          <h4 className="text-sm font-bold text-slate-900">All Clearances Settle</h4>
          <p className="text-xs text-slate-500 mt-1">There are no pending leaving employees in the offboarding clearance pipeline.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 max-w-4xl">
          {offboardingList.map((emp) => (
            <div key={emp.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3">
              <div className="p-6 md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{emp.name}</h4>
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">{emp.id}</span>
                  </div>
                  <span className="bg-amber-50 text-amber-800 text-[10px] uppercase font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldAlert size={12} className="text-amber-600" />
                    Unsettled Arrears
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-4 text-xs">
                  <div>
                    <strong className="text-slate-400 block uppercase text-[9px] font-bold tracking-widest mb-1">EWA Advance Taken</strong>
                    <span className="font-semibold text-slate-800">{emp.outstanding}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400 block uppercase text-[9px] font-bold tracking-widest mb-1">Proposed Deduction</strong>
                    <span className="font-semibold text-rose-700">{emp.deduction} MMK (from final pay)</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-50 pt-4">
                  <strong className="text-slate-400 block uppercase text-[9px] font-bold tracking-widest mb-2">Internal Assets Checklist</strong>
                  <div className="flex gap-4 text-[11px] text-slate-600">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600" /> Keycard Returned
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600" /> Terminal Handed Back
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600" /> Systems Suspended
                    </label>
                  </div>
                </div>
              </div>

              {/* Clearance Action panel */}
              <div className="bg-slate-50 border-l border-slate-100 p-6 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Final Ledger Pay</span>
                  <div className="text-lg font-bold text-slate-900">Cleared Paycheck</div>
                  <p className="text-[10px] text-slate-400 leading-normal mt-1">EWA advances are recaptured into final paycheck values before clearance certificates issues.</p>
                </div>
                <button 
                  onClick={() => handleClear(emp.id, emp.name)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-xl transition shadow-sm mt-6"
                >
                  Approve Clearance Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
