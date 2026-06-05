import toast from "react-hot-toast";

export function confirmToast(message) {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="confirm-toast">
          <p className="confirm-toast-msg">{message}</p>
          <div className="confirm-toast-actions">
            <button
              className="confirm-toast-btn confirm-toast-btn--danger"
              onClick={() => { toast.dismiss(t.id); resolve(true); }}
            >
              Delete
            </button>
            <button
              className="confirm-toast-btn confirm-toast-btn--cancel"
              onClick={() => { toast.dismiss(t.id); resolve(false); }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" }
    );
  });
}
