import { usePortalState } from '@/context/PortalStateContext';
import { Menu, Globe, Bell } from 'lucide-react';

interface HeaderProps {
  screenName: string;
  onToggleMobileMenu: () => void;
}

export function Header({ screenName, onToggleMobileMenu }: HeaderProps) {
  const { language, setLanguage } = usePortalState();

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center px-4 md:px-8 justify-between flex-shrink-0 relative z-30 shadow-sm md:shadow-none">
      {/* Left side: Hamburger (mobile only) & Brand Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-sm md:text-xl font-extrabold text-slate-900 tracking-tight line-clamp-1">
            {screenName}
          </h2>
          <p className="text-[10px] md:text-xs text-slate-500 font-medium">
            {language === 'mm' ? 'မြန်မာ့ကော်ပိုရိတ် HR ထိန်းချုပ်မှုစနစ်' : 'Corporate HR Mobile Terminal'}
          </p>
        </div>
      </div>

      {/* Right side: Language Switcher, Active Status & Notifications */}
      <div className="flex items-center gap-2 md:gap-4 select-none">
        
        {/* Toggleable Flag Pill */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5 shadow-sm">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-1 ${
              language === 'en'
                ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <i className="fa-solid fa-flag text-[9px]"></i>
            <span className="hidden sm:inline">EN</span>
          </button>
          <button
            onClick={() => setLanguage('mm')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-tight transition-all flex items-center gap-1 ${
              language === 'mm'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <i className="fa-solid fa-star text-[9px] text-yellow-300"></i>
            <span>မြန်မာ</span>
          </button>
        </div>

        {/* HR Checker Active Status */}
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-100 uppercase tracking-widest font-mono">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          {language === 'mm' ? 'HR စစ်ဆေးရေးမှူး' : 'HR Checker active'}
        </span>

        {/* Notifications Icon with Indicator */}
        <div className="relative text-xs cursor-pointer p-2 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-colors text-slate-500 hover:text-slate-800 flex items-center justify-center border border-slate-100">
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border border-white rounded-full animate-bounce"></span>
        </div>
      </div>
    </header>
  );
}
