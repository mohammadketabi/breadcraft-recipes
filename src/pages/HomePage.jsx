import { useEffect, useRef, useState } from "react";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import TimeFilter from "../components/TimeFilter";
import RecipeList from "../components/RecipeList";
import FeaturedRecipes from "../components/FeaturedRecipes";
import { useInfiniteRecipes } from "../hooks/useInfiniteRecipes";
import { CATEGORIES } from "../constants/categories";

const ALL_CATEGORIES = [{ name: "All", slug: "all" }, ...CATEGORIES];

export default function HomePage() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [maxMinutes, setMaxMinutes] = useState(null);
  const sentinelRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText), 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const { recipes, loading, loadingMore, hasMore, loadMore } = useInfiniteRecipes({
    search: debouncedSearch,
    maxMinutes,
  });

  // Trigger loadMore when sentinel scrolls into view
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "300px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <h1>Breadcraft Recipes</h1>

      <FeaturedRecipes />

      <SearchBar searchText={searchText} onSearchChange={setSearchText} />

      <CategoryFilter categories={ALL_CATEGORIES} activeSlug="all" />
      <TimeFilter activeMax={maxMinutes} onChange={setMaxMinutes} />

      {loading ? (
        <p className="loading-text">Loading recipes…</p>
      ) : (
        <>
          <RecipeList recipes={recipes} />
          <div ref={sentinelRef} className="scroll-sentinel" />
          {loadingMore && <p className="loading-more-text">Loading more…</p>}
          {!hasMore && recipes.length > 0 && (
            <p className="no-more-text">You've seen all the recipes!</p>
          )}
        </>
      )}
    </>
  );
}
