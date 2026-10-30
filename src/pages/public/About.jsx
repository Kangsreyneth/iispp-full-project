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
          {(s.mission || s.vision || s.goals) && (
            <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
              {[[t("mission"), s.mission], [t("vision"), s.vision], [t("goals"), s.goals]].filter(([, value]) => value).map(([title, value]) => (
                <section key={title} className="py-5"><h2 className="font-display text-xl font-semibold text-brand-800">{title}</h2><p className="prose-body mt-2 text-sm">{value}</p></section>
              ))}
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
