import { useEffect, useState } from "react";
import { useLang } from "@/hooks/useLang";

/** One document by id. Drafts are blocked by the rules, so they come back as "not found". */
export function useDocument(service, id) {
  const [state, setState] = useState({ data: null, loading: true });
  const { lang } = useLang();
  useEffect(() => {
    let live = true;
    setState({ data: null, loading: true });
    service.get(id, lang).then((data) => live && setState({ data, loading: false })).catch(() => live && setState({ data: null, loading: false }));
    return () => { live = false; };
  }, [service, id, lang]);
  return state;
}
