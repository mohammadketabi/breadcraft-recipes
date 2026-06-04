import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe, uploadRecipeImage } from "../services/recipeService";

export default function AddRecipePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadRecipeImage(imageFile);
    }

    try {
      const newRecipe = {
        title,
        category,
        category_slug: category.toLowerCase().replaceAll(" ", "-"),
        time,
        image: imageUrl,
        featured: false,
        ingredients: ingredients.split(",").map((item) => item.trim()),
        steps: steps.split(",").map((step) => step.trim()),
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

        <button type="submit">Add Recipe</button>
      </form>
    </>
  );
}
