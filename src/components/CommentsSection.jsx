import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { confirmToast } from "../utils/confirmToast";
import { getComments, addComment, deleteComment } from "../services/commentService";
import useProfile from "../hooks/useProfile";
import avatarPlaceholder from "../assets/avatar-placeholder.svg";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function CommentsSection({ recipeId }) {
  const { user, profile } = useProfile();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getComments(recipeId).then(setComments).catch(() => {});
  }, [recipeId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const comment = await addComment(recipeId, user.id, text.trim());
      setComments((prev) => [...prev, comment]);
      setText("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!await confirmToast("Delete this comment?")) return;
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  }

  const isAdmin = profile?.role === "admin";

  return (
    <section className="comments-section">
      <h2 className="recipe-section-title">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {comments.length === 0 && (
        <p className="comments-empty">No comments yet. Be the first!</p>
      )}

      <div className="comments-list">
        {comments.map((c) => (
          <div key={c.id} className="comment">
            <img
              src={c.author?.avatar_url || avatarPlaceholder}
              alt={c.author?.full_name || "User"}
              className="comment-avatar"
            />
            <div className="comment-body">
              <div className="comment-header">
                <span className="comment-name">{c.author?.full_name || "Anonymous"}</span>
                <span className="comment-time">{timeAgo(c.created_at)}</span>
                {(c.user_id === user?.id || isAdmin) && (
                  <button className="comment-delete" onClick={() => handleDelete(c.id)} title="Delete">
                    ×
                  </button>
                )}
              </div>
              <p className="comment-text">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      {user ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <img
            src={profile?.avatar_url || avatarPlaceholder}
            alt="You"
            className="comment-avatar"
          />
          <div className="comment-input-row">
            <input
              type="text"
              placeholder="Add a comment…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              required
            />
            <button type="submit" disabled={submitting || !text.trim()}>
              {submitting ? "…" : "Post"}
            </button>
          </div>
        </form>
      ) : (
        <p className="comments-login-prompt">
          <Link to="/login">Log in</Link> to leave a comment.
        </p>
      )}
    </section>
  );
}
