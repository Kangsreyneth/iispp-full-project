import PageHeader from "@/components/ui/PageHeader";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { FacultyCard } from "@/components/cards/Cards";
import { useCollection } from "@/hooks/useCollection";
import { useLang } from "@/hooks/useLang";
import departmentService from "@/services/departmentService";
import { byOrder } from "@/utils/format";

export default function Faculties() {
  const { t } = useLang();
  const { data, loading, error } = useCollection(departmentService, { sort: byOrder });
  return (
    <>
      <PageHeader title={t("departments")} subtitle={t("departmentsIntro")} crumbs={[[t("departments")]]} />
      <div className="container-page py-12">
        {loading ? <Spinner /> : error ? <EmptyState title={t("dataUnavailable")} text={t("tryAgainLater")} /> : data.length === 0 ? <EmptyState title={t("noDepartments")} /> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.map((d) => <FacultyCard key={d.id} item={d} />)}</div>
        )}
      </div>
    </>
  );
}
