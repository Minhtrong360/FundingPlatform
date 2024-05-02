import { useAuth } from "../context/AuthContext";
import AnnouncePage from "../components/AnnouncePage";

function PermissionRequired({ children, message }) {
  const { subscribed } = useAuth();

  if (!subscribed) {
    return (
      <AnnouncePage
        title="Free trial"
        announce="Subscribe now."
        describe="14-day free trial available."
      />
    );
  }

  return children;
}

export default PermissionRequired;
