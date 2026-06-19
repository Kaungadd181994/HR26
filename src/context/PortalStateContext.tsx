import React, { createContext, useContext, useState } from 'react';
import { Screen, Employee } from '@/types';
import { 
  employees as initialEmployees, 
  disbursements as initialDisbursements, 
  repayments as initialRepayments, 
  onboardings as initialOnboardings, 
  logs as initialLogs, 
  templates as initialTemplates, 
  policies as initialPolicies, 
  smartCaps as initialSmartCaps, 
  freezeList as initialFreezeList, 
  diffs as initialDiffs, 
  offboardingList as initialOffboardingList, 
  exportFormats as initialExportFormats, 
  cycleConfigs as initialCycleConfigs, 
  rbac as initialRbac 
} from '@/data/mockData';

export interface DisbursementItem {
  ref: string;
  empId: string;
  amount: number;
  status: string;
  date: string;
}

export interface RepaymentItem {
  ref: string;
  empId: string;
  amount: number;
  status: string;
  date: string;
}

export interface OnboardingItem {
  id: string;
  empId: string;
  name: string;
  status: 'Verification' | 'Ready' | 'Approved';
}

export interface LogItem {
  timestamp: string;
  action: string;
  user: string;
}

export interface DiffItem {
  id: string;
  name: string;
  salary: string;
  status: 'New' | 'Modified';
}

export interface OffboardingItem {
  id: string;
  name: string;
  outstanding: string;
  deduction: string;
}

export interface CharityCampaign {
  id: string;
  title: string;
  category: string;
  desc: string;
  icon: string; // FontAwesome icon class name
  totalRaised: number;
  goal: number;
}

export interface CharityDonation {
  id: string;
  employeeName: string;
  campaignTitle: string;
  amount: number;
  date: string;
  isMatched: boolean;
}

export interface PortalContextType {
  employees: Employee[];
  disbursements: DisbursementItem[];
  repayments: RepaymentItem[];
  onboardings: OnboardingItem[];
  logs: LogItem[];
  templates: { name: string; policy: string }[];
  policies: { rule: string; value: string }[];
  smartCaps: { tier: string; limit: string }[];
  freezeList: { id: string; name: string; status: string; amount: number }[];
  diffs: DiffItem[];
  offboardingList: OffboardingItem[];
  exportFormats: { format: string; type: string }[];
  cycleConfigs: { config: string; value: string }[];
  rbac: { role: string; permissions: string }[];
  
  // Charity and CSR parameters:
  charities: CharityCampaign[];
  donations: CharityDonation[];
  companyMatchPercent: number;
  addCharityCampaign: (title: string, category: string, desc: string, icon: string, goal: number) => void;
  donateToCampaign: (campaignId: string, empName: string, amount: number) => void;
  setCompanyMatchPercent: (percent: number) => void;

  // Focus Sanctuary state:
  focusSessionActive: boolean;
  focusTitle: string;
  focusTimeRemaining: number;
  focusSessionCount: number;
  focusHistory: string[];
  startFocusSession: (title: string, durationMinutes: number) => void;
  stopFocusSession: () => void;
  updateFocusTime: (secondsElapsed: number) => void;
  addFocusHistory: (entry: string) => void;
  
  // Custom interactive mutations:
  addLog: (action: string, user?: string) => void;
  approveOnboarding: (id: string) => void;
  disburseWage: (ref: string) => void;
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  toggleWhitelist: (empId: string) => void;
  executeBulkUpload: (items: DiffItem[]) => void;
  applyDiffs: () => void;
  performClearance: (empId: string) => void;
  unfreezeEmployee: (empId: string) => void;
  savePolicy: (rule: string, value: string) => void;
  addTemplate: (name: string, policy: string) => void;
  addRepayment: (empId: string, amount: number) => void;
}

const PortalStateContext = createContext<PortalContextType | undefined>(undefined);

