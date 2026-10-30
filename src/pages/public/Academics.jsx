import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { ProgramCard } from "@/components/cards/Cards";
import { useCollection } from "@/hooks/useCollection";
import { useLang } from "@/hooks/useLang";
import programService from "@/services/programService";
import { byOrder } from "@/utils/format";
import { LEVELS } from "@/utils/constants";

export default function Academics() {
  const { t } = useLang();
  const [params, setParams] = useSearchParams();
  const level = params.get("level") || "";
  const [q, setQ] = useState("");
  const { data, loading } = useCollection(programService, { sort: byOrder });
  const shown = useMemo(
    () => data.filter((p) => (!level || p.level === level) && (!q || `${p.name} ${p.description} ${p.faculty}`.toLowerCase().includes(q.toLowerCase()))),
    [data, level, q]
  );
  const chip = (active) => `rounded-full border px-4 py-1.5 text-sm font-medium transition ${active ? "border-brand-700 bg-brand-700 text-white" : "border-slate-300 hover:border-brand-600 hover:text-brand-700"}`;

  return (
    <>
      <PageHeader title={t("academics")} subtitle="Explore undergraduate, graduate and short-course programs." crumbs={[[t("academics")]]} />
      <div className="container-page py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button className={chip(!level)} onClick={() => setParams({})}>All</button>
            {LEVELS.map((l) => <button key={l} className={chip(level === l)} onClick={() => setParams({ level: l })}>{l}</button>)}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter programs…" aria-label="Filter programs" className="w-full rounded-full border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
        </div>
        {loading ? <Spinner /> : shown.length === 0 ? <EmptyState title="No programs found" text="Try another filter." /> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map((p) => <ProgramCard key={p.id} item={p} />)}</div>
        )}
      </div>
    </>
  );
}
