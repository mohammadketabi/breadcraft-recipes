import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRecipeById,
  updateRecipe,
  uploadRecipeImage,
} from "../services/recipeService";

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecipe() {
      try {
        const recipe = await getRecipeById(id);

        setTitle(recipe.title);
        setCategory(recipe.category);
        setTime(recipe.time);
        setImage(recipe.image);
        setIngredients(recipe.ingredients.join(", "));
        setSteps(recipe.steps.join(", "));
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      let imageUrl = image;

      if (imageFile) {
        imageUrl = await uploadRecipeImage(imageFile);
      }

      const updatedRecipe = {
        title,
        category,
        category_slug: category.toLowerCase().replaceAll(" ", "-"),
        time,
        image: imageUrl,
        ingredients: ingredients.split(",").map((item) => item.trim()),
        steps: steps.split(",").map((step) => step.trim()),
      };

      await updateRecipe(id, updatedRecipe);

      navigate("/admin");
    } catch (error) {
      alert(error.message);
    }
  }

  if (loading) {
    return <p>Loading recipe...</p>;
  }

  return (
    <>
      <h1>Edit Recipe</h1>

      <form onSubmit={handleSubmit} className="recipe-form">
        <input
          type="text"
          placeholder="Recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="text"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        {image && (
          <img
            src={image}
            alt={title}
            className="recipe-detail-image"
          />
        )}

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

        <button type="submit">Update Recipe</button>
      </form>
    </>
  );
}