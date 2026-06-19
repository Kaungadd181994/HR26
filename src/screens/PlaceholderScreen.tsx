export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center">
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-500 mt-2">This module is part of the prototype and is currently being developed.</p>
    </div>
  );
}
