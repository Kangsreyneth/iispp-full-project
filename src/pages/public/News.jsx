import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { NewsCard } from "@/components/cards/Cards";
import { useCollection } from "@/hooks/useCollection";
import { useLang } from "@/hooks/useLang";
import newsService from "@/services/newsService";
import { byDateDesc } from "@/utils/format";
import { NEWS_CATEGORIES } from "@/utils/constants";

export default function News() {
  const { t } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const cat = searchParams.get("category") || "";
  const setCat = (category) => setSearchParams((current) => {
    const next = new URLSearchParams(current);
    if (category) next.set("category", category);
    else next.delete("category");
    return next;
  });
  const [q, setQ] = useState("");
  const { data, loading, error } = useCollection(newsService, { sort: byDateDesc });
  const shown = useMemo(
    () => data.filter((n) => (!cat || n.category === cat) && (!q || `${n.title} ${n.excerpt} ${n.content}`.toLowerCase().includes(q.toLowerCase()))),
    [data, cat, q]
  );
  const chip = (a) => `border-b-2 px-3 py-2 text-sm font-medium transition ${a ? "border-brand-600 text-brand-700" : "border-transparent text-slate-600 hover:border-gold-400 hover:text-brand-700"}`;
  return (
    <>
      <PageHeader title={t("news")} subtitle={t("newsIntro")} crumbs={[[t("news")]]} />
      <div className="container-page py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button className={chip(!cat)} onClick={() => setCat("")}>{t("all")}</button>
            {NEWS_CATEGORIES.map((c) => <button key={c} className={chip(cat === c)} onClick={() => setCat(c)}>{t(`newsCategory${c}`)}</button>)}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchNews")} aria-label={t("searchNews")} className="w-full rounded-full border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
        </div>
        {loading ? <Spinner /> : error ? <EmptyState title={t("dataUnavailable")} text={t("tryAgainLater")} /> : shown.length === 0 ? <EmptyState title={t("noNewsFound")} text={t("newStoriesSoon")} /> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map((n) => <NewsCard key={n.id} item={n} />)}</div>
        )}
      </div>
    </>
  );
}
