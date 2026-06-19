import { useState } from 'react';

interface GuideChapter {
  id: string;
  category: string;
  title: string;
  icon: string;
  summary: string;
  steps: {
    title: string;
    description: string;
    proTip?: string;
  }[];
  bestPractices: string[];
}

const chaptersData: GuideChapter[] = [
  {
    id: 'intro',
    category: 'System Core',
    title: '1. Executive Core: The EWA Framework',
    icon: 'fa-solid fa-landmark',
    summary: 'Understanding Earned Wage Access (EWA) fundamentals to protect employee liquidity while bypassing high-interest debt cycles.',
    steps: [
      {
        title: 'Step 1.1: The Liquidity Paradigm',
        description: 'Earned Wage Access is not loans or credit lines. It allows employees to withdraw accrued net earnings calculated in real-time from workdays already served, keeping their household balance positive.',
        proTip: 'Deduct the total sum of advances directly from the final monthly paycheck ledger to reduce risk.'
      },
      {
        title: 'Step 1.2: Portal Architecture Overview',
        description: 'This centralized HR portal integrates data parsing engines, regulatory compliance limits, smart tenure caps, automated clearings, and risk flags to guarantee SOC-2 transparency.',
        proTip: 'The primary dashboard metrics provide instant overview of liquidity drain versus operational capital safety.'
      }
    ],
    bestPractices: [
      'Maintain an operational cushion equal to 15% of the total monthly payroll payroll pool.',
      'Audit the dashboard twice weekly, specifically reviewing Total Disbursed versus Active Repayments.'
    ]
  },
  {
    id: 'onboarding',
    category: 'Staff Operations',
    title: '2. Employee Acquisition & Onboarding',
    icon: 'fa-solid fa-user-plus',
    summary: 'The operational procedures required to register new workers, upload core spreadsheets, and verify identity metrics.',
    steps: [
      {
        title: 'Step 2.1: Pre-Screening Clearances',
        description: 'Go to the Onboarding pane and verify recently hired staff profiles. Check that their bank routing credentials, job titles, and base payroll rates are verified by the regional office.',
        proTip: 'Toggling the whitelist allows you to test early payouts for single pilot teams before general release.'
      },
      {
        title: 'Step 2.2: Excel Draft Sheet Uploads',
        description: 'Navigate to the Bulk Data Upload console. Choose a standard CSV, preview any parsed updates in the visual comparison ledger (New vs. Modified status indicators), and press "Apply Verified Updates" to commit updates to the system.',
        proTip: 'Always check that the unique Employee ID matches the corporate roster.'
      }
    ],
    bestPractices: [
      'Upload the corrected corporate timesheet every second Friday matching standard bank reconciliation timelines.',
      'Reject any onboarding files with null entries in the Base Bank Account Field.'
    ]
  },
  {
    id: 'policies',
    category: 'Compliance Controls',
    title: '3. Risk Controls & Policy Settings',
    icon: 'fa-solid fa-scale-balanced',
    summary: 'How to deploy dynamic ceiling caps based on worker tenure grids to manage financial risk.',
    steps: [
      {
        title: 'Step 3.1: Defining Tenure Tiers',
        description: 'Access the Smart Cap pane. Allocate maximum percent ceilings to staff tenure groups: Under 6 Months gets a conservative ceiling of 20%, whereas Senior Staff of over 1 Year can safely request up to 50% limit.',
        proTip: 'Restricting temporary contractors safeguards the fund from sudden spikes prior to month-end.'
      },
      {
        title: 'Step 3.2: Corporate Policy Engine',
        description: 'Open Policy Engine module to configure global thresholds such as the Maximum Advance limit (example: 150,000 MMK per request), or standard transaction processing fee boundaries.',
        proTip: 'Changes register instantly inside the audit ledger to preserve SOC-2 visibility.'
      }
    ],
    bestPractices: [
      'Keep the Maximum Single Request capped at 200,000 MMK for general workers.',
      'Review any customized subsidiary profile templates weekly.'
    ]
  },
  {
    id: 'payouts',
    category: 'Transactional Systems',
    title: '4. Payout approvals & Freeze Audits',
    icon: 'fa-solid fa-circle-dollar-to-slot',
    summary: 'Auditing pending disbursement pipelines, executing instant batch releases, and placing freeze flags on flagged security accounts.',
    steps: [
      {
        title: 'Step 4.1: Checking and Processing Disbursements',
        description: 'Go to the Disbursements screen, audit open accounts for unusual spikes or suspicious withdraws, then select action "Disburse Funds" to execute the transfer.',
        proTip: 'You can check logs for previous disbursements to confirm matching pay histories.'
      },
      {
        title: 'Step 4.2: Freeze Command Center',
        description: 'If an employee violates disciplinary terms or changes roles suddenly, head to EWA Freeze console and activate suspension to lock transactions immediately.',
        proTip: 'Reinstating accounts can be done with a single click using the "Unfreeze Account" action.'
      }
    ],
    bestPractices: [
      'Only release bulk disbursements after validating bank transfer file health.',
      'Check freeze lists regularly to verify inactive contractors remain blocked.'
    ]
  },
  {
    id: 'reconciliation',
    category: 'Financial Closures',
    title: '5. Payroll Export & Final Reconcile',
    icon: 'fa-solid fa-file-invoice-dollar',
    summary: 'Sop guidelines on extracting deduction ledger tables for ERP matching, and handling offboarding settlements.',
    steps: [
      {
        title: 'Step 5.1: Exporting ERP-Ready Pay Files',
        description: 'Navigate to Multi-System Payroll Export screen, choose your target format (Standard CSV or Excel XML), and click "Generate Ledger File". Reconcile this into SAP, Oracle, or corporate payroll pipelines.',
        proTip: 'These formatted rows outline precise individual deduction figures to deduct from baseline checks.'
      },
      {
        title: 'Step 5.2: Offboarding Clearances',
        description: 'For leaving staff members, head to the Offboarding & Clearance console to match key-cards, return hardware, and deduct outstanding EWA advances prior to printing final clearance invoices.',
        proTip: 'Clearing the clearance invoice formally offsets active advance balances to 0.'
      }
    ],
    bestPractices: [
      'Export the CSV deduction ledger 48 hours prior to final bank wire dispatch.',
      'Confirm offboarding staff are deactivated in both work registers and EWA portals simultaneously.'
    ]
  },
  {
    id: 'welfare',
    category: 'EWA Welfare',
    title: '6. Charity & HR Mindfulness Pacer',
    icon: 'fa-solid fa-heart-pulse',
    summary: 'Improving stress indexes using Zen concentration modules, and facilitating community impact program settings.',
    steps: [
      {
        title: 'Step 6.1: CSR Round-Up & Matching Campaigns',
        description: 'Enable EWA micro-contributions in the Charity and CSR Hub. Here, staff can elect to round up payouts to local causes such as rural education clinics. Adjust the Corporate Match Multiplier from 0% to 200% to double the fundraising stream.',
        proTip: 'Simulating active round-ups provides quick live feedback of total corporate MATCH allocations.'
      },
      {
        title: 'Step 6.2: Pomodoro Concentration Sanctuary',
        description: 'When manual audits represent a high mental burden, enter the HR Zen Sanctuary component. Plan your focus topic, align breathing cycles with the visual 10-second wave expander, and play local atmospheric frequencies to lower heart rate.',
        proTip: 'A focused HR reviewer commits up to 94% fewer entry errors during bulk reconciliations.'
      }
    ],
    bestPractices: [
      'Initiate at least one 15-minute sanctuary block before clicking batch payout actions.',
      'Offer up to 100% corporate matching on healthcare-related charity campaigns to foster CSR.'
    ]
  }
];

