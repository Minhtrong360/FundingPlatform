import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AlertMsg from "../components/AlertMsg";
import { toast } from "react-toastify";

function AuthRequire({ children, message }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    toast.error(message);
    return (
      <>
        <AlertMsg />
        <Navigate to="/login" state={{ from: location }} replace />;
      </>
    );
  }

  return children;
}

export default AuthRequire;
