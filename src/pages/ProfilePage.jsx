import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useProfile from "../hooks/useProfile";
import { supabase } from "../lib/supabaseClient";
import { uploadProfileImage } from "../services/profileService";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }

    if (profile?.avatar_url) {
      setAvatarPreview(profile.avatar_url);
    }
  }, [profile]);

  function handleAvatarChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      let avatarUrl = profile?.avatar_url || "";

      if (avatarFile) {
        avatarUrl = await uploadProfileImage(avatarFile);
        setAvatarPreview(avatarUrl);
      }

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        avatar_url: avatarUrl,
        role: profile?.role || "user",
      });

      if (profileError) throw profileError;

      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password,
        });

        if (passwordError) throw passwordError;
      }

      alert("Profile updated successfully");
      setPassword("");
      setConfirmPassword("");
      setAvatarFile(null);
    } catch (error) {
      alert(error.message);
    }
  }

  if (authLoading || profileLoading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return <p>Please login to see your profile.</p>;
  }

  return (
    <div className="profile-card">
      <h1>Profile</h1>

      {avatarPreview ? (
        <img
          src={avatarPreview}
          alt="Profile"
          className="profile-avatar-image"
        />
      ) : (
        <div className="profile-avatar">
          {fullName ? fullName[0].toUpperCase() : user.email[0].toUpperCase()}
        </div>
      )}

      <form onSubmit={handleSubmit} className="recipe-form">
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

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
