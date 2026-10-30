import { useParams } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import CoverImage from "@/components/ui/CoverImage";
import Spinner from "@/components/ui/Spinner";
import NotFoundBlock from "@/components/ui/NotFoundBlock";
import ShareBar from "@/components/ui/ShareBar";
import { useDocument } from "@/hooks/useDocument";
import eventService from "@/services/eventService";
import { formatDate } from "@/utils/format";
import { useLang } from "@/hooks/useLang";

export default function EventDetail() {
  const { id } = useParams();
  const { t } = useLang();
  const { data: e, loading } = useDocument(eventService, id);
  if (loading) return <Spinner className="min-h-[50vh]" />;
  if (!e) return <NotFoundBlock what={t("events")} to="/events" label={t("allEvents")} />;
  const info = [[Calendar, t("date"), formatDate(e.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })], [Clock, t("time"), e.time], [MapPin, t("location"), e.location]].filter((i) => i[2]);
  return (
    <>
      <PageHeader title={e.title} crumbs={[[t("events"), "/events"], [e.title]]} />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.7fr_1fr]">
        <article>
          <div className="group overflow-hidden rounded-2xl shadow-lg"><CoverImage src={e.image} alt={e.title} ratio="aspect-[16/9]" zoom={false} shade={false} /></div>
          <h2 className="mb-3 mt-8 font-display text-2xl font-bold text-brand-800">{t("aboutEvent")}</h2>
          <p className="prose-body text-lg">{e.description}</p>
          <div className="mt-8 border-t pt-5"><ShareBar title={e.title} /></div>
        </article>
        <aside className="h-fit space-y-4 rounded-2xl border bg-white p-6 shadow-sm lg:sticky lg:top-28">
          <h3 className="font-display text-xl font-bold text-brand-800">{t("eventDetails")}</h3>
          {info.map(([Icon, label, value]) => (
            <div key={label} className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700"><Icon className="h-5 w-5" /></span>
              <div><p className="text-xs uppercase tracking-wide text-slate-500">{label}</p><p className="font-medium text-slate-800">{value}</p></div></div>
          ))}
        </aside>
      </div>
    </>
  );
}
