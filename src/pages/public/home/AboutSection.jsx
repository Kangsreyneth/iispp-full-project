import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CoverImage from "@/components/ui/CoverImage";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { useLang } from "@/hooks/useLang";
import { useSettings } from "@/hooks/useSettings";
import { truncate } from "@/utils/format";

export default function AboutSection() {
  const { t } = useLang();
  const { settings } = useSettings();
  const statements = [
    [t("vision"), settings.vision],
    [t("mission"), settings.mission],
    [t("goals"), settings.goals],
  ].filter(([, value]) => value);

  return (
    <section className="container-page grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16" aria-labelledby="about-home-title">
      <div className="relative">
        <CoverImage src={settings.aboutImage} alt={t("iisppCampusAlt")} ratio="aspect-[4/3]" className="w-full" zoom={false} shade={false} />
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{t("aboutIispp")}</p>
      </div>
      <div>
        <SectionTitle eyebrow={t("aboutIispp")} title={settings.aboutTitle || t("aboutIispp")} />
        <div id="about-home-title" className="sr-only">{t("aboutIispp")}</div>
        {settings.background && <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-600">{settings.background}</p>}
        <p className="max-w-2xl text-base leading-8 text-slate-600">{truncate(settings.aboutText, 520)}</p>
        {statements.length > 0 && (
          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {statements.map(([label, text]) => (
              <div key={label} className="grid gap-2 py-4 sm:grid-cols-[130px_1fr] sm:gap-6">
                <h3 className="font-display text-lg font-semibold text-brand-800">{label}</h3>
                <p className="text-sm leading-7 text-slate-600">{truncate(text, 220)}</p>
              </div>
            ))}
          </div>
        )}
        <Button as={Link} to="/about" variant="outline" className="mt-7">{t("learnMore")} <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </section>
  );
}
