import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddRecipePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const newRecipe = {
      id: Date.now(),
      title,
      category,
      categorySlug: category.toLowerCase().replaceAll(" ", "-"),
      time,
      image,
      featured: false,
      ingredients: ingredients.split(","),
      steps: steps.split(","),
    };

    const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];

    const updatedRecipes = [...savedRecipes, newRecipe];

    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));

    navigate("/");
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
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
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
