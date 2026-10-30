import { useEffect, useState } from "react";
import { useLang } from "@/hooks/useLang";

const cache = new Map(); // one fetch per collection per visit

/** Published items of a collection, optionally sorted. Shared across components. */
export function useCollection(service, { max = 100, sort } = {}) {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  const { lang } = useLang();

  useEffect(() => {
    let live = true;
    const key = `${service.col}:${lang}:${max}`;
    setState({ data: [], loading: true, error: null });
    if (!cache.has(key)) cache.set(key, service.listPublished(max, lang));
    cache.get(key)
      .then((rows) => live && setState({ data: sort ? [...rows].sort(sort) : rows, loading: false, error: null }))
      .catch((error) => { cache.delete(key); live && setState({ data: [], loading: false, error }); });
    return () => { live = false; };
  }, [service, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
