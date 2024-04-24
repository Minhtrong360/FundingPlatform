import { useAuth } from "../context/AuthContext";
import AnnouncePage from "../components/AnnouncePage";

function AdminRequired({ children, message }) {
  const { admin } = useAuth();

  if (!admin) {
    return (
      <AnnouncePage
        title="Admin Page"
        announce="Admin Page"
        describe="Only for admin"
      />
    );
  }

  return children;
}

export default AdminRequired;
