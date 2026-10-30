import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import CoverImage from "@/components/ui/CoverImage";
import SectionTitle from "@/components/ui/SectionTitle";
import EmptyState from "@/components/ui/EmptyState";
import { useLang } from "@/hooks/useLang";
import { formatDate, truncate } from "@/utils/format";

export default function LatestNews({ news = [], loading = false, error = null }) {
  const { t } = useLang();
  const lead = news.find((n) => n.featured) || news[0];
  const rest = news.filter((n) => n.id !== lead?.id).slice(0, 3);
  const categoryLabel = (category) => {
    if (!category) return "";
    const key = `newsCategory${category}`;
    const translated = t(key);
    return translated === key ? category : translated;
  };
  return (
    <section className="container-page py-20">
      <SectionTitle eyebrow={t("news")} title={t("latestNews")} action={<Link to="/news" className="text-sm font-semibold text-brand-700 hover:underline">{t("viewAll")} →</Link>} />
      {loading ? <div className="border-y border-slate-200 py-4"><p className="text-sm text-slate-500">{t("loading")}</p></div> : error ? (
        <EmptyState title={t("dataUnavailable")} text={t("tryAgainLater")} />
      ) : !lead ? (
        <EmptyState title={t("noNews")} />
      ) : (
        <div className="grid gap-6 border-t border-slate-300 pt-6 lg:grid-cols-[1.35fr_1fr]">
          <Link to={`/news/${lead.id}`} className="group block overflow-hidden">
            <CoverImage src={lead.image} alt={lead.title} ratio="aspect-[16/11]" className="min-h-[18rem]">
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                  <span className="inline-block bg-gold-300 px-2.5 py-1 text-brand-950">{lead.featured ? t("featured") : categoryLabel(lead.category)}</span>
                  {lead.date && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(lead.date)}</span>}
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold leading-snug sm:text-3xl">{lead.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/85">{truncate(lead.excerpt || lead.content, 130)}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold-300">{t("readMore")} <ArrowRight className="h-4 w-4" /></span>
              </div>
            </CoverImage>
          </Link>
          <div className="space-y-4">
            {rest.map((n) => (
              <Link key={n.id} to={`/news/${n.id}`} className="group flex gap-4 border-b border-slate-200 py-3 transition hover:border-brand-400">
                <div className="w-28 shrink-0 overflow-hidden rounded-lg sm:w-36"><CoverImage src={n.image} alt="" ratio="aspect-[4/3]" shade={false} /></div>
                <div className="min-w-0 py-1">
                  <p className="flex flex-wrap items-center gap-2 text-xs text-slate-500"><Calendar className="h-3 w-3" /> {formatDate(n.date)}{n.category && <span className="text-brand-600">· {categoryLabel(n.category)}</span>}</p>
                  <h3 className="mt-1 line-clamp-2 font-display text-lg font-bold leading-snug text-brand-900 transition group-hover:text-brand-600">{n.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{truncate(n.excerpt || n.content, 90)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
