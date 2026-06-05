import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (user) loadRecipes();
  }, [user]);

  async function handleDelete(id) {
    const confirmed = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmed) return;

    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      alert(error.message);
    }
  }

  if (loading) return <p>Loading your recipes...</p>;

  return (
    <>
      <div className="my-recipes-header">
        <h1>My Recipes</h1>
        <Link to="/add-recipe" className="recipe-button">
          + Add Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p>You haven't added any recipes yet.</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img
                src={recipe.image || recipePlaceholder}
                alt={recipe.title}
                className="recipe-image"
              />
              <h2>{recipe.title}</h2>
              <p>{recipe.category}</p>
              <p>{recipe.time}</p>
              <span className={`visibility-badge ${recipe.is_public ? "badge-public" : "badge-private"}`}>
                {recipe.is_public ? "Public" : "Private"}
              </span>
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
