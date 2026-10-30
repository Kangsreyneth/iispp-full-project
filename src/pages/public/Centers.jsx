import PageHeader from "@/components/ui/PageHeader";
import { CENTERS, centerAnchor } from "@/config/centers";
import { useLang } from "@/hooks/useLang";

export default function Centers() {
  const { t } = useLang();
  return (
    <>
      <PageHeader
        title={t("centersAndSupport")}
        subtitle={t("centersIntro")}
        crumbs={[[t("centersAndSupport")]]}
      />
      <section className="container-page py-12" aria-labelledby="centers-heading">
        <h2 id="centers-heading" className="sr-only">{t("centersAndSupport")}</h2>
        <ul className="grid border-y border-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {CENTERS.map((name) => (
            <li
              id={centerAnchor(name)}
              key={name}
              className="scroll-mt-24 border-b border-slate-200 p-5 sm:border-r sm:px-6 lg:first:pl-0"
            >
              <h3 className="font-display text-lg font-semibold text-brand-900">{name}</h3>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
