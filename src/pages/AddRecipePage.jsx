import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createRecipe, uploadRecipeImage } from "../services/recipeService";
import useProfile from "../hooks/useProfile";
import { CATEGORIES } from "../constants/categories";
import ItemList from "../components/ItemList";

export default function AddRecipePage() {
  const navigate = useNavigate();
  const { user } = useProfile();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) imageUrl = await uploadRecipeImage(imageFile);

      const categorySlug = CATEGORIES.find((c) => c.name === category)?.slug ?? "other";

      await createRecipe({
        title,
        category,
        category_slug: categorySlug,
        time,
        image: imageUrl,
        featured: false,
        is_public: isPublic,
        ingredients: ingredients.map((i) => i.trim()).filter(Boolean),
        steps: steps.map((s) => s.trim()).filter(Boolean),
        user_id: user.id,
      });

      toast.success("Recipe added!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="recipe-form-page">
      <h1>Add New Recipe</h1>

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

          <label className="image-upload-label">
            {imageFile ? (
              <span className="image-upload-chosen">{imageFile.name}</span>
            ) : (
              <span>📷 Choose a photo</span>
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

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving…" : "Add Recipe"}
          </button>
        </div>

      </form>
    </div>
  );
}
