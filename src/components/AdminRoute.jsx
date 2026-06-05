import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useProfile from "../hooks/useProfile";

export default function AdminRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (authLoading || profileLoading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
