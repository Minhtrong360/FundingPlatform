import { useAuth } from "../context/AuthContext";
import AnnouncePage from "../components/AnnouncePage";

function PermissionRequired({ children, message }) {
  const { subscribed } = useAuth();

  if (!subscribed) {
    return (
      <AnnouncePage
        title="Upgrade to FunFlow Premium"
        announce="Access Financial Model with AI"
        describe="Upgrade to the FunFlow Premium plan to unlock the Financial Model with AI feature and enhance your financial analysis capabilities."
      />
    );
  }

  return children;
}

export default PermissionRequired;
