import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import useAuth from "../hooks/useAuth";
import useProfile from "../hooks/useProfile";
import { useState } from "react";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile } = useProfile();
  const isAdmin = profile?.role === "admin";

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        Breadcraft 🍞
      </Link>

      <nav className="nav-links">
        <Link to="/">All Recipes</Link>
        <Link to="/about">About</Link>

        {!loading &&
          (user ? (
            <div className="user-menu">
              <button
                className="avatar-button"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {user.email[0].toUpperCase()}
              </button>

              {menuOpen && (
                <div className="user-dropdown">
                  <Link to="/profile">Profile</Link>

                  {isAdmin ? (
                    <Link to="/admin">Admin Dashboard</Link>
                  ) : (
                    <Link to="/my-recipes">My Recipes</Link>
                  )}

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">Login</Link>
          ))}
      </nav>
    </header>
  );
}
