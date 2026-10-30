import PageHeader from "@/components/ui/PageHeader";
import { CENTERS, centerAnchor } from "@/config/centers";

export default function Centers() {
  return (
    <>
      <PageHeader
        title="Centers"
        subtitle="Explore the centers and academic support units listed by IISPP."
        crumbs={[["Centers"]]}
      />
      <section className="container-page py-12" aria-labelledby="centers-heading">
        <h2 id="centers-heading" className="sr-only">IISPP centers</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CENTERS.map((name) => (
            <li
              id={centerAnchor(name)}
              key={name}
              className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-display text-lg font-semibold text-brand-900">{name}</h3>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
