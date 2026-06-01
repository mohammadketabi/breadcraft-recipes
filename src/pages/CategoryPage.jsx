import { useParams } from "react-router-dom";
import recipes from "../data/recipes.json";
import RecipeList from "../components/RecipeList";

export default function CategoryPage() {
  const { categorySlug } = useParams();

  const filteredRecipes = recipes.filter(
    (recipe) => recipe.categorySlug === categorySlug,
  );

  const categoryTitle = filteredRecipes[0]?.category || "Category";

  return (
    <>
      <h1>{categoryTitle}</h1>
      <RecipeList recipes={filteredRecipes} />
    </>
  );
}
