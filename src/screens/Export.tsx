import { usePortalState } from '@/context/PortalStateContext';
import { Save, FileSpreadsheet, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function Export() {
  const { exportFormats, employees, disbursements } = usePortalState();
  const [selectedFormat, setSelectedFormat] = useState('Standard CSV');
  const [exporting, setExporting] = useState(false);
  const [exportedFile, setExportedFile] = useState('');

  const triggerExport = () => {
    setExporting(true);
    setExportedFile('');
    setTimeout(() => {
      setExporting(false);
      setExportedFile(`EWA_PAYROLL_EXPORT_${new Date().toISOString().split('T')[0]}.${selectedFormat === 'Standard CSV' ? 'csv' : 'xlsx'}`);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Save size={20} className="text-emerald-500" />
          Multi-System Payroll Export
        </h3>
        <p className="text-sm text-slate-500 mt-1">Generate ISO 20022 and standard ERP formats to reconcile wage advances directly into Oracle, SAP, or manual spreadsheet systems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-50 pb-4">
            <h4 className="text-sm font-bold text-slate-900">Format Selection</h4>
            <p className="text-xs text-slate-500 mt-1">Select the export specification matching your bank's portal or HR ERP.</p>
          </div>

          <div className="space-y-3">
            {exportFormats.map((item) => (
              <label 
                key={item.format} 
                onClick={() => setSelectedFormat(item.format)}
                className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition ${
                  selectedFormat === item.format 
                    ? 'border-emerald-500 bg-emerald-50/10' 
                    : 'border-slate-100 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className={selectedFormat === item.format ? 'text-emerald-600' : 'text-slate-400'} size={20} />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{item.format}</span>
                    <span className="text-[10px] text-slate-500">Includes Employee ID, cycle deduction, and bank account mappings</span>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value={item.format} 
                  checked={selectedFormat === item.format} 
                  onChange={() => setSelectedFormat(item.format)} 
                  className="accent-emerald-600" 
                />
              </label>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-end">
            <button 
              onClick={triggerExport}
              disabled={exporting}
              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              {exporting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Generating Ledger...
                </>
              ) : (
                <>
                  <Download size={14} />
                  Generate Ledger File
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 h-fit">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selected Payload Statistics</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-50">
              <span className="text-slate-500">Record Count</span>
              <strong className="text-slate-900 font-mono">{employees.length}</strong>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-50">
              <span className="text-slate-500">Disbursed Cycles</span>
              <strong className="text-slate-900 font-mono">{disbursements.filter(d => d.status === 'Paid').length} rows</strong>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">Our system processes all active EWA files and outputs clean data arrays. Ensure to verify all differences before synchronizing paycheque files with standard banking apps.</p>
          </div>
        </div>
      </div>

      {exportedFile && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex gap-4 text-xs max-w-4xl animate-fadeIn">
          <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={18} />
          <div className="flex-1">
            <h5 className="font-bold text-emerald-900">Download Ready</h5>
            <p className="text-emerald-800 leading-relaxed mt-1">Generated report is compiled matching security rules.</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="bg-white border border-emerald-200 text-emerald-800 font-mono text-[10px] px-3 py-1.5 rounded-lg font-bold">
                {exportedFile}
              </span>
              <span className="text-[10px] bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-emerald-500 transition">
                Download Now
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
