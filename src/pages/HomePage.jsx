import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import RecipeList from "../components/RecipeList";
import FeaturedRecipes from "../components/FeaturedRecipes";
import { getRecipes } from "../services/recipeService";

export default function HomePage() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
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

  const categories = [
    { name: "All", slug: "all" },
    ...Array.from(
      new Map(
        recipes.map((recipe) => [
          recipe.category_slug,
          {
            name: recipe.category,
            slug: recipe.category_slug,
          },
        ])
      ).values()
    ),
  ];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <RecipeList recipes={filteredRecipes} />
    </>
  );
}