import { usePortalState } from '@/context/PortalStateContext';
import { Play, Square, CheckSquare, SquareSquare, ListTodo, Plus, Trash2, BatteryCharging, BrainCircuit } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function Focus() {
  const { 
    focusSessionActive, 
    focusTitle, 
    focusTimeRemaining, 
    focusSessionCount, 
    focusHistory,
    startFocusSession, 
    stopFocusSession, 
    updateFocusTime 
  } = usePortalState();

  const [inputTitle, setInputTitle] = useState('Reconciling EWA Disbursement Discrepancies');
  const [inputDuration, setInputDuration] = useState(25);
  const [pacerPeriod, setPacerPeriod] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [secondsInCycle, setSecondsInCycle] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [ambientSounds, setAmbientSounds] = useState<'None' | 'Brownian Rain' | 'Forest Stream' | 'Zen Music'>('None');

  // Custom single-session checklist
  const [todos, setTodos] = useState([
    { id: '1', text: 'Cross-examine high-risk disbursement flags', checked: false },
    { id: '2', text: 'Double check salary caps matched keycard returns', checked: true },
    { id: '3', text: 'Validate Oracle export headers matching ISO-20022', checked: false }
  ]);
  const [newTodoText, setNewTodoText] = useState('');

  // Local effect to trigger the global timer countdown tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (focusSessionActive) {
      interval = setInterval(() => {
        updateFocusTime(1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusSessionActive]);

  // Breathing pacer effect (10-second total cycle: Inhale 4s, Hold 2s, Exhale 4s)
  useEffect(() => {
    let breathInterval: NodeJS.Timeout | null = null;
    if (focusSessionActive) {
      breathInterval = setInterval(() => {
        setSecondsInCycle(prev => {
          const next = (prev + 1) % 10;
          if (next < 4) {
            setPacerPeriod('Inhale');
          } else if (next < 6) {
            setPacerPeriod('Hold');
          } else {
            setPacerPeriod('Exhale');
          }
          return next;
        });
      }, 1000);
    } else {
      setSecondsInCycle(0);
      setPacerPeriod('Inhale');
    }
    return () => {
      if (breathInterval) clearInterval(breathInterval);
    };
  }, [focusSessionActive]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;
    startFocusSession(inputTitle, inputDuration);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodos(prev => [...prev, { id: Date.now().toString(), text: newTodoText, checked: false }]);
    setNewTodoText('');
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  // Format Helper: Seconds to MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Breathing ring visual percentage
  const getBreathingScale = () => {
    if (!focusSessionActive) return 'scale-90 opacity-70';
    if (pacerPeriod === 'Inhale') {
      // 0 to 4s: expand from 100% to 135%
      const pct = secondsInCycle / 4;
      return `scale-[${1 + pct * 0.35}] bg-emerald-500/10 border-emerald-400`;
    }
    if (pacerPeriod === 'Hold') {
      // 4 to 6s: remain max expansion
      return 'scale-[1.35] bg-emerald-500/20 border-emerald-400 border-2 shadow-lg shadow-emerald-500/20';
    }
    // 6 to 10s: contract from 135% down to 100%
    const pct = (secondsInCycle - 6) / 4;
    return `scale-[${1.35 - pct * 0.35}] bg-emerald-500/5 border-slate-300`;
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <i className="fa-solid fa-brain-circuit text-emerald-400"></i>
            HR Zen Focus Sanctuary
          </h3>
          <p className="text-xs text-slate-400">
            Keep clear, sharp concentration. Temporarily lock external communications, control high-stress payroll approvals, and maintain flawless EWA journals.
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center min-w-28">
            <span className="text-[10px] block uppercase font-bold text-slate-400 tracking-wider">Completed Tracks</span>
            <span className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1.5 mt-0.5">
              <i className="fa-solid fa-circle-check text-xs"></i>
              {focusSessionCount}
            </span>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center min-w-28">
            <span className="text-[10px] block uppercase font-bold text-slate-400 tracking-wider">Focus Purity</span>
            <span className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1.5 mt-0.5">
              <i className="fa-solid fa-gauge-high text-xs"></i>
              98.4%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Timer Dial & Breathing Circle */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center justify-center text-center shadow-sm space-y-6 min-h-[460px]">
          
          {focusSessionActive ? (
            /* Active Mode Layout */
            <div className="space-y-8 py-4 w-full max-w-sm flex flex-col items-center">
              <div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1 justify-center max-w-fit mx-auto">
                  <i className="fa-solid fa-bullseye animate-pulse"></i>
                  Currently Executing
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-2 line-clamp-1">{focusTitle}</h4>
              </div>

              {/* Breathing Circle and Timer Display */}
              <div className="relative w-56 h-56 flex items-center justify-center">
                {/* Visual Breathing Wave expander */}
                <div 
                  className={`absolute inset-0 rounded-full border border-dashed transition-all duration-1000 ease-in-out ${getBreathingScale()}`}
                />
                
                {/* Foreground Solid Circle */}
                <div className="w-44 h-44 rounded-full bg-slate-950 text-white flex flex-col items-center justify-center shadow-lg relative z-10 border border-slate-800">
                  <span className="text-xs font-mono tracking-wider uppercase text-slate-400">
                    {pacerPeriod === 'Inhale' && 'Breath In 4s'}
                    {pacerPeriod === 'Hold' && 'Hold 2s'}
                    {pacerPeriod === 'Exhale' && 'Release 4s'}
                  </span>
                  <div className="text-3xl font-extrabold font-mono tracking-tighter my-1 text-emerald-400">
                    {formatTime(focusTimeRemaining)}
                  </div>
                  
                  {/* Subtle breathing state icons */}
                  <span className="text-[10px] text-slate-500 font-bold tracking-widest flex items-center gap-1">
                    {pacerPeriod === 'Inhale' && <i className="fa-solid fa-arrows-up-to-line text-emerald-500 animate-bounce"></i>}
                    {pacerPeriod === 'Hold' && <i className="fa-solid fa-pause text-amber-500"></i>}
                    {pacerPeriod === 'Exhale' && <i className="fa-solid fa-arrows-down-to-line text-sky-400 animate-bounce"></i>}
                    {pacerPeriod}
                  </span>
                </div>
              </div>

              {/* Ambient Atmosphere Controls */}
              <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Atmospheric Background Loop</span>
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="text-slate-400 hover:text-slate-900 transition text-[11px]"
                  >
                    <i className={`fa-solid ${isMuted ? 'fa-volume-xmark text-rose-500' : 'fa-volume-high text-emerald-600'}`}></i> {isMuted ? 'Silent' : 'Audible'}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-[10px] font-semibold">
                  {(['None', 'Brownian Rain', 'Forest Stream', 'Zen Music'] as const).map((sound) => (
                    <button
                      key={sound}
                      onClick={() => setAmbientSounds(sound)}
                      className={`py-1.5 rounded-lg border transition ${
                        ambientSounds === sound 
                          ? 'bg-slate-900 border-slate-900 text-white' 
                          : 'bg-white border-slate-100 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {sound === 'None' && 'Normal'}
                      {sound === 'Brownian Rain' && 'Soft Rain'}
                      {sound === 'Forest Stream' && 'Forest'}
                      {sound === 'Zen Music' && 'Zen'}
                    </button>
                  ))}
                </div>
                {ambientSounds !== 'None' && !isMuted && (
                  <div className="text-[9px] text-emerald-700 flex items-center justify-center gap-1 bg-emerald-50 py-1 rounded">
                    <i className="fa-solid fa-music animate-pulse"></i>
                    Synthesizing ambient {ambientSounds} frequencies safely...
                  </div>
                )}
              </div>

              {/* End / Forfeit block */}
              <button
                onClick={stopFocusSession}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow"
              >
                <Square size={13} fill="white" />
                Dismount Focus Sanctuary
              </button>
            </div>
          ) : (
            /* Setup Mode Layout */
            <form onSubmit={handleStart} className="w-full max-w-md space-y-6 py-6 text-left">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                  <i className="fa-solid fa-moon text-emerald-600 text-lg"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-base">Enter Distraction-Free Workspace</h4>
                <p className="text-xs text-slate-500">Configure your target task and work block below to trigger focus pacer.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Concentration Goal</label>
                  <input
                    type="text"
                    value={inputTitle}
                    onChange={e => setInputTitle(e.target.value)}
                    placeholder="Ex. June Batch Deduction Checking..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Target Duration</label>
                    <div className="relative">
                      <select
                        value={inputDuration}
                        onChange={e => setInputDuration(Number(e.target.value))}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs appearance-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      >
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={25}>25 minutes (Standard)</option>
                        <option value={45}>45 minutes (Deep)</option>
                        <option value={60}>60 minutes (Ultra Deep)</option>
                      </select>
                      <span className="absolute right-4 top-3 text-[10px] text-slate-400 pointer-events-none">
                        <i className="fa-solid fa-chevron-down"></i>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Breathing Guide</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs h-[42px] flex items-center justify-between text-slate-600">
                      <span>10s Coherence</span>
                      <i className="fa-solid fa-wind text-teal-500"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 flex gap-3 text-xs leading-normal">
                  <i className="fa-solid fa-shield-halved text-emerald-600 mt-0.5 text-sm"></i>
                  <p className="text-emerald-900">
                    Upon activation, a custom <strong>10-second respiratory wave pacer</strong> will align visually with the timer count to optimize HRV (Heart Rate Variability), lowering auditing stress.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow"
              >
                <Play size={13} fill="white" />
                Initialize Quiet Work Pacer
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Focus Checklist & Recent History */}
        <div className="space-y-6">
          {/* Active Checklist */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <ListTodo size={14} className="text-emerald-600" />
              Sanctuary High-Impact Tasks
            </h4>

            {/* Todo List */}
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {todos.map((todo) => (
                <div 
                  key={todo.id}
                  className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition ${
                    todo.checked 
                      ? 'bg-slate-50/50 border-slate-100 text-slate-400 line-through' 
                      : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800'
                  }`}
                >
                  <label className="flex items-center gap-2.5 flex-1 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={todo.checked} 
                      onChange={() => handleToggleTodo(todo.id)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-medium leading-relaxed">{todo.text}</span>
                  </label>
                  <button 
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-slate-300 hover:text-rose-600 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Todo input */}
            <form onSubmit={handleAddTodo} className="flex gap-2 pt-2 border-t border-slate-50">
              <input 
                type="text" 
                placeholder="Ex. Scan negative salary check..." 
                value={newTodoText}
                onChange={e => setNewTodoText(e.target.value)}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] focus:ring-1 focus:ring-emerald-500"
              />
              <button 
                type="submit"
                className="bg-slate-900 text-white font-bold text-[10px] px-3.5 rounded-lg hover:bg-slate-800"
              >
                Add
              </button>
            </form>
          </div>

          {/* History / Accomplished Cards */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Recent Work blocks Completed
            </h4>
            
            <div className="space-y-3">
              {focusHistory.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No cycles accomplished in this session yet.</p>
              ) : (
                focusHistory.slice(0, 4).map((hist, idx) => (
                  <div key={idx} className="flex gap-2 text-xs leading-normal pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="mt-0.5 text-emerald-600 font-bold">
                      <i className="fa-solid fa-circle-check text-xs"></i>
                    </div>
                    <div>
                      <p className="text-slate-700 font-medium">{hist}</p>
                      <span className="text-[10px] text-slate-400 font-mono">SOC-2 Audited Record</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
