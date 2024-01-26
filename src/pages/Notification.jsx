import React from "react";

const CustomNotification = ({ title, content, onCancel, onArchive }) => {
  return (
    <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right dark:bg-gray-900 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
      <div>
        <div className="flex items-center justify-center"></div>

        <div className="mt-2 text-center">
          <h3
            className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white"
            id="modal-title"
          >
            {title}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {content}
          </p>
        </div>
      </div>

      <div className="mt-5 sm:flex sm:items-center sm:justify-center">
        <div className="sm:flex sm:items-center">
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:mt-0 sm:w-auto sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
          >
            Cancel
          </button>

          <button
            onClick={onArchive}
            className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:w-auto sm:mt-0 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomNotification;
