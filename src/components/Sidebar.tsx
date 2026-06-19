import { useState } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ReceiptText, 
  Users, 
  CheckCircle2, 
  Upload, 
  Settings, 
  BarChart3, 
  ClipboardList, 
  ShieldAlert, 
  DoorOpen, 
  Save, 
  ScrollText, 
  KeyRound, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  CalendarCheck,
  Heart,
  Brain,
  Coins
} from 'lucide-react';
import { Screen } from '@/types';

interface SidebarProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

interface MenuCategory {
  title: string;
  items: { id: Screen; label: string; icon: any }[];
}

export function Sidebar({ activeScreen, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  
  const categories: MenuCategory[] = [
    {
      title: 'Directory & Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'employees', label: 'Employees', icon: Users },
        { id: 'onboarding', label: 'Onboarding', icon: CheckCircle2 },
        { id: 'offboarding', label: 'Offboarding', icon: DoorOpen },
      ]
    },
    {
      title: 'Cash Flows & Finance',
      items: [
        { id: 'salary-portal', label: 'Salary Portal', icon: Coins },
        { id: 'disbursement', label: 'Disbursement', icon: Wallet },
        { id: 'repayments', label: 'Repayments', icon: ReceiptText },
        { id: 'charity', label: 'Charity & CSR', icon: Heart },
        { id: 'freeze', label: 'Freeze', icon: ShieldAlert },
        { id: 'export', label: 'Export', icon: Save },
      ]
    },
    {
      title: 'Rules & Configurations',
      items: [
        { id: 'upload', label: 'Upload & Diff', icon: Upload },
        { id: 'policy', label: 'Policy Engine', icon: Settings },
        { id: 'config', label: 'Cycle Config', icon: CalendarCheck },
        { id: 'limits', label: 'Smart Cap', icon: BarChart3 },
        { id: 'templates', label: 'Templates', icon: ClipboardList },
      ]
    },
    {
      title: 'Governance & Tech',
      items: [
        { id: 'rbac', label: 'RBAC Security', icon: KeyRound },
        { id: 'logs', label: 'Approval Logs', icon: ScrollText },
        { id: 'focus', label: 'HR Focus Sanctuary', icon: Brain },
        { id: 'guide', label: 'System Guide', icon: BookOpen },
      ]
    }
  ];

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-slate-950 text-white flex flex-col h-full overflow-hidden transition-all duration-300`}>
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white flex items-center justify-center font-bold text-slate-950 text-sm">
            <i className="fa-solid fa-coins"></i>
          </div>
          {!collapsed && <span className="font-extrabold text-sm tracking-widest text-white uppercase font-mono">REMIX <span className="text-slate-500 font-bold">: HR</span></span>}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 hover:bg-slate-900 transition-colors text-slate-400 hover:text-white">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      <nav className="flex-1 p-2 flex flex-col gap-5 overflow-y-auto bg-slate-950">
        {categories.map((category, catIdx) => (
          <div key={catIdx} className="space-y-0.5">
            {!collapsed ? (
              <h4 className="px-3 text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5 font-mono">
                {category.title}
              </h4>
            ) : (
              <div className="border-t border-slate-900 my-2 mx-1"></div>
            )}
            {category.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-slate-900 text-white border-l-2 border-white' 
                      : 'text-slate-400 hover:bg-slate-900/40 hover:text-white'
                  }`}
                >
                  <Icon size={14} className={`${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!collapsed && <span className="font-mono text-[11px] uppercase">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      {!collapsed && (
        <div className="p-4 border-t border-slate-900 text-xs bg-slate-950 font-mono text-slate-500 flex justify-between items-center">
          <div>
            <div className="font-bold text-white uppercase tracking-tight text-[11px]">HTET KO KO</div>
            <div className="text-[9px] font-bold text-slate-600 uppercase">SYS_ADMIN_CHECKER</div>
          </div>
          <div className="text-emerald-500 text-[10px]">
            <i className="fa-solid fa-circle text-[8px] animate-pulse"></i>
          </div>
        </div>
      )}
    </aside>
  );
}

