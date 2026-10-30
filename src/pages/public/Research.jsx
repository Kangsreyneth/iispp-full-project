import { useCollection } from "@/hooks/useCollection";
import PageHeader from "@/components/ui/PageHeader";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import researchService from "@/services/researchService";
import { formatDate } from "@/utils/format";
import { useLang } from "@/hooks/useLang";

export default function Research() {
  const { t } = useLang();
  const { data, loading, error } = useCollection(researchService);

  return (
    <>
      <PageHeader title={t("research")} subtitle={t("researchIntro")} crumbs={[[t("research")]]} />
      <section className="container-page py-12">
        {loading ? <Spinner /> : error ? <EmptyState title={t("dataUnavailable")} text={t("tryAgainLater")} /> : data.length === 0 ? (
          <EmptyState title={t("noResearchPublished")} text={t("publishedResearchWillAppear")} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {data.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{item.publicationDate ? formatDate(item.publicationDate) : t("research")}</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-brand-900">{item.title}</h2>
                {item.authors?.length > 0 && <p className="mt-2 text-sm text-slate-500">{item.authors.join(", ")}</p>}
                {item.abstract && <p className="prose-body mt-4">{item.abstract}</p>}
                {item.documentUrl && <a href={item.documentUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex font-semibold text-brand-700 hover:underline">{t("readPublication")}</a>}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
