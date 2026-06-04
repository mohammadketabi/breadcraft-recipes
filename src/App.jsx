import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import CategoryPage from "./pages/CategoryPage";
import AboutPage from "./pages/AboutPage";
import AddRecipePage from "./pages/AddRecipePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import EditRecipePage from "./pages/EditRecipePage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/add-recipe"
          element={
            <ProtectedRoute>
              <AddRecipePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/edit-recipe/:id"
        element={
          <ProtectedRoute>
            <EditRecipePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
