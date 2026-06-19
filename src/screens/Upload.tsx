import { usePortalState } from '@/context/PortalStateContext';
import { useState } from 'react';
import { 
  Upload as UploadIcon, 
  ArrowRight, 
  CheckCircle, 
  HelpCircle,
  FileCheck, 
  Sparkles,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  UserPlus,
  Edit3
} from 'lucide-react';

type WizardStep = 'upload' | 'diff' | 'completed';

export function Upload() {
  const { diffs, applyDiffs, executeBulkUpload } = usePortalState();
  const [step, setStep] = useState<WizardStep>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);

  const simulateDragAndDrop = () => {
    setProcessing(true);
    setTimeout(() => {
      // Simulate reading a CSV with differences
      executeBulkUpload([
        { id: 'EMP-6001', name: 'New Hire A (Tin Tin)', salary: '1,350,000', status: 'New' },
        { id: 'EMP-4412', name: 'Su Myat', salary: '1,050,000', status: 'Modified' },
      ]);
      setProcessing(false);
      setStep('diff');
    }, 1200);
  };

  const handleApply = () => {
    applyDiffs();
    setStep('completed');
  };

  const resetWizard = () => {
    setStep('upload');
  };

  return (
    <div className="space-y-6">
      {/* Header and Explanation */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UploadIcon size={20} className="text-emerald-500" />
            Bulk Sync & Diff Engine
          </h3>
          <p className="text-sm text-slate-500 mt-1">Upload files from Workday or SAP. Review automated delta comparisons before commiting.</p>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-slate-900 px-8 py-4 rounded-2xl flex items-center justify-between text-white border border-slate-800 shadow-sm max-w-4xl">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step === 'upload' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>1</span>
            <span className={`text-xs font-semibold ${step === 'upload' ? 'text-white' : 'text-slate-400'}`}>Upload Master</span>
          </div>
          <ChevronRight size={14} className="text-slate-600" />
          <div className="flex items-center gap-3">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step === 'diff' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>2</span>
            <span className={`text-xs font-semibold ${step === 'diff' ? 'text-white' : 'text-slate-400'}`}>Verify Deltas</span>
          </div>
          <ChevronRight size={14} className="text-slate-600" />
          <div className="flex items-center gap-3">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step === 'completed' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>3</span>
            <span className={`text-xs font-semibold ${step === 'completed' ? 'text-white' : 'text-slate-400'}`}>Commit & Log</span>
          </div>
        </div>
      </div>

      {/* Step Contents */}
      {step === 'upload' && (
        <div className="max-w-4xl space-y-6">
          <div 
            onClick={simulateDragAndDrop}
            className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
              dragActive || processing
                ? 'border-emerald-500 bg-emerald-50/15' 
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30'
            }`}
          >
            {processing ? (
              <div className="space-y-4 animate-pulse">
                <RefreshCw size={44} className="text-emerald-500 mx-auto animate-spin" />
                <h4 className="text-sm font-bold text-slate-900">Comparing payroll items...</h4>
                <p className="text-xs text-slate-500">Retrieving employee database and generating a side-by-side delta preview.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <UploadIcon size={22} className="text-slate-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Upload Pay Cycles, New Hires, or Diffs</h4>
                  <p className="text-xs text-slate-400 mt-1">Accepts standard Excel, CSV, or Workday exported feeds.</p>
                </div>
                <div className="pt-2">
                  <span className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition inline-block">
                    Click to browse files & Sync Demographics
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 flex gap-4 text-xs max-w-4xl">
            <AlertTriangle className="text-amber-600 flex-shrink-0" size={18} />
            <div>
              <h5 className="font-bold text-amber-900">Pro-tip for testing the prototype</h5>
              <p className="text-amber-800 leading-relaxed mt-1">To easily test the interactive delta mechanics without uploading a real file, simply <strong>click anywhere on the dashed container box above</strong>. The app will automatically construct 2 different sample changes matching real employee targets!</p>
            </div>
          </div>
        </div>
      )}

      {step === 'diff' && (
        <div className="max-w-4xl space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">System Detected Differences</h4>
                <p className="text-xs text-slate-500 mt-1">Review additions and edits discovered in this file upload check.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                  <UserPlus size={10} /> 1 New
                </span>
                <span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                  <Edit3 size={10} /> 1 Modified
                </span>
              </div>
            </div>

            {/* Structured Table Comparor */}
            <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-50">
              {diffs.map((diff) => (
                <div key={diff.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/50 transition">
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      diff.status === 'New' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {diff.status === 'New' ? <UserPlus size={14} /> : <Edit3 size={14} />}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900">{diff.name}</div>
                      <span className="font-mono text-[10px] text-slate-400">{diff.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Proposed Salary</span>
                      <strong className="font-mono text-slate-900">{diff.salary} MMK</strong>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      diff.status === 'New' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {diff.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button 
                onClick={resetWizard}
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Abondon Upload
              </button>
              <button 
                onClick={handleApply}
                className="bg-emerald-600 hover:bg-emerald-505 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1"
              >
                Apply Changes & Save
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'completed' && (
        <div className="max-w-2xl bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900">Master Synchronisation Complete</h4>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Delta records successfully applied, saved securely in the employee ledger directory, and noted inside system compliance logs.
            </p>
          </div>
          <div className="pt-2">
            <button 
              onClick={resetWizard}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition shadow-sm"
            >
              Start New Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
