import { Link, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { centerBySlug } from "@/config/centers";
import { useLang } from "@/hooks/useLang";

export default function CenterDetail() {
  const { slug } = useParams();
  const { t } = useLang();
  const center = centerBySlug(slug);

  if (!center) {
    return (
      <div className="container-page py-16">
        <EmptyState title={t("centerNotFound")} action={<Button as={Link} to="/centers">{t("viewCenters")}</Button>} />
      </div>
    );
  }

  return (
    <>
      <PageHeader title={center.name} crumbs={[[t("centersAndSupport"), "/centers"], [center.name]]} />
      <section className="container-page py-12">
        <EmptyState title={t("centerDetailsUnavailable")} text={t("centerDetailsEmptyText")} />
        <Link to="/centers" className="mt-6 inline-flex text-sm font-semibold text-brand-700 hover:underline">← {t("viewCenters")}</Link>
      </section>
    </>
  );
}
