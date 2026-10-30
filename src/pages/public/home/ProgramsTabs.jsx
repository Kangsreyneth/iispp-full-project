import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { useLang } from "@/hooks/useLang";
import { LEVELS } from "@/utils/constants";

const key = { Undergraduate: "undergraduate", Graduate: "graduate", "Short course": "shortCourse" };

export default function ProgramsTabs({ programs = [], loading = false, error = null }) {
  const { t } = useLang();
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="home-programs-title">
      <div className="container-page">
        <SectionTitle
          eyebrow={t("academics")}
          title={t("programs")}
          action={<Link to="/academics" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">{t("viewAll")} <ArrowRight className="h-4 w-4" /></Link>}
        />
        <h2 id="home-programs-title" className="sr-only">{t("programs")}</h2>
        {loading ? <Spinner /> : error ? <EmptyState title={t("dataUnavailable")} text={t("tryAgainLater")} /> : <div className="border-y border-slate-300">
          {LEVELS.map((level, index) => {
            const list = programs.filter((program) => program.level === level).slice(0, 3);
            return (
              <div key={level} className="grid gap-5 border-b border-slate-200 py-6 last:border-b-0 md:grid-cols-[220px_1fr] md:gap-10 md:py-8">
                <div className="flex items-start gap-4">
                  <span className="mt-1 text-gold-500" aria-hidden="true"><GraduationCap className="h-6 w-6" /></span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">{String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 font-display text-xl font-semibold text-brand-900">{t(key[level])}</h3>
                  </div>
                </div>
                <div>
                  {list.length ? (
                    <ul className="divide-y divide-slate-200">
                      {list.map((program) => (
                        <li key={program.id}>
                          <Link to={`/academics/${program.id}`} className="group flex items-center justify-between gap-4 py-3 text-sm font-medium text-slate-700 hover:text-brand-700">
                            <span>{program.name}</span><ArrowRight className="h-4 w-4 shrink-0 text-gold-500 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="py-3 text-sm text-slate-500">{t("noPrograms")}</p>}
                  <Link to={`/academics?level=${encodeURIComponent(level)}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-800">{t("viewAll")} {t(key[level])} <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </div>
            );
          })}
        </div>}
      </div>
    </section>
  );
}
