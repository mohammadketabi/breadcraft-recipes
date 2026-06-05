import { useEffect, useState } from "react";
import { getFeaturedRecipes } from "../services/recipeService";
import RecipeList from "./RecipeList";

export default function FeaturedRecipes({ categorySlug = null }) {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getFeaturedRecipes(categorySlug).then(setFeatured).catch(() => {});
  }, [categorySlug]);

  if (!featured.length) return null;

  return (
    <>
      <h2>⭐ Featured Recipes</h2>
      <RecipeList recipes={featured} />
    </>
  );
}
