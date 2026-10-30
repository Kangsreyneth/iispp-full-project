// import { useMemo } from "react";
// import { useCollection } from "./useCollection";
// import newsService from "@/services/newsService";
// import eventService from "@/services/eventService";
// import programService from "@/services/programService";
// import departmentService from "@/services/departmentService";
// import { buildIndex } from "@/utils/search";

// export function useSearchIndex() {
//   const news = useCollection(newsService);
//   const events = useCollection(eventService);
//   const programs = useCollection(programService);
//   const faculties = useCollection(departmentService);
//   const loading = news.loading || events.loading || programs.loading || faculties.loading;
//   const index = useMemo(
//     () => buildIndex({ news: news.data, events: events.data, programs: programs.data, faculties: faculties.data }),
//     [news.data, events.data, programs.data, faculties.data]
//   );
//   return { index, loading };
// }


import { useMemo } from "react";

import { useCollection } from "./useCollection";
import newsService from "@/services/newsService";
import eventService from "@/services/eventService";
import programService from "@/services/programService";
import departmentService from "@/services/departmentService";
import { buildIndex } from "@/utils/search";

const asArray = (value) =>
  Array.isArray(value) ? value : [];

export function useSearchIndex() {
  const news = useCollection(newsService);
  const events = useCollection(eventService);
  const programs = useCollection(programService);
  const faculties = useCollection(departmentService);

  const loading = Boolean(
    news.loading ||
    events.loading ||
    programs.loading ||
    faculties.loading
  );

  const index = useMemo(
    () =>
      buildIndex({
        news: asArray(news.data),
        events: asArray(events.data),
        programs: asArray(programs.data),
        faculties: asArray(faculties.data),
      }),
    [
      news.data,
      events.data,
      programs.data,
      faculties.data,
    ]
  );

  return {
    index,
    loading,
  };
}
