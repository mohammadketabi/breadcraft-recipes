import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import TimeFilter from "../components/TimeFilter";
import RecipeList from "../components/RecipeList";
import FeaturedRecipes from "../components/FeaturedRecipes";
import { useInfiniteRecipes } from "../hooks/useInfiniteRecipes";
import { CATEGORIES } from "../constants/categories";

const ALL_CATEGORIES = [{ name: "All", slug: "all" }, ...CATEGORIES];

export default function CategoryPage() {
  const { categorySlug } = useParams();
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
    categorySlug,
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

  const categoryTitle =
    CATEGORIES.find((c) => c.slug === categorySlug)?.name ?? "Recipes";

  return (
    <>
      <h1>{categoryTitle}</h1>

      <FeaturedRecipes categorySlug={categorySlug} />

      <SearchBar searchText={searchText} onSearchChange={setSearchText} />

      <CategoryFilter categories={ALL_CATEGORIES} activeSlug={categorySlug} />
      <TimeFilter activeMax={maxMinutes} onChange={setMaxMinutes} />

      {loading ? (
        <p className="loading-text">Loading recipes…</p>
      ) : (
        <>
          <RecipeList recipes={recipes} />
          <div ref={sentinelRef} className="scroll-sentinel" />
          {loadingMore && <p className="loading-more-text">Loading more…</p>}
          {!hasMore && recipes.length > 0 && (
            <p className="no-more-text">You've seen all {categoryTitle} recipes!</p>
          )}
        </>
      )}
    </>
  );
}
