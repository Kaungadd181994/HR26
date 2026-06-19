import { usePortalState } from '@/context/PortalStateContext';
import { useState, useMemo } from 'react';
import { 
  Wallet, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Search, 
  Filter, 
  Trash2, 
  ShieldAlert, 
  ArrowRightLeft,
  FileCheck2,
  FileX2,
  CheckCircle2,
  X
} from 'lucide-react';
import { translations } from '@/utils/translations';

export function Disbursement() {
  const { 
    disbursements, 
    employees, 
    disburseWage, 
    addLog,
    language 
  } = usePortalState();

  const dict = translations[language];

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Voiding transactions simulation
  const [voidedRefs, setVoidedRefs] = useState<string[]>([]);
  const [activeRefDetails, setActiveRefDetails] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Helper: Get employee name & dept from id
  const getEmpDetails = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    return emp ? { name: emp.name, dept: emp.department } : { name: 'Unknown Personnel', dept: 'Operations' };
  };

  // Helper: Get bank destination deterministically
  const getBankDestination = (empName: string) => {
    const charCodeSum = empName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const banks = [
      'KBZ Bank (***8490)',
      'Yoma Bank (***1120)',
      'CB Bank (***3920)',
      'WavePay Wallet (***7410)',
      'Aya Bank (***5530)'
    ];
    return banks[charCodeSum % banks.length];
  };

  // Helper: Get ISO Transaction protocol standard
  const getProtocolCode = (ref: string) => {
    const code = ref.replace('DS-', '');
    return `ISO-20022-CBM-${code}81XA`;
  };

  // Quick Action: Void un-cleared transaction
  const handleVoidDraft = (ref: string, empName: string, amount: number) => {
    setVoidedRefs(prev => [...prev, ref]);
    addLog(`[Admin Void Action] Cancelled and voided unpoured EWA draft Ref ${ref} for ${empName} worth ${amount.toLocaleString()} MMK.`);
    triggerToast(`Transaction draft ${ref} was successfully voided.`);
  };

  // Quick Action: Batch release all un-cleared drafts (Requested "Quick Action")
  const handleBulkReleaseDrafts = () => {
    let count = 0;
    disbursements.forEach(d => {
      if (d.status !== 'Paid' && !voidedRefs.includes(d.ref)) {
        disburseWage(d.ref);
        count++;
      }
    });

    if (count > 0) {
      triggerToast(`Batch executed! Cleared ${count} pending salary advances inside state ledger.`);
    } else {
      triggerToast('No pending drafts available to release right now.');
    }
  };

  // Filtered disbursements list
  const filteredDisbursements = useMemo(() => {
    return disbursements
      .filter(d => !voidedRefs.includes(d.ref)) // Exclude voided ones
      .filter(d => {
        const details = getEmpDetails(d.empId);
        
        const matchesSearch = 
          d.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          details.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
        const matchesDept = deptFilter === 'ALL' || details.dept === deptFilter;

        return matchesSearch && matchesStatus && matchesDept;
      });
  }, [disbursements, voidedRefs, searchTerm, statusFilter, deptFilter, employees]);

  // Aggregate metrics (re-calculating for active unvoided disbursements)
  const totalDisbursed = useMemo(() => {
    return disbursements
      .filter(d => d.status === 'Paid' && !voidedRefs.includes(d.ref))
      .reduce((sum, curr) => sum + curr.amount, 0);
  }, [disbursements, voidedRefs]);

  const totalPending = useMemo(() => {
    return disbursements
      .filter(d => d.status === 'Pending' && !voidedRefs.includes(d.ref))
      .reduce((sum, curr) => sum + curr.amount, 0);
  }, [disbursements, voidedRefs]);

  return (
    <div className="space-y-6">
      {/* Dynamic Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-bounce">
          <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Corporate liquidity status and clearing statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 shadow-md">
        <div className="space-y-2">
          <div className="text-slate-400 font-mono text-[10px] uppercase tracking-widest block font-bold">{dict.clearedCapital}</div>
          <div className="text-3xl font-bold font-mono text-emerald-400 block">{totalDisbursed.toLocaleString()} MMK</div>
          <p className="text-xs text-slate-400 leading-normal">{dict.clearedCapitalDesc}</p>
        </div>
        <div className="col-span-1 border-l border-slate-800 md:pl-6 space-y-2">
          <div className="text-slate-400 font-mono text-[10px] uppercase tracking-widest block font-bold">{dict.awaitingSettle}</div>
          <div className="text-3xl font-bold font-mono text-amber-400 block">{totalPending.toLocaleString()} MMK</div>
          <p className="text-xs text-slate-400 leading-normal">{dict.awaitingSettleDesc}</p>
        </div>
        <div className="col-span-1 border-l border-slate-800 md:pl-6 space-y-2">
          <div className="text-slate-400 font-mono text-[10px] uppercase tracking-widest block font-bold">{dict.networkProtocolTitle}</div>
          <div className="text-xs text-slate-300 flex items-center gap-1.5 font-bold">
            <Sparkles size={14} className="text-emerald-400 animate-pulse" />
            ISO 20022 immediate-clearing active
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            {dict.networkProtocolDesc}
          </p>
        </div>
      </div>

      {/* Section Header with Quick Action (Batch Settle) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet size={20} className="text-emerald-500" />
            {dict.clearanceLedgerTitle}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {dict.clearanceLedgerSubtitle}
          </p>
        </div>

        {/* Global Quick Action button requested */}
        {totalPending > 0 && (
          <button 
            onClick={handleBulkReleaseDrafts}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5 self-start md:self-auto"
          >
            <i className="fa-solid fa-bolt text-[10px]"></i>
            {dict.forceSettleBtn} ({totalPending.toLocaleString()} MMK)
          </button>
        )}
      </div>

      {/* Advanced Filter and Search Hub card (Requested: "search and filter at tables") */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <i className="fa-solid fa-filter text-xs"></i>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-500 font-mono">Transaction Ledger Filters</h4>
            <p className="text-[10px] text-slate-400 font-medium">Verify specific settlement groups or search by ID references.</p>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Query Box */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Ref, ID, or employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-slate-800"
            />
          </div>

          {/* Status filter dropdown */}
          <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-200/60 rounded-xl px-3 py-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Settle status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Settlement States</option>
              <option value="Paid">Cleared / Disbursed</option>
              <option value="Pending">Authorized Drafts</option>
            </select>
          </div>

          {/* Department filter dropdown */}
          <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-200/60 rounded-xl px-3 py-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Division :</span>
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

      {/* Advanced Interactive Columns Transactions Ledger Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-slate-500 font-mono text-[9px] font-bold uppercase tracking-wider">
          <span>Active Batch Queue</span>
          <span>Security Protocol Standard: ISO 20022</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Settle Ref</th>
                <th className="px-6 py-4">Employee Details</th>
                <th className="px-6 py-4">Clearing Route (Wallet/Bank)</th>
                <th className="px-6 py-4">Requested Cache</th>
                <th className="px-6 py-4">Tax Fee (2%)</th>
                <th className="px-6 py-4 font-extrabold text-slate-900">Net Wired Payout</th>
                <th className="px-6 py-4">Settlement State</th>
                <th className="px-6 py-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDisbursements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400 font-semibold font-mono">
                    <i className="fa-solid fa-road-barrier text-2xl text-slate-300 block mb-2"></i>
                    No active wage advances match the query parameters.
                  </td>
                </tr>
              ) : (
                filteredDisbursements.map((row) => {
                  const emp = getEmpDetails(row.empId);
                  const bank = getBankDestination(emp.name);
                  const protocol = getProtocolCode(row.ref);
                  const tax = Math.round(row.amount * 0.02);
                  const net = row.amount - tax;

                  return (
                    <tr key={row.ref} className="hover:bg-slate-50/50 transition duration-100">
                      
                      {/* Ref ID */}
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">
                        <div>{row.ref}</div>
                        <div className="text-[8px] text-slate-400 font-normal uppercase tracking-wider mt-0.5">{protocol}</div>
                      </td>

                      {/* Employee name and department */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">{row.empId} ({emp.dept})</div>
                      </td>

                      {/* Clearing Route destination bank */}
                      <td className="px-6 py-4 font-medium text-slate-600">
                        <div className="flex items-center gap-1.5 uppercase font-semibold text-[10px] tracking-wide">
                          <i className="fa-solid fa-building-columns text-slate-400"></i>
                          {bank}
                        </div>
                      </td>

                      {/* Gross requested amount */}
                      <td className="px-6 py-4 font-mono font-bold text-slate-500">
                        {row.amount.toLocaleString()} MMK
                      </td>

                      {/* Retained 2% Regulatory income tax */}
                      <td className="px-6 py-4 text-amber-700 font-mono font-semibold">
                        -{tax.toLocaleString()} MMK
                      </td>

                      {/* Net wired payout amount */}
                      <td className="px-6 py-4 text-emerald-600 font-mono font-extrabold text-[13px]">
                        {net.toLocaleString()} MMK
                      </td>

                      {/* Clear state */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-extrabold border ${
                          row.status === 'Paid' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                            : 'bg-amber-50 text-amber-800 border-amber-100 animate-pulse'
                        }`}>
                          {row.status === 'Paid' ? (
                            <>
                              <CheckCircle2 size={11} className="text-emerald-500" />
                              Wired Settle
                            </>
                          ) : (
                            <>
                              <AlertCircle size={11} className="text-amber-500" />
                              Un-poured Draft
                            </>
                          )}
                        </span>
                      </td>

                      {/* Quick Actions (Requested: "Quick Action") */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Settle button */}
                          {row.status !== 'Paid' ? (
                            <>
                              {/* Void Action */}
                              <button 
                                onClick={() => handleVoidDraft(row.ref, emp.name, row.amount)}
                                title="Void Pending Draft"
                                className="p-2 border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-lg transition"
                              >
                                <Trash2 size={13} />
                              </button>

                              {/* Manual Release */}
                              <button 
                                onClick={() => {
                                  disburseWage(row.ref);
                                  triggerToast(`Clearing executed for ${emp.name}. MMK ${row.amount.toLocaleString()} disbursed.`);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg transition shadow-sm flex items-center gap-1"
                              >
                                <ArrowRightLeft size={11} />
                                Wire Payout
                              </button>
                            </>
                          ) : (
                            // Verified transaction details view trigger
                            <button 
                              onClick={() => {
                                setActiveRefDetails({
                                  ref: row.ref,
                                  empId: row.empId,
                                  name: emp.name,
                                  dept: emp.dept,
                                  amount: row.amount,
                                  tax,
                                  net,
                                  bank,
                                  protocol,
                                  date: row.date
                                });
                              }}
                              className="border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-bold text-[11px] px-3.5 py-1.5 rounded-lg transition shadow-sm flex items-center gap-1"
                            >
                              <FileCheck2 size={12} />
                              Verify Audit
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Viewer sheet dynamic popup */}
      {activeRefDetails && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-150 p-6 space-y-4 shadow-2xl">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <i className="fa-solid fa-shield-halved text-sm"></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Security Clearance Report</h4>
                  <p className="text-[10px] text-slate-400 font-mono">TRANS REF ID: {activeRefDetails.ref}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveRefDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Audit metrics */}
            <div className="space-y-3.5 text-xs">
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase font-black tracking-widest text-[8px] font-mono">Clearance Date</span>
                  <span className="font-mono font-bold text-slate-900">{activeRefDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase font-black tracking-widest text-[8px] font-mono">Recipient Personnel</span>
                  <span className="font-bold text-indigo-600 block">{activeRefDetails.name} ({activeRefDetails.empId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase font-black tracking-widest text-[8px] font-mono">Clearing Destination Route</span>
                  <span className="font-mono text-slate-800 font-semibold">{activeRefDetails.bank}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-slate-400 uppercase font-bold text-[9px] block font-mono">Clearance Financial Breakdown</span>
                <div className="flex justify-between border-b border-dashed border-slate-100 pb-1.5 text-slate-600">
                  <span>Gross EWA amount withdrawn :</span>
                  <span className="font-mono font-bold">{activeRefDetails.amount.toLocaleString()} MMK</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-100 pb-1.5 text-amber-700">
                  <span>2% income withholding tax reserve :</span>
                  <span className="font-mono font-bold">-{activeRefDetails.tax.toLocaleString()} MMK</span>
                </div>
                <div className="flex justify-between pt-1 font-extrabold text-[14px]">
                  <span className="text-slate-800">Net wired standard payout :</span>
                  <span className="text-emerald-600 font-mono">{activeRefDetails.net.toLocaleString()} MMK</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 bg-indigo-50/20 p-3 rounded-lg border border-indigo-100 text-[10px] text-indigo-900 font-mono tracking-tight leading-normal">
                <div className="font-bold uppercase tracking-widest text-[8px] text-indigo-700 mb-0.5">Clearing Network protocol</div>
                <strong>ISO-20022 clearing code:</strong> {activeRefDetails.protocol}
                <div className="mt-1 text-slate-400 uppercase text-[8px]">Status Code: GREEN_MUT_VERIFIED</div>
              </div>

            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button 
                onClick={() => setActiveRefDetails(null)}
                className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs px-5 py-2 rounded-lg"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
