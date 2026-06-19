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
  Heart,
  Brain,
  Coins,
  X
} from 'lucide-react';
import { Screen } from '@/types';
import { usePortalState } from '@/context/PortalStateContext';

interface SidebarProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface MenuCategory {
  titleEn: string;
  titleMm: string;
  items: { 
    id: Screen; 
    labelEn: string; 
    labelMm: string; 
    icon: any 
  }[];
}

export function Sidebar({ activeScreen, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { language } = usePortalState();
  
  const categories: MenuCategory[] = [
    {
      titleEn: 'Directory & Operations',
      titleMm: 'ခန့်ခွဲမှုနှင့် အလုပ်အကိုင်',
      items: [
        { id: 'dashboard', labelEn: 'Dashboard', labelMm: 'ပင်မမျက်နှာစာ', icon: LayoutDashboard },
        { id: 'employees', labelEn: 'Workforce Control', labelMm: 'ဝန်ထမ်းထိန်းချုပ်မှု', icon: Users },
        { id: 'onboarding', labelEn: 'Onboarding Checklist', labelMm: 'ဝန်ထမ်းသစ်ဝင်ရောက်မှု', icon: CheckCircle2 },
        { id: 'offboarding', labelEn: 'Offboarding Clearing', labelMm: 'ထွက်ခွာမှုစာရင်းချုပ်', icon: DoorOpen },
      ]
    },
    {
      titleEn: 'Cash Flows & Finance',
      titleMm: 'ဘဏ္ဍာရေးနှင့် လစာစီးဆင်းမှု',
      items: [
        { id: 'salary-portal', labelEn: 'Salary Portal', labelMm: 'လစာထုတ်ယူမှု စနစ်', icon: Coins },
        { id: 'disbursement', labelEn: 'Disbursement Ledger', labelMm: 'ငွေထုတ်ပေးမှု မှတ်တမ်း', icon: Wallet },
        { id: 'repayments', labelEn: 'Repayment Ledger', labelMm: 'လစာပြန်သွင်းမှု လယ်ဂျာ', icon: ReceiptText },
        { id: 'charity', labelEn: 'Charity & CSR', labelMm: 'လူမှုရေးကူညီမှုနှင့် CSR', icon: Heart },
        { id: 'freeze', labelEn: 'Freeze Control', labelMm: 'လစာဆိုင်းငံ့မှု စနစ်', icon: ShieldAlert },
        { id: 'export', labelEn: 'Export Hub', labelMm: 'အချက်အလက်ပို့ထုတ်ရန်', icon: Save },
      ]
    },
    {
      titleEn: 'Rules & Configurations',
      titleMm: 'မူဝါဒနှင့် စက်ပြင်ဆင်ချက်များ',
      items: [
        { id: 'upload', labelEn: 'Upload & Diff', labelMm: 'ဒေတာတင်သွင်းရန်', icon: Upload },
        { id: 'policy', labelEn: 'Policy Engine', labelMm: 'မူဝါဒထိန်းချုပ်စနစ်', icon: Settings },
        { id: 'config', labelEn: 'Cycle Config', labelMm: 'လစဉ်တွက်ချက်စက်ဝန်း', icon: BarChart3 },
        { id: 'limits', labelEn: 'Smart Cap Rules', labelMm: 'ယူမှုကန့်သတ်နှုန်း', icon: ClipboardList },
        { id: 'templates', labelEn: 'Template Preset', labelMm: 'မူဝါဒပုံစံကြမ်း presets', icon: CalendarCheckIcon },
      ]
    },
    {
      titleEn: 'Governance & Tech',
      titleMm: 'စီမံခန့်ခွဲမှုနှင့် လုံခြုံရေး',
      items: [
        { id: 'rbac', labelEn: 'RBAC Security', labelMm: 'လုံခြုံရေးခွင့်ပြုချက်များ', icon: KeyRound },
        { id: 'logs', labelEn: 'Approval Logs', labelMm: 'စနစ်အတည်ပြုမှတ်တမ်း', icon: ScrollText },
        { id: 'focus', labelEn: 'HR Focus Area', labelMm: 'HR အာရုံစိုက်ရာ ကဏ္ဍ', icon: Brain },
        { id: 'guide', labelEn: 'System Guide', labelMm: 'စနစ်လမ်းညွှန်စာထုတ်', icon: BookOpen },
      ]
    }
  ];

  // Helper custom icon render in place of CalendarCheck to prevent any import limits
  function CalendarCheckIcon(props: any) {
    return <ClipboardList {...props} />;
  }

  const sidebarTitle = language === 'mm' ? 'လစာထုတ်စနစ်' : 'EWA Portal';

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 z-40 md:hidden transition-opacity cursor-pointer backdrop-blur-sm"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 transition-transform duration-300 md:duration-200 flex flex-col h-full overflow-hidden bg-slate-950 text-white ${
          collapsed ? 'md:w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 select-none shadow">
              E
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="font-extrabold text-lg tracking-tight flex items-center gap-1.5 grayscale-0">
                EWA 
                <span className="text-emerald-400 font-normal border-b border-emerald-400/40 text-xs tracking-widest pb-0.5">
                  {language === 'mm' ? 'ပေါ်တယ်' : 'PORTAL'}
                </span>
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {/* Desktop collapse button */}
            <button 
              onClick={() => setCollapsed(!collapsed)} 
              className="hidden md:flex p-1.5 rounded hover:bg-slate-800 transition text-slate-400 hover:text-white"
              title="Toggle Sidebar size"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            {/* Mobile close button */}
            <button 
              onClick={onCloseMobile} 
              className="md:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition shadow-sm"
              title="Close Sidebar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Navigation Actions */}
        <nav className="flex-1 p-3 flex flex-col gap-5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          {categories.map((category, catIdx) => (
            <div key={catIdx} className="space-y-1">
              {(!collapsed || mobileOpen) ? (
                <h4 className="px-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">
                  {language === 'mm' ? category.titleMm : category.titleEn}
                </h4>
              ) : (
                <div className="border-t border-slate-800/60 my-2 mx-2"></div>
              )}
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeScreen === item.id;
                const label = language === 'mm' ? item.labelMm : item.labelEn;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onCloseMobile(); // Auto close on select for sleek feel on mobile
                    }}
                    title={label}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-slate-900 text-emerald-400 border-l-2 border-emerald-400 shadow-inner' 
                        : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                    }`}
                  >
                    <Icon size={15} className={`${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-white'}`} />
                    {(!collapsed || mobileOpen) && <span className="truncate">{label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Active HR Checker Badge Footer */}
        {(!collapsed || mobileOpen) && (
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-[10px] text-white">
                HK
              </div>
              <div>
                <div className="font-extrabold text-slate-200">U Htet Ko</div>
                <div className="text-[10px] text-emerald-500 font-bold tracking-wider uppercase font-mono">
                  {language === 'mm' ? 'HR စစ်ဆေးချုပ်' : 'HR CHECKER'}
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
