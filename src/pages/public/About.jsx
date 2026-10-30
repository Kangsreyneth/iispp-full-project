import PageHeader from "@/components/ui/PageHeader";
import CoverImage from "@/components/ui/CoverImage";
import { useSettings } from "@/hooks/useSettings";
import { useLang } from "@/hooks/useLang";
import { BRAND } from "@/utils/constants";

export default function About() {
  const { t } = useLang();
  const { settings: s } = useSettings();
  const stats = [1, 2, 3].map((n) => [s[`stat${n}Value`], s[`stat${n}Label`]]).filter(([v, l]) => v && l);
  return (
    <>
      <PageHeader title={s.aboutTitle} subtitle={BRAND.name} crumbs={[[t("about")]]} />
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="prose-body text-lg">{s.aboutText}</p>
          {(s.mission || s.vision) && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {s.mission && <div className="rounded-xl border-t-4 border-brand-600 bg-brand-50 p-6"><h2 className="font-display text-2xl font-bold text-brand-800">Mission</h2><p className="prose-body mt-2 text-sm">{s.mission}</p></div>}
              {s.vision && <div className="rounded-xl border-t-4 border-gold-500 bg-slate-50 p-6"><h2 className="font-display text-2xl font-bold text-brand-800">Vision</h2><p className="prose-body mt-2 text-sm">{s.vision}</p></div>}
            </div>
          )}
        </div>
        <aside>
          <div className="group overflow-hidden rounded-2xl shadow-xl"><CoverImage src={s.aboutImage} alt="About" ratio="aspect-[4/5]" /></div>
          {stats.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {stats.map(([v, l]) => <div key={l} className="rounded-xl bg-brand-700 p-4 text-white"><p className="font-display text-3xl font-bold">{v}</p><p className="text-xs text-brand-100">{l}</p></div>)}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
