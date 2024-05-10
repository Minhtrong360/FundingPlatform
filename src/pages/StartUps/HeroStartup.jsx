// import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
      <div className="container sm:px-6 px-0 py-16 mx-auto text-center">
        <div className="max-w-3xl mx-auto">
        <h1 className="block text-3xl font-extrabold leading-relaxed text-gray-800 sm:text-4xl md:text-5xl lg:text-7xl" style={{ lineHeight: '1.5' }}>
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
          </div>
        </div>

        <div className="flex justify-center items-center w-full mt-8 rounded-xl">
            <div
              className="relative w-full md:w-2/3 lg:w-2/3"
              style={{ paddingTop: "41%" }}
            >
              <p>
                <iframe
                  title="YouTube video player"
                  className="absolute top-0 left-0 right-0 w-full h-full"
                  src="https://www.youtube.com/embed/OTuhZIlpDZg?si=HFGd7RDtQJEH0dCp&amp;controls=0&autoplay=1&mute=1&loop=1&playlist=OTuhZIlpDZg"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </p>
            </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroStartup;
