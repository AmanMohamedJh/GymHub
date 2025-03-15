import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, isLoading } = useAuthContext();

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  if (!user) {
    // Only redirect to login if we're sure there's no user
    return <Navigate to="/login" />;
  }

  // Handle both single role string and array of roles
  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
