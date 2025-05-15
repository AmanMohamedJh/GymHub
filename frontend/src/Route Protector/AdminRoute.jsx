import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
