import BannerSlider from "./home/BannerSlider";
import AboutSection from "./home/AboutSection";
import DepartmentsSection from "./home/DepartmentsSection";
import CentersSection from "./home/CentersSection";
import ProgramsTabs from "./home/ProgramsTabs";
import ResearchHighlights from "./home/ResearchHighlights";
import LatestNews from "./home/LatestNews";
import UpcomingEvents from "./home/UpcomingEvents";
import { useCollection } from "@/hooks/useCollection";
import newsService from "@/services/newsService";
import eventService from "@/services/eventService";
import programService from "@/services/programService";
import { byDateDesc, byOrder } from "@/utils/format";

export default function Home() {
  const newsState = useCollection(newsService, { sort: byDateDesc });
  const eventsState = useCollection(eventService);
  const programsState = useCollection(programService, { sort: byOrder });
  return (
    <>
      <BannerSlider />
      <AboutSection />
      <DepartmentsSection />
      <CentersSection />
      <ProgramsTabs programs={programsState.data} loading={programsState.loading} error={programsState.error} />
      <ResearchHighlights />
      <LatestNews news={newsState.data} loading={newsState.loading} error={newsState.error} />
      <UpcomingEvents events={eventsState.data} loading={eventsState.loading} error={eventsState.error} />
    </>
  );
}
