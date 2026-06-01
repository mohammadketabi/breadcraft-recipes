import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />

      <h2>{recipe.title}</h2>
      <p>{recipe.category}</p>
      <p>{recipe.time}</p>

      <Link className="recipe-button" to={`/recipe/${recipe.id}`}>
        View Recipe
      </Link>
    </div>
  );
}