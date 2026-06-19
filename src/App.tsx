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
import { PortalStateProvider, usePortalState } from '@/context/PortalStateContext';

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = usePortalState();

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
    const isMm = language === 'mm';
    if (activeScreen === 'salary-portal') return isMm ? 'လစာကြိုတင်ထုတ်ယူခွင့်စနစ် (Standard EWA Portal)' : 'Salary Release Portal';
    if (activeScreen === 'dashboard') return isMm ? 'ကော်ပိုရိတ် စုံစမ်းမှုပြင်ကွင်း (Corporate Dashboard)' : 'Corporate Dashboard';
    if (activeScreen === 'employees') return isMm ? 'ပေါင်းစပ်ဝန်ထမ်းထိန်းချုပ်ရေး (Enterprise Workforce)' : 'Workforce Directory';
    if (activeScreen === 'disbursement') return isMm ? 'လစာစောထုတ်ငွေ ပေးအပ်မှုစာရင်းချုပ်' : 'Disbursement Ledger';
    if (activeScreen === 'repayments') return isMm ? 'ပြန်လည်ရယူမှုငွေလွှဲလယ်ဂျာ' : 'Wage Repayment Ledgers';
    if (activeScreen === 'onboarding') return isMm ? 'ဝန်ထမ်းသစ်ဝင်ရောက်စစ်ဆေးမှု' : 'Onboarding Checklists';
    if (activeScreen === 'offboarding') return isMm ? 'အလုပ်မှထွက်ခွာသူများစာရင်းလှုပ်ရှားမှု' : 'Staff Offboarding';
    if (activeScreen === 'upload') return isMm ? 'ဒေတာတင်သွင်းမှုနှင့် အချက်ပြောင်းလဲမှု' : 'Data Diff Integrator';
    if (activeScreen === 'policy') return isMm ? 'ကော်ပိုရိတ် စည်းမျဉ်းမူဝါဒ ထိန်းချုပ်စနစ်' : 'Corporate Policy Engine';
    if (activeScreen === 'config') return isMm ? 'လစဉ်တွက်ချက်ခြင်း လစက်ဝန်း' : 'Payroll Cycle Config';
    if (activeScreen === 'limits') return isMm ? 'ထုတ်ယူမှုအမြင့်ဆုံး သတ်မှတ်ချက်' : 'Smart Limit Caps';
    if (activeScreen === 'templates') return isMm ? 'အုပ်ချုပ်ရေး ပုံစံကြမ်း Preset' : 'Policy Templates';
    if (activeScreen === 'rbac') return isMm ? 'လုံခြုံရေး ကဏ္ဍစစ်ဆေးမှု' : 'RBAC Access Controller';
    if (activeScreen === 'logs') return isMm ? 'ခွင့်ပြုချက်သမိုင်းမှတ်တမ်း' : 'Portal Audit Trail Logs';
    if (activeScreen === 'focus') return isMm ? 'HR သီးသန့်စိတ်ရှည်မှု ၄၄၃' : 'HR Focus Sanctuary';
    if (activeScreen === 'charity') return isMm ? 'လူမှုရေးကူညီပံ့ပိုးမှုကဏ္ဍ (CSR Hub)' : 'CSR Charity Donator';
    if (activeScreen === 'guide') return isMm ? 'စနစ်လမ်းညွှန် လမ်းညွှန်စာအုပ်' : 'Corporate Portal Guide';
    if (activeScreen === 'export') return isMm ? 'ရှင်းလင်းငွေစာရင်းလွှဲပြောင်းရန် ဒေတာထုတ်ယူမှု' : 'Payroll Settlement Export';
    return activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden relative">
      {/* Sidebar navigation is responsive now */}
      <Sidebar 
        activeScreen={activeScreen} 
        onNavigate={setActiveScreen} 
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header 
          screenName={getScreenName()} 
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderScreen()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PortalStateProvider>
      <AppContent />
    </PortalStateProvider>
  );
}
