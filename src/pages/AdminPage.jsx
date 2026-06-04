import { useEffect, useState } from "react";
import { getRecipes, deleteRecipe } from "../services/recipeService";
import { Link } from "react-router-dom";

export default function AdminPage() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function loadRecipes() {
      const data = await getRecipes();
      setRecipes(data);
    }

    loadRecipes();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recipe?",
    );

    if (!confirmed) return;

    try {
      await deleteRecipe(id);

      setRecipes((recipes) => recipes.filter((recipe) => recipe.id !== id));
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <>
      <h1>Admin Dashboard</h1>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe.id}>
              <td>{recipe.title}</td>
              <td>{recipe.category}</td>

              <td>
                <Link to={`/edit-recipe/${recipe.id}`}>Edit</Link>

                <button onClick={() => handleDelete(recipe.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
