import { useSettings } from "@/hooks/useSettings";

export default function StatsBand() {
  const { settings: s } = useSettings();
  const stats = [1, 2, 3].map((n) => [s[`stat${n}Value`], s[`stat${n}Label`]]).filter(([v, l]) => v && l);
  if (!stats.length) return null;
  return (
    <section className="bg-brand-700 text-white">
      <div className="container-page grid divide-y divide-white/20 sm:grid-flow-col sm:auto-cols-fr sm:divide-x sm:divide-y-0">
        {stats.map(([value, label]) => (
          <div key={label} className="px-6 py-8 text-center sm:text-left">
            <p className="font-display text-5xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-brand-100">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
