import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { confirmToast } from "../utils/confirmToast";
import { getAllRecipes, deleteRecipe, updateRecipe } from "../services/recipeService";
import { getProfiles, deleteProfile } from "../services/profileService";
import recipePlaceholder from "../assets/recipe-placeholder.svg";
import avatarPlaceholder from "../assets/avatar-placeholder.svg";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("recipes");

  const [recipes, setRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getAllRecipes();
        setRecipes(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setRecipesLoading(false);
      }
    }

    async function loadUsers() {
      try {
        const data = await getProfiles();
        setUsers(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setUsersLoading(false);
      }
    }

    loadRecipes();
    loadUsers();
  }, []);

  async function handleDelete(id) {
    const confirmed = await confirmToast("Delete this recipe? This cannot be undone.");
    if (!confirmed) return;

    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleToggleFeatured(recipe) {
    try {
      await updateRecipe(recipe.id, { featured: !recipe.featured });
      setRecipes((prev) =>
        prev.map((r) => r.id === recipe.id ? { ...r, featured: !r.featured } : r)
      );
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleDeleteUser(id) {
    const confirmed = await confirmToast("Delete this user's profile?");
    if (!confirmed) return;

    try {
      await deleteProfile(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <h1>Admin Dashboard</h1>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "recipes" ? "active" : ""}`}
          onClick={() => setActiveTab("recipes")}
        >
          Recipes ({recipes.length})
        </button>
        <button
          className={`profile-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users ({users.length})
        </button>
      </div>

      {activeTab === "recipes" && (
        recipesLoading ? <p>Loading recipes...</p> : (
          <div className="table-scroll"><table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 64 }}></th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Visibility</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>
                    <img
                      src={recipe.image || recipePlaceholder}
                      alt={recipe.title}
                      className="admin-thumb"
                    />
                  </td>
                  <td>{recipe.title}</td>
                  <td>
                    {(() => {
                      const author = users.find((u) => u.id === recipe.user_id);
                      return (
                        <div className="admin-author">
                          <img
                            src={author?.avatar_url || avatarPlaceholder}
                            alt={author?.full_name || "Unknown"}
                            className="admin-thumb admin-thumb--round"
                            style={{ width: 28, height: 28 }}
                          />
                          <span>{author?.full_name || author?.email || "Unknown"}</span>
                        </div>
                      );
                    })()}
                  </td>
                  <td>{recipe.category}</td>
                  <td>
                    <span className={`visibility-badge ${recipe.is_public ? "badge-public" : "badge-private"}`}>
                      {recipe.is_public ? "Public" : "Private"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`featured-toggle ${recipe.featured ? "featured-toggle--on" : ""}`}
                      onClick={() => handleToggleFeatured(recipe)}
                      title={recipe.featured ? "Remove from featured" : "Mark as featured"}
                    >
                      {recipe.featured ? "⭐ Featured" : "☆ Feature"}
                    </button>
                  </td>
                  <td className="admin-actions">
                    <Link to={`/edit-recipe/${recipe.id}`} className="recipe-button recipe-button--outline">
                      Edit
                    </Link>
                    <button
                      className="recipe-button recipe-button--danger"
                      onClick={() => handleDelete(recipe.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )
      )}

      {activeTab === "users" && (
        usersLoading ? <p>Loading users...</p> : (
          <div className="table-scroll"><table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 64 }}></th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <img
                      src={user.avatar_url || avatarPlaceholder}
                      alt={user.full_name || "user"}
                      className="admin-thumb admin-thumb--round"
                    />
                  </td>
                  <td>{user.full_name || "—"}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`visibility-badge ${user.role === "admin" ? "badge-admin" : "badge-user"}`}>
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="admin-actions">
                    {user.role !== "admin" && (
                      <button
                        className="recipe-button recipe-button--danger"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )
      )}
    </>
  );
}
