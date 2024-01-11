import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthRequire({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default AuthRequire;