import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FacultyCard } from "@/components/cards/Cards";
import EmptyState from "@/components/ui/EmptyState";
import SectionTitle from "@/components/ui/SectionTitle";
import Spinner from "@/components/ui/Spinner";
import { useCollection } from "@/hooks/useCollection";
import { useLang } from "@/hooks/useLang";
import departmentService from "@/services/departmentService";
import { byOrder } from "@/utils/format";

export default function DepartmentsSection() {
  const { t } = useLang();
  const { data, loading, error } = useCollection(departmentService, { sort: byOrder });
  const departments = data.slice(0, 4);

  return (
    <section className="container-page py-16 sm:py-20" aria-labelledby="home-departments-title">
      <SectionTitle
        eyebrow={t("academics")}
        title={t("departments")}
        action={<Link to="/faculty" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">{t("viewDepartments")} <ArrowRight className="h-4 w-4" /></Link>}
      />
      <h2 id="home-departments-title" className="sr-only">{t("departments")}</h2>
      {loading ? <Spinner /> : error ? (
        <EmptyState title={t("dataUnavailable")} text={t("tryAgainLater")} />
      ) : departments.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((department) => <FacultyCard key={department.id} item={department} />)}
        </div>
      ) : <EmptyState title={t("noDepartments")} />}
    </section>
  );
}
