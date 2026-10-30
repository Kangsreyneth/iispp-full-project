import { useParams } from "react-router-dom";
import { Mail, Phone, User } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import CoverImage from "@/components/ui/CoverImage";
import Spinner from "@/components/ui/Spinner";
import NotFoundBlock from "@/components/ui/NotFoundBlock";
import { ProgramCard } from "@/components/cards/Cards";
import { useDocument } from "@/hooks/useDocument";
import { useCollection } from "@/hooks/useCollection";
import departmentService from "@/services/departmentService";
import programService from "@/services/programService";

export default function FacultyDetail() {
  const { id } = useParams();
  const { data: d, loading } = useDocument(departmentService, id);
  const { data: programs } = useCollection(programService);
  if (loading) return <Spinner className="min-h-[50vh]" />;
  if (!d) return <NotFoundBlock what="faculty" to="/faculty" label="All faculties" />;

  const staff = String(d.staff || "").split("\n").map((l) => l.trim()).filter(Boolean);
  const mine = programs.filter((p) => p.faculty && p.faculty.toLowerCase() === d.name.toLowerCase());
  return (
    <>
      <PageHeader title={d.name} crumbs={[["Faculty", "/faculty"], [d.name]]} />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.7fr_1fr]">
        <article>
          <div className="group overflow-hidden rounded-2xl shadow-lg"><CoverImage src={d.image} alt={d.name} ratio="aspect-[16/8]" /></div>
          <h2 className="mb-3 mt-8 font-display text-2xl font-bold text-brand-800">About</h2>
          <p className="prose-body">{d.description}</p>
          {staff.length > 0 && (
            <>
              <h2 className="mb-3 mt-8 font-display text-2xl font-bold text-brand-800">Faculty members</h2>
              <ul className="grid gap-2 sm:grid-cols-2">{staff.map((s) => <li key={s} className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3 text-sm"><User className="h-4 w-4 text-brand-600" /> {s}</li>)}</ul>
            </>
          )}
          {mine.length > 0 && (
            <>
              <h2 className="mb-4 mt-10 font-display text-2xl font-bold text-brand-800">Programs</h2>
              <div className="grid gap-6 sm:grid-cols-2">{mine.map((p) => <ProgramCard key={p.id} item={p} />)}</div>
            </>
          )}
        </article>
        <aside className="h-fit space-y-3 rounded-2xl border bg-white p-6 shadow-sm lg:sticky lg:top-28">
          <h3 className="font-display text-xl font-bold text-brand-800">Contact</h3>
          {d.head && <p className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-brand-600" /> <span><b>Head:</b> {d.head}</span></p>}
          {d.email && <a href={`mailto:${d.email}`} className="flex items-center gap-2 text-sm hover:text-brand-700"><Mail className="h-4 w-4 text-brand-600" /> {d.email}</a>}
          {d.phone && <a href={`tel:${d.phone}`} className="flex items-center gap-2 text-sm hover:text-brand-700"><Phone className="h-4 w-4 text-brand-600" /> {d.phone}</a>}
        </aside>
      </div>
    </>
  );
}
