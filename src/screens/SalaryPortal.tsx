import { usePortalState } from '@/context/PortalStateContext';
import { useState, useMemo } from 'react';

export function SalaryPortal() {
  const { 
    employees, 
    disbursements, 
    addLog, 
    smartCaps,
    companyMatchPercent,
    donations
  } = usePortalState();

  // Simulated cycle day (Default is 19 representing June 19, 2026)
  const [cycleDay, setCycleDay] = useState(19);
  const totalDays = 30; // Standard cycle month
  const accruedRatio = cycleDay / totalDays;

  // Search, filter & page state
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Treasury Settings state
  const [fundingSource, setFundingSource] = useState<'treasury' | 'syndicated'>('treasury');
  const [interestMargin, setInterestMargin] = useState(1.5); // %
  const [flatTxFee, setFlatTxFee] = useState(2500); // flat MMK
  const [payoutModel, setPayoutModel] = useState<'subsidized' | 'microfee' | 'interest'>('microfee');
  const [utilizationStress, setUtilizationStress] = useState(25); // Simulated adoption %

  // Advance modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpForAdvance, setSelectedEmpForAdvance] = useState<any>(null);
  const [requestedAmount, setRequestedAmount] = useState('');
  const [charityDonationPct, setCharityDonationPct] = useState(0); // CSR contribution %
  const [validationError, setValidationError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Local storage of simulated advancements during session
  const [localAdvances, setLocalAdvances] = useState<Record<string, number>>({});

  // Helper: Get employee cap limit percentage
  const getCapPct = (empId: string, dept: string) => {
    // Determine tier based on mock tenure mappings or departments
    // Senior: Engineering, Confirmed: Finance, Probation: Operations
    if (dept === 'Engineering') return 50; // Senior
    if (dept === 'Finance') return 40;     // Confirmed
    return 20;                             // Probation
  };

  // Helper: Calculate previous drawn amount this cycle
  const getDrawnAmount = (empId: string) => {
    const historicalDrawn = disbursements
      .filter((d) => d.empId === empId && d.status === 'Paid')
      .reduce((sum, d) => sum + d.amount, 0);
    const sessionDrawn = localAdvances[empId] || 0;
    return historicalDrawn + sessionDrawn;
  };

  // Process rows and memoize
  const ledgerData = useMemo(() => {
    return employees.map((emp) => {
      const gross = emp.salary;
      // Pro-rata accrued earnings for current simulated cycle day
      const accrued = Math.round(gross * accruedRatio);
      const capPct = getCapPct(emp.id, emp.department);
      const ewaLimit = Math.min(
        Math.round(accrued * (capPct / 100)),
        Math.round(gross * 0.5) // Myanmar law absolute 50% cap on total payroll deductions
      );
      const drawn = getDrawnAmount(emp.id);
      const available = Math.max(ewaLimit - drawn, 0);

      return {
        ...emp,
        gross,
        accrued,
        capPct,
        ewaLimit,
        drawn,
        available,
      };
    });
  }, [employees, cycleDay, disbursements, localAdvances]);

  // Filtered rows for rendered table
  const filteredLedger = useMemo(() => {
    return ledgerData.filter((row) => {
      const matchesSearch = 
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = deptFilter === 'ALL' || row.department === deptFilter;
      const matchesStatus = 
        statusFilter === 'ALL' ||
        (statusFilter === 'WHITELISTED' && row.isWhitelisted) ||
        (statusFilter === 'DISABLED' && !row.isWhitelisted) ||
        (statusFilter === 'CONFLICT' && row.status === 'conflict');
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [ledgerData, searchTerm, deptFilter, statusFilter]);

  // Aggregate stats
  const totalEwaPortfolioAccrued = ledgerData.reduce((sum, r) => sum + r.accrued, 0);
  const totalAvailableAdvanceLiquidity = ledgerData.reduce((sum, r) => sum + r.available, 0);
  const totalActivelyDrawnThisCycle = ledgerData.reduce((sum, r) => sum + r.drawn, 0);
  const mockWorkingCapitalBase = fundingSource === 'treasury' ? 150000000 : 300000000;
  const remainingCashReserve = mockWorkingCapitalBase - totalActivelyDrawnThisCycle;
  const reserveDrawbackPct = Math.round((totalActivelyDrawnThisCycle / mockWorkingCapitalBase) * 100);

  // Simulated stress outputs
  const projectedMonthlyDrawdown = Math.round(
    totalEwaPortfolioAccrued * (utilizationStress / 100) * 0.4
  );

  // Triggering the advance request modal
  const handleOpenAdvanceModal = (row: any) => {
    setSelectedEmpForAdvance(row);
    setRequestedAmount('');
    setCharityDonationPct(0);
    setValidationError('');
    setIsModalOpen(true);
  };

  // Submit on-behalf advance request
  const handleAuthorizeAdvanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpForAdvance) return;

    const emp = selectedEmpForAdvance;
    const amountVal = parseInt(requestedAmount, 10);

    if (isNaN(amountVal) || amountVal <= 0) {
      setValidationError('Please specify a positive MMK advance value.');
      return;
    }

    if (!emp.isWhitelisted) {
      setValidationError('This personnel is currently excluded from EWA access.');
      return;
    }

    if (emp.status !== 'active') {
      setValidationError(`EWA blocked: Personnel status is currently listed as "${emp.status}".`);
      return;
    }

    if (amountVal > emp.available) {
      setValidationError(`Limit exceeded: Maximum allowable right now is ${emp.available.toLocaleString()} MMK (based on ${cycleDay} accrued days and standard ${emp.capPct}% cap bounds).`);
      return;
    }

    // Proceeding to store simulated transaction
    const taxWithholding = Math.round(amountVal * 0.02); // 2% Personal income tax estimate
    const donationAmount = Math.round(amountVal * (charityDonationPct / 100));

    // Register inside context
    setLocalAdvances((prev) => ({
      ...prev,
      [emp.id]: (prev[emp.id] || 0) + amountVal,
    }));

    addLog(
      `Enterprise EWA Issued on behalf of ${emp.name} (${emp.id}): ${amountVal.toLocaleString()} MMK (Tax w/h: ${taxWithholding.toLocaleString()} MMK). Funding source: ${fundingSource.toUpperCase()}`
    );

    // Apply corporate matched donation block if applicable
    if (donationAmount > 0) {
      addLog(
        `CSR Match Grant Generated: ${emp.name} contributed ${donationAmount.toLocaleString()} MMK from EWA advance payout. Company matched donation is active.`
      );
    }

    setSuccessToast(`EWA authorized for ${emp.name}! MMK ${amountVal.toLocaleString()} wired successfully.`);
    setTimeout(() => setSuccessToast(''), 4000);

    setIsModalOpen(false);
    setSelectedEmpForAdvance(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-bounce">
          <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Cycle Day Simulation Control Center - Prominently Placed */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block font-mono">
              Pro-Rata Calendar Simulator
            </span>
            <h4 className="text-lg font-bold text-white mt-1">
              Active Pay Cycle: June 1st - June 30th, 2026
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Move the cycle projection slider to adjust the current month's simulated date. Employee accrued salaries and available EWA parameters automatically shift in real-time.
            </p>
          </div>
          <div className="bg-slate-950 px-4 py-2 border border-slate-800 rounded-xl text-center min-w-32">
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider font-mono">Simulated Date</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">June {cycleDay}, 2026</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Day 1</span>
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={cycleDay}
              onChange={(e) => setCycleDay(Number(e.target.value))}
              className="flex-1 accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer appearance-none"
            />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Day 30</span>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-mono">
            <span>Cycle Start</span>
            <span>Week 1 (23% elapsed)</span>
            <span>Mid-Cycle (50% accrued)</span>
            <span>Week 3 (73% elapsed)</span>
            <span>Payroll Closing Cutoff</span>
          </div>
        </div>
      </div>

      {/* Corporate Liquidity & General Operations KPI matrices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Treasury pool status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Treasury Cash Reserves</span>
              <span className="text-xl font-bold text-slate-900 font-mono block mt-1">
                {remainingCashReserve.toLocaleString()} MMK
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <i className="fa-solid fa-vault text-sm"></i>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[9px] font-bold text-slate-500 font-mono uppercase">
              <span>Reserve Used: {reserveDrawbackPct}%</span>
              <span>Total Cap: {(mockWorkingCapitalBase / 1000000).toFixed(0)}M</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
                style={{ width: `${reserveDrawbackPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Accrued wage volume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Aggregate Accrued Pay</span>
              <span className="text-xl font-bold text-slate-900 font-mono block mt-1">
                {totalEwaPortfolioAccrued.toLocaleString()} MMK
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <i className="fa-solid fa-chart-line text-xs"></i>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
              Gross payroll accrued up to June {cycleDay} ({Math.round(accruedRatio * 100)}% cycle elapsed).
            </p>
          </div>
        </div>

        {/* EWA funds outstanding */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Disbursed Advances</span>
              <span className="text-xl font-bold text-slate-900 font-mono block mt-1">
                {totalActivelyDrawnThisCycle.toLocaleString()} MMK
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <i className="fa-solid fa-money-bill-transfer text-xs"></i>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
              Accumulated withdrawable salary drawn by whitelisted workforce this cycle.
            </p>
          </div>
        </div>

        {/* EWA Remaining available */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Remaining EWA Liquidity</span>
              <span className="text-xl font-bold text-emerald-600 font-mono block mt-1">
                {totalAvailableAdvanceLiquidity.toLocaleString()} MMK
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <i className="fa-solid fa-wallet text-xs"></i>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
              Total compliant funding buffer remaining available for workforce withdrawal right now.
            </p>
          </div>
        </div>

      </div>

      {/* Main Interactive Screen Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Side: Employees Accruals & EWA Spreadsheet Ledger (Take up 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            
            {/* Table control filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Compliant EWA Accrual Ledger</h4>
                <p className="text-xs text-slate-500">Select an employee row to review and authorize on-behalf wage payouts.</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <input 
                  type="text" 
                  placeholder="ID or search name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none min-w-36 bg-slate-50/50"
                />
                
                <select 
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white font-semibold text-slate-700"
                >
                  <option value="ALL">All Depts</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>

                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white font-semibold text-slate-700"
                >
                  <option value="ALL">All States</option>
                  <option value="WHITELISTED">EWA Whitelisted</option>
                  <option value="DISABLED">EWA Disabled</option>
                  <option value="CONFLICT">Status Conflict</option>
                </select>
              </div>
            </div>

            {/* Comprehensive accurate table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[9px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3.5">Employee ID</th>
                    <th className="px-4 py-3.5">Personnel Name</th>
                    <th className="px-4 py-3.5">Gross Pay</th>
                    <th className="px-4 py-3.5">Accrued up to Day {cycleDay}</th>
                    <th className="px-4 py-3.5 text-center">EWA Cap</th>
                    <th className="px-4 py-3.5">Drawn Balance</th>
                    <th className="px-4 py-3.5">Net Available</th>
                    <th className="px-4 py-3.5 text-right">Authorize Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-400 font-medium">
                        No workers match active search filter settings.
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-4 py-4 font-mono font-bold text-slate-400">{row.id}</td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-slate-900">{row.name}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">{row.department}</div>
                        </td>
                        <td className="px-4 py-4 text-slate-900 font-mono font-bold">
                          {row.gross.toLocaleString()}<span className="text-[9px] ml-0.5 text-slate-400">MMK</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-mono text-slate-900 font-semibold">{row.accrued.toLocaleString()}</div>
                          <div className="text-[9px] text-slate-400 font-bold font-mono">({Math.round((row.accrued / row.gross)*100)}%)</div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="font-mono font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md px-1.5 py-0.5 text-[10px]">
                            {row.capPct}%
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`font-mono font-bold ${row.drawn > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                            {row.drawn.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`font-mono font-bold text-[13px] ${row.available > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {row.available.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button 
                            disabled={row.available <= 0 || !row.isWhitelisted || row.status !== 'active'}
                            onClick={() => handleOpenAdvanceModal(row)}
                            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition shadow-sm ${
                              row.available > 0 && row.isWhitelisted && row.status === 'active'
                                ? 'border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                                : 'border-zinc-200 text-stone-400 bg-stone-50 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <i className="fa-solid fa-paper-plane mr-1 text-[9px]"></i>
                            Advance EWA
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Compliance Help & Tax Withholding advisory card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm flex flex-col md:flex-row gap-5 items-center justify-between">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-slate-800 rounded-xl text-emerald-400 flex-shrink-0 animate-pulse">
                <i className="fa-solid fa-scale-balanced text-xl"></i>
              </div>
              <div>
                <h5 className="font-extrabold text-white text-sm">Regulatory SSM/CBM Labor Code Compliance</h5>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  EWA system caps overall cumulative dynamic advance drawdowns at <strong className="text-white font-mono">50% of monthly gross wages</strong>. This guarantees perfect adherence to local labor rules restricting out-of-cycle payroll debt-spirals and safeguards staff take-home pay. Standard 2% Personal Income Tax is automatically reserved.
                </p>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center gap-3 w-full md:w-auto flex-shrink-0">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
              <span className="text-[10px] uppercase font-bold text-slate-300 font-mono tracking-widest">
                SYSTEM AUDIT: 100% SECURE
              </span>
            </div>
          </div>

        </div>

        {/* Right Side Controls: Treasury Funding Projections & Stress Simulation */}
        <div className="space-y-6">

          {/* 1. Treasury Pool Sourcing Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="border-b border-slate-50 pb-3">
              <h4 className="text-sm font-bold text-slate-900">Treasury Sourcing Rules</h4>
              <p className="text-xs text-slate-500">Configure how early wage advances are loaded or funded.</p>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] uppercase font-bold text-slate-500">Funding Source Selector</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setFundingSource('treasury')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition text-center flex flex-col items-center gap-1 ${
                    fundingSource === 'treasury'
                      ? 'border-emerald-500 text-emerald-800 bg-emerald-50'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <i className="fa-solid fa-briefcase text-sm"></i>
                  <span>Corporate Reserves</span>
                </button>
                <button 
                  onClick={() => setFundingSource('syndicated')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition text-center flex flex-col items-center gap-1 ${
                    fundingSource === 'syndicated'
                      ? 'border-indigo-500 text-indigo-800 bg-indigo-50'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <i className="fa-solid fa-building-columns text-sm"></i>
                  <span>Syndicated Bank Credit</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-[10px] uppercase font-bold text-slate-500">Early Payout Pricing Model</label>
              <div className="space-y-2">
                {[
                  { id: 'subsidized', title: 'Subsidized Benefit', desc: 'Flat 0% interest, 0 MMK fee (fully company covered)', icon: 'fa-gift', color: 'text-rose-500' },
                  { id: 'microfee', title: 'Fixed Transaction Fee', desc: `Flat MMK ${flatTxFee.toLocaleString()} handling charge per withdraw`, icon: 'fa-tags', color: 'text-emerald-500' },
                  { id: 'interest', title: 'Marginal Capital Interest', desc: `${interestMargin}% fee derived from early capital duration`, icon: 'fa-percent', color: 'text-indigo-500' }
                ].map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => setPayoutModel(m.id as any)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-start gap-2.5 ${
                      payoutModel === m.id
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-slate-100 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg bg-slate-50 mt-0.5 ${m.color}`}>
                      <i className={`fa-solid ${m.icon}`}></i>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{m.title}</span>
                      <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{m.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* 2. Working Capital Stress-Testing Projections */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="border-b border-slate-50 pb-3">
              <h4 className="text-sm font-bold text-slate-900">Capital Stress & Adoption Simulator</h4>
              <p className="text-xs text-slate-500">Inspect liquidity impact depending on EWA adoption speed.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">
                  <span>Projected Workforce Adoption</span>
                  <span className="text-slate-900 font-extrabold">{utilizationStress}%</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  step="5"
                  value={utilizationStress}
                  onChange={(e) => setUtilizationStress(Number(e.target.value))}
                  className="w-full accent-slate-900 h-1 bg-slate-100 rounded-lg cursor-pointer appearance-none"
                />
              </div>

              {/* Projections breakdown */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3.5">
                <div className="flex justify-between text-xs border-b border-indigo-100/50 pb-2">
                  <span className="font-semibold text-slate-500">Projected Monthly Drawdown:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {projectedMonthlyDrawdown.toLocaleString()} MMK
                  </span>
                </div>
                <div className="flex justify-between text-xs border-b border-indigo-100/50 pb-2">
                  <span className="font-semibold text-slate-500">Annual Credit Line Costs:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {Math.round(projectedMonthlyDrawdown * interestMargin * 12 / 100).toLocaleString()} MMK
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-500">Working Capital Buffer Safety:</span>
                  <span className={`font-bold font-mono ${utilizationStress > 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {utilizationStress > 65 ? 'ADVISORY' : 'ADEQUATE'} ({100 - utilizationStress}%)
                  </span>
                </div>
              </div>

              {/* Stress Visual Chart Projections */}
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block font-mono">Simulated Capital Projection Peak</span>
                <div className="h-24 w-full relative">
                  <svg viewBox="0 0 300 80" className="w-full h-full text-indigo-500">
                    <path 
                      d={`M 10 70 Q 150 ${Math.max(70 - (utilizationStress * 0.6), 5)}, 290 ${Math.max(75 - (utilizationStress * 0.5), 10)}`}
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                    />
                    <circle cx="290" cy={Math.max(75 - (utilizationStress * 0.5), 10)} r="3.5" className="fill-white stroke-indigo-600 stroke-2" />
                  </svg>
                  <div className="flex justify-between text-[8px] font-bold text-slate-400 font-mono mt-1">
                    <span>CYCLE DAY 1</span>
                    <span>MID CYCLE</span>
                    <span>CLOSING REPORT</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 3. CSR Corporate Match Hub widget */}
          <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
            <div className="text-3xl text-rose-500">
              <i className="fa-solid fa-hand-holding-heart animate-bounce"></i>
            </div>
            <div>
              <span className="text-[9px] font-bold text-rose-400 tracking-widest block uppercase font-mono">
                CSR Integration Match: Active
              </span>
              <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                Company Match Multiplier set at <strong className="text-white font-mono">{companyMatchPercent}%</strong>. Staff early decimal donations automatically load equal corporate charity funding.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Advanced Drawer/Modal Backdrop */}
      {isModalOpen && selectedEmpForAdvance && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-100 shadow-2xl overflow-hidden p-6 space-y-4">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-signature text-emerald-600"></i>
                  On-Behalf EWA Payout Request
                </h4>
                <p className="text-xs text-slate-500">Process instant early wage release. Confirm matching parameters.</p>
              </div>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedEmpForAdvance(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Error messaging state */}
            {validationError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation text-rose-500 text-sm"></i>
                <span>{validationError}</span>
              </div>
            )}

            {/* Selected personnel specs */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[9px] block">Target Personnel</span>
                <span className="font-bold text-slate-900 block mt-0.5">{selectedEmpForAdvance.name}</span>
                <span className="font-mono text-[10px] text-slate-400">{selectedEmpForAdvance.id}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[9px] block">Tenure Band (Cap Ceiling)</span>
                <span className="font-extrabold text-indigo-600 block mt-0.5">{selectedEmpForAdvance.department} ({selectedEmpForAdvance.capPct}%)</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[9px] block">Simulated Accrued Wages</span>
                <span className="font-mono font-bold text-slate-900 block mt-0.5">{selectedEmpForAdvance.accrued.toLocaleString()} MMK</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[9px] block">Max Available EWA Drawdown</span>
                <span className="font-mono font-bold text-teal-600 block mt-0.5">{selectedEmpForAdvance.ewaLimit.toLocaleString()} MMK</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-800">
                <span>Drawn this cycle: <strong className="font-mono font-normal text-slate-500">{selectedEmpForAdvance.drawn.toLocaleString()} MMK</strong></span>
                <span className="text-emerald-600">Net available check: <strong className="font-mono">{selectedEmpForAdvance.available.toLocaleString()} MMK</strong></span>
              </div>
            </div>

            {/* Modal Input Form */}
            <form onSubmit={handleAuthorizeAdvanceSubmit} className="space-y-4">
              
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase text-slate-500">
                  Withdrawal Amount (MMK)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-bold text-slate-400 text-xs font-mono">
                    MMK
                  </div>
                  <input 
                    type="number" 
                    placeholder={`Ex. ${Math.min(50000, selectedEmpForAdvance.available)}`}
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(e.target.value)}
                    max={selectedEmpForAdvance.available}
                    className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 text-xs font-mono font-bold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 block font-medium">
                  ISO 20022 immediate Bank clearance protocol applies. Subject to 2% compliance income tax deduction.
                </span>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <label className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                  <span>CSR Roundup Donation (Matched % of Advance)</span>
                  <span className="text-rose-500 text-xs font-bold">{charityDonationPct}% contribution</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="2"
                  value={charityDonationPct}
                  onChange={(e) => setCharityDonationPct(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1 bg-slate-100 rounded-lg cursor-pointer appearance-none"
                />
                <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  <span>No Contribution (0%)</span>
                  <span>2% Donation</span>
                  <span>6% Match</span>
                  <span>Max CSR (10%)</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-4 justify-end border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedEmpForAdvance(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100"
                >
                  Discard Request
                </button>
                <button 
                  type="submit"
                  className="px-4.5 py-2 text-xs font-bold text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 flex items-center gap-1.5 transition"
                >
                  <i className="fa-solid fa-signature text-[10px]"></i>
                  Authorize & Wire EWA
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
