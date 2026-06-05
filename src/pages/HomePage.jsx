import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import RecipeList from "../components/RecipeList";
import FeaturedRecipes from "../components/FeaturedRecipes";
import { getRecipes } from "../services/recipeService";
import { CATEGORIES } from "../constants/categories";

const ALL_CATEGORIES = [{ name: "All", slug: "all" }, ...CATEGORIES];

export default function HomePage() {
  const [searchText, setSearchText] = useState("");
  const [recipes, setRecipes] = useState([]);
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

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <p>Loading recipes...</p>;
  }

  return (
    <>
      <h1>Breadcraft Recipes</h1>

      <FeaturedRecipes recipes={recipes} />

      <SearchBar
        searchText={searchText}
        onSearchChange={setSearchText}
      />

      <CategoryFilter categories={ALL_CATEGORIES} activeSlug="all" />

      <RecipeList recipes={filteredRecipes} />
    </>
  );
}