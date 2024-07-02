import { useAuth } from "../context/AuthContext";
import AnnouncePage from "../components/AnnouncePage";

function PermissionRequired({ children, message }) {
  const { subscribed } = useAuth();

  if (!subscribed) {
    return (
      <AnnouncePage
        title="Free trial"
        announce="Subscribe now."
        describe="Subscribe now."
      />
    );
  }

  return children;
}

export default PermissionRequired;
