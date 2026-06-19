import { usePortalState } from '@/context/PortalStateContext';
import { Wallet, Check, AlertCircle, Sparkles } from 'lucide-react';

export function Disbursement() {
  const { disbursements, employees, disburseWage } = usePortalState();

  const totalDisbursed = disbursements
    .filter(d => d.status === 'Paid')
    .reduce((sum, curr) => sum + curr.amount, 0);

  const totalPending = disbursements
    .filter(d => d.status === 'Pending')
    .reduce((sum, curr) => sum + curr.amount, 0);

  const getEmpName = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    return emp ? emp.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 shadow-sm">
        <div className="space-y-2">
          <div className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">Released Capital</div>
          <div className="text-3xl font-bold font-mono text-emerald-400">{totalDisbursed.toLocaleString()} MMK</div>
          <p className="text-xs text-slate-400">Total liquid cash wired to verified bank accounts.</p>
        </div>
        <div className="col-span-1 border-l border-slate-800 pl-6 space-y-2">
          <div className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">Awaiting Release</div>
          <div className="text-3xl font-bold font-mono text-amber-400">{totalPending.toLocaleString()} MMK</div>
          <p className="text-xs text-slate-400">EWA drafts marked for immediate settlement.</p>
        </div>
        <div className="col-span-1 border-l border-slate-800 pl-6 space-y-2">
          <div className="text-slate-400 font-mono text-[10px] uppercase tracking-widest font-bold">Verification Standard</div>
          <div className="text-xs text-slate-300 flex items-center gap-1">
            <Sparkles size={14} className="text-emerald-400" />
            Instant bank transfer protocol active
          </div>
          <p className="text-[11px] text-slate-400">Disbursements are cleared in batch bursts under ISO 20022 compliance.</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Wallet size={20} className="text-emerald-500" />
          Disbursement Batch Ledgers
        </h3>
        <p className="text-sm text-slate-500 mt-1">Review active wage withdrawal bills. Approve outstanding rows to release local bank transfers.</p>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Ref ID</th>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Amount Requested</th>
              <th className="px-6 py-4">Value Date</th>
              <th className="px-6 py-4">Settlement Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {disbursements.map((row) => (
              <tr key={row.ref} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-mono font-bold text-slate-900">{row.ref}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-950">{getEmpName(row.empId)}</div>
                  <div className="text-[10px] font-mono text-slate-400">{row.empId}</div>
                </td>
                <td className="px-6 py-4 text-slate-950 font-bold">{row.amount.toLocaleString()} MMK</td>
                <td className="px-6 py-4 text-slate-500 font-mono">{row.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${
                    row.status === 'Paid' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                      : 'bg-amber-50 text-amber-800 border border-amber-100 animate-pulse'
                  }`}>
                    {row.status === 'Paid' ? (
                      <>
                        <Check size={10} />
                        Disbursed
                      </>
                    ) : (
                      <>
                        <AlertCircle size={10} />
                        Authorized Draft
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {row.status !== 'Paid' ? (
                    <button 
                      onClick={() => disburseWage(row.ref)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] px-4 py-1.5 rounded-lg transition shadow-sm"
                    >
                      Release Fund
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-400 px-4">Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
