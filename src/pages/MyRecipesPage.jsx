import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { confirmToast } from "../utils/confirmToast";
import useProfile from "../hooks/useProfile";
import { getMyRecipes, deleteRecipe } from "../services/recipeService";
import recipePlaceholder from "../assets/recipe-placeholder.svg";

export default function MyRecipesPage() {
  const { user } = useProfile();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getMyRecipes(user.id);
        setRecipes(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (user) loadRecipes();
  }, [user]);

  async function handleDelete(id) {
    if (!await confirmToast("Delete this recipe? This cannot be undone.")) return;
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      toast.success("Recipe deleted.");
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (loading) return <p className="loading-text">Loading your recipes…</p>;

  return (
    <>
      <div className="my-recipes-header">
        <h1>My Recipes</h1>
        <Link to="/add-recipe" className="recipe-button">
          + Add Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p className="empty-state">You haven't added any recipes yet.</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card my-recipe-card">
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
                  <div className="my-recipe-meta">
                    {recipe.time && (
                      <span className="recipe-card-meta">⏱ {recipe.time}</span>
                    )}
                    <span className={`visibility-badge ${recipe.is_public ? "badge-public" : "badge-private"}`}>
                      {recipe.is_public ? "Public" : "Private"}
                    </span>
                  </div>
                  <div className="recipe-card-stats">
                    <span className="recipe-card-stat" title="Likes">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {recipe.recipe_likes?.[0]?.count ?? 0}
                    </span>
                    <span className="recipe-card-stat" title="Comments">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      {recipe.recipe_comments?.[0]?.count ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="my-recipe-card-actions">
                <Link to={`/recipe/${recipe.id}`} className="recipe-button">
                  View
                </Link>
                <Link to={`/edit-recipe/${recipe.id}`} className="recipe-button recipe-button--outline">
                  Edit
                </Link>
                <button
                  className="recipe-button recipe-button--danger"
                  onClick={() => handleDelete(recipe.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
