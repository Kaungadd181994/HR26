
export function Header({ screenName }: { screenName: string }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between flex-shrink-0">
      <div>
        <h2 className="text-sm font-black text-slate-900 tracking-wider uppercase font-mono">{screenName}</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">WORKSPACE: PRIMARY PORTAL</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="px-3 py-1 text-[10px] font-bold bg-slate-900 text-white border border-slate-900 font-mono uppercase">
          HR CHECKER
        </span>
        <div className="text-xs cursor-pointer p-2 bg-slate-50 hover:bg-slate-900 hover:text-white transition-all text-slate-500 flex items-center justify-center border border-slate-200 font-mono">
          <i className="fa-solid fa-bell"></i>
        </div>
      </div>
    </header>
  );
}
