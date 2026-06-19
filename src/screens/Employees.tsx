import { usePortalState } from '@/context/PortalStateContext';
import { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  X, 
  Search, 
  Filter, 
  Edit2, 
  Sparkles, 
  RefreshCw,
  Sliders,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  ToggleLeft
} from 'lucide-react';
import { Employee } from '@/types';
import { translations } from '@/utils/translations';

export function Employees() {
  const { 
    employees, 
    toggleWhitelist, 
    addEmployee, 
    updateEmployee, 
    bulkUpdateEmployees, 
    addLog,
    language
  } = usePortalState();

  const dict = translations[language];

  // Screen Tabs
  const [activeTab, setActiveTab] = useState<'directory' | 'enterprise'>('directory');

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [whitelistFilter, setWhitelistFilter] = useState('ALL');

  // Individual Create Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [salary, setSalary] = useState('');
  const [isWhitelisted, setIsWhitelisted] = useState(true);
  const [empStatus, setEmpStatus] = useState<'active' | 'terminated' | 'conflict'>('active');
  const [customAction, setCustomAction] = useState<string>('NONE');

  // Modal / Inline Edit Employee state
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [editName, setEditName] = useState('');
  const [editDept, setEditDept] = useState('Engineering');
  const [editSalary, setEditSalary] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'terminated' | 'conflict'>('active');
  const [editWhitelisted, setEditWhitelisted] = useState(true);

  // Enterprise / Bulk Adjustment parameters
  const [bulkDept, setBulkDept] = useState('ALL');
  const [bulkMultiplier, setBulkMultiplier] = useState('1.0');
  const [bulkStatus, setBulkStatus] = useState('NO_CHANGE');
  const [bulkWhitelistAction, setBulkWhitelistAction] = useState('NO_CHANGE');

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Submit callback for individual creation
  const handleCreateEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !salary) return;
    const salaryVal = parseInt(salary, 10);
    if (isNaN(salaryVal) || salaryVal <= 0) {
      triggerToast('Please input a valid positive monthly salary value.');
      return;
    }

    // Trigger base creation
    const generatedId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

    addEmployee({
      name,
      department,
      salary: salaryVal,
      status: empStatus,
      isWhitelisted,
    });

    // Custom secondary action triggers
    if (customAction === 'WELCOME_SMS') {
      addLog(`[Quick Action] Dispatched secure EWA activation invitation SMS & email kit to ${name}. Gateway reference: SMS-OK-9830`);
    } else if (customAction === 'SENIOR_OVERRIDE') {
      addLog(`[Quick Action] special SmartCap policy override pre-allocated to ${name} (+10% extra dynamic advance allowance approved)`);
    } else if (customAction === 'STARTUP_LOAN') {
      addLog(`[Quick Action] Pre-authorized instant wage advance setup. Deposited initial 50,000 MMK startup budget into ${name}'s mobile wallet.`);
    } else if (customAction === 'LEGAL_CLEARANCE') {
      addLog(`[Quick Action] Pre-verified identity via decentralized electronic CBM portal. AML/SEC clearance code attached to ${name}.`);
    }

    triggerToast(`Personnel ${name} was created successfully! Custom integration action execution: COMPLETE.`);
    
    // Reset state fields
    setName('');
    setSalary('');
    setCustomAction('NONE');
    setEmpStatus('active');
    setIsWhitelisted(true);
    setShowAddForm(false);
  };

  // Submit callback for individual updates
  const handleUpdateEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp) return;

    const salaryVal = parseInt(editSalary, 10);
    if (isNaN(salaryVal) || salaryVal <= 0) {
      triggerToast('Error: Monthly salary must be a positive number.');
      return;
    }

    updateEmployee(editingEmp.id, {
      name: editName,
      department: editDept,
      salary: salaryVal,
      status: editStatus,
      isWhitelisted: editWhitelisted,
    });

    triggerToast(`Employee ${editName} (${editingEmp.id}) updated successfully!`);
    setEditingEmp(null);
  };

  // Triggering Bulk Updates on state context
  const handleApplyBulkUpdates = () => {
    const mult = parseFloat(bulkMultiplier);
    bulkUpdateEmployees(bulkDept, mult, bulkStatus);

    // Apply whitelist alterations specifically if modified
    if (bulkWhitelistAction !== 'NO_CHANGE') {
      employees.forEach(row => {
        if (bulkDept === 'ALL' || row.department === bulkDept) {
          const targetState = bulkWhitelistAction === 'FORCE_WHITELIST';
          if (row.isWhitelisted !== targetState) {
            // Adjust whitelist toggle
            toggleWhitelist(row.id);
          }
        }
      });
    }

    triggerToast(`Enterprise updates dispatched! Bulk salary factor of ${mult}x applied across department: ${bulkDept}.`);
  };

  // One-click Regulatory Sync action
  const handleRunRegulatorySync = () => {
    employees.forEach(row => {
      // Auto-align all operational staff onto active whitelist while ensuring compliance
      if (row.status === 'active' && !row.isWhitelisted) {
        toggleWhitelist(row.id);
      }
    });
    addLog(`CBM National Wage Security compliance protocol triggered: Synced, scrubbed, and optimized all active personnel records.`);
    triggerToast(`Personnel repository synced with Central Bank regulatory EWA guidelines.`);
  };

  // Inline Editing trigger helper
  const handleTriggerEdit = (row: Employee) => {
    setEditingEmp(row);
    setEditName(row.name);
    setEditDept(row.department);
    setEditSalary(row.salary.toString());
    setEditStatus(row.status as any);
    setEditWhitelisted(row.isWhitelisted);
  };

  // Filtered dataset representing active workforce directory view
  const filteredEmployeesList = useMemo(() => {
    return employees.filter(row => {
      const matchesSearch = 
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDept = deptFilter === 'ALL' || row.department === deptFilter;
      const matchesStatus = statusFilter === 'ALL' || row.status === statusFilter;
      const matchesWhitelist = 
        whitelistFilter === 'ALL' || 
        (whitelistFilter === 'WHITELISTED' && row.isWhitelisted) ||
        (whitelistFilter === 'DISABLED' && !row.isWhitelisted);

      return matchesSearch && matchesDept && matchesStatus && matchesWhitelist;
    });
  }, [employees, searchTerm, deptFilter, statusFilter, whitelistFilter]);

  return (
    <div className="space-y-6">
      {/* Dynamic Toast Alerts */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-bounce">
          <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Screen Title & Responsive Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users size={22} className="text-emerald-500" />
            {dict.workforceCtrl}
          </h3>
          <p className="text-sm text-slate-500 mt-1 block">
            {dict.workforceSubtitle}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/50">
          <button 
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'directory' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-folder-open text-[10px]"></i>
            {dict.directoryTab}
          </button>
          <button 
            onClick={() => setActiveTab('enterprise')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'enterprise' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders size={12} />
            {dict.controlTab}
          </button>
        </div>
      </div>

      {/* RENDER TAB 1: WORKFORCE DIRECTORY VIEW */}
      {activeTab === 'directory' && (
        <div className="space-y-6">

          {/* Quick Filter Hub card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <i className="fa-solid fa-magnifying-glass text-xs"></i>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-500 font-mono">
                    {language === 'mm' ? 'ရှာဖွေခြင်းနှင့် စစ်ထုတ်ခြင်းမနူး' : 'Directory Search Panel'}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {language === 'mm' ? 'လက်ရှိဝန်ထမ်းစာရင်းများအား အမြန်ရှာဖွေစစ်ဆေးရန်' : 'Real-time personnel query filters based on business parameters.'}
                  </p>
                </div>
              </div>

              {/* Add New Button */}
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition duration-150 flex items-center gap-1.5 self-start md:self-auto shadow-sm"
              >
                <Plus size={14} />
                {showAddForm ? dict.hideFormBtn : dict.registerBtn}
              </button>
            </div>

            {/* Selection filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text"
                  placeholder={dict.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition font-medium"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-200/60 rounded-xl px-3 py-2">
                <Filter size={12} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{dict.deptFilterText}</span>
                <select 
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="flex-1 bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">{language === 'mm' ? 'ဌာနအားလုံး' : 'All Departments'}</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-200/60 rounded-xl px-3 py-2">
                <UserCheck size={12} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{dict.statusFilterText}</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">{language === 'mm' ? 'အားလုံး' : 'All Lifecycles'}</option>
                  <option value="active">{language === 'mm' ? 'လက်ရှိဝန်ထမ်း' : 'Active Personnel'}</option>
                  <option value="terminated">{language === 'mm' ? 'ရပ်စဲပြီးသူများ' : 'Terminated/Offboarded'}</option>
                  <option value="conflict">{language === 'mm' ? 'အငြင်းပွားဆဲ' : 'Status Conflict'}</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-200/60 rounded-xl px-3 py-2">
                <ToggleLeft size={13} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{dict.ewaAccessText}</span>
                <select 
                  value={whitelistFilter}
                  onChange={(e) => setWhitelistFilter(e.target.value)}
                  className="flex-1 bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">{language === 'mm' ? 'EWA ခွင့်ပြုချက်အားလုံး' : 'All Whitelist Statuses'}</option>
                  <option value="WHITELISTED">{language === 'mm' ? 'EWA ခွင့်ပြုထားသူ' : 'EWA Whitelisted'}</option>
                  <option value="DISABLED">{language === 'mm' ? 'EWA ပိတ်ထားသူ' : 'EWA Excluded'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Individual Creator: High Fidelity Employee Entry Board */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-4xl animate-fadeIn space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-user-plus text-emerald-500"></i>
                  {dict.registerTitle}
                </h4>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateEmployeeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  
                  {/* Name field */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{dict.personnelName}</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs bg-slate-50/50 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-900" 
                      placeholder="Ex. Daw Tin Hlaing"
                      required 
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{dict.departmentLabel}</label>
                    <select 
                      value={department} 
                      onChange={e => setDepartment(e.target.value)} 
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs bg-slate-50/50 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-700"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  {/* Monthly Base Pay */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{dict.salaryLabel}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-bold text-slate-400 text-xs font-mono">
                        MMK
                      </div>
                      <input 
                        type="number" 
                        value={salary} 
                        onChange={e => setSalary(e.target.value)} 
                        className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 text-xs bg-slate-50/50 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-900" 
                        placeholder="e.g. 1500000"
                        required 
                      />
                    </div>
                  </div>

                  {/* Onboarding Lifecycle State */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{dict.statusCode}</label>
                    <select 
                      value={empStatus} 
                      onChange={e => setEmpStatus(e.target.value as any)} 
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs bg-slate-50/50 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-700"
                    >
                      <option value="active">{dict.activeService}</option>
                      <option value="terminated">{dict.terminatedService}</option>
                      <option value="conflict">{dict.conflictService}</option>
                    </select>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  
                  {/* Custom Action Selector (Requested specifically) */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-purple-600 flex items-center gap-1 font-mono">
                      <Sparkles size={11} className="text-purple-500 animate-spin" />
                      {dict.customActionTitle}
                    </label>
                    <select
                      value={customAction}
                      onChange={(e) => setCustomAction(e.target.value)}
                      className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-xs bg-purple-50/30 font-bold text-purple-900 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="NONE">{language === 'mm' ? 'အပိုအလိုအလျောက်လုပ်ငန်း လုပ်ဆောင်ရန်မလိုပါ' : 'No secondary automated action trigger'}</option>
                      <option value="WELCOME_SMS">{language === 'mm' ? 'EWA စနစ်သို့ ဝင်ရောက်ရန် ဖိတ်ကြားစာ SMS ပေးပို့မည်' : 'Dispatch SMS/Email EWA Login Invite credentials'}</option>
                      <option value="SENIOR_OVERRIDE">{language === 'mm' ? 'အထူးဝန်ထမ်း ဦးစားပေး အပို ၁၀% ထုတ်ယူခွင့် ပေးအပ်မည်' : 'Pre-Allocate 10% Senior merit SmartCap exception'}</option>
                      <option value="STARTUP_LOAN">{language === 'mm' ? 'စတင်အသုံးပြုမှု လက်ဆောင်ငွေ ၅၀,၀၀၀ ကျပ် ဝေါလတ်ထဲ ထည့်သွင်းမည်' : 'Auto-Issue Initial 50,000 MMK microloan widget'}</option>
                      <option value="LEGAL_CLEARANCE">{language === 'mm' ? 'အမျိုးသားဒီဂျစ်တယ် အထောက်အထားစိစစ်စာရွက်တွဲ ဆက်စပ်မည်' : 'Attach decentralized Electronic National ID Verification code'}</option>
                    </select>
                    <p className="text-[10px] text-slate-400 font-medium leading-normal">
                      {dict.customActionDesc}
                    </p>
                  </div>

                  {/* Initial Whitelisting */}
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/50 self-center">
                    <input 
                      type="checkbox"
                      id="initial_whitelisting"
                      checked={isWhitelisted}
                      onChange={(e) => setIsWhitelisted(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 focus:ring-1"
                    />
                    <div>
                      <label htmlFor="initial_whitelisting" className="block text-xs font-bold text-slate-800 cursor-pointer select-none">
                        {dict.preApproveEwa}
                      </label>
                      <p className="text-[10px] text-slate-400">{dict.preApproveEwaDesc}</p>
                    </div>
                  </div>

                </div>

                {/* Submit button */}
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-semibold"
                  >
                    {dict.cancelBtn}
                  </button>
                  <button 
                    type="submit" 
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2 rounded-lg transition"
                  >
                    {dict.createBtn}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Main List Table Ledger */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <i className="fa-solid fa-database"></i>
                Displaying {filteredEmployeesList.length} of {employees.length} records
              </span>
              <div className="text-[10px] font-sans font-bold text-emerald-600 bg-emerald-50 rounded-lg px-2 py-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                Instant database mirror active
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4.5">{dict.colEmpId}</th>
                    <th className="px-6 py-4.5">{dict.colName}</th>
                    <th className="px-6 py-4.5">{dict.colDept}</th>
                    <th className="px-6 py-4.5">{dict.colGrossSalary}</th>
                    <th className="px-6 py-4.5">{dict.colEwaGateway}</th>
                    <th className="px-6 py-4.5">{dict.colLifecycle}</th>
                    <th className="px-6 py-4.5 text-right font-bold">{dict.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredEmployeesList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 font-semibold">
                        <div className="space-y-2">
                          <i className="fa-solid fa-file-circle-exclamation text-3xl text-slate-300"></i>
                          <p className="text-xs">{language === 'mm' ? 'ရှာဖွေမှုနှင့် ကိုက်ညီသော ဝန်ထမ်းတစ်ဦးမှ မရှိပါ' : 'No employees matched your custom filters or search term.'}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                  filteredEmployeesList.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/40 transition">
                      
                      {/* ID column */}
                      <td className="px-6 py-4 font-mono font-bold text-slate-400">{row.id}</td>
                      
                      {/* Name Card */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{row.name}</div>
                        <div className="text-[10px] text-indigo-500 font-bold mt-0.5">EST. TAX: {Math.round(row.salary * 0.02).toLocaleString()} MMK</div>
                      </td>
                      
                      {/* Dept */}
                      <td className="px-6 py-4 font-semibold text-slate-700">{row.department}</td>
                      
                      {/* Salary */}
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 text-sm">
                        {row.salary.toLocaleString()}
                        <span className="text-[9px] text-slate-400 ml-0.5">MMK</span>
                      </td>
                      
                      {/* Whitelist Tag with Toggle */}
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => {
                            toggleWhitelist(row.id);
                            triggerToast(`Whitelist authorization state toggled for ${row.name}`);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border transition ${
                            row.isWhitelisted 
                              ? 'bg-emerald-50/50 text-emerald-800 border-emerald-100 hover:bg-emerald-100' 
                              : 'bg-stone-50 text-stone-500 border-stone-100 hover:bg-stone-100'
                          }`}
                        >
                          {row.isWhitelisted ? (
                            <>
                              <ShieldCheck size={12} className="text-emerald-500" />
                              EWA whitelisted
                            </>
                          ) : (
                            <>
                              <ShieldAlert size={12} className="text-slate-400" />
                              disabled/withdrawn
                            </>
                          )}
                        </button>
                      </td>

                      {/* State status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                          row.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                            : row.status === 'conflict' 
                            ? 'bg-amber-50 text-amber-800 border-amber-100' 
                            : 'bg-rose-50 text-rose-800 border-rose-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            row.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'
                          }`}></span>
                          {row.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Multi-Edit Trigger actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => handleTriggerEdit(row)}
                            className="text-indigo-700 bg-indigo-50 hover:bg-indigo-600 hover:text-white border border-indigo-100 px-2.5 py-1.5 rounded-lg transition text-[11px] font-bold flex items-center gap-1"
                          >
                            <Edit2 size={11} />
                            Modify Details
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        </div>
      )}

      {/* RENDER TAB 2: ENTERPRISE CONTROL CENTER (Requested "Enterprise Control Tab" & "bulk update") */}
      {activeTab === 'enterprise' && (
        <div className="space-y-6">

          {/* Enterprise Bulk Controller Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Box: Bulk transform controls */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <i className="fa-solid fa-gears text-sm"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{dict.bulkEngineTitle}</h4>
                    <p className="text-xs text-slate-500">{dict.bulkEngineSubtitle}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Targeting Dept */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-extrabold text-slate-500">{dict.targetDept}</label>
                  <select 
                    value={bulkDept}
                    onChange={(e) => setBulkDept(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs bg-slate-50 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-bold text-slate-700"
                  >
                    <option value="ALL">{language === 'mm' ? 'ဌာနအားလုံး (လုပ်ငန်းတစ်ခုလုံး)' : 'All Departments (Entire Workforce)'}</option>
                    <option value="Engineering">Engineering Department</option>
                    <option value="Finance">Finance Department</option>
                    <option value="Operations font-bold">Operations Department</option>
                  </select>
                </div>

                {/* Multiplier adjustment */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-extrabold text-slate-500 flex justify-between">
                    <span>{dict.salaryMultiplier}</span>
                    {bulkMultiplier !== '1.0' && <span className="text-emerald-500 font-mono font-extrabold">{language === 'mm' ? 'အပြောင်းအလဲရှိသည်' : 'Active Change'}</span>}
                  </label>
                  <select 
                    value={bulkMultiplier}
                    onChange={(e) => setBulkMultiplier(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs bg-slate-50 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-extrabold text-slate-700"
                  >
                    <option value="1.0">{language === 'mm' ? 'အပြောင်းအလဲမရှိ (၁.၀ ဆ)' : 'No Change (Multiplier 1.0x)'}</option>
                    <option value="1.03">{language === 'mm' ? '+၃% ငွေဖောင်းပွမှုဒဏ် သက်သာခွင့်ညှိခြင်း' : '+3% Inflationary Cost Adjustment'}</option>
                    <option value="1.05">{language === 'mm' ? '+၅% နှစ်လယ်လစာ တိုးမြှင့်သတ်မှတ်ခြင်း' : '+5% Mid-Year Salary Grade Adjust'}</option>
                    <option value="1.10">{language === 'mm' ? '+၁၀% စွမ်းဆောင်ရည် အပိုဆုကြေးပေးအပ်ခြင်း' : '+10% Performance Bonus Expansion'}</option>
                    <option value="0.95">{language === 'mm' ? '-၅% လုပ်ငန်းအခြေအနေအရ လျှော့ချညှိနှိုင်းခြင်း' : '-5% Macro Operational Downscale'}</option>
                  </select>
                </div>

                {/* Status Force adjustment */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-extrabold text-slate-500">{dict.forceLifecycle}</label>
                  <select 
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs bg-slate-50 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-700"
                  >
                    <option value="NO_CHANGE">{language === 'mm' ? 'လက်ရှိ ဝန်ထမ်းတစ်ဦးချင်းစီ၏ အခြေအနေအတိုင်း ထားရှိမည်' : 'Preserve individual worker lifecycle status'}</option>
                    <option value="active">{language === 'mm' ? 'အားလုံးကို "လက်ရှိဝန်ထမ်း" အဖြစ် ပြောင်းလဲမည်' : 'Force all targeted to: "Active Service"'}</option>
                    <option value="terminated">{language === 'mm' ? 'အားလုံးကို "အလုပ်ရပ်စဲပြီးသူ" အဖြစ် ပြောင်းလဲမည်' : 'Force all targeted to: "Terminated/Offboarded"'}</option>
                  </select>
                </div>

                {/* Whitelist Force adjustment */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-extrabold text-slate-500">{dict.forceEwaAccess}</label>
                  <select 
                    value={bulkWhitelistAction}
                    onChange={(e) => setBulkWhitelistAction(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs bg-slate-50 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-700"
                  >
                    <option value="NO_CHANGE">{language === 'mm' ? 'လက်ရှိ သတ်မှတ်ချက်အတိုင်း ထားရှိမည်' : 'Keep current whitelist settings as-is'}</option>
                    <option value="FORCE_WHITELIST">{language === 'mm' ? 'အားလုံးကို တစ်ပြိုင်နက် EWA ခွင့်ပြုမည်' : 'Batch Whitelist and Grant all EWA access'}</option>
                    <option value="FORCE_DISABLE">{language === 'mm' ? 'အားလုံးကို တစ်ပြိုင်နက် EWA ပိတ်သိမ်းမည်' : 'Batch Disable and Revoke all EWA access'}</option>
                  </select>
                </div>

              </div>

              {/* Apply trigger */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-850 flex items-start gap-3">
                <div className="text-amber-600 shrink-0 text-base mt-0.5">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold">{dict.irreversibleNotice}</strong>
                  <span className="block mt-0.5 text-slate-500">
                    {dict.irreversibleNoticeDesc}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => {
                    setBulkDept('ALL');
                    setBulkMultiplier('1.0');
                    setBulkStatus('NO_CHANGE');
                    setBulkWhitelistAction('NO_CHANGE');
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-semibold"
                >
                  {dict.resetBtn}
                </button>
                <button 
                  onClick={handleApplyBulkUpdates}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1"
                >
                  <TrendingUp size={13} />
                  {dict.executeBulkBtn}
                </button>
              </div>

            </div>

            {/* Right Box: Quick Action & Compliance Configs (Requested "Quick Action") */}
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">{dict.quickAuditsTitle}</h4>
                  <p className="text-xs text-slate-500">{dict.quickAuditsSubtitle}</p>
                </div>

                <div className="space-y-3">
                  
                  {/* Sync action */}
                  <button 
                    onClick={handleRunRegulatorySync}
                    className="w-full text-left p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50/45 transition flex items-start gap-3 text-xs"
                  >
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 shrink-0">
                      <i className="fa-solid fa-scale-balanced text-sm"></i>
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block">{dict.deploySyncBtn}</span>
                      <span className="text-[10px] text-slate-500 block leading-normal mt-0.5">
                        {dict.deploySyncDesc}
                      </span>
                    </div>
                  </button>

                  {/* Clean Logs action */}
                  <button 
                    onClick={() => {
                      addLog('[Quick Action] Enterprise Administrator initiated clean telemetry sweep. Internal compliance is green.');
                      triggerToast('Internal system audit completed! Results mapped and clean.');
                    }}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition flex items-start gap-3 text-xs"
                  >
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
                      <i className="fa-solid fa-clipboard-check text-sm"></i>
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block">{dict.triggerScanBtn}</span>
                      <span className="text-[10px] text-slate-500 block leading-normal mt-0.5">
                        {dict.triggerScanDesc}
                      </span>
                    </div>
                  </button>

                  {/* Seed Sandbox data action */}
                  <button 
                    onClick={() => {
                      addLog('[Quick Action] Seeded secondary employee records into sandbox framework.');
                      triggerToast('Database records synced with high-capacity datasets.');
                    }}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition flex items-start gap-3 text-xs"
                  >
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600 shrink-0">
                      <RefreshCw size={14} className="animate-spin" />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block">{dict.cleanSandboxBtn}</span>
                      <span className="text-[10px] text-slate-500 block leading-normal mt-0.5">
                        {dict.cleanSandboxDesc}
                      </span>
                    </div>
                  </button>

                </div>
              </div>

              {/* Regulatory Advisory */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm space-y-2">
                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">ISO 20022 REGULATION</span>
                <h5 className="font-bold text-white text-sm">{dict.regulatoryAdvisoryTitle}</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {dict.regulatoryAdvisoryDesc}
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* MODAL WINDOW: EDIT / MODIFY EMPLOYEE DETAILS (Requested "edit", "update") */}
      {editingEmp && (
        <div className="fixed inset-0 bg-slate-900/55 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-100 shadow-2xl p-6 space-y-4">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <i className="fa-solid fa-user-pen text-indigo-600"></i>
                  {dict.modifyTitle}
                </h4>
                <p className="text-xs text-slate-500">{dict.modifySubtitle}</p>
              </div>
              <button 
                onClick={() => setEditingEmp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-950 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Editing Form */}
            <form onSubmit={handleUpdateEmployeeSubmit} className="space-y-4">
              
              <div className="space-y-3">
                
                {/* ID non-editable state */}
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 font-mono">{dict.uniqueCode}</span>
                  <span className="font-mono text-sm font-extrabold text-slate-900 bg-slate-100 border border-slate-200/50 rounded-lg px-3 py-1 bg-slate-100/50 mt-1 inline-block">
                    {editingEmp.id}
                  </span>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{dict.workerFullname}</label>
                  <input 
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-950 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Grid Split */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Salary input */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{dict.monthlyGross}</label>
                    <input 
                      type="number"
                      value={editSalary}
                      onChange={(e) => setEditSalary(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  {/* Department select */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{dict.departmentLabel}</label>
                    <select 
                      value={editDept}
                      onChange={(e) => setEditDept(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  
                  {/* Status select */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{dict.accountLifecycle}</label>
                    <select 
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="active">{dict.activeService}</option>
                      <option value="terminated">{dict.terminatedService}</option>
                      <option value="conflict">{dict.conflictService}</option>
                    </select>
                  </div>

                  {/* Whitelisted Checkbox */}
                  <div className="flex items-center gap-2 mt-4">
                    <input 
                      type="checkbox"
                      id="edit_whitelisted_check"
                      checked={editWhitelisted}
                      onChange={(e) => setEditWhitelisted(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 focus:ring-1 cursor-pointer"
                    />
                    <label htmlFor="edit_whitelisted_check" className="text-xs font-bold text-slate-800 cursor-pointer select-none">
                      {dict.whitelistedEwa}
                    </label>
                  </div>

                </div>

              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-4 justify-end border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setEditingEmp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100"
                >
                  {dict.discardChanges}
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-850 rounded-lg transition"
                >
                  {dict.saveChanges}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
