import { usePortalState } from '@/context/PortalStateContext';
import { ShieldAlert, CheckCircle2, UserCheck } from 'lucide-react';
import { useState } from 'react';

export function Freeze() {
  const { freezeList, unfreezeEmployee } = usePortalState();
  const [msg, setMsg] = useState('');

  const handleUnfreeze = (id: string, name: string) => {
    unfreezeEmployee(id);
    setMsg(`Employee ${name} (${id}) has been successfully unfrozen and reinstated into standard EWA cycle.`);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {msg}
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldAlert size={20} className="text-rose-500" />
          EWA Freeze & Suspicious Accounts Console
        </h3>
        <p className="text-sm text-slate-500 mt-1">Suspend, view, or resume EWA system transactions for accounts flagged for disciplinary reasons or unpaid recovery cycles.</p>
      </div>

      {freezeList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center max-w-xl">
          <CheckCircle2 className="text-emerald-500 mx-auto mb-3" size={36} />
          <h4 className="text-sm font-bold text-slate-900 font-sans">All Accounts Active</h4>
          <p className="text-xs text-slate-500 mt-1 font-sans">No staff profiles are currently frozen or flagged inside the suspension cycle.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4 font-mono">Status Flag</th>
                <th className="px-6 py-4">Outstanding Bal</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs text-slate-600">
              {freezeList.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-mono font-bold text-rose-500">{row.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{row.name}</td>
                  <td className="px-6 py-4 font-mono">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-700 font-bold border border-rose-100">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{row.amount.toLocaleString()} MMK</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleUnfreeze(row.id, row.name)}
                      className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-1.5 rounded-lg transition shadow-sm flex items-center gap-1.5 ml-auto"
                    >
                      <UserCheck size={12} />
                      Unfreeze Account
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
