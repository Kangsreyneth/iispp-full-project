import Hero from "./home/Hero";
import StatsBand from "./home/StatsBand";
import AboutSection from "./home/AboutSection";
import ProgramsTabs from "./home/ProgramsTabs";
import LatestNews from "./home/LatestNews";
import UpcomingEvents from "./home/UpcomingEvents";
import VisitUs from "./home/VisitUs";
import { useCollection } from "@/hooks/useCollection";
import newsService from "@/services/newsService";
import eventService from "@/services/eventService";
import programService from "@/services/programService";
import { byDateDesc, byOrder } from "@/utils/format";

export default function Home() {
  const { data: news } = useCollection(newsService, { sort: byDateDesc });
  const { data: events } = useCollection(eventService);
  const { data: programs } = useCollection(programService, { sort: byOrder });
  return (
    <>
      <Hero />
      <StatsBand />
      <AboutSection />
      <ProgramsTabs programs={programs} />
      <LatestNews news={news} />
      <UpcomingEvents events={events} />
      <VisitUs />
    </>
  );
}
