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
  console.log("isLoading", isLoading);
  return (
    <>
      <Modal
        isOpen={isLoading}
        contentLabel="YouTube Link Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
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
        <Spinner />
      </Modal>
    </>
  );
}

export default LoadingButtonClick;
