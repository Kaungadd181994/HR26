import { usePortalState } from '@/context/PortalStateContext';
import { useState, useMemo } from 'react';
import { ReceiptText, CheckCircle, RefreshCcw, Plus, Search, Filter } from 'lucide-react';

export function Repayments() {
  const { repayments, employees, addRepayment } = usePortalState();
  const [empId, setEmpId] = useState('');
  const [amount, setAmount] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const getEmpDetails = (id: string) => {
    const emp = employees.find(e => e.id === id);
    return emp ? { name: emp.name, dept: emp.department } : { name: 'Unknown Employee', dept: 'Operations' };
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empId || !amount) return;
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) return;
    addRepayment(empId, num);
    setAmount('');
    setEmpId('');
    setShowForm(false);
  };

  // Filtered repayments list
  const filteredRepayments = useMemo(() => {
    return repayments.filter(row => {
      const details = getEmpDetails(row.empId);
      const matchesSearch = 
        row.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        details.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDept = deptFilter === 'ALL' || details.dept === deptFilter;

      return matchesSearch && matchesDept;
    });
  }, [repayments, employees, searchTerm, deptFilter]);

  const totalRepaidAmount = useMemo(() => {
    return filteredRepayments.reduce((sum, curr) => sum + curr.amount, 0);
  }, [filteredRepayments]);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ReceiptText size={20} className="text-emerald-500" />
            Wage Repayment Ledgers
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Audit trail of auto-deducted salary recoveries and direct company credit paybacks.
          </p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 self-start md:self-auto shadow-sm"
        >
          <Plus size={14} />
          {showForm ? 'Cancel Direct Recovery' : 'Post Direct Recovery Receipt'}
        </button>
      </div>

      {/* Direct Recovery form */}
      {showForm && (
        <form onSubmit={handlePost} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-lg space-y-4 animate-fadeIn">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <i className="fa-solid fa-file-invoice text-emerald-600"></i>
            Post Settle / Recovery Cash Receipt
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Select Employee ID</label>
              <select 
                value={empId} 
                onChange={e => setEmpId(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs bg-slate-50 focus:ring-1 focus:ring-emerald-500 text-slate-800 font-semibold"
                required
              >
                <option value="">Choose Employee...</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Amount Recaptured (MMK)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[10px] font-mono font-bold text-slate-400">MMK</span>
                <input 
                  type="number" 
                  placeholder="Ex. 150000" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg pl-11 pr-4 py-2 text-xs font-bold font-mono focus:ring-1 focus:ring-emerald-500 text-slate-900 bg-slate-50" 
                  required 
                />
              </div>
            </div>
          </div>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-sm">
            Apply Direct Recovery Recapture
          </button>
        </form>
      )}

      {/* Recovers Stats & Interactive Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recovers sum banner */}
        <div className="bg-emerald-600 text-white p-6 rounded-2xl border border-emerald-700 shadow-md flex items-center justify-between lg:col-span-1">
          <div className="space-y-1">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-100 font-mono">Matched Active Recoveries</h4>
            <div className="text-3xl font-extrabold font-mono">{totalRepaidAmount.toLocaleString()} MMK</div>
            <p className="text-[11px] text-emerald-100">Sum of filtered recapture records.</p>
          </div>
          <RefreshCcw size={28} className="text-emerald-200 opacity-60 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Search controls */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col md:flex-row items-center gap-3 justify-center">
          
          <div className="flex-1 w-full relative">
            <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search receipt refs, keys, names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
            />
          </div>

          <div className="w-full md:w-56 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
            <Filter size={13} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase font-mono">Dept :</span>
            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="flex-1 bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

        </div>

      </div>

      {/* Repayments table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-mono font-bold text-slate-400">
          Showing {filteredRepayments.length} audit receipt records
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Receipt Ref</th>
              <th className="px-6 py-4">Employee ID</th>
              <th className="px-6 py-4">Staff Name</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Recovered Amount</th>
              <th className="px-6 py-4">Value Date</th>
              <th className="px-6 py-4">Recovery Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
            {filteredRepayments.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400 font-semibold font-mono">
                  No recovery records found matching filters.
                </td>
              </tr>
            ) : (
              filteredRepayments.map((row) => {
                const details = getEmpDetails(row.empId);
                return (
                  <tr key={row.ref} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{row.ref}</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-400">{row.empId}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{details.name}</td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">{details.dept}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-600 font-mono text-[13px]">{row.amount.toLocaleString()} MMK</td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-500">{row.date}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-100">
                        <CheckCircle size={10} className="text-emerald-500" />
                        {row.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
