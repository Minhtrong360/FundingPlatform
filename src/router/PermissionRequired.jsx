import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PermissionRequired({ children, message }) {
  const { subscribed } = useAuth();
  const location = useLocation();

  if (!subscribed) {
    return (
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-md darkBorderGray">
        <Navigate to="/announce" state={{ from: location }} replace />;
      </div>
    );
  }

  return children;
}

export default PermissionRequired;
