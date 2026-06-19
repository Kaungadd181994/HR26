import { usePortalState } from '@/context/PortalStateContext';
import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight, 
  RotateCcw,
  Plus
} from 'lucide-react';

export function Dashboard() {
  const { 
    employees, 
    disbursements, 
    repayments, 
    logs, 
    addRepayment 
  } = usePortalState();

  const [selectedEmp, setSelectedEmp] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Calculations
  const activeCount = employees.filter(e => e.status === 'active').length;
  
  const totalDisbursed = disbursements
    .filter(d => d.status === 'Paid')
    .reduce((sum, curr) => sum + curr.amount, 0);

  const totalOutstanding = disbursements
    .filter(d => d.status === 'Pending')
    .reduce((sum, curr) => sum + curr.amount, 0);

  const totalRepaid = repayments
    .reduce((sum, curr) => sum + curr.amount, 0);

  const handleQuickRepay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp || !repayAmount) return;
    const amountVal = parseInt(repayAmount, 10);
    if (isNaN(amountVal) || amountVal <= 0) return;
    
    addRepayment(selectedEmp, amountVal);
    setSuccessToast(`Repayment of ${amountVal.toLocaleString()} MMK filed successfully!`);
    setTimeout(() => setSuccessToast(''), 3000);
    setSelectedEmp('');
    setRepayAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-bounce">
          <CheckCircle className="text-emerald-400" size={18} />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Stats Summary Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Disbursed', 
            value: `${totalDisbursed.toLocaleString()} MMK`, 
            sub: 'Approved this cycle',
            icon: DollarSign,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100/50'
          },
          { 
            label: 'Active Members', 
            value: activeCount, 
            sub: 'Enrolled employees',
            icon: Users,
            color: 'text-blue-600 bg-blue-50 border-blue-100/50'
          },
          { 
            label: 'Cycle Outstanding', 
            value: `${totalOutstanding.toLocaleString()} MMK`, 
            sub: 'Pending recovery',
            icon: AlertCircle,
            color: 'text-amber-600 bg-amber-50 border-amber-100/50'
          },
          { 
            label: 'Total Repaid', 
            value: `${totalRepaid.toLocaleString()} MMK`, 
            sub: 'Received through payroll deduction',
            icon: RotateCcw,
            color: 'text-indigo-600 bg-indigo-50 border-indigo-100/50'
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-slate-200 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <span className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon size={16} />
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
                <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Activity Graphics & Trends */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">EWA Transaction Velocity</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time volume tracking per month</p>
            </div>
            <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
              <ArrowUpRight size={12} />
              +14.2% Growth
            </span>
          </div>

          {/* SVG Custom Interactive Graph - ensures compatibility with React 19 */}
          <div className="h-48 w-full relative pt-2">
            <svg viewBox="0 0 500 150" className="w-full h-full text-emerald-500">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              {/* Area path */}
              <path 
                d="M 10 140 Q 100 80, 180 110 T 360 40 T 490 20 L 490 140 Z" 
                fill="url(#chartGrad)" 
              />
              {/* Line path */}
              <path 
                d="M 10 140 Q 100 80, 180 110 T 360 40 T 490 20" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
              {/* Circle Nodes */}
              <circle cx="180" cy="110" r="4.5" className="fill-white stroke-emerald-600 stroke-2" />
              <circle cx="360" cy="40" r="4.5" className="fill-white stroke-emerald-600 stroke-2" />
              <circle cx="490" cy="20" r="4.5" className="fill-white stroke-emerald-600 stroke-2" />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-2 mt-2 font-mono">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN (CURRENT)</span>
            </div>
          </div>
        </div>

        {/* Quick Operations panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Post Wage Repayment</h3>
            <p className="text-xs text-slate-500 mt-0.5">Deduct or settle out-of-cycle advanced funds</p>
          </div>
          <form onSubmit={handleQuickRepay} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Employee Target</label>
              <select 
                value={selectedEmp} 
                onChange={(e) => setSelectedEmp(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                required
              >
                <option value="">Select Employee...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.id}) - {emp.department}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Amount (MMK)</label>
              <input 
                type="number" 
                placeholder="Ex. 150000"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Plus size={14} />
              Register Repayment
            </button>
          </form>
        </div>
      </div>

      {/* Latest Logs list for compliance visibility */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">System Activity Logs</h3>
            <p className="text-xs text-slate-500">Audit trail of the current EWA workspace cycle</p>
          </div>
        </div>
        <div className="divide-y divide-slate-50 text-xs text-slate-600">
          {logs.slice(0, 4).map((log, index) => (
            <div key={index} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <div>
                  <span className="font-semibold text-slate-900">{log.action}</span>
                  <span className="text-[10px] text-slate-400 ml-2">by {log.user}</span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
