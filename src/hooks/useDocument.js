import { useEffect, useState } from "react";

/** One document by id. Drafts are blocked by the rules, so they come back as "not found". */
export function useDocument(service, id) {
  const [state, setState] = useState({ data: null, loading: true });
  useEffect(() => {
    let live = true;
    setState({ data: null, loading: true });
    service.get(id).then((data) => live && setState({ data, loading: false })).catch(() => live && setState({ data: null, loading: false }));
    return () => { live = false; };
  }, [service, id]);
  return state;
}
