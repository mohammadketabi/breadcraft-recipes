import RecipeList from "./RecipeList";

export default function FeaturedRecipes({ recipes }) {
  const featuredRecipes = recipes.filter((recipe) => recipe.featured);

  return (
    <>
      <h2>⭐ Featured Recipes</h2>
      <RecipeList recipes={featuredRecipes} />
    </>
  );
}
