import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { message as messageAntd } from "antd";

function AuthRequire({ children, message }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    messageAntd.warning(message);
    return (
      <>
        <Navigate to="/login" state={{ from: location }} replace />;
      </>
    );
  }

  return children;
}

export default AuthRequire;
