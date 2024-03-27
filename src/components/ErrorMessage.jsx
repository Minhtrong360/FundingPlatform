import React from "react";
import Modal from "react-modal";

function ErrorMessage({ isModalOpen, closeModal, message, onCancel }) {
  return (
    <Modal
      ariaHideApp={false}
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      style={{
        overlay: {
          backgroundColor: "none", // Để ẩn background overlay
        },
        content: {
          border: "none", // Để ẩn border của nội dung Modal
          background: "none", // Để ẩn background của nội dung Modal

          margin: "auto", // Để căn giữa
        },
      }}
    >
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        ></span>

        <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right darkBg sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div>
            <div className="flex items-center justify-center">
              {/* You can add any error-related content here */}
            </div>

            <div className="mt-2 text-center">
              <h3
                className="text-lg font-medium leading-6 text-gray-800 capitalize darkTextWhite"
                id="modal-title"
              >
                Some thing is wrong!
              </h3>
              <p className="mt-2 text-md text-red-500 darkTextGray">
                {message}{" "}
              </p>
            </div>
          </div>

          <div className="mt-5 sm:flex sm:items-center sm:justify-center">
            <button
              onClick={onCancel}
              className="w-full px-3 py-2 mt-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:mt-0 sm:w-auto sm:mx-2 darkTextGray -gray-700 darkHoverBgBlue hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
            >
              Cancel
            </button>
            {/* You can add additional error-related buttons or content here */}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ErrorMessage;
