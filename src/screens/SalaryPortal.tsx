import { usePortalState } from '@/context/PortalStateContext';
import { useState, useMemo } from 'react';

interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: 'Treasury Officer' | 'HR Admin' | 'Finance Checker' | 'CSR Specialist';
  permissions: {
    approveEWAs: boolean;
    overrideCaps: boolean;
    modifyCycles: boolean;
    viewAuditLogs: boolean;
  };
  isActive: boolean;
}

export function SalaryPortal() {
  const { 
    employees, 
    disbursements, 
    addLog, 
    companyMatchPercent,
  } = usePortalState();

  // Simulated cycle day (Default is 19 representing June 19, 2026)
  const [cycleDay, setCycleDay] = useState(19);
  const totalDays = 30; // Standard cycle month
  const accruedRatio = cycleDay / totalDays;

  // Search & Filter state for Employee Ledger
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

  // -------------------------------------------------------------
  // USER & PERMISSION MANAGEMENT STATE
  // -------------------------------------------------------------
  const [portalUsers, setPortalUsers] = useState<PortalUser[]>([
    {
      id: "USR-001",
      name: "U Tin Aung",
      email: "tinaung@remixhr.com",
      role: "Treasury Officer",
      permissions: { approveEWAs: true, overrideCaps: false, modifyCycles: true, viewAuditLogs: true },
      isActive: true
    },
    {
      id: "USR-002",
      name: "Daw Hla Hla",
      email: "hlahla@remixhr.com",
      role: "HR Admin",
      permissions: { approveEWAs: true, overrideCaps: true, modifyCycles: false, viewAuditLogs: true },
      isActive: true
    },
    {
      id: "USR-003",
      name: "Ko Thiha",
      email: "thiha@remixhr.com",
      role: "Finance Checker",
      permissions: { approveEWAs: false, overrideCaps: false, modifyCycles: false, viewAuditLogs: true },
      isActive: true
    },
    {
      id: "USR-004",
      name: "Ma Su Mon",
      email: "sumon@remixhr.com",
      role: "CSR Specialist",
      permissions: { approveEWAs: false, overrideCaps: false, modifyCycles: false, viewAuditLogs: false },
      isActive: false
    }
  ]);

  // Form states for creating a new user
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Treasury Officer' | 'HR Admin' | 'Finance Checker' | 'CSR Specialist'>('HR Admin');
  const [newUserPermApprove, setNewUserPermApprove] = useState(false);
  const [newUserPermOverride, setNewUserPermOverride] = useState(false);
  const [newUserPermModify, setNewUserPermModify] = useState(false);
  const [newUserPermLogs, setNewUserPermLogs] = useState(true);

  // Active Tab: Switch between 'ewa' and 'users'
  const [activeTab, setActiveTab] = useState<'ewa' | 'users'>('ewa');

  // Helper: Get employee cap limit percentage
  const getCapPct = (empId: string, dept: string) => {
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
      const accrued = Math.round(gross * accruedRatio);
      const capPct = getCapPct(emp.id, emp.department);
      const ewaLimit = Math.min(
        Math.round(accrued * (capPct / 100)),
        Math.round(gross * 0.5) // Myanmar absolute labor limit cap
      );
      const drawn = getDrawnAmount(emp.id);
      const available = Math.max(ewaLimit - drawn, 0);

      // Simple calculation for taxes and status indicators for reports
      const personalTaxRef = Math.round(accrued * 0.02);
      const isOverdrawn = drawn > ewaLimit;

      return {
        ...emp,
        gross,
        accrued,
        capPct,
        ewaLimit,
        drawn,
        available,
        personalTaxRef,
        isOverdrawn
      };
    });
  }, [employees, cycleDay, disbursements, localAdvances]);

  // Filtered rows for rendered table
  const filteredLedger = useMemo(() => {
    return ledgerData.filter((row) => {
      const matchesSearch = 
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = deptFilter === 'ALL' || row.department === deptFilter;
      const matchesStatus = 
        statusFilter === 'ALL' ||
        (statusFilter === 'WHITELISTED' && row.isWhitelisted) ||
        (statusFilter === 'DISABLED' && !row.isWhitelisted) ||
        (statusFilter === 'FUNDS_AVAILABLE' && row.available > 0) ||
        (statusFilter === 'WITHDRAWN_ACTIVE' && row.drawn > 0);
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
      setValidationError(`Limit exceeded: Maximum allowable right now is ${emp.available.toLocaleString()} MMK.`);
      return;
    }

    const donationAmount = Math.round(amountVal * (charityDonationPct / 100));

    setLocalAdvances((prev) => ({
      ...prev,
      [emp.id]: (prev[emp.id] || 0) + amountVal,
    }));

    addLog(
      `Enterprise EWA Issued to ${emp.name} (${emp.id}): ${amountVal.toLocaleString()} MMK. CSR Donation of ${donationAmount.toLocaleString()} MMK included.`
    );

    setSuccessToast(`Early Salary release authorized for ${emp.name}. MMK ${amountVal.toLocaleString()} dispatched successfully.`);
    setTimeout(() => setSuccessToast(''), 4000);

    setIsModalOpen(false);
    setSelectedEmpForAdvance(null);
  };

  // User Actions: Toggle status of a portal admin
  const toggleUserStatus = (userId: string) => {
    setPortalUsers(prev => 
      prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u)
    );
    const user = portalUsers.find(u => u.id === userId);
    if (user) {
      addLog(`Security Admin updated status for ${user.name} (${userId}) to ${!user.isActive ? 'ACTIVE' : 'INACTIVE'}`);
    }
  };

  // User Actions: Toggle individual permissions
  const toggleUserPermission = (userId: string, permissionKey: keyof PortalUser['permissions']) => {
    setPortalUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const updatedPerms = { ...u.permissions, [permissionKey]: !u.permissions[permissionKey] };
          return { ...u, permissions: updatedPerms };
        }
        return u;
      })
    );
    const user = portalUsers.find(u => u.id === userId);
    if (user) {
      addLog(`Security Guard updated permissions for ${user.name} [${permissionKey}]`);
    }
  };

  // User Actions: Create user
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert('Please specify name and a corporate email address.');
      return;
    }

    const newId = `USR-0${portalUsers.length + 1}`;
    const newUser: PortalUser = {
      id: newId,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      permissions: {
        approveEWAs: newUserPermApprove,
        overrideCaps: newUserPermOverride,
        modifyCycles: newUserPermModify,
        viewAuditLogs: newUserPermLogs,
      },
      isActive: true,
    };

    setPortalUsers(prev => [...prev, newUser]);
    addLog(`System Auth registered new portal administrator: ${newUserName} as role ${newUserRole}`);
    
    // Reset Form
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPermApprove(false);
    setNewUserPermOverride(false);
    setNewUserPermModify(false);
    setSuccessToast(`Portal Security user "${newUserName}" successfully provisioned.`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="w-full text-slate-800 font-sans select-none antialiased space-y-6">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-700/80 text-white px-5 py-4 rounded-xl shadow-xl flex items-center gap-3.5 z-50 animate-bounce font-mono text-xs">
          <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
          <div>
            <div className="font-bold uppercase tracking-wider text-slate-300">Transaction Approved</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{successToast}</div>
          </div>
        </div>
      )}

      {/* Modern High-Fidelity Header Card with Slate Accent */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 w-2 h-full bg-slate-900"></div>
        <div className="space-y-1 sm:space-y-1.5 pl-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black bg-slate-900 text-white font-mono tracking-widest">
              Fintech EWA Core
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            EMPLOYEE EARNED WAGE REGISTER COCKPIT
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl font-medium">
            Monitor real-time corporate treasury reserves, check personnel accrued earnings, process on-demand payout logs, and authorize administrator IAM profiles.
          </p>
        </div>

        {/* Tab Selection Pill Capsules */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-xl self-start md:self-auto shadow-inner border border-slate-200/50">
          <button
            onClick={() => setActiveTab('ewa')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ewa'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <i className={`fa-solid fa-wallet ${activeTab === 'ewa' ? 'text-white' : 'text-slate-400'}`}></i>
            <span className="font-mono uppercase tracking-wider">Accrual Ledger</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <i className={`fa-solid fa-user-shield ${activeTab === 'users' ? 'text-white' : 'text-slate-400'}`}></i>
            <span className="font-mono uppercase tracking-wider">Security Access</span>
          </button>
        </div>
      </div>

      {/* Dynamic Pro-Rata Accrual Cycle Simulator Card (Gorgeous Rounded Gradient Theme) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Active Cycle Progress Multiplier
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white font-mono tracking-wide">
              Live Month Period: June 1 - June 30, 2026
            </h4>
            <p className="text-xs text-slate-400">
              Drag the control slider to simulate calendar dates. Real-time wage accruals calculate on-the-fly.
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-5 py-3 text-center min-w-[160px] shadow-lg">
            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider font-mono">Simulated Date</span>
            <span className="text-xl font-black font-mono text-emerald-400 tracking-tight">June {cycleDay}, 2026</span>
          </div>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-center gap-5">
            <span className="text-xs font-black text-slate-500 font-mono w-10">Day 1</span>
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={cycleDay}
              onChange={(e) => setCycleDay(Number(e.target.value))}
              className="flex-1 accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer border border-slate-700"
            />
            <span className="text-xs font-black text-slate-500 font-mono w-10 text-right">Day 30</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono text-center sm:text-left">
            <span className="text-left">Cycle Open (0%)</span>
            <span className="hidden sm:inline text-left">Week 1 (23%)</span>
            <span className="text-center">Midpoint (50%)</span>
            <span className="hidden sm:inline text-right">Week 3 (73%)</span>
            <span className="text-right text-emerald-400">Payroll Cutoff (100%)</span>
          </div>
        </div>
      </div>

      {/* Aggregate Real-time Stat Widget Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Cash Reserves Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-6 -mt-6 group-hover:bg-indigo-100/70 transition-colors"></div>
          <div className="relative flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Treasury Cash Reserves</span>
              <span className="text-xl font-black text-slate-900 font-mono block tracking-tight">
                {remainingCashReserve.toLocaleString()} MMK
              </span>
              <div className="pt-2 flex items-center justify-between gap-4 text-[10px] text-slate-500 font-mono">
                <span>Drawn Rate: <strong className="text-slate-800">{reserveDrawbackPct}%</strong></span>
                <span>Max: {(mockWorkingCapitalBase / 1000000).toFixed(0)}M</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-50 border border-indigo-100/50 rounded-xl text-indigo-600">
              <i className="fa-solid fa-vault text-base"></i>
            </div>
          </div>
        </div>

        {/* Aggregate Accrued Wages Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-full -mr-6 -mt-6 group-hover:bg-sky-100/70 transition-colors"></div>
          <div className="relative flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Aggregate Accrued Wages</span>
              <span className="text-xl font-black text-slate-900 font-mono block tracking-tight">
                {totalEwaPortfolioAccrued.toLocaleString()} MMK
              </span>
              <p className="text-[10px] text-slate-500 font-medium">
                Cycle Progress Index: <strong className="text-slate-800">{Math.round(accruedRatio * 100)}%</strong>
              </p>
            </div>
            <div className="p-3 bg-sky-50 border border-sky-100/50 rounded-xl text-sky-600">
              <i className="fa-solid fa-chart-line text-base"></i>
            </div>
          </div>
        </div>

        {/* Disbursed Advances Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-6 -mt-6 group-hover:bg-emerald-100/70 transition-colors"></div>
          <div className="relative flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Disbursed Advances</span>
              <span className="text-xl font-black text-slate-900 font-mono block tracking-tight">
                {totalActivelyDrawnThisCycle.toLocaleString()} MMK
              </span>
              <p className="text-[10px] text-slate-500 font-medium">
                Active out-of-cycle transfers verified.
              </p>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-100/50 rounded-xl text-emerald-600">
              <i className="fa-solid fa-money-bill-transfer text-base"></i>
            </div>
          </div>
        </div>

        {/* Remainder Liquidity Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-6 -mt-6 group-hover:bg-purple-100/70 transition-colors"></div>
          <div className="relative flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Withdrawable Buffer</span>
              <span className="text-xl font-black text-emerald-700 font-mono block tracking-tight">
                {totalAvailableAdvanceLiquidity.toLocaleString()} MMK
              </span>
              <p className="text-[10px] text-slate-500 font-medium">
                Remaining EWA allocation pools.
              </p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-100/50 rounded-xl text-purple-600">
              <i className="fa-solid fa-wallet text-base"></i>
            </div>
          </div>
        </div>

      </div>

      {/* Main Container Layout */}
      {activeTab === 'ewa' ? (
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Sifting Register & Ledger Report */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search and Filters Section */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-slate-900 rounded-lg text-white text-[10px]">
                    <i className="fa-solid fa-filter"></i>
                  </span>
                  <h4 className="text-xs font-black uppercase tracking-wider font-mono text-slate-900">
                    Sifting & Searching Registers
                  </h4>
                </div>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setDeptFilter('ALL');
                    setStatusFilter('ALL');
                  }}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase font-mono flex items-center gap-1.5 transition-colors"
                >
                  <i className="fa-solid fa-trash-can"></i> Clear All Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase font-black text-slate-400 font-mono">Search Name / ID</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none text-xs">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input 
                      type="text"
                      placeholder="Type component keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full text-xs placeholder-slate-400 border border-slate-200 rounded-xl bg-slate-50/50 pl-9 pr-3.5 py-2.5 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-800 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase font-black text-slate-400 font-mono">Department</label>
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="w-full text-xs font-bold text-slate-600 border border-slate-200 rounded-xl bg-white p-2.5 focus:ring-2 focus:ring-slate-900/5 focus:outline-none transition-all"
                  >
                    <option value="ALL">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase font-black text-slate-400 font-mono">EWA Access Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full text-xs font-bold text-slate-600 border border-slate-200 rounded-xl bg-white p-2.5 focus:ring-2 focus:ring-slate-900/5 focus:outline-none transition-all"
                  >
                    <option value="ALL">All Access Statuses</option>
                    <option value="WHITELISTED">EWA Whitelisted</option>
                    <option value="DISABLED">EWA Excluded</option>
                    <option value="FUNDS_AVAILABLE">Available Buffer</option>
                    <option value="WITHDRAWN_ACTIVE">Already Drawn</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Comprehensive Report Table Ledger */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                  <span className="text-[10px] font-black uppercase text-slate-900 tracking-wider font-mono">
                    Staff Pro-Rata Accrual Ledgers
                  </span>
                </div>
                <span className="text-[10px] bg-slate-200 text-slate-800 font-bold font-mono px-3 py-1 rounded-full">
                  Found: {filteredLedger.length} Records
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-55 border-b border-slate-100 text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                      <th className="px-5 py-4">Employee ID</th>
                      <th className="px-5 py-4">Personnel Info</th>
                      <th className="px-5 py-4 font-mono">Gross Wages</th>
                      <th className="px-5 py-4 text-center">EWA Cap</th>
                      <th className="px-5 py-4">Accrued up to Day {cycleDay}</th>
                      <th className="px-5 py-4 font-mono">Drawn Amount</th>
                      <th className="px-5 py-4 font-mono">Available Balance</th>
                      <th className="px-5 py-4 text-right">Action Gate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredLedger.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-16 text-slate-400 font-medium font-mono bg-slate-50/10">
                          <i className="fa-solid fa-rectangle-xmark text-2xl mb-2 block text-slate-300"></i>
                          No active query records encountered. Try removing filters.
                        </td>
                      </tr>
                    ) : (
                      filteredLedger.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-5 py-4 font-mono text-xs text-slate-400 font-bold group-hover:text-slate-900 transition-colors">
                            {row.id}
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-900 text-sm">{row.name}</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold mt-0.5">{row.department}</div>
                          </td>
                          <td className="px-5 py-4 font-mono text-slate-900 font-bold">
                            {row.gross.toLocaleString()}<span className="text-[10px] text-slate-400 font-normal ml-0.5">MMK</span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="font-mono font-black text-slate-700 text-xs bg-slate-100 rounded px-1.5 py-0.5">
                              {row.capPct}%
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-mono text-slate-900 font-bold">{row.accrued.toLocaleString()} MMK</div>
                            <span className="text-[9px] text-emerald-800 font-bold font-mono uppercase bg-emerald-50 border border-emerald-100 px-1 rounded-sm">
                              {Math.round((row.accrued / row.gross) * 100)}% Accrued
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono">
                            <span className={`font-semibold text-xs ${row.drawn > 0 ? 'text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded' : 'text-slate-450 text-slate-400'}`}>
                              {row.drawn.toLocaleString()} MMK
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono">
                            <span className={`font-black text-xs ${row.available > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                              {row.available.toLocaleString()} MMK
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              disabled={row.available <= 0 || !row.isWhitelisted || row.status !== 'active'}
                              onClick={() => handleOpenAdvanceModal(row)}
                              className={`text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl border transition-all ${
                                row.available > 0 && row.isWhitelisted && row.status === 'active'
                                  ? 'border-slate-900 text-white bg-slate-900 hover:bg-slate-800 hover:border-slate-800 hover:shadow-sm'
                                  : 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed opacity-50'
                              }`}
                            >
                              <i className="fa-solid fa-signature mr-1.5"></i>
                              Disburse
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Secure compliance note */}
            <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-3.5 items-center">
                <div className="p-2 bg-slate-800 border border-slate-700 text-amber-400 rounded-xl animate-pulse">
                  <i className="fa-solid fa-shield-halved text-base"></i>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white tracking-tight block">
                    CBM Regulatory Safety Compliance Enforced
                  </span>
                  <span className="text-[10px] text-slate-400 block max-w-lg font-medium">
                    All transaction pools align standard article caps limits & taxation records for transparency audit controls.
                  </span>
                </div>
              </div>
              <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                System Active
              </span>
            </div>

          </div>

          {/* Right Column: Funding settings & stress analysis */}
          <div className="space-y-6">
            
            {/* Funding Settings */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3.5">
                <h4 className="text-xs font-black uppercase tracking-wider font-mono text-slate-900">
                  Treasury Funding Control
                </h4>
                <p className="text-xs text-slate-400 mt-1">Configure backing reserve reserves pool & employee charges structures.</p>
              </div>

              <div className="space-y-2.5">
                <label className="block text-[9px] uppercase font-black text-slate-400 font-mono">Reserves Asset Sourcing</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button 
                    onClick={() => setFundingSource('treasury')}
                    className={`px-3.5 py-3 rounded-xl text-xs font-extrabold uppercase border transition-all text-center flex flex-col items-center gap-2 ${
                      fundingSource === 'treasury'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <i className="fa-solid fa-briefcase text-sm"></i>
                    <span>Internal Capital</span>
                  </button>
                  <button 
                    onClick={() => setFundingSource('syndicated')}
                    className={`px-3.5 py-3 rounded-xl text-xs font-extrabold uppercase border transition-all text-center flex flex-col items-center gap-2 ${
                      fundingSource === 'syndicated'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <i className="fa-solid fa-building-columns text-sm"></i>
                    <span>Syndicated Line</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="block text-[9px] uppercase font-black text-slate-400 font-mono">Employee cost model</label>
                <div className="space-y-2">
                  {[
                    { id: 'subsidized', title: 'Zero cost program Benefit', desc: 'Flat zero cost corporate sponsorship', icon: 'fa-gift' },
                    { id: 'microfee', title: 'Flat Handling wire surcharge', desc: `Only MMK ${flatTxFee.toLocaleString()} static transaction charge`, icon: 'fa-receipt' },
                    { id: 'interest', title: 'Period Margin percentage', desc: `${interestMargin}% safety buffer margin`, icon: 'fa-percent' }
                  ].map((m) => (
                    <button 
                      key={m.id}
                      onClick={() => setPayoutModel(m.id as any)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                        payoutModel === m.id
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-100 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="mt-0.5">
                        <i className={`fa-solid ${m.icon} text-base`}></i>
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-extrabold block uppercase tracking-tight">{m.title}</span>
                        <span className={`text-[10px] block ${payoutModel === m.id ? 'text-slate-350 text-slate-300' : 'text-slate-450 text-slate-400'}`}>{m.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stress Simulator Chart Widget */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3.5">
                <h4 className="text-xs font-black uppercase tracking-wider font-mono text-slate-900">
                  Liquidity Stress Projection
                </h4>
                <p className="text-xs text-slate-400 mt-1">Analyze projected monthly drawdowns relative to adoption metrics.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase font-black text-slate-400 font-mono">
                    <span>Adoption scale</span>
                    <span className="text-slate-900 font-black">{utilizationStress}% of staff</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="100" 
                    step="5"
                    value={utilizationStress}
                    onChange={(e) => setUtilizationStress(Number(e.target.value))}
                    className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4.5 space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-2 text-slate-600">
                    <span>Peak Capital Stress:</span>
                    <span className="text-slate-900 font-bold">
                      {projectedMonthlyDrawdown.toLocaleString()} MMK
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2 text-slate-600">
                    <span>Estimated Period Cost:</span>
                    <span className="text-slate-900 font-bold">
                      {Math.round(projectedMonthlyDrawdown * interestMargin * 12 / 100).toLocaleString()} MMK
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Reserves Health:</span>
                    <span className={`font-black ${utilizationStress > 60 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {utilizationStress > 65 ? 'EXPOSURE RISK' : 'ADEQUATE SHIELD'} ({100 - utilizationStress}%)
                    </span>
                  </div>
                </div>

                {/* Simulated Curve Plot */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Sinking Reserve Model Curve</span>
                  <div className="h-24 w-full relative bg-slate-50 border border-slate-100 rounded-xl p-2 pb-1 overflow-hidden">
                    <svg viewBox="0 0 300 80" className="w-full h-full text-slate-900">
                      <path 
                        d={`M 10 70 Q 150 ${Math.max(70 - (utilizationStress * 0.6), 8)}, 290 ${Math.max(75 - (utilizationStress * 0.5), 14)}`}
                        fill="none" 
                        stroke="#0f172a" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                      />
                      <circle cx="290" cy={Math.max(75 - (utilizationStress * 0.5), 14)} r="5" className="fill-emerald-400 stroke-slate-950 stroke-2 animate-ping" />
                      <circle cx="290" cy={Math.max(75 - (utilizationStress * 0.5), 14)} r="4" className="fill-white stroke-slate-950 stroke-2" />
                    </svg>
                    <div className="flex justify-between text-[8px] font-bold text-slate-400 font-mono px-2 pt-1">
                      <span>June 1</span>
                      <span>Month Half</span>
                      <span>Cutoff</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      ) : (
        
        /* Tab 2: User Access & Identity Setup screen */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in">
          
          {/* Active Admins Configuration Lists */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase tracking-wider font-mono text-slate-900">
                    Portal Active Identity Registry
                  </h4>
                  <p className="text-xs text-slate-400">Configure role assignments, state controls, and granular permissions.</p>
                </div>
                <span className="text-[10px] bg-slate-900 text-white font-mono px-3 py-1 rounded-full uppercase tracking-wider">
                  IAM Protection active
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {portalUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all ${
                      user.isActive ? 'bg-white' : 'bg-slate-50/50 grayscale opacity-70'
                    }`}
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-[10px] text-slate-400 font-extrabold bg-slate-100 px-2 py-0.5 rounded">
                          {user.id}
                        </span>
                        <h5 className="font-extrabold text-base text-slate-900">{user.name}</h5>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                          user.isActive 
                            ? 'border-emerald-200 text-emerald-800 bg-emerald-50' 
                            : 'border-slate-200 text-slate-400 bg-slate-100'
                        }`}>
                          {user.isActive ? 'Active' : 'Revoked'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 font-semibold font-mono">
                        <span>
                          <i className="fa-solid fa-envelope mr-1.5 text-slate-400"></i>
                          {user.email}
                        </span>
                        <span>
                          <i className="fa-solid fa-id-badge mr-1.5 text-slate-400"></i>
                          Role Profile: <strong className="text-slate-800">{user.role}</strong>
                        </span>
                      </div>

                      {/* Explicit Interactive Permission badget-capsules */}
                      <div className="pt-2 flex flex-wrap gap-2">
                        {[
                          { key: 'approveEWAs', label: 'Approve early pay' },
                          { key: 'overrideCaps', label: 'Override caps' },
                          { key: 'modifyCycles', label: 'Modify cycles' },
                          { key: 'viewAuditLogs', label: 'View logs' }
                        ].map((perm) => {
                          const hasPerm = user.permissions[perm.key as keyof typeof user.permissions];
                          return (
                            <button
                              key={perm.key}
                              disabled={!user.isActive}
                              onClick={() => toggleUserPermission(user.id, perm.key as any)}
                              className={`text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border transition-all ${
                                !user.isActive 
                                  ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                                  : hasPerm
                                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700'
                              }`}
                            >
                              <i className={`fa-solid ${hasPerm ? 'fa-square-check' : 'fa-square'} mr-1 text-[11px]`}></i>
                              {perm.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action controls button */}
                    <div className="shrink-0">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all w-full sm:w-auto text-center ${
                          user.isActive
                            ? 'border-rose-200 text-rose-800 bg-rose-50/50 hover:bg-rose-600 hover:text-white hover:border-rose-600'
                            : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900'
                        }`}
                      >
                        <i className={`fa-solid ${user.isActive ? 'fa-user-slash' : 'fa-user-check'} mr-1.5`}></i>
                        {user.isActive ? 'Revoke Profile' : 'Restore Profile'}
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Create New Identity profile Setup Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3.5">
              <h4 className="text-xs font-black uppercase tracking-wider font-mono text-slate-900">
                Provision Identity Profile
              </h4>
              <p className="text-xs text-slate-400 mt-1">Assign roles permissions & register corporate administrator access.</p>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4.5">
              
              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase font-black text-slate-400 font-mono">Full Name</label>
                <input 
                  type="text"
                  placeholder="Ex. U Kyaw Min"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-800 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase font-black text-slate-400 font-mono">Corporate business Email</label>
                <input 
                  type="email"
                  placeholder="kyawmin@remixhr.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-800 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase font-black text-slate-400 font-mono">Administrative Role Division</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full text-xs font-bold text-slate-600 border border-slate-200 rounded-xl bg-white p-3 focus:ring-2 focus:ring-slate-900/5 focus:outline-none transition-all"
                >
                  <option value="HR Admin">HR Admin (Accruals auditing)</option>
                  <option value="Treasury Officer">Treasury Officer (Cash matching releases)</option>
                  <option value="Finance Checker">Finance Checker (Buffer safety checks)</option>
                  <option value="CSR Specialist">CSR Specialist (CSR and charities matching)</option>
                </select>
              </div>

              <div className="space-y-3.5 border-t border-slate-100 pt-4">
                <span className="block text-[9px] uppercase font-black text-slate-900 font-mono">Assign default grants</span>
                
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 text-xs text-slate-600 font-semibold cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={newUserPermApprove}
                      onChange={(e) => setNewUserPermApprove(e.target.checked)}
                      className="accent-slate-900 w-4 h-4 rounded"
                    />
                    <span>Grant wire approval rights</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs text-slate-600 font-semibold cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={newUserPermOverride}
                      onChange={(e) => setNewUserPermOverride(e.target.checked)}
                      className="accent-slate-900 w-4 h-4 rounded"
                    />
                    <span>Grant limit override caps rights</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs text-slate-600 font-semibold cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={newUserPermModify}
                      onChange={(e) => setNewUserPermModify(e.target.checked)}
                      className="accent-slate-900 w-4 h-4 rounded"
                    />
                    <span>Grant cycle calendar shift rights</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs text-slate-600 font-semibold cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={newUserPermLogs}
                      onChange={(e) => setNewUserPermLogs(e.target.checked)}
                      className="accent-slate-900 w-4 h-4 rounded"
                    />
                    <span>Grant audit system log viewing</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-center text-xs font-black uppercase tracking-wider py-3 px-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-user-plus text-xs"></i>
                Create Admin Identity
              </button>

            </form>
          </div>

        </div>

      )}

      {/* Advanced Premium Rounded Dialog Modal */}
      {isModalOpen && selectedEmpForAdvance && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg border border-slate-100 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 transform transition-all scale-100">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-950 flex items-center gap-2 font-mono">
                  <i className="fa-solid fa-signature text-slate-900 text-sm"></i>
                  Authorize Early Wage release
                </h4>
                <p className="text-xs text-slate-400">Review employee accruals parameters to submit out-of-cycle payments safely.</p>
              </div>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedEmpForAdvance(null);
                }}
                className="p-1.5 bg-slate-50 border border-slate-200/60 rounded-full text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition-all"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* ValidationError Box */}
            {validationError && (
              <div className="bg-rose-50 border border-rose-150 text-rose-800 p-4 rounded-xl text-xs font-bold font-mono flex items-center gap-2.5 uppercase tracking-wide">
                <i className="fa-solid fa-circle-exclamation text-rose-600 text-sm animate-bounce"></i>
                <span>{validationError}</span>
              </div>
            )}

            {/* Quick Analytics Card inside dialog */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4.5 rounded-xl text-xs font-medium">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[9px] block font-mono">Target employee</span>
                <span className="font-extrabold text-slate-900 block mt-0.5">{selectedEmpForAdvance.name}</span>
                <span className="font-mono text-[10px] text-slate-400 block mt-0.5">{selectedEmpForAdvance.id}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[9px] block font-mono">Department Cap Limit</span>
                <span className="font-extrabold text-slate-900 block mt-0.5 uppercase">{selectedEmpForAdvance.department} ({selectedEmpForAdvance.capPct}% Guidelines)</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[9px] block font-mono">Accrued Wage index</span>
                <span className="font-mono font-bold text-slate-900 block mt-0.5">{selectedEmpForAdvance.accrued.toLocaleString()} MMK</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[9px] block font-mono">Maximum allowed buffer</span>
                <span className="font-mono font-black text-slate-900 block mt-0.5">{selectedEmpForAdvance.ewaLimit.toLocaleString()} MMK</span>
              </div>
              <div className="col-span-2 pt-2.5 border-t border-slate-200 flex justify-between font-mono text-[10px] font-bold text-slate-500 uppercase">
                <span>Drawn Rate: {selectedEmpForAdvance.drawn.toLocaleString()} MMK</span>
                <span className="text-slate-900 font-black">Net Remaining available: {selectedEmpForAdvance.available.toLocaleString()} MMK</span>
              </div>
            </div>

            {/* Form Input fields */}
            <form onSubmit={handleAuthorizeAdvanceSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="block text-[9px] font-extrabold uppercase text-slate-500 font-mono">
                  Enter Release Amount (MMK)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none font-bold text-slate-400 text-xs font-mono">
                    MMK
                  </div>
                  <input 
                    type="number" 
                    placeholder={`Maximum: ${selectedEmpForAdvance.available}`}
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(e.target.value)}
                    max={selectedEmpForAdvance.available}
                    className="w-full border border-slate-200 rounded-xl pl-14 pr-4 py-3 text-xs font-mono font-extrabold focus:ring-2 focus:ring-slate-900/5 focus:border-slate-800 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Matching matching parameters */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-[9px] font-bold uppercase text-slate-500 font-mono">
                  <span>CSR Matching Roundup Grant Contribution</span>
                  <span className="text-slate-900 font-black">{charityDonationPct}% Match</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="2"
                  value={charityDonationPct}
                  onChange={(e) => setCharityDonationPct(Number(e.target.value))}
                  className="w-full accent-slate-900 h-1.5 bg-slate-150 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">
                  <span>No Contribution</span>
                  <span>2% Match</span>
                  <span>6% Match</span>
                  <span>Max (10%)</span>
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
                  className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-slate-900 border border-slate-900 hover:bg-slate-800 hover:border-slate-800 transition-all flex items-center gap-2 shadow-sm"
                >
                  <i className="fa-solid fa-signature"></i>
                  Authorize & Wire MMK
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
