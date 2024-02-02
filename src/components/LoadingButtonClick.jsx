import React, { useEffect } from "react";
import Modal from "react-modal";
import Spinner from "./Spinner";

function LoadingButtonClick({ isLoading }) {
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isLoading]);
  return (
    <>
      <Modal
        ariaHideApp={false}
        isOpen={isLoading}
        style={{
          overlay: {
            backgroundColor: "none",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          },
          content: {
            border: "none",
            background: "none",
            margin: "auto",
          },
        }}
      >
        <Spinner isLoading={isLoading} />
      </Modal>
    </>
  );
}

export default LoadingButtonClick;
