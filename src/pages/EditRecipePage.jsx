import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getRecipeById,
  updateRecipe,
  uploadRecipeImage,
} from "../services/recipeService";
import { CATEGORIES } from "../constants/categories";
import ItemList from "../components/ItemList";

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadRecipe() {
      try {
        const recipe = await getRecipeById(id);
        setTitle(recipe.title);
        setCategory(recipe.category);
        setTime(recipe.time);
        setImage(recipe.image);
        setIngredients(recipe.ingredients?.length ? recipe.ingredients : [""]);
        setSteps(recipe.steps?.length ? recipe.steps : [""]);
        setIsPublic(recipe.is_public ?? true);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadRecipe();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = image;
      if (imageFile) imageUrl = await uploadRecipeImage(imageFile);

      const categorySlug = CATEGORIES.find((c) => c.name === category)?.slug ?? "other";

      await updateRecipe(id, {
        title,
        category,
        category_slug: categorySlug,
        time,
        image: imageUrl,
        is_public: isPublic,
        ingredients: ingredients.map((i) => i.trim()).filter(Boolean),
        steps: steps.map((s) => s.trim()).filter(Boolean),
      });

      toast.success("Recipe updated!");
      navigate("/admin");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading recipe…</p>;

  return (
    <div className="recipe-form-page">
      <h1>Edit Recipe</h1>

      <form onSubmit={handleSubmit} className="recipe-form recipe-form--card">

        {/* ── Basic info ── */}
        <div className="form-section">
          <h3 className="form-section-title">Basic Info</h3>

          <input
            type="text"
            placeholder="Recipe title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="form-row">
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Time (e.g. 45 min)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          {image && (
            <img src={image} alt={title} className="recipe-detail-image" />
          )}

          <label className="image-upload-label">
            {imageFile ? (
              <span className="image-upload-chosen">{imageFile.name}</span>
            ) : (
              <span>📷 Replace photo</span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </label>
        </div>

        {/* ── Ingredients ── */}
        <div className="form-section">
          <h3 className="form-section-title">Ingredients</h3>
          <ItemList
            label="Ingredients"
            items={ingredients}
            onChange={setIngredients}
            placeholder="Ingredient"
          />
        </div>

        {/* ── Steps ── */}
        <div className="form-section">
          <h3 className="form-section-title">Steps</h3>
          <ItemList
            label="Steps"
            items={steps}
            onChange={setSteps}
            placeholder="Step"
            multiline
          />
        </div>

        {/* ── Visibility + submit ── */}
        <div className="form-section form-section--footer">
          <div className="visibility-toggle">
            <label className={`visibility-option ${isPublic ? "active" : ""}`}>
              <input type="radio" name="visibility" checked={isPublic} onChange={() => setIsPublic(true)} />
              Public
            </label>
            <label className={`visibility-option ${!isPublic ? "active" : ""}`}>
              <input type="radio" name="visibility" checked={!isPublic} onChange={() => setIsPublic(false)} />
              Private
            </label>
          </div>

          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? "Saving…" : "Update Recipe"}
          </button>
        </div>

      </form>
    </div>
  );
}
