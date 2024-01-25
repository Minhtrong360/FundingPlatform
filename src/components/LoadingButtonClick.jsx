import React, { useEffect } from "react";
import Modal from "react-modal";
import Spinner from "./Spinner";

function LoadingButtonClick({ isLoading }) {
  return (
    <>
      <Modal
        isOpen={isLoading}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
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
