import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { isRecipeBookmarked, toggleBookmark } from "../services/bookmarkService";
import useProfile from "../hooks/useProfile";

export default function BookmarkButton({ recipeId }) {
  const { user } = useProfile();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    isRecipeBookmarked(recipeId, user.id)
      .then(setSaved)
      .catch(() => {});
  }, [recipeId, user]);

  async function handleClick() {
    if (!user) return;
    const prev = saved;
    setSaved(!prev);
    setLoading(true);
    try {
      const nowSaved = await toggleBookmark(recipeId, user.id);
      setSaved(nowSaved);
      toast.success(nowSaved ? "Recipe saved!" : "Removed from saved");
    } catch (err) {
      setSaved(prev);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`bookmark-btn ${saved ? "bookmark-btn--saved" : ""}`}
      onClick={handleClick}
      disabled={loading || !user}
      title={!user ? "Log in to save this recipe" : saved ? "Remove from saved" : "Save recipe"}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
