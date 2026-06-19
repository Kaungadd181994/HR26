import { usePortalState } from '@/context/PortalStateContext';
import { UserCheck, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export function Onboarding() {
  const { onboardings, approveOnboarding } = usePortalState();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <UserCheck size={20} className="text-emerald-500" />
          Onboarding Verification Queue
        </h3>
        <p className="text-sm text-slate-500 mt-1">Review newly registered staff members and approve their credential verification for wage advance eligibility.</p>
      </div>

      {onboardings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center">
          <ShieldCheck className="text-emerald-500 mx-auto mb-3" size={36} />
          <h4 className="text-sm font-bold text-slate-900">Queue is Clear</h4>
          <p className="text-xs text-slate-500 mt-1">All newly hired staff profiles are verified.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {onboardings.map((rec) => (
            <div key={rec.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-slate-200 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] font-bold text-slate-400">{rec.id}</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    rec.status === 'Approved' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : rec.status === 'Ready' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    <Clock size={10} />
                    {rec.status}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{rec.name}</h4>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>Employee Ref: <span className="font-mono font-medium text-slate-700">{rec.empId}</span></div>
                  <div>KYC Check: <span className="text-emerald-600 font-medium">Completed</span></div>
                  <div>Source: <span className="font-medium text-slate-700">Workday Automated Map</span></div>
                </div>
              </div>

              <button 
                onClick={() => approveOnboarding(rec.id)}
                className="mt-6 w-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                Approve & Activate EWA
                <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
