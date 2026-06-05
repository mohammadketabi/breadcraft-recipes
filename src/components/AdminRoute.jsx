import { Navigate } from "react-router-dom";
import useProfile from "../hooks/useProfile";

export default function AdminRoute({ children }) {
  const { profile, loading } = useProfile();

  if (loading) return <p>Loading...</p>;

  if (profile?.role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