export function SystemGuide() {
  const [activeTab, setActiveTab] = useState<string>('intro');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedSOPs, setCompletedSOPs] = useState<Record<string, boolean>>({
    'sop-01': true,
    'sop-02': false,
    'sop-03': false,
    'sop-04': false,
    'sop-05': false,
    'sop-06': false,
  });

  const toggleSOP = (id: string) => {
    setCompletedSOPs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredChapters = chaptersData.filter(chapter => {
    const term = searchQuery.toLowerCase();
    return (
      chapter.title.toLowerCase().includes(term) ||
      chapter.summary.toLowerCase().includes(term) ||
      chapter.category.toLowerCase().includes(term) ||
      chapter.steps.some(s => s.title.toLowerCase().includes(term) || s.description.toLowerCase().includes(term))
    );
  });

  const activeChap = chaptersData.find(c => c.id === activeTab) || chaptersData[0];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Banner */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <i className="fa-solid fa-book-open-reader text-emerald-500"></i>
            Corporate EWA Operational User Manual
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Official standard operating guidelines, platform workflows, and interactive step-by-step procedures for the HR Checkers and Auditors.
          </p>
        </div>
        <div className="relative min-w-72">
          <input
            type="text"
            placeholder="Search documentation chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 pb-2 border-b border-slate-50">
              Manual Table of Contents
            </h4>
            <div className="space-y-1 pt-1">
              {filteredChapters.map((chap) => (
                <button
                  key={chap.id}
                  onClick={() => setActiveTab(chap.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition ${
                    activeChap.id === chap.id
                      ? 'bg-slate-900 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <i className={`${chap.icon} text-xs ${activeChap.id === chap.id ? 'text-emerald-400' : 'text-slate-400'}`}></i>
                  <span className="truncate">{chap.title.replace(/^\d+\.\s*/, '')}</span>
                </button>
              ))}
              {filteredChapters.length === 0 && (
                <p className="text-slate-400 italic text-xs px-2 py-4">No matching chapters found.</p>
              )}
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 flex items-center gap-1.5">
              <i className="fa-solid fa-circle-question text-xs"></i>
              System Credentials
            </h4>
            <p className="text-[11px] text-emerald-900 leading-normal">
              Need direct systems engineering support? Reach our support office:
            </p>
            <div className="text-[10px] space-y-1 font-mono text-emerald-950 font-semibold bg-white/60 p-2 rounded-lg border border-emerald-150">
              <div>Checker ID: htet-ko-checker</div>
              <div>Authority: Level-3 Controller</div>
              <div>SOC-2 Audit: COMPLIANT</div>
            </div>
          </div>
        </div>

        {/* Contents Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Main Chapter Display */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-50 pb-4 space-y-1.5">
              <span className="bg-slate-150 text-slate-700 text-[10px] font-bold uppercase px-3 py-0.5 rounded-full border border-slate-200">
                {activeChap.category}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <i className={`${activeChap.icon} text-emerald-500`}></i>
                {activeChap.title}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                "{activeChap.summary}"
              </p>
            </div>

            {/* Steps Container */}
            <div className="space-y-6">
              {activeChap.steps.map((step, idx) => (
                <div key={idx} className="space-y-2 border-l-2 border-slate-100 pl-4 relative">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-emerald-500"></div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {step.description}
                  </p>
                  {step.proTip && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10.5px] text-slate-600 leading-relaxed font-sans flex gap-2">
                      <strong className="text-emerald-700 block uppercase text-[10px] font-bold tracking-widest flex-shrink-0">
                        <i className="fa-solid fa-lightbulb text-emerald-600"></i> PRO TIP:
                      </strong>
                      <span>{step.proTip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Best Practices banner */}
            <div className="bg-emerald-50/50 rounded-2xl p-4.5 border border-emerald-100/60 space-y-2.5">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-check text-emerald-600"></i>
                Auditor Best Practices & Directives
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-900 font-medium pl-5 list-disc leading-normal">
                {activeChap.bestPractices.map((bp, i) => (
                  <li key={i}>{bp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive SOP checklist */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-50 pb-2 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-emerald-500"></i>
                  Auditor SOP Operational Progress
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Track your standard daily setup procedures directly to verify portal safety.</p>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Completed: {Object.values(completedSOPs).filter(Boolean).length} / 6
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div 
                onClick={() => toggleSOP('sop-01')}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition select-none ${
                  completedSOPs['sop-01'] 
                    ? 'bg-emerald-50/25 border-emerald-200 text-slate-400' 
                    : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800 font-medium'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={completedSOPs['sop-01']} 
                  onChange={() => {}}
                  className="rounded border-slate-300 text-emerald-600 mt-0.5 scale-95" 
                />
                <div>
                  <span className={`text-xs block ${completedSOPs['sop-01'] ? 'line-through text-slate-400' : 'text-slate-900 font-bold'}`}>
                    SOP #01: Verify Whitelist Drafts
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Check pre-registered spreadsheet changes inside Bulk Upload.</span>
                </div>
              </div>

              <div 
                onClick={() => toggleSOP('sop-02')}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition select-none ${
                  completedSOPs['sop-02'] 
                    ? 'bg-emerald-50/25 border-emerald-200 text-slate-400' 
                    : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800 font-medium'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={completedSOPs['sop-02']} 
                  onChange={() => {}}
                  className="rounded border-slate-300 text-emerald-600 mt-0.5 scale-95" 
                />
                <div>
                  <span className={`text-xs block ${completedSOPs['sop-02'] ? 'line-through text-slate-400' : 'text-slate-900 font-bold'}`}>
                    SOP #02: Align Safe Limits
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Assign policy limits to ensure appropriate safety ratios.</span>
                </div>
              </div>

              <div 
                onClick={() => toggleSOP('sop-03')}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition select-none ${
                  completedSOPs['sop-03'] 
                    ? 'bg-emerald-50/25 border-emerald-200 text-slate-400' 
                    : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800 font-medium'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={completedSOPs['sop-03']} 
                  onChange={() => {}}
                  className="rounded border-slate-300 text-emerald-600 mt-0.5 scale-95" 
                />
                <div>
                  <span className={`text-xs block ${completedSOPs['sop-03'] ? 'line-through text-slate-400' : 'text-slate-900 font-bold'}`}>
                    SOP #03: Perform EWA Focus Block
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Take a 10-minute focus session to prevent manual entry payroll typos.</span>
                </div>
              </div>

              <div 
                onClick={() => toggleSOP('sop-04')}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition select-none ${
                  completedSOPs['sop-04'] 
                    ? 'bg-emerald-50/25 border-emerald-200 text-slate-400' 
                    : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800 font-medium'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={completedSOPs['sop-04']} 
                  onChange={() => {}}
                  className="rounded border-slate-300 text-emerald-600 mt-0.5 scale-95" 
                />
                <div>
                  <span className={`text-xs block ${completedSOPs['sop-04'] ? 'line-through text-slate-400' : 'text-slate-900 font-bold'}`}>
                    SOP #04: Reconcile Leaving Arrears
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Check leaving personnel details within Offboarding clearances.</span>
                </div>
              </div>

              <div 
                onClick={() => toggleSOP('sop-05')}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition select-none ${
                  completedSOPs['sop-05'] 
                    ? 'bg-emerald-50/25 border-emerald-200 text-slate-400' 
                    : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800 font-medium'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={completedSOPs['sop-05']} 
                  onChange={() => {}}
                  className="rounded border-slate-300 text-emerald-600 mt-0.5 scale-95" 
                />
                <div>
                  <span className={`text-xs block ${completedSOPs['sop-05'] ? 'line-through text-slate-400' : 'text-slate-900 font-bold'}`}>
                    SOP #05: Set Company Match Rate
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Configure matching percentages to drive Myanmar social welfare CSR.</span>
                </div>
              </div>

              <div 
                onClick={() => toggleSOP('sop-06')}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition select-none ${
                  completedSOPs['sop-06'] 
                    ? 'bg-emerald-50/25 border-emerald-200 text-slate-400' 
                    : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800 font-medium'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={completedSOPs['sop-06']} 
                  onChange={() => {}}
                  className="rounded border-slate-300 text-emerald-600 mt-0.5 scale-95" 
                />
                <div>
                  <span className={`text-xs block ${completedSOPs['sop-06'] ? 'line-through text-slate-400' : 'text-slate-900 font-bold'}`}>
                    SOP #06: Export Ledger File
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Generate final CSV files matching Oracle/SAP schema rules.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