export function PortalStateProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<any[]>(initialEmployees);
  const [disbursements, setDisbursements] = useState<DisbursementItem[]>(initialDisbursements);
  const [repayments, setRepayments] = useState<RepaymentItem[]>(initialRepayments);
  const [onboardings, setOnboardings] = useState<any[]>(initialOnboardings);
  const [logs, setLogs] = useState<LogItem[]>(initialLogs);
  const [templates, setTemplates] = useState(initialTemplates);
  const [policies, setPolicies] = useState(initialPolicies);
  const [smartCaps, setSmartCaps] = useState(initialSmartCaps);
  const [freezeList, setFreezeList] = useState(initialFreezeList);
  const [diffs, setDiffs] = useState<DiffItem[]>(initialDiffs as DiffItem[]);
  const [offboardingList, setOffboardingList] = useState<OffboardingItem[]>(initialOffboardingList);
  const [exportFormats, setExportFormats] = useState(initialExportFormats);
  const [cycleConfigs, setCycleConfigs] = useState(initialCycleConfigs);
  const [rbac, setRbac] = useState(initialRbac);

  // Charity & CSR State hooks
  const [charities, setCharities] = useState<CharityCampaign[]>([
    {
      id: 'CSR-001',
      title: 'Phyu Sin Myanmar Education Relief',
      category: 'Education',
      desc: 'Sponsors learning materials, uniforms, and primary school scholarship grants for underprivileged youth in rural divisions.',
      icon: 'fa-graduation-cap',
      totalRaised: 850000,
      goal: 2000000
    },
    {
      id: 'CSR-002',
      title: 'Irrawaddy Delta Green Forestry',
      category: 'Environment',
      desc: 'Active eco-reforestation program planting mangrove seedlings to protect coastal villages from soil erosion and monsoon storms.',
      icon: 'fa-leaf',
      totalRaised: 420000,
      goal: 1500000
    },
    {
      id: 'CSR-003',
      title: 'Yangon Free Mobile Clinic',
      category: 'Healthcare',
      desc: 'Delivers primary medical checkups, vital medicines, and community nursing support across low-income wards weekly.',
      icon: 'fa-house-chimney-medical',
      totalRaised: 1100000,
      goal: 3000000
    }
  ]);

  const [donations, setDonations] = useState<CharityDonation[]>([
    { id: 'DON-01', employeeName: 'Nandar Win', campaignTitle: 'Phyu Sin Myanmar Education Relief', amount: 25000, date: '2026-06-15', isMatched: true },
    { id: 'DON-02', employeeName: 'Kyaw Myo Thu', campaignTitle: 'Yangon Free Mobile Clinic', amount: 50000, date: '2026-06-17', isMatched: true },
    { id: 'DON-03', employeeName: 'Zarni Aung', campaignTitle: 'Irrawaddy Delta Green Forestry', amount: 15000, date: '2026-06-18', isMatched: true }
  ]);

  const [companyMatchPercent, setCompanyMatchPercent] = useState<number>(100);

  // Focus Sanctuary state hooks
  const [focusSessionActive, setFocusSessionActive] = useState<boolean>(false);
  const [focusTitle, setFocusTitle] = useState<string>('');
  const [focusTimeRemaining, setFocusTimeRemaining] = useState<number>(0);
  const [focusSessionCount, setFocusSessionCount] = useState<number>(2);
  const [focusHistory, setFocusHistory] = useState<string[]>([
    'Completed 25-minute quiet audit loop on May high-risk advances.',
    'Focused 15-minute checklist on Onboarding verification pipeline.'
  ]);

  const addLog = (action: string, user: string = 'Htet Ko (HR Checker)') => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setLogs((prev) => [{ timestamp, action, user }, ...prev]);
  };

  const approveOnboarding = (id: string) => {
    const item = onboardings.find(ob => ob.id === id);
    if (item) {
      // Add to employees list
      const newEmp = {
        id: item.empId,
        name: item.name,
        department: 'Engineering',
        salary: 1000000,
        status: 'active',
        isWhitelisted: true
      };
      setEmployees((prev) => [...prev, newEmp]);
      // Remove from onboarding
      setOnboardings((prev) => prev.filter(ob => ob.id !== id));
      addLog(`Approved onboarding for ${item.name} (${item.empId})`);
    }
  };

  const disburseWage = (ref: string) => {
    setDisbursements((prev) =>
      prev.map((d) => (d.ref === ref ? { ...d, status: 'Paid' } : d))
    );
    const item = disbursements.find(d => d.ref === ref);
    if (item) {
      addLog(`Disbursed wages for Reference ${ref} amount ${item.amount.toLocaleString()} MMK`);
    }
  };

  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const newId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEmp = { ...emp, id: newId };
    setEmployees((prev) => [...prev, newEmp]);
    addLog(`Created employee ${emp.name} (${newId})`);
  };

  const toggleWhitelist = (empId: string) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === empId) {
          const updated = !e.isWhitelisted;
          addLog(`${updated ? 'Whitelisted' : 'Removed from Whitelist'} employee ${e.name}`);
          return { ...e, isWhitelisted: updated };
        }
        return e;
      })
    );
  };

  const executeBulkUpload = (items: DiffItem[]) => {
    setDiffs(items);
    addLog(`Bulk Upload draft imported with ${items.length} proposed records`);
  };

  const applyDiffs = () => {
    diffs.forEach(diff => {
      if (diff.status === 'New') {
        const salaryVal = parseInt(diff.salary.replace(/,/g, ''), 10) || 900000;
        setEmployees(prev => [
          ...prev, 
          { id: diff.id, name: diff.name, department: 'Operations', salary: salaryVal, status: 'active', isWhitelisted: true }
        ]);
        addLog(`Bulk Upload: Added employee ${diff.name} (${diff.id})`);
      } else if (diff.status === 'Modified') {
        const salaryVal = parseInt(diff.salary.replace(/,/g, ''), 10) || 1000000;
        setEmployees(prev => prev.map(e => e.id === diff.id ? { ...e, salary: salaryVal, name: diff.name } : e));
        addLog(`Bulk Upload: Modified employee ${diff.name} (${diff.id}) salary to ${diff.salary}`);
      }
    });
    setDiffs([]);
  };

  const performClearance = (empId: string) => {
    const item = offboardingList.find(ob => ob.id === empId);
    if (item) {
      setEmployees(prev => prev.filter(e => e.id !== empId));
      setOffboardingList(prev => prev.filter(ob => ob.id !== empId));
      addLog(`Offboarded and cleared employee ${item.name} (${empId})`);
    }
  };

  const unfreezeEmployee = (empId: string) => {
    setFreezeList(prev => prev.filter(f => f.id !== empId));
    addLog(`Resumed transactions for frozen employee ${empId}`);
  };

  const savePolicy = (rule: string, value: string) => {
    setPolicies(prev => {
      const exists = prev.find(p => p.rule === rule);
      if (exists) {
        return prev.map(p => p.rule === rule ? { ...p, value } : p);
      }
      return [...prev, { rule, value }];
    });
    addLog(`Policy updated: ${rule} set to ${value}`);
  };

  const addTemplate = (name: string, policy: string) => {
    setTemplates(prev => [...prev, { name, policy }]);
    addLog(`Added config template "${name}"`);
  };

  const addRepayment = (empId: string, amount: number) => {
    const ref = `RP-${Math.floor(100 + Math.random() * 900)}`;
    const date = new Date().toISOString().split('T')[0];
    setRepayments(prev => [...prev, { ref, empId, amount, status: 'Completed', date }]);
    addLog(`Repayment received: Ref ${ref} for employee ${empId} of ${amount.toLocaleString()} MMK`);
  };

  const addCharityCampaign = (title: string, category: string, desc: string, icon: string, goal: number) => {
    const id = `CSR-00${charities.length + 1}`;
    setCharities(prev => [...prev, { id, title, category, desc, icon, totalRaised: 0, goal }]);
    addLog(`Added new corporate CSR charity campaign: "${title}"`);
  };

  const donateToCampaign = (campaignId: string, empName: string, amount: number) => {
    const campaign = charities.find(c => c.id === campaignId);
    if (!campaign) return;

    const newDonation: CharityDonation = {
      id: `DON-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeName: empName,
      campaignTitle: campaign.title,
      amount,
      isMatched: companyMatchPercent > 0,
      date: new Date().toISOString().split('T')[0]
    };

    setDonations(prev => [newDonation, ...prev]);
    setCharities(prev => prev.map(c => c.id === campaignId ? { ...c, totalRaised: c.totalRaised + amount } : c));
    addLog(`Charity Donation: ${empName} contributed ${amount.toLocaleString()} MMK to "${campaign.title}"`);
  };

  const startFocusSession = (title: string, durationMinutes: number) => {
    setFocusTitle(title);
    setFocusTimeRemaining(durationMinutes * 60);
    setFocusSessionActive(true);
    addLog(`HR Focus block started: "${title}" for ${durationMinutes} minutes`);
  };

  const stopFocusSession = () => {
    setFocusSessionActive(false);
    addLog(`HR Focus block stopped: "${focusTitle}"`);
    setFocusTitle('');
    setFocusTimeRemaining(0);
  };

  const updateFocusTime = (secondsElapsed: number) => {
    setFocusTimeRemaining(prev => {
      if (prev <= secondsElapsed) {
        setFocusSessionActive(false);
        setFocusSessionCount(c => c + 1);
        const entry = `Completed Focus Block: "${focusTitle || 'Default Audit'}" at ${new Date().toLocaleTimeString().substring(0, 5)}`;
        setFocusHistory(h => [entry, ...h]);
        addLog(`Completed focused work session: "${focusTitle || 'Default Audit'}" successfully`);
        return 0;
      }
      return prev - secondsElapsed;
    });
  };

  const addFocusHistory = (entry: string) => {
    setFocusHistory(prev => [entry, ...prev]);
  };

  return (
    <PortalStateContext.Provider value={{
      employees, disbursements, repayments, onboardings, logs, templates, policies, smartCaps,
      freezeList, diffs, offboardingList, exportFormats, cycleConfigs, rbac,
      charities, donations, companyMatchPercent, addCharityCampaign, donateToCampaign, setCompanyMatchPercent,
      focusSessionActive, focusTitle, focusTimeRemaining, focusSessionCount, focusHistory,
      startFocusSession, stopFocusSession, updateFocusTime, addFocusHistory,
      addLog, approveOnboarding, disburseWage, addEmployee, toggleWhitelist, executeBulkUpload,
      applyDiffs, performClearance, unfreezeEmployee, savePolicy, addTemplate, addRepayment
    }}>
      {children}
    </PortalStateContext.Provider>
  );
}

export function usePortalState() {
  const context = useContext(PortalStateContext);
  if (!context) {
    throw new Error('usePortalState must be used within a PortalStateProvider');
  }
  return context;
}
