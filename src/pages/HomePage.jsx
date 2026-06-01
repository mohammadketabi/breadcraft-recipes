import { useState } from "react";

import recipes from "../data/recipes.json";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import RecipeList from "../components/RecipeList";
import FeaturedRecipes from "../components/FeaturedRecipes";

export default function HomePage() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { name: "All", slug: "all" },
    ...Array.from(
      new Map(
        recipes.map((recipe) => [
          recipe.categorySlug,
          {
            name: recipe.category,
            slug: recipe.categorySlug,
          },
        ]),
      ).values(),
    ),
  ];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <h1>Breadcraft Recipes</h1>

      <FeaturedRecipes recipes={recipes} />

      <SearchBar searchText={searchText} onSearchChange={setSearchText} />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <RecipeList recipes={filteredRecipes} />
    </>
  );
}
