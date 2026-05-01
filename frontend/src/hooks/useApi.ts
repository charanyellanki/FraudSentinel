import { useEffect, useRef, useState } from "react";

interface ApiState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  /** True after 3s of loading — used to show "backend warming up" copy. */
  warming: boolean;
}

/**
 * Generic data-fetching hook. Call `fetcher` on mount and whenever any value
 * in `deps` changes. Tracks a `warming` flag for Render free-tier cold starts.
 */
export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [warming, setWarming] = useState(false);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setWarming(false);
    setError(null);

    const warmingTimer = window.setTimeout(() => {
      if (!cancelled) setWarming(true);
    }, 3000);

    fetcherRef
      .current()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setLoading(false);
        setWarming(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err);
        setLoading(false);
        setWarming(false);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(warmingTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, warming };
}
