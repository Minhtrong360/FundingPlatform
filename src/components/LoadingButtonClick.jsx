import React from "react";
import Modal from "react-modal";
import Spinner from "./Spinner";

function LoadingButtonClick({ isLoading }) {
  return (
    <>
      <Modal
        zIndex={42424244}
        ariaHideApp={false}
        isOpen={isLoading}
        style={{
          overlay: {
            backgroundColor: "white",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 42424244,
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
