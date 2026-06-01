import { useParams, Link } from "react-router-dom";
import recipes from "../data/recipes.json";
import NotFoundPage from "./NotFoundPage";

export default function RecipeDetailPage() {
  const { id } = useParams();

  const recipe = recipes.find((recipe) => recipe.id === Number(id));

  if (!recipe) {
    return <NotFoundPage />;
  }

  return (
    <div className="recipe-detail">
      <Link to="/">← Back to Recipes</Link>

      <h1>{recipe.title}</h1>

      <img
        src={recipe.image}
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
