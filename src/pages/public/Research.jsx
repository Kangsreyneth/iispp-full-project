import { useCollection } from "@/hooks/useCollection";
import PageHeader from "@/components/ui/PageHeader";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import researchService from "@/services/researchService";
import { formatDate } from "@/utils/format";

export default function Research() {
  const { data, loading } = useCollection(researchService);

  return (
    <>
      <PageHeader title="Research" subtitle="Research, policy and public engagement at IISPP." crumbs={[["Research"]]} />
      <section className="container-page py-12">
        {loading ? <Spinner /> : data.length === 0 ? (
          <EmptyState title="No research published yet" text="Published research items will appear here." />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {data.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{item.publicationDate ? formatDate(item.publicationDate) : "Research"}</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-brand-900">{item.title}</h2>
                {item.authors?.length > 0 && <p className="mt-2 text-sm text-slate-500">{item.authors.join(", ")}</p>}
                {item.abstract && <p className="prose-body mt-4">{item.abstract}</p>}
                {item.documentUrl && <a href={item.documentUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex font-semibold text-brand-700 hover:underline">Read publication</a>}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
