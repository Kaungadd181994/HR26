import { usePortalState } from '@/context/PortalStateContext';
import { KeyRound, ShieldAlert, Plus, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function RBAC() {
  const { rbac, addLog } = usePortalState();
  const [roles, setRoles] = useState(rbac);
  const [newRole, setNewRole] = useState('');
  const [newPerms, setNewPerms] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [success, setSuccess] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole || !newPerms) return;
    setRoles(prev => [...prev, { role: newRole, permissions: newPerms }]);
    addLog(`Security Role "${newRole}" added with permission matrix [${newPerms}]`);
    setNewRole('');
    setNewPerms('');
    setShowAdd(false);
    setSuccess(`Security Profile for "${newRole}" has been mapped successfully!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEditPerms = (roleName: string, current: string) => {
    const val = prompt(`Tweak permission matrix for role [${roleName}]:`, current);
    if (!val) return;
    setRoles(prev => prev.map(r => r.role === roleName ? { ...r, permissions: val } : r));
    addLog(`Modified permissions for security role "${roleName}" to [${val}]`);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {success}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <KeyRound size={20} className="text-emerald-500" />
            Security & RBAC Matrix
          </h3>
          <p className="text-sm text-slate-500 mt-1">Configure user roles and specific dashboard write/execute clearances to guarantee SOC-2 compliance.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
        >
          <Plus size={14} />
          {showAdd ? 'Close' : 'Add New Role'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 max-w-lg animate-fadeIn">
          <h4 className="text-sm font-bold text-slate-900">Configure Security Role</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Role Title</label>
              <input 
                type="text" 
                placeholder="Ex. Regional Manager" 
                value={newRole} 
                onChange={e => setNewRole(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
                required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Clearances (Comma separated)</label>
              <input 
                type="text" 
                placeholder="Ex. Read, Export, Freeze" 
                value={newPerms} 
                onChange={e => setNewPerms(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
                required 
              />
            </div>
          </div>
          <button type="submit" className="bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all">Grant Credentials</button>
        </form>
      )}

      {/* RBAC Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Security Role</th>
              <th className="px-6 py-4">Assigned Clearance Parameters</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs text-slate-600">
            {roles.map((row) => (
              <tr key={row.role} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-950 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    {row.role}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {row.permissions.split(',').map((p) => (
                      <span key={p} className="bg-slate-50 border border-slate-100 text-slate-600 font-mono text-[9px] px-2 py-0.5 rounded-md font-bold">
                        {p.trim()}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleEditPerms(row.role, row.permissions)}
                    className="text-[10px] font-bold border border-slate-100 hover:border-emerald-200 px-3 py-1 rounded-lg transition"
                  >
                    Tweak Clearances
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
