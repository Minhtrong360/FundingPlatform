import AnnouncePage from "../components/AnnouncePage";

function PermissionRequired({ children, message, isPrivateDisabled }) {
  if (isPrivateDisabled) {
    return (
      <>
        <AnnouncePage
          title="Subscription Required"
          announce="Financial model helps you build your business plan and you need to subscribe."
          describe="This is our special feature that helps startups or new businesses build their business plans. We provide tools with AI to build your BS, IS, FS... Please upgrade your plan to experience this exciting feature"
        />
      </>
    );
  }

  return children;
}

export default PermissionRequired;
