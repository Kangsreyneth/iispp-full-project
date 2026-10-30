import { Link } from "react-router-dom";
import { Search, FileText, Send, CalendarClock } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { useLang } from "@/hooks/useLang";
import { useSettings } from "@/hooks/useSettings";

const steps = [
  [Search, "Choose a program", "Browse undergraduate, graduate and short-course programs."],
  [FileText, "Prepare documents", "Check the requirements listed on the program page."],
  [Send, "Apply or contact us", "Send us a message and the team will guide you."],
];

export default function Admissions() {
  const { t } = useLang();
  const { settings: s } = useSettings();
  return (
    <>
      <PageHeader title={t("admissions")} subtitle="Everything prospective students need to know." crumbs={[[t("admissions")]]} />
      <div className="container-page py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(([Icon, title, text], i) => (
            <div key={title} className="relative rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <span className="absolute right-5 top-4 font-display text-5xl font-bold text-brand-100">{i + 1}</span>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-700 text-white"><Icon className="h-6 w-6" /></span>
              <h2 className="mt-4 font-display text-xl font-bold text-brand-800">{title}</h2>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
        {s.admissionsDeadline && (
          <div className="mt-8 flex items-center gap-3 rounded-xl border-l-4 border-gold-500 bg-brand-50 p-5"><CalendarClock className="h-6 w-6 text-brand-700" /><p><b>Application deadline:</b> {s.admissionsDeadline}</p></div>
        )}
        {s.admissionsText && <div className="prose-body mt-10 max-w-3xl text-lg">{s.admissionsText}</div>}
        <div className="mt-10 flex flex-wrap gap-3">
          <Button as={Link} to="/academics" size="lg">Browse programs</Button>
          <Button as={Link} to="/contact" variant="outline" size="lg">Contact admissions</Button>
        </div>
      </div>
    </>
  );
}
