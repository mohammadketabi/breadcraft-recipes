import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookmarkedRecipes } from "../services/bookmarkService";
import useProfile from "../hooks/useProfile";
import RecipeCard from "../components/RecipeCard";

export default function SavedRecipesPage() {
  const { user } = useProfile();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getBookmarkedRecipes(user.id)
      .then(setRecipes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p className="loading-text">Loading saved recipes…</p>;

  return (
    <>
      <h1>Saved Recipes</h1>

      {recipes.length === 0 ? (
        <div className="saved-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c9b99a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <p>No saved recipes yet.</p>
          <p>Browse recipes and click <strong>Save</strong> to bookmark them here.</p>
          <Link to="/" className="recipe-button">Browse Recipes</Link>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </>
  );
}
