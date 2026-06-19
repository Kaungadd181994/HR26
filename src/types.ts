export type Screen = 'salary-portal' | 'dashboard' | 'disbursement' | 'repayments' | 'employees' | 'onboarding' | 'upload' | 'policy' | 'config' | 'limits' | 'templates' | 'freeze' | 'offboarding' | 'export' | 'logs' | 'rbac' | 'guide' | 'focus' | 'charity';

export interface Employee {
  id: string;
  name: string;
  department: string;
  salary: number;
  status: 'active' | 'conflict' | 'terminated';
  isWhitelisted: boolean;
}
