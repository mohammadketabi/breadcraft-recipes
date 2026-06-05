import { useEffect, useState } from "react";
import { getRecipeLikes, toggleLike } from "../services/likeService";
import useProfile from "../hooks/useProfile";

export default function LikeButton({ recipeId }) {
  const { user } = useProfile();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRecipeLikes(recipeId).then(setLikes).catch(() => {});
  }, [recipeId]);

  const liked = user ? likes.some((l) => l.user_id === user.id) : false;
  const count = likes.length;

  async function handleClick() {
    if (!user) return;
    setLoading(true);
    try {
      const nowLiked = await toggleLike(recipeId, user.id);
      setLikes((prev) =>
        nowLiked
          ? [...prev, { user_id: user.id }]
          : prev.filter((l) => l.user_id !== user.id)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`like-btn ${liked ? "like-btn--liked" : ""}`}
      onClick={handleClick}
      disabled={loading || !user}
      title={!user ? "Log in to like this recipe" : liked ? "Unlike" : "Like"}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{count > 0 ? count : ""}</span>
    </button>
  );
}
