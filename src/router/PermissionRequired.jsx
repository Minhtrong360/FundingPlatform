import { Navigate, useLocation } from "react-router-dom";

function PermissionRequired({ children, message, isPrivateDisabled }) {
  const location = useLocation();

  if (!isPrivateDisabled) {
    return (
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg darkBorderGray">
        <Navigate to="/announce" state={{ from: location }} replace />;
      </div>
    );
  }

  return children;
}

export default PermissionRequired;
