import PageHeader from "@/components/ui/PageHeader";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { EventCard } from "@/components/cards/Cards";
import { useCollection } from "@/hooks/useCollection";
import { useLang } from "@/hooks/useLang";
import eventService from "@/services/eventService";
import { byDateAsc, byDateDesc, today } from "@/utils/format";

export default function Events() {
  const { t } = useLang();
  const { data, loading } = useCollection(eventService);
  const upcoming = data.filter((e) => e.date >= today()).sort(byDateAsc);
  const past = data.filter((e) => e.date < today()).sort(byDateDesc);
  return (
    <>
      <PageHeader title={t("events")} subtitle="Talks, workshops, ceremonies and campus activities." crumbs={[[t("events")]]} />
      <div className="container-page space-y-14 py-12">
        {loading ? <Spinner /> : (
          <>
            <section>
              <h2 className="mb-5 font-display text-2xl font-bold text-brand-800">{t("upcomingEvents")}</h2>
              {upcoming.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{upcoming.map((e) => <EventCard key={e.id} item={e} />)}</div>
                : <EmptyState title="No upcoming events" text="Check back soon." />}
            </section>
            {past.length > 0 && (
              <section><h2 className="mb-5 font-display text-2xl font-bold text-brand-800">Past events</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{past.map((e) => <EventCard key={e.id} item={e} />)}</div></section>
            )}
          </>
        )}
      </div>
    </>
  );
}
