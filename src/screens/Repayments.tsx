import { usePortalState } from '@/context/PortalStateContext';
import { useState } from 'react';
import { ReceiptText, CheckCircle, RefreshCcw, Plus } from 'lucide-react';

export function Repayments() {
  const { repayments, employees, addRepayment } = usePortalState();
  const [empId, setEmpId] = useState('');
  const [amount, setAmount] = useState('');
  const [showForm, setShowForm] = useState(false);

  const getEmpName = (id: string) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.name : 'Unknown Employee';
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empId || !amount) return;
    const num = parseInt(amount, 10);
    if (isNaN(num)) return;
    addRepayment(empId, num);
    setAmount('');
    setEmpId('');
    setShowForm(false);
  };

  const totalRepaidAmount = repayments.reduce((sum, curr) => sum + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ReceiptText size={20} className="text-emerald-500" />
            Wage Repayment Ledgers
          </h3>
          <p className="text-sm text-slate-500 mt-1">Audit of payroll-deducted or corporate paid back funds recovered during the current pay cycle.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
        >
          <Plus size={14} />
          {showForm ? 'Cancel' : 'Post Direct Recovery'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handlePost} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-lg space-y-4 animate-fadeIn">
          <h4 className="text-sm font-bold text-slate-900">Post Settle / Recovery Cash</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Employee ID</label>
              <select 
                value={empId} 
                onChange={e => setEmpId(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white focus:ring-1 focus:ring-emerald-500"
                required
              >
                <option value="">Select Employee...</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Amount Recaptured (MMK)</label>
              <input 
                type="number" 
                placeholder="Ex. 150000" 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500" 
                required 
              />
            </div>
          </div>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">Apply Recovery</button>
        </form>
      )}

      {/* Overview Stat */}
      <div className="bg-emerald-600 text-white p-6 rounded-2xl border border-emerald-700 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-100">Cumulative Recoveries Settled</h4>
          <div className="text-3xl font-bold font-mono">{totalRepaidAmount.toLocaleString()} MMK</div>
        </div>
        <RefreshCcw size={28} className="text-emerald-200 opacity-60" />
      </div>

      {/* Repayments table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Receipt Ref</th>
              <th className="px-6 py-4">Employee ID</th>
              <th className="px-6 py-4">Staff Name</th>
              <th className="px-6 py-4">Recovered Amount</th>
              <th className="px-6 py-4">Value Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs text-slate-600">
            {repayments.map((row) => (
              <tr key={row.ref} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-mono font-bold text-slate-900">{row.ref}</td>
                <td className="px-6 py-4 font-mono">{row.empId}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{getEmpName(row.empId)}</td>
                <td className="px-6 py-4 font-semibold text-slate-950 font-mono">{row.amount.toLocaleString()} MMK</td>
                <td className="px-6 py-4 font-mono">{row.date}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                    <CheckCircle size={10} />
                    {row.status}
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
