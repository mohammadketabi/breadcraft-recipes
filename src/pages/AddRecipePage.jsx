import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe, uploadRecipeImage } from "../services/recipeService";
import useProfile from "../hooks/useProfile";
import { CATEGORIES } from "../constants/categories";

export default function AddRecipePage() {
  const navigate = useNavigate();
  const { user } = useProfile();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadRecipeImage(imageFile);
      }

      const categorySlug = CATEGORIES.find((c) => c.name === category)?.slug ?? "other";

      const newRecipe = {
        title,
        category,
        category_slug: categorySlug,
        time,
        image: imageUrl,
        featured: false,
        is_public: isPublic,
        ingredients: ingredients.split(",").map((item) => item.trim()),
        steps: steps.split(",").map((step) => step.trim()),
        user_id: user.id,
      };

      await createRecipe(newRecipe);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <>
      <h1>Add New Recipe</h1>

      <form onSubmit={handleSubmit} className="recipe-form">
        <input
          type="text"
          placeholder="Recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <textarea
          placeholder="Ingredients, separated by commas"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />

        <textarea
          placeholder="Steps, separated by commas"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />

        <div className="visibility-toggle">
          <label className={`visibility-option ${isPublic ? "active" : ""}`}>
            <input
              type="radio"
              name="visibility"
              checked={isPublic}
              onChange={() => setIsPublic(true)}
            />
            Public
          </label>
          <label className={`visibility-option ${!isPublic ? "active" : ""}`}>
            <input
              type="radio"
              name="visibility"
              checked={!isPublic}
              onChange={() => setIsPublic(false)}
            />
            Private
          </label>
        </div>

        <button type="submit">Add Recipe</button>
      </form>
    </>
  );
}
