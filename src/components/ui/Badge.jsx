const tones = {
  published: "bg-emerald-50 text-emerald-700", active: "bg-emerald-50 text-emerald-700", read: "bg-slate-100 text-slate-600",
  draft: "bg-amber-50 text-amber-700", pending: "bg-amber-50 text-amber-700", new: "bg-brand-50 text-brand-700",
  admin: "bg-brand-100 text-brand-800",
};

export default function Badge({ value, className = "" }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${tones[value] || "bg-slate-100 text-slate-600"} ${className}`}>{value}</span>;
}
