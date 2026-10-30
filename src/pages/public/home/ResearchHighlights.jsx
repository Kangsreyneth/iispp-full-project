import { ArrowUpRight, BookOpenText } from "lucide-react";
import { Link } from "react-router-dom";
import SectionTitle from "@/components/ui/SectionTitle";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { useCollection } from "@/hooks/useCollection";
import { useLang } from "@/hooks/useLang";
import researchService from "@/services/researchService";
import { formatDate } from "@/utils/format";

export default function ResearchHighlights() {
  const { t } = useLang();
  const { data, loading, error } = useCollection(researchService);
  const items = data.slice(0, 3);
  return (
    <section className="bg-[#f8f8f6] py-16 sm:py-20" aria-labelledby="research-highlights-title">
      <div className="container-page">
        <SectionTitle
          eyebrow={t("research")}
          title={t("latestResearch")}
          action={<Link to="/research" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">{t("viewAll")} <ArrowUpRight className="h-4 w-4" /></Link>}
        />
        <h2 id="research-highlights-title" className="sr-only">{t("latestResearch")}</h2>
        {loading ? <Spinner /> : error ? <EmptyState title={t("dataUnavailable")} text={t("tryAgainLater")} /> : items.length ? (
          <div className="grid border-t border-slate-300 md:grid-cols-3 md:divide-x md:divide-slate-300">
            {items.map((item) => (
              <article key={item.id} className="py-6 md:px-6 md:first:pl-0 md:last:pr-0">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-600"><BookOpenText className="h-4 w-4" />{item.publicationDate ? formatDate(item.publicationDate) : t("research")}</p>
                <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-slate-900">{item.title}</h3>
                {item.abstract && <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">{item.abstract}</p>}
                {item.documentUrl && <a href={item.documentUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">{t("readPublication")} <ArrowUpRight className="h-4 w-4" /></a>}
              </article>
            ))}
          </div>
        ) : <EmptyState title={t("noResearch")} />}
      </div>
    </section>
  );
}
