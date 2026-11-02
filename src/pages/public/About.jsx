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
          <section id="overview" className="scroll-mt-24">
            {s.background && <p id="background" className="mb-4 scroll-mt-24 text-sm font-semibold uppercase tracking-wide text-brand-700">{s.background}</p>}
            <p className="prose-body text-lg">{s.aboutText}</p>
          </section>
          {(s.mission || s.vision || s.goals) && (
            <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
              {[[t("vision"), s.vision, "vision"], [t("mission"), s.mission, "mission"], [t("goals"), s.goals, "goals"]].filter(([, value]) => value).map(([title, value, id]) => (
                <section key={id} id={id} className="scroll-mt-24 py-5"><h2 className="font-display text-xl font-semibold text-brand-800">{title}</h2><p className="prose-body mt-2 text-sm">{value}</p></section>
              ))}
            </div>
          )}
        </div>
        <aside>
          <div className="overflow-hidden border border-slate-200 bg-white"><CoverImage src={s.aboutImage} alt="About" ratio="aspect-[4/5]" /></div>
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
