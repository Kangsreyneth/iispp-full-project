import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import CoverImage from "@/components/ui/CoverImage";
import SectionTitle from "@/components/ui/SectionTitle";
import EmptyState from "@/components/ui/EmptyState";
import { useLang } from "@/hooks/useLang";
import { formatDate, truncate } from "@/utils/format";

export default function LatestNews({ news }) {
  const { t } = useLang();
  const lead = news.find((n) => n.featured) || news[0];
  const rest = news.filter((n) => n.id !== lead?.id).slice(0, 3);
  return (
    <section className="container-page py-20">
      <SectionTitle eyebrow={t("news")} title={t("latestNews")} action={<Link to="/news" className="text-sm font-semibold text-brand-700 hover:underline">{t("viewAll")} →</Link>} />
      {!lead ? (
        <EmptyState title="No news yet" text="Stories published from the admin dashboard will appear here." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Link to={`/news/${lead.id}`} className="group block overflow-hidden rounded-2xl shadow-lg">
            <CoverImage src={lead.image} alt={lead.title} ratio="aspect-[16/11]" className="min-h-[18rem]">
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="rounded bg-gold-400 px-2.5 py-1 text-xs font-bold text-brand-900">{lead.featured ? t("featured") : lead.category}</span>
                <h3 className="mt-3 font-display text-2xl font-bold leading-snug sm:text-3xl">{lead.title}</h3>
                <p className="mt-2 hidden text-sm text-white/85 sm:block">{truncate(lead.excerpt || lead.content, 130)}</p>
              </div>
            </CoverImage>
          </Link>
          <div className="space-y-4">
            {rest.map((n) => (
              <Link key={n.id} to={`/news/${n.id}`} className="group flex gap-4 rounded-xl border bg-white p-3 transition hover:border-brand-300 hover:shadow-lg">
                <div className="w-28 shrink-0 overflow-hidden rounded-lg sm:w-36"><CoverImage src={n.image} alt="" ratio="aspect-[4/3]" shade={false} /></div>
                <div className="min-w-0 py-1">
                  <p className="flex items-center gap-1 text-xs text-slate-500"><Calendar className="h-3 w-3" /> {formatDate(n.date)}</p>
                  <h3 className="mt-1 line-clamp-3 font-display text-lg font-bold leading-snug text-brand-900 transition group-hover:text-brand-600">{n.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
