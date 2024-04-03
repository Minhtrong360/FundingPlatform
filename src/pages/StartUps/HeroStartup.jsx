// import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import img from "./Cprofile.mp4";
import { useAuth } from "../../context/AuthContext";

const HeroStartup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/founder/${"3ec3f142-f33c-4977-befd-30d4ce2b764d"}`);
    }
  };

  const handleClickProfile = () => {
    navigate(`/founder`);
  };

  return (
    <section className="bg-white mt-12">
      {" "}
      {/* Add margin-top */}
      <div className="container px-6 py-16 mx-auto text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="block text-3xl font-extrabold leading-relaxed text-gray-800 sm:text-4xl md:text-5xl lg:text-7xl">
            <span className="text-blue-600 bg-yellow-300 h-6">
              Profile listing
            </span>{" "}
            for raising fund made easy.
          </h1>
          <p className="mt-6 text-lg text-gray-800">
            Create a fundraising profile and get discovered by investors. It
            will be easy, fast and well-structured.
          </p>
          <div className="mt-7 flex justify-center">
            {" "}
            {/* Add justify-center class */}
            <button
              className="sm:mx-4 mx-2 hover:cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleClick}
            >
              {user ? "See demo" : "Get started"}
            </button>
            {user && (
              <button
                className="sm:mx-4 mx-2 hover:cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                onClick={handleClickProfile}
              >
                Create profile
              </button>
            )}
            {/* Add spacing for small screens */}
            {/* <a
              className="hover:cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() =>
                navigate(`/founder/${"3ec3f142-f33c-4977-befd-30d4ce2b764d"}`)
              }
            >
              See demo
            </a> */}
          </div>
        </div>

        {/* <div className="flex justify-center mt-10">
          <video
            className="object-cover w-full md:w-4/5 rounded-xl shadow-2xl border border-gray-300"
            autoPlay
            loop
            muted
            playsInline
            src={img}
            alt="Description"
          />
        </div> */}
      </div>
    </section>
  );
};

export default HeroStartup;
