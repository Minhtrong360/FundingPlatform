import React from "react";
import { useNavigate } from "react-router-dom";



const AnnouncePage = ({ title, announce, describe, highlightedWord }) => {
  const navigate = useNavigate();
  const [firstPart, middlePart, lastPart] = announce.split(highlightedWord);

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container flex items-center min-h-screen px-4 sm:px-6 py-12 mx-auto">
        <div className="w-full">
          <p className="text-3xl sm:text-5xl font-medium text-blue-600 dark:text-blue-400">
            {title}
          </p>
          <h1 className="mt-3 text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
            {firstPart}
            <span className="text-blue-600">{highlightedWord}</span>
            {lastPart}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            {describe}
          </p>

          <div className="flex flex-col sm:flex-row items-center mt-6 gap-x-3 gap-y-2">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 dark:bg-blue-600"
            >
              Homepage
            </button>
          </div>
        </div>
     
      </div>
    </section>
  );
};

export default AnnouncePage;
