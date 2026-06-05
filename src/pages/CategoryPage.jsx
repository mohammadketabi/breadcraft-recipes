import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import RecipeList from "../components/RecipeList";
import FeaturedRecipes from "../components/FeaturedRecipes";
import { getRecipes } from "../services/recipeService";
import { CATEGORIES } from "../constants/categories";

const ALL_CATEGORIES = [{ name: "All", slug: "all" }, ...CATEGORIES];

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadRecipes();
  }, []);

  const categoryTitle =
    CATEGORIES.find((c) => c.slug === categorySlug)?.name ?? "Recipes";

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.category_slug === categorySlug &&
      recipe.title.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <p>Loading recipes...</p>;

  return (
    <>
      <h1>{categoryTitle}</h1>

      <FeaturedRecipes recipes={recipes} />

      <SearchBar searchText={searchText} onSearchChange={setSearchText} />

      <CategoryFilter categories={ALL_CATEGORIES} activeSlug={categorySlug} />

      <RecipeList recipes={filteredRecipes} />
    </>
  );
}
