import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-white darkBg">
      <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
        <div>
          <p className="text-5xl font-medium text-blue-500 darkTextBlue">
            404 error
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800 darkTextWhite md:text-3xl">
            We can’t find that page
          </h1>
          <p className="mt-4 text-gray-500 darkTextGray">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>

          <div className="flex items-center mt-6 gap-x-3">
            <button
              onClick={() => navigate("/")}
              className="w-1/2 px-4 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-600 rounded-md shrink-0 sm:w-auto hover:bg-blue-700 darkHoverBgBlue darkBgBlue"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
