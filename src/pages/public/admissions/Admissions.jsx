import { Link } from "react-router-dom";
import { Search, FileText, Send, CalendarClock } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { useLang } from "@/hooks/useLang";
import { useSettings } from "@/hooks/useSettings";

const steps = [
  [Search, "chooseProgram", "browsePrograms"],
  [FileText, "prepareDocuments", "checkRequirements"],
  [Send, "applyOrContact", "admissionsGuide"],
];

export default function Admissions() {
  const { t } = useLang();
  const { settings: s } = useSettings();
  return (
    <>
      <PageHeader title={t("admissions")} subtitle={t("admissionsIntro")} crumbs={[[t("admissions")]]} />
      <div className="container-page py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(([Icon, title, text], i) => (
            <div key={title} className="border-t-2 border-brand-600 bg-white py-6">
              <span className="flex items-center gap-3 text-gold-500"><Icon className="h-6 w-6" /><span className="font-display text-3xl font-semibold text-slate-300">0{i + 1}</span></span>
              <h2 className="mt-4 font-display text-xl font-semibold text-brand-800">{t(title)}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{t(text)}</p>
            </div>
          ))}
        </div>
        {s.admissionsDeadline && (
          <div className="mt-8 flex items-center gap-3 border-l-4 border-gold-500 bg-white p-5"><CalendarClock className="h-6 w-6 text-brand-700" /><p><b>{t("applicationDeadline")}</b> {s.admissionsDeadline}</p></div>
        )}
        {s.admissionsText && <div className="prose-body mt-10 max-w-3xl text-lg">{s.admissionsText}</div>}
        <div className="mt-10 flex flex-wrap gap-3">
          <Button as={Link} to="/academics" size="lg">{t("browseProgramsAction")}</Button>
          <Button as={Link} to="/contact" variant="outline" size="lg">{t("contactAdmissions")}</Button>
        </div>
      </div>
    </>
  );
}
