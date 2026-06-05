import { Link } from "react-router-dom";
import recipePlaceholder from "../assets/recipe-placeholder.svg";

export default function RecipeCard({ recipe }) {
  const likeCount    = recipe.recipe_likes?.[0]?.count ?? 0;
  const commentCount = recipe.recipe_comments?.[0]?.count ?? 0;

  return (
    <Link className="recipe-card" to={`/recipe/${recipe.id}`}>
      <div className="recipe-card-img-wrap">
        <img
          src={recipe.image || recipePlaceholder}
          alt={recipe.title}
          className="recipe-image"
        />
      </div>

      <div className="recipe-card-body">
        <p className="recipe-card-category">{recipe.category}</p>
        <h2 className="recipe-card-title">{recipe.title}</h2>

        <div className="recipe-card-footer">
          {recipe.time && (
            <span className="recipe-card-meta">⏱ {recipe.time}</span>
          )}
          <div className="recipe-card-stats">
            <span className="recipe-card-stat" title="Likes">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {likeCount}
            </span>
            <span className="recipe-card-stat" title="Comments">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {commentCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
