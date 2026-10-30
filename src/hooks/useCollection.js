import { useEffect, useState } from "react";

const cache = new Map(); // one fetch per collection per visit

/** Published items of a collection, optionally sorted. Shared across components. */
export function useCollection(service, { max = 100, sort } = {}) {
  const [state, setState] = useState({ data: [], loading: true, error: null });

  useEffect(() => {
    let live = true;
    if (!cache.has(service.col)) cache.set(service.col, service.listPublished(max));
    cache.get(service.col)
      .then((rows) => live && setState({ data: sort ? [...rows].sort(sort) : rows, loading: false, error: null }))
      .catch((error) => { cache.delete(service.col); live && setState({ data: [], loading: false, error }); });
    return () => { live = false; };
  }, [service]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
