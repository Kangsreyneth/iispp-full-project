import { Link } from "react-router-dom";
import { ArrowRight, Landmark } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/hooks/useLang";
import { CENTERS, centerAnchor } from "@/config/centers";

export default function CentersSection() {
  const { t } = useLang();
  const items = CENTERS.slice(0, 4);
  return (
    <section className="border-y border-slate-200 bg-white py-16 sm:py-20" aria-labelledby="home-centers-title">
      <div className="container-page">
        <SectionTitle
          eyebrow={t("academics")}
          title={t("centersAndSupport")}
          action={<Link to="/centers" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">{t("viewCenters")} <ArrowRight className="h-4 w-4" /></Link>}
        />
        <h2 id="home-centers-title" className="sr-only">{t("centersAndSupport")}</h2>
        <p className="mb-7 max-w-2xl text-sm leading-7 text-slate-600">{t("centersIntro")}</p>
        <ul className="grid border-y border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((name) => (
            <li key={name} className="border-b border-slate-200 last:border-b-0 sm:border-r sm:px-6 sm:py-6 lg:border-b-0 lg:first:pl-0 lg:last:border-r-0">
              <Link to={`/centers#${centerAnchor(name)}`} className="group flex min-h-24 items-start gap-4 py-5 sm:py-2">
                <Landmark className="mt-1 h-5 w-5 shrink-0 text-gold-500" aria-hidden="true" />
                <span>
                  <span className="block font-semibold leading-6 text-slate-900 group-hover:text-brand-700">{name}</span>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-600">{t("exploreCenter")} <ArrowRight className="h-3 w-3" /></span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
