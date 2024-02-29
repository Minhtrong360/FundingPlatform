import React from "react";
import AnnouncePage from "../../components/AnnouncePage";

function Confirmed() {
  const button = true;
  return (
    <AnnouncePage
      title="Congratulations!"
      announce="You have confirmed your email."
      describe="Confirmed email successfully. Thank you so much. Let start your journey together"
      highlightedWord="BeeKrowd"
      button={button}
    />
  );
}

export default Confirmed;
