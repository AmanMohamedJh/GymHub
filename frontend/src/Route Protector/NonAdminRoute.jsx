import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const NonAdminRoute = ({ children }) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is admin, redirect to admin dashboard
  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export default NonAdminRoute;
