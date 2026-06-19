/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Screen } from '@/types';
import { Dashboard } from '@/screens/Dashboard';
import { Disbursement } from '@/screens/Disbursement';
import { SystemGuide } from '@/screens/SystemGuide';
import { Employees } from '@/screens/Employees';
import { Repayments } from '@/screens/Repayments';
import { Onboarding } from '@/screens/Onboarding';
import { Logs } from '@/screens/Logs';
import { PolicyEngine } from '@/screens/PolicyEngine';
import { SmartCap } from '@/screens/SmartCap';
import { Freeze } from '@/screens/Freeze';
import { Upload } from '@/screens/Upload';
import { Offboarding } from '@/screens/Offboarding';
import { Export } from '@/screens/Export';
import { Templates } from '@/screens/Templates';
import { RBAC } from '@/screens/RBAC';
import { CycleConfig } from '@/screens/CycleConfig';
import { Focus } from '@/screens/Focus';
import { Charity } from '@/screens/Charity';
import { SalaryPortal } from '@/screens/SalaryPortal';
import { PortalStateProvider } from '@/context/PortalStateContext';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('salary-portal');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'salary-portal': return <SalaryPortal />;
      case 'dashboard': return <Dashboard />;
      case 'disbursement': return <Disbursement />;
      case 'repayments': return <Repayments />;
      case 'employees': return <Employees />;
      case 'onboarding': return <Onboarding />;
      case 'logs': return <Logs />;
      case 'templates': return <Templates />;
      case 'rbac': return <RBAC />;
      case 'policy': return <PolicyEngine />;
      case 'config': return <CycleConfig />;
      case 'limits': return <SmartCap />;
      case 'freeze': return <Freeze />;
      case 'upload': return <Upload />;
      case 'offboarding': return <Offboarding />;
      case 'export': return <Export />;
      case 'guide': return <SystemGuide />;
      case 'focus': return <Focus />;
      case 'charity': return <Charity />;
      default: return <div className="p-8 bg-white border border-slate-100 rounded-2xl">Page outstanding</div>;
    }
  };

  const getScreenName = () => {
    if (activeScreen === 'salary-portal') return 'Enterprise Advanced Salary Portal';
    if (activeScreen === 'focus') return 'HR Focus Sanctuary';
    if (activeScreen === 'charity') return 'Charity & CSR Impact';
    if (activeScreen === 'rbac') return 'RBAC Security';
    return activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1);
  };

  return (
    <PortalStateProvider>
      <div className="flex h-screen bg-slate-50 text-slate-900">
        <Sidebar activeScreen={activeScreen} onNavigate={setActiveScreen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header screenName={getScreenName()} />
          <main className="flex-1 overflow-y-auto p-5 md:p-6 bg-zinc-50/50">{renderScreen()}</main>
        </div>
      </div>
    </PortalStateProvider>
  );
}

