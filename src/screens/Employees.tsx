import { usePortalState } from '@/context/PortalStateContext';
import { useState } from 'react';
import { Users, Plus, ShieldCheck, ShieldAlert, Check, X } from 'lucide-react';

export function Employees() {
  const { employees, toggleWhitelist, addEmployee } = usePortalState();
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [salary, setSalary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !salary) return;
    const salaryVal = parseInt(salary, 10);
    if (isNaN(salaryVal)) return;

    addEmployee({
      name,
      department,
      salary: salaryVal,
      status: 'active',
      isWhitelisted: true,
    });

    setName('');
    setSalary('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users size={20} className="text-emerald-500" />
            Employee Directory
          </h3>
          <p className="text-sm text-slate-500 mt-1">Manage personnel, salaries, and salary advance whitelist configurations.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2"
        >
          <Plus size={14} />
          {showAddForm ? 'Close panel' : 'Add Employee'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 max-w-xl animate-fadeIn">
          <h4 className="text-sm font-semibold text-slate-900">Add New Employee</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                placeholder="Mg Aung"
                required 
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Department</label>
              <select 
                value={department} 
                onChange={e => setDepartment(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Monthly Salary (MMK)</label>
              <input 
                type="number" 
                value={salary} 
                onChange={e => setSalary(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                placeholder="1000000"
                required 
              />
            </div>
          </div>
          <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg">
            Save Employee
          </button>
        </form>
      )}

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Monthly Salary</th>
              <th className="px-6 py-4">EWA Whitelist Status</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {employees.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-mono font-semibold text-slate-500">{row.id}</td>
                <td className="px-6 py-4 text-slate-900 font-medium">{row.name}</td>
                <td className="px-6 py-4 text-slate-600">{row.department}</td>
                <td className="px-6 py-4 text-slate-900 font-semibold">{row.salary.toLocaleString()} MMK</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${
                    row.isWhitelisted 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {row.isWhitelisted ? (
                      <>
                        <ShieldCheck size={12} className="text-emerald-500" />
                        Whitelisted
                      </>
                    ) : (
                      <>
                        <ShieldAlert size={12} className="text-slate-400" />
                        Disabled
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    row.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-800' 
                      : row.status === 'conflict' 
                      ? 'bg-amber-50 text-amber-800' 
                      : 'bg-rose-50 text-rose-800'
                  }`}>
                    {row.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => toggleWhitelist(row.id)}
                    className={`text-[10px] font-bold px-3 py-1 rounded-lg border transition ${
                      row.isWhitelisted 
                        ? 'border-rose-100 text-rose-700 bg-rose-50/30 hover:bg-rose-50' 
                        : 'border-emerald-100 text-emerald-700 bg-emerald-50/30 hover:bg-emerald-50'
                    }`}
                  >
                    {row.isWhitelisted ? 'Revoke EWA' : 'Grant EWA'}
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
