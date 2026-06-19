export const employees = [
  { id: 'EMP-1001', name: 'Aung Myo', department: 'Engineering', salary: 1200000, status: 'active', isWhitelisted: true },
  { id: 'EMP-4412', name: 'Su Myat', department: 'Finance', salary: 800000, status: 'conflict', isWhitelisted: true },
  { id: 'EMP-8902', name: 'Kyaw Zin', department: 'Operations', salary: 950000, status: 'terminated', isWhitelisted: false },
  { id: 'EMP-2201', name: 'Min Min', department: 'Engineering', salary: 1100000, status: 'active', isWhitelisted: true },
  { id: 'EMP-7703', name: 'Su Su', department: 'Finance', salary: 750000, status: 'active', isWhitelisted: false },
];

export const disbursements = [
  { ref: 'MO-8821', empId: 'EMP-1001', amount: 500000, status: 'Paid', date: '2026-06-05' },
  { ref: 'MO-8822', empId: 'EMP-4412', amount: 300000, status: 'Pending', date: '2026-06-19' },
  { ref: 'MO-8823', empId: 'EMP-2201', amount: 400000, status: 'Paid', date: '2026-06-10' },
];

export const repayments = [
    { ref: 'RP-101', empId: 'EMP-1001', amount: 500000, status: 'Completed', date: '2026-06-10' },
    { ref: 'RP-102', empId: 'EMP-2201', amount: 400000, status: 'Completed', date: '2026-06-12' },
];

export const onboardings = [
    { id: 'OB-001', empId: 'EMP-7788', name: 'Mg Mg', status: 'Verification' },
    { id: 'OB-002', empId: 'EMP-9901', name: 'Zaw Htet', status: 'Ready' },
    { id: 'OB-003', empId: 'EMP-5501', name: 'Hla Hla', status: 'Approved' },
];

export const logs = [
    { timestamp: '2026-06-19 10:23', action: 'Bulk Upload Approved', user: 'Htet Ko' },
    { timestamp: '2026-06-18 14:15', action: 'Whitelist Granted', user: 'Htet Ko' },
    { timestamp: '2026-06-19 09:00', action: 'New Employee Map', user: 'System' },
    { timestamp: '2026-06-17 11:00', action: 'Policy Updated', user: 'Admin' },
];

export const templates = [
  { name: 'Manufacturing Std', policy: '40% limit, Monthly' },
  { name: 'Tech Aggressive', policy: '60% limit, Weekly' }
];

export const policies = [
  { rule: 'Allowance Window', value: '1st - 25th of month' },
  { rule: 'Corporate Max Cap', value: '10,000,000 MMK' },
];

export const smartCaps = [
  { tier: 'Probation', limit: '20%' },
  { tier: 'Confirmed', limit: '40%' },
  { tier: 'Senior', limit: '50%' },
];

export const freezeList = [
  { id: 'EMP-8902', name: 'Kyaw Zin', status: 'Frozen', amount: 150000 },
];

export const diffs = [
  { id: 'EMP-6001', name: 'New Hire A', salary: '900,000', status: 'New' },
  { id: 'EMP-4412', name: 'Su Myat', salary: '1,000,000', status: 'Modified' },
];

export const offboardingList = [
  { id: 'EMP-8902', name: 'Kyaw Zin', outstanding: '150,000 MMK', deduction: '150,000' },
];

export const exportFormats = [
  { format: 'Standard CSV', type: 'CSV' },
  { format: 'Excel for SAP/Oracle', type: 'XLSX' },
];

export const cycleConfigs = [
  { config: 'Cycle Type', value: 'Monthly' },
  { config: 'Grace Period', value: '5 Days' },
];

export const rbac = [
  { role: 'HR Maker', permissions: 'Upload, Drafts' },
  { role: 'HR Checker', permissions: 'Approve, Commit' },
  { role: 'Auditor', permissions: 'ReadOnly Reports' }
];
