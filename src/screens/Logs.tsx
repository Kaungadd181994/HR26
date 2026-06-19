import { usePortalState } from '@/context/PortalStateContext';
import { ScrollText, ShieldAlert } from 'lucide-react';

export function Logs() {
  const { logs } = usePortalState();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ScrollText size={20} className="text-emerald-500" />
          Approval & Audit Logs
        </h3>
        <p className="text-sm text-slate-500 mt-1">Immutable ledger tracking EWA configuration adjustments, bulk uploads, clearances, and disbursement approvals.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Triggered Action</th>
              <th className="px-6 py-4">Operator Credentials</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs text-slate-600">
            {logs.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-mono font-medium text-slate-400">{row.timestamp}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{row.action}</td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100/60 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200">
                    {row.user}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
