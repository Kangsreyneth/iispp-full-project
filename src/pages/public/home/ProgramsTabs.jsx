import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/hooks/useLang";
import { LEVELS } from "@/utils/constants";

const key = { Undergraduate: "undergraduate", Graduate: "graduate", "Short course": "shortCourse" };

/** Three columns; the one under the mouse turns maroon. Click works on touch screens. */
export default function ProgramsTabs({ programs }) {
  const { t } = useLang();
  const [active, setActive] = useState(LEVELS[0]);
  return (
    <section className="bg-slate-50 py-20">
      <div className="container-page">
        <SectionTitle eyebrow={t("academics")} title={t("programs")} action={<Link to="/academics" className="text-sm font-semibold text-brand-700 hover:underline">{t("viewAll")} →</Link>} />
        <div className="grid overflow-hidden rounded-2xl border bg-white shadow-sm md:grid-cols-3">
          {LEVELS.map((lv) => {
            const list = programs.filter((p) => p.level === lv).slice(0, 5);
            const on = active === lv;
            return (
              <div key={lv} onMouseEnter={() => setActive(lv)} onClick={() => setActive(lv)} className={`p-7 transition-colors duration-300 ${on ? "bg-brand-700 text-white" : ""}`}>
                <h3 className="mb-4 font-display text-2xl font-bold">{t(key[lv])}</h3>
                <div className="space-y-2">
                  {list.map((p) => (
                    <Link key={p.id} to={`/academics/${p.id}`} className={`flex items-center justify-between rounded border px-3 py-2.5 text-sm transition-all hover:pl-5 ${on ? "border-white/40 hover:bg-white/15" : "border-slate-300 hover:border-brand-600 hover:text-brand-700"}`}>
                      <span className="truncate">{p.name}</span><ArrowRight className="h-4 w-4 shrink-0" />
                    </Link>
                  ))}
                  {list.length === 0 && <p className="text-sm opacity-60">Programs will appear here.</p>}
                </div>
                <Link to={`/academics?level=${encodeURIComponent(lv)}`} className="mt-4 inline-block text-sm font-semibold underline-offset-4 hover:underline">{t("viewAll")}</Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
