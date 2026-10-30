import { Link, useParams } from "react-router-dom";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import CoverImage from "@/components/ui/CoverImage";
import Spinner from "@/components/ui/Spinner";
import NotFoundBlock from "@/components/ui/NotFoundBlock";
import ShareBar from "@/components/ui/ShareBar";
import { NewsCard } from "@/components/cards/Cards";
import { useDocument } from "@/hooks/useDocument";
import { useCollection } from "@/hooks/useCollection";
import newsService from "@/services/newsService";
import { formatDate, byDateDesc } from "@/utils/format";
import { useLang } from "@/hooks/useLang";

export default function NewsDetail() {
  const { id } = useParams();
  const { t } = useLang();
  const { data: n, loading } = useDocument(newsService, id);
  const { data: all } = useCollection(newsService, { sort: byDateDesc });
  if (loading) return <Spinner className="min-h-[50vh]" />;
  if (!n) return <NotFoundBlock what={t("newsStory")} to="/news" label={t("allNews")} />;
  const related = all.filter((x) => x.id !== n.id).slice(0, 3);
  return (
    <>
      <PageHeader title={n.title} crumbs={[[t("news"), "/news"], [n.title]]} />
      <article className="container-page max-w-4xl py-12">
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-brand-600" /> {formatDate(n.date)}</span>
          {n.category && <span className="flex items-center gap-1.5"><Tag className="h-4 w-4 text-brand-600" /> {n.category}</span>}
        </div>
        {n.image && <div className="mb-8 overflow-hidden rounded-2xl shadow-lg"><CoverImage src={n.image} alt={n.title} ratio="aspect-[16/9]" zoom={false} shade={false} /></div>}
        {n.excerpt && <p className="mb-6 border-l-4 border-gold-500 pl-4 font-display text-xl italic text-brand-800">{n.excerpt}</p>}
        <div className="prose-body text-lg">{n.content}</div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
          <ShareBar title={n.title} />
          <Link to="/news" className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"><ArrowLeft className="h-4 w-4" /> {t("allNews")}</Link>
        </div>
      </article>
      {related.length > 0 && (
        <section className="container-page pb-6"><h2 className="mb-5 font-display text-2xl font-bold text-brand-800">{t("moreNews")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((r) => <NewsCard key={r.id} item={r} />)}</div></section>
      )}
    </>
  );
}
