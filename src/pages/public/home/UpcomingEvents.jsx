import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { useLang } from "@/hooks/useLang";
import { dayOf, monthOf, today, byDateAsc, formatDate } from "@/utils/format";

export default function UpcomingEvents({ events = [], loading = false, error = null }) {
  const { t } = useLang();
  const upcoming = events.filter((e) => e.date >= today()).sort(byDateAsc).slice(0, 4);
  if (!upcoming.length && !loading && !error) return null;
  return (
    <section className="bg-brand-800 py-16 text-white sm:py-20">
      <div className="container-page">
        <SectionTitle light eyebrow={t("events")} title={t("upcomingEvents")} action={<Link to="/events" className="text-sm font-semibold text-gold-300 hover:underline">{t("viewAll")} →</Link>} />
        {loading ? <Spinner className="py-8 text-white/75" /> : error ? <EmptyState title={t("dataUnavailable")} text={t("tryAgainLater")} /> : <div className="grid gap-4 md:grid-cols-2">
          {upcoming.map((e) => (
            <Link key={e.id} to={`/events/${e.id}`} className="group flex gap-5 border-t border-white/25 py-5 transition hover:border-gold-400">
              <div className="h-20 w-20 shrink-0 overflow-hidden bg-white text-center leading-none text-brand-800 sm:w-24">
                {e.image ? <img src={e.image} alt="" loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full place-content-center"><p className="font-display text-3xl font-bold">{dayOf(e.date)}</p><p className="mt-1 text-xs font-bold uppercase">{monthOf(e.date)}</p></div>}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-xl font-bold transition group-hover:text-gold-300">{e.title}</h3>
                <div className="mt-2 space-y-1 text-sm text-brand-100">
                  {e.image && <p className="text-xs">{formatDate(e.date)}</p>}
                  {e.time && <p className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {e.time}</p>}
                  {e.location && <p className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {e.location}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>}
      </div>
    </section>
  );
}
