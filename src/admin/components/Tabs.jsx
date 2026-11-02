export default function Tabs({ items, value, onChange, label = "Dashboard sections" }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1" role="tablist" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          onClick={() => onChange(item.value)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${value === item.value ? "bg-white text-brand-900 shadow-sm" : "text-slate-500 hover:text-brand-900"}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
