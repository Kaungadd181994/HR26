import { usePortalState } from '@/context/PortalStateContext';
import { Heart, Plus, Sparkles, CheckCircle2, DollarSign, Gift, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function Charity() {
  const { 
    charities, 
    donations, 
    companyMatchPercent, 
    addCharityCampaign, 
    donateToCampaign, 
    setCompanyMatchPercent,
    employees 
  } = usePortalState();

  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignDesc, setCampaignDesc] = useState('');
  const [campaignCategory, setCampaignCategory] = useState('Community Support');
  const [campaignGoal, setCampaignGoal] = useState(1000000);
  const [campaignIcon, setCampaignIcon] = useState('fa-hand-holding-heart');
  const [showAddForm, setShowAddForm] = useState(false);

  // Manual donation simulation inputs
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [selectedEmployeeName, setSelectedEmployeeName] = useState(employees[0]?.name || 'Nandar Win');
  const [donationAmount, setDonationAmount] = useState(25000);
  const [showSimulateForm, setShowSimulateForm] = useState(false);

  const [success, setSuccess] = useState('');

  // Calculations
  const totalBaseDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const matchMultiplier = companyMatchPercent / 100;
  const totalCompanyMatchAllocated = donations.filter(d => d.isMatched).reduce((sum, d) => sum + d.amount * matchMultiplier, 0);
  const aggregateImpactPool = totalBaseDonated + totalCompanyMatchAllocated;

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle.trim()) return;
    addCharityCampaign(campaignTitle, campaignCategory, campaignDesc, campaignIcon, campaignGoal);
    setCampaignTitle('');
    setCampaignDesc('');
    setCampaignCategory('Community Support');
    setCampaignGoal(1000000);
    setCampaignIcon('fa-hand-holding-heart');
    setShowAddForm(false);
    setSuccess(`CSR Campaign "${campaignTitle}" has been opened successfully!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSimulateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const campId = selectedCampaignId || charities[0]?.id;
    if (!campId) return;
    donateToCampaign(campId, selectedEmployeeName, Number(donationAmount));
    setShowSimulateForm(false);
    setSuccess(`Simulated ${selectedEmployeeName} contributing ${Number(donationAmount).toLocaleString()} MMK with EWA Round-Up matched!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {success}
        </div>
      )}

      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <i className="fa-solid fa-heart-pulse text-rose-500"></i>
            EWA Charity & CSR Impact Hub
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Empower employees to round up wage payouts to trusted Myanmar charities. Track, modify, and double the pool via corporate matching rules.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowSimulateForm(false);
            }}
            className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={14} />
            {showAddForm ? 'Close' : 'Setup New Campaign'}
          </button>
          <button 
            onClick={() => {
              setShowSimulateForm(!showSimulateForm);
              setShowAddForm(false);
              if (charities.length > 0) {
                setSelectedCampaignId(charities[0].id);
              }
            }}
            className="bg-emerald-600 hover:bg-emerald-505 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm"
          >
            <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
            Simulate EWA Round-Up
          </button>
        </div>
      </div>

      {/* Strategic Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Aggregate Impact</span>
              <span className="text-xl font-extrabold text-slate-950 font-mono block mt-1">
                {aggregateImpactPool.toLocaleString()} MMK
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <i className="fa-solid fa-handshake-angle text-sm"></i>
            </div>
          </div>
          <p className="text-[10px] text-zinc-400">Sum of employee round-ups and employer matching grants combined.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Staff Donations</span>
              <span className="text-xl font-extrabold text-slate-950 font-mono block mt-1">
                {totalBaseDonated.toLocaleString()} MMK
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
              <i className="fa-solid fa-gift text-sm"></i>
            </div>
          </div>
          <p className="text-[10px] text-zinc-400">Deducted from active wage disbursement balances at payout time.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Company Matching</span>
              <span className="text-xl font-extrabold text-slate-950 font-mono block mt-1">
                {totalCompanyMatchAllocated.toLocaleString()} MMK
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center font-bold">
              <i className="fa-solid fa-circle-dollar-to-slot text-sm"></i>
            </div>
          </div>
          <p className="text-[10px] text-zinc-400">Corporate contributions governed by the dynamic Match Multiplier.</p>
        </div>

        {/* Corporate Match settings */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Match Multiplier</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-white font-mono">{companyMatchPercent}%</span>
              <span className="text-[10px] text-slate-400 font-semibold">{companyMatchPercent > 0 ? 'Matched Rate' : 'No Match'}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <input 
              type="range" 
              min="0" 
              max="200" 
              step="50" 
              value={companyMatchPercent}
              onChange={e => setCompanyMatchPercent(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1 bg-slate-700 rounded-lg cursor-pointer appearance-none"
            />
            <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
              <span>150%</span>
              <span>200%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forms (Create & Simulate) */}
      {showAddForm && (
        <form onSubmit={handleCreateCampaign} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 animate-fadeIn">
          <div className="border-b border-slate-50 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-folder-plus text-emerald-600 text-xs"></i>
              Launch New Local CSR Campaign
            </h4>
            <p className="text-xs text-slate-500">Define a target campaign which staff can choose for micro-withholding programs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Campaign Title</label>
              <input 
                type="text" 
                placeholder="Ex. Mandalay Healthcare Sanitization" 
                value={campaignTitle} 
                onChange={e => setCampaignTitle(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 bg-slate-50/50"
                required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Category</label>
              <select
                value={campaignCategory}
                onChange={e => setCampaignCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value="Education">Education & Literacy</option>
                <option value="Environment">Environmental Forestry</option>
                <option value="Healthcare">Healthcare & Clinical Support</option>
                <option value="Disaster Relief">Disaster Relief Assistance</option>
                <option value="Community Welfare">Community Welfare</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Fundraising Target (MMK)</label>
              <input 
                type="number" 
                value={campaignGoal} 
                onChange={e => setCampaignGoal(Number(e.target.value))} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 bg-slate-50/50"
                min={500000}
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Campaign Goal Statement</label>
              <input 
                type="text" 
                placeholder="Give exact structural actions of what funds are utilized for..." 
                value={campaignDesc} 
                onChange={e => setCampaignDesc(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 bg-slate-50/50" 
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">FontAwesome Visual Icon</label>
              <select
                value={campaignIcon}
                onChange={e => setCampaignIcon(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value="fa-graduation-cap">Graduation Cap (Education)</option>
                <option value="fa-leaf">Leaf / Reforestation (Nature)</option>
                <option value="fa-house-chimney-medical">Medical Kit Clinic (Health)</option>
                <option value="fa-cloud-showers-water">Water & Flood Wave (Relief)</option>
                <option value="fa-hand-holding-heart">Holding Hearts (Community)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4.5 py-2 rounded-lg transition">
            Initiate CSR Campaign
          </button>
        </form>
      )}

      {showSimulateForm && (
        <form onSubmit={handleSimulateDonation} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 animate-fadeIn">
          <div className="border-b border-slate-200 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-emerald-600 text-xs animate-spin-slow"></i>
              Interactive EWA Round-Up Simulation Engine
            </h4>
            <p className="text-xs text-slate-500">Represent an employee opting in to allocate a slice of their earned wage request to a selected foundation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">OPT-In Employee</label>
              <select
                value={selectedEmployeeName}
                onChange={e => setSelectedEmployeeName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.name}>{emp.name} ({emp.department})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Target Campaign</label>
              <select
                value={selectedCampaignId}
                onChange={e => setSelectedCampaignId(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                {charities.map(c => (
                  <option key={c.id} value={c.id}>{c.title} ({c.category})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Round-Up Donation (MMK)</label>
              <select
                value={donationAmount}
                onChange={e => setDonationAmount(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value={5000}>5,000 MMK</option>
                <option value={10000}>10,000 MMK</option>
                <option value={20000}>20,000 MMK</option>
                <option value={50000}>50,000 MMK</option>
              </select>
            </div>
          </div>

          <button type="submit" className="bg-emerald-600 hover:bg-emerald-505 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition">
            Consolidate simulated round-up EWA transaction
          </button>
        </form>
      )}

      {/* active campaigns list */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
          Current Active CSR Fundraisers
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {charities.map((item) => {
            const raisedPct = Math.min((item.totalRaised / item.goal) * 100, 100);
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:border-slate-200 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-50 border border-slate-100 text-[9px] font-bold uppercase px-2 py-0.5 rounded text-slate-500 tracking-wider">
                      {item.category}
                    </span>
                    <span className="font-mono text-[9px] text-zinc-400 font-semibold">{item.id}</span>
                  </div>
                  
                  <div className="flex gap-2 items-start">
                    <div className="w-9 h-9 min-w-9 bg-slate-950 text-white rounded-lg flex items-center justify-center font-bold">
                      <i className={`fa-solid ${item.icon} text-sm`}></i>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-normal">{item.title}</h4>
                      <p className="text-[10px] text-zinc-500 leading-normal line-clamp-2 mt-1">{item.desc}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-50">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-800">
                    <span>Progress: <strong className="font-mono text-emerald-600">{item.totalRaised.toLocaleString()} MMK</strong></span>
                    <span className="text-slate-400">Goal: <strong className="font-mono font-bold">{item.goal.toLocaleString()}</strong></span>
                  </div>
                  
                  {/* Progress bar container */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${raisedPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donation History List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Employee Round-Up Donation History
          </h4>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Participant Staff</th>
              <th className="px-6 py-4">CSR Partner</th>
              <th className="px-6 py-4">Roundup Value</th>
              <th className="px-6 py-4">Corporate Matching Status</th>
              <th className="px-6 py-4 text-right">Transaction Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs text-slate-600">
            {donations.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-bold text-slate-900">{row.employeeName}</td>
                <td className="px-6 py-4 font-medium text-slate-600">{row.campaignTitle}</td>
                <td className="px-6 py-4 font-extrabold text-slate-900 font-mono">{row.amount.toLocaleString()} MMK</td>
                <td className="px-6 py-4 font-mono">
                  {row.isMatched ? (
                    <span className="bg-emerald-50 border border-emerald-100 text-[9px] font-bold uppercase text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center justify-center max-w-fit gap-1">
                      <i className="fa-solid fa-check text-[8px]"></i>
                      Matched (+{companyMatchPercent}%)
                    </span>
                  ) : (
                    <span className="bg-zinc-100 text-[10px] px-2.5 py-0.5 rounded-full text-stone-500 font-semibold">
                      Standard
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-mono text-stone-400 font-bold">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
