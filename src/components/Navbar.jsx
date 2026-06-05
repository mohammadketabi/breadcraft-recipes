import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import useProfile from "../hooks/useProfile";
import avatarPlaceholder from "../assets/avatar-placeholder.svg";

export default function Navbar() {
  const { user, loading, profile } = useProfile();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = profile?.role === "admin";

  function closeAll() {
    setDropdownOpen(false);
    setMobileOpen(false);
  }

  async function handleLogout() {
    closeAll();
    await supabase.auth.signOut();
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo" onClick={closeAll}>
        Breadcraft 🍞
      </Link>

      {/* Desktop nav */}
      <nav className="nav-links">
        <Link to="/">All Recipes</Link>
        <Link to="/about">About</Link>

        {!loading && (
          user ? (
            <div className="user-menu">
              <button className="avatar-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img src={profile?.avatar_url || avatarPlaceholder} alt="avatar" className="avatar-img" />
              </button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" onClick={closeAll}>Profile</Link>
                  <Link to="/my-recipes" onClick={closeAll}>My Recipes</Link>
                  <Link to="/saved-recipes" onClick={closeAll}>Saved Recipes</Link>
                  {isAdmin && <Link to="/admin" onClick={closeAll}>Admin Dashboard</Link>}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )
        )}
      </nav>

      {/* Mobile hamburger button */}
      <button
        className="hamburger-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          {!loading && user && (
            <div className="mobile-menu-profile">
              <img
                src={profile?.avatar_url || avatarPlaceholder}
                alt="avatar"
                className="mobile-avatar"
              />
              <span className="mobile-menu-name">{profile?.full_name || user.email}</span>
            </div>
          )}
          <Link to="/" onClick={closeAll}>All Recipes</Link>
          <Link to="/about" onClick={closeAll}>About</Link>
          {!loading && (
            user ? (
              <>
                <Link to="/profile" onClick={closeAll}>Profile</Link>
                <Link to="/my-recipes" onClick={closeAll}>My Recipes</Link>
                <Link to="/saved-recipes" onClick={closeAll}>Saved Recipes</Link>
                {isAdmin && <Link to="/admin" onClick={closeAll}>Admin Dashboard</Link>}
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={closeAll}>Login</Link>
            )
          )}
        </div>
      )}
    </header>
  );
}
