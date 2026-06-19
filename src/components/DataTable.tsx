interface Column {
  key: string;
  label: string;
}

export function DataTable({ columns, data }: { columns: Column[], data: any[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-sm">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-3">{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
