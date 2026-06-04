import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, loading } = useAuth();

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        Breadcraft 🍞
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>

        {!loading && user && <Link to="/add-recipe">Add Recipe</Link>}

        {user && <Link to="/admin">Admin</Link>}

        {!loading &&
          (user ? (
            <>
              <span>Welcome {user.email}</span>

              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          ))}
      </nav>
    </header>
  );
}
