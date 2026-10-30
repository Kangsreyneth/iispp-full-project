import { useMemo, useState } from "react";
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
  const [cat, setCat] = useState("");
  const [q, setQ] = useState("");
  const { data, loading } = useCollection(newsService, { sort: byDateDesc });
  const shown = useMemo(
    () => data.filter((n) => (!cat || n.category === cat) && (!q || `${n.title} ${n.excerpt} ${n.content}`.toLowerCase().includes(q.toLowerCase()))),
    [data, cat, q]
  );
  const chip = (a) => `rounded-full border px-4 py-1.5 text-sm font-medium transition ${a ? "border-brand-700 bg-brand-700 text-white" : "border-slate-300 hover:border-brand-600 hover:text-brand-700"}`;
  return (
    <>
      <PageHeader title={t("news")} subtitle="Stories, announcements and updates from IISPP." crumbs={[[t("news")]]} />
      <div className="container-page py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button className={chip(!cat)} onClick={() => setCat("")}>All</button>
            {NEWS_CATEGORIES.map((c) => <button key={c} className={chip(cat === c)} onClick={() => setCat(c)}>{c}</button>)}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search news…" aria-label="Search news" className="w-full rounded-full border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
        </div>
        {loading ? <Spinner /> : shown.length === 0 ? <EmptyState title="No news found" text="New stories will appear here once they are published." /> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map((n) => <NewsCard key={n.id} item={n} />)}</div>
        )}
      </div>
    </>
  );
}
