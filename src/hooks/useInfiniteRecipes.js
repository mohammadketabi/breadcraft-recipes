import { useCallback, useEffect, useRef, useState } from "react";
import { getRecipes } from "../services/recipeService";

const PAGE_SIZE = 12;

export function useInfiniteRecipes({ search = "", categorySlug = null, maxMinutes = null } = {}) {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const queryKey = `${search}||${categorySlug ?? ""}||${maxMinutes ?? ""}`;
  const activeQueryRef = useRef(queryKey);

  useEffect(() => {
    let cancelled = false;

    // Query changed — reset and wait for page to settle at 0 before fetching
    if (activeQueryRef.current !== queryKey) {
      activeQueryRef.current = queryKey;
      setRecipes([]);
      setHasMore(true);
      if (page !== 0) {
        setPage(0);
        return;
      }
    }

    if (page === 0) setLoading(true);
    else setLoadingMore(true);

    getRecipes({ page, pageSize: PAGE_SIZE, search, categorySlug, maxMinutes })
      .then((data) => {
        if (cancelled) return;
        setRecipes((prev) => (page === 0 ? data : [...prev, ...data]));
        setHasMore(data.length === PAGE_SIZE);
      })
      .catch((e) => { if (!cancelled) console.error(e); })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      });

    return () => { cancelled = true; };
  }, [page, queryKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading) return;
    setPage((p) => p + 1);
  }, [hasMore, loadingMore, loading]);

  return { recipes, loading, loadingMore, hasMore, loadMore };
}
