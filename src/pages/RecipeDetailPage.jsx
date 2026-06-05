import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipeById } from "../services/recipeService";
import NotFoundPage from "./NotFoundPage";
import recipePlaceholder from "../assets/recipe-placeholder.svg";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (error) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id]);

  if (loading) return <p>Loading recipe...</p>;
  if (notFound || !recipe) return <NotFoundPage />;

  return (
    <div className="recipe-detail">
      <Link to="/">← Back to Recipes</Link>

      <h1>{recipe.title}</h1>

      <img
        src={recipe.image || recipePlaceholder}
        alt={recipe.title}
        className="recipe-detail-image"
      />

      <p>
        <strong>Category:</strong> {recipe.category}
      </p>

      <p>
        <strong>Time:</strong> {recipe.time}
      </p>

      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <ol>
        {recipe.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
