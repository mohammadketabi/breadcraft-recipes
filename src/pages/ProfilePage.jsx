import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useProfile from "../hooks/useProfile";
import { supabase } from "../lib/supabaseClient";
import { uploadProfileImage } from "../services/profileService";
import avatarPlaceholder from "../assets/avatar-placeholder.svg";

export default function ProfilePage() {
  const { profile, loading, user } = useProfile();

  const [activeTab, setActiveTab] = useState("profile");

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [fullName, setFullName] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
    if (profile?.avatar_url) setAvatarPreview(profile.avatar_url);
  }, [profile]);

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();

    try {
      let avatarUrl = profile?.avatar_url || "";

      if (avatarFile) {
        avatarUrl = await uploadProfileImage(avatarFile);
        setAvatarPreview(avatarUrl);
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        avatar_url: avatarUrl,
        role: profile?.role || "user",
      });

      if (error) throw error;

      toast.success("Profile updated successfully");
      setAvatarFile(null);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      toast.success("Password updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Please login to see your profile.</p>;

  return (
    <div className="profile-card">
      <h1>Profile</h1>

      <img
        src={avatarPreview || avatarPlaceholder}
        alt="Profile"
        className="profile-avatar-image"
      />

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`profile-tab ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Change Password
        </button>
      </div>

      {activeTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="recipe-form">
          <label>Email</label>
          <input type="email" value={user.email} readOnly />

          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label>Avatar</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />

          <button type="submit">Save Changes</button>
        </form>
      )}

      {activeTab === "password" && (
        <form onSubmit={handlePasswordSubmit} className="recipe-form">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">Update Password</button>
        </form>
      )}
    </div>
  );
}
