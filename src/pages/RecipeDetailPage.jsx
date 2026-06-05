import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { confirmToast } from "../utils/confirmToast";
import { getRecipeById, deleteRecipe } from "../services/recipeService";
import useProfile from "../hooks/useProfile";
import ShareButtons from "../components/ShareButtons";
import LikeButton from "../components/LikeButton";
import BookmarkButton from "../components/BookmarkButton";
import CommentsSection from "../components/CommentsSection";
import NotFoundPage from "./NotFoundPage";
import recipePlaceholder from "../assets/recipe-placeholder.svg";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useProfile();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadRecipe();
  }, [id]);

  const isOwner = user && recipe && (recipe.user_id === user.id || profile?.role === "admin");

  async function handleDelete() {
    if (!await confirmToast("Delete this recipe? This cannot be undone.")) return;
    try {
      await deleteRecipe(recipe.id);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (loading) return <p className="loading-text">Loading recipe…</p>;
  if (notFound || !recipe) return <NotFoundPage />;

  return (
    <div className="recipe-detail">

      <Link to="/" className="recipe-back">← Back to Recipes</Link>

      {/* Hero image */}
      <div className="recipe-detail-hero">
        <img
          src={recipe.image || recipePlaceholder}
          alt={recipe.title}
          className="recipe-detail-image"
        />
      </div>

      {/* Title + meta */}
      <div className="recipe-detail-header">
        <div className="recipe-detail-title-row">
          <h1 className="recipe-detail-title">{recipe.title}</h1>
          {isOwner && (
            <div className="recipe-detail-actions">
              <Link to={`/edit-recipe/${recipe.id}`} className="recipe-button recipe-button--outline">
                Edit
              </Link>
              <button className="recipe-button recipe-button--danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="recipe-detail-meta">
          {recipe.category && (
            <Link
              to={`/category/${recipe.category_slug ?? recipe.category.toLowerCase()}`}
              className="recipe-meta-badge recipe-meta-badge--category"
            >
              {recipe.category}
            </Link>
          )}
          {recipe.time && (
            <span className="recipe-meta-badge recipe-meta-badge--time">
              ⏱ {recipe.time}
            </span>
          )}
        </div>

        <div className="recipe-detail-actions-row">
          <ShareButtons title={recipe.title} imageUrl={recipe.image} />
          <div className="recipe-detail-engagement">
            <LikeButton recipeId={recipe.id} />
            <BookmarkButton recipeId={recipe.id} />
          </div>
        </div>
      </div>

      {/* Body: ingredients + steps */}
      <div className="recipe-detail-body">

        <aside className="recipe-ingredients-card">
          <h2 className="recipe-section-title">Ingredients</h2>
          <ul className="recipe-ingredients-list">
            {recipe.ingredients?.filter(Boolean).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </aside>

        <section className="recipe-steps-section">
          <h2 className="recipe-section-title">Instructions</h2>
          <ol className="recipe-steps-list">
            {recipe.steps?.filter(Boolean).map((step, i) => (
              <li key={i} className="recipe-step">
                <span className="recipe-step-num">{i + 1}</span>
                <p className="recipe-step-text">{step}</p>
              </li>
            ))}
          </ol>
        </section>

      </div>

      <CommentsSection recipeId={recipe.id} />

    </div>
  );
}
