import { Link, useParams } from "react-router-dom";
import { Clock, Languages, Wallet, Building2, GraduationCap, Mail } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import CoverImage from "@/components/ui/CoverImage";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import NotFoundBlock from "@/components/ui/NotFoundBlock";
import ShareBar from "@/components/ui/ShareBar";
import { ProgramCard } from "@/components/cards/Cards";
import { useDocument } from "@/hooks/useDocument";
import { useCollection } from "@/hooks/useCollection";
import { useSettings } from "@/hooks/useSettings";
import programService from "@/services/programService";

export default function ProgramDetail() {
  const { id } = useParams();
  const { settings: s } = useSettings();
  const { data: p, loading } = useDocument(programService, id);
  const { data: all } = useCollection(programService);
  if (loading) return <Spinner className="min-h-[50vh]" />;
  if (!p) return <NotFoundBlock what="program" to="/academics" label="All programs" />;

  const facts = [[GraduationCap, "Level", p.level], [Clock, "Duration", p.duration], [Languages, "Language", p.language], [Wallet, "Tuition", p.tuition], [Building2, "Faculty", p.faculty]].filter((f) => f[2]);
  const related = all.filter((x) => x.id !== p.id && x.level === p.level).slice(0, 3);

  return (
    <>
      <PageHeader title={p.name} crumbs={[["Academics", "/academics"], [p.name]]} />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.7fr_1fr]">
        <article>
          <div className="group overflow-hidden rounded-2xl shadow-lg"><CoverImage src={p.image} alt={p.name} ratio="aspect-[16/8]" /></div>
          {facts.length > 0 && (
            <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {facts.map(([Icon, label, value]) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border bg-white p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700"><Icon className="h-5 w-5" /></span>
                  <div><dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt><dd className="font-semibold text-brand-900">{value}</dd></div>
                </div>
              ))}
            </dl>
          )}
          <h2 className="mb-3 mt-10 font-display text-2xl font-bold text-brand-800">About this program</h2>
          <p className="prose-body">{p.description}</p>
          {p.requirements && (<><h2 className="mb-3 mt-8 font-display text-2xl font-bold text-brand-800">Requirements</h2><p className="prose-body">{p.requirements}</p></>)}
          <div className="mt-8 border-t pt-5"><ShareBar title={p.name} /></div>
        </article>
        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-gradient-to-br from-brand-800 to-brand-600 p-6 text-white shadow-lg">
            <h3 className="font-display text-2xl font-bold">Interested?</h3>
            <p className="mt-2 text-sm text-brand-100">See how to apply or contact the admissions office.</p>
            <div className="mt-4 grid gap-2">
              <Button as={Link} to="/admissions" variant="light">How to apply</Button>
              <Button as="a" href={`mailto:${s.email}?subject=${encodeURIComponent(p.name)}`} variant="glass" icon={Mail}>Email us</Button>
            </div>
          </div>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="container-page pb-6"><h2 className="mb-5 font-display text-2xl font-bold text-brand-800">Related programs</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((r) => <ProgramCard key={r.id} item={r} />)}</div></section>
      )}
    </>
  );
}
