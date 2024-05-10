// import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const HeroSection = () => {
  const { user, subscribed } = useAuth();
  const navigate = useNavigate();

  const handlePricingClick = () => {
    // Lấy đối tượng ref của phần tử "Financial Product" từ Home component
    const financialProductRef = document.getElementById("pricing"); // Đặt ID tương ứng với ref của bạn

    if (financialProductRef) {
      // Sử dụng `scrollIntoView()` để cuộn đến phần tử "Financial Product"
      const elementRect = financialProductRef.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const offsetTop = elementRect.top - bodyRect.top;
      window.scrollTo({
        top: offsetTop - (window.innerHeight - elementRect.height) / 20,
        behavior: "smooth",
      });
    }
  };

  const handleClick = () => {
    if (!user) {
      navigate("/login");
    } else if (subscribed) {
      navigate("/financials");
    } else {
      handlePricingClick();
    }
  };

  return (
    <section className="bg-white mt-12">
      {" "}
      {/* Add margin-top */}
      <div className="container px-6 py-16 mx-auto text-center">
        <div className="max-w-3xl mx-auto">
        <h1 className="block text-3xl font-extrabold leading-relaxed text-gray-800 sm:text-4xl md:text-5xl lg:text-7xl" style={{ lineHeight: '1.5' }}>
  Build your{" "}
  <span className="text-blue-600 bg-yellow-300 h-6">
    Financial Planning & Analysis
  </span>{" "}
  under 5' with AI.
</h1>
          <p className="mt-6 text-lg text-gray-800">
            Craft an effective fundraising profile and compelling financial
            model on an AI-powered platform.
          </p>
          <div className="mt-7 flex justify-center">
            {" "}
            {/* Add justify-center class */}
            <button
              className="hover:cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleClick}
            >
              {user
                ? subscribed
                  ? "Financial Model"
                  : "14-day free trial"
                : "Get started"}
            </button>
            {/* Add spacing for small screens */}
            {/* <a
              className="hover:cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() =>
                navigate(`/founder/${"3ec3f142-f33c-4977-befd-30d4ce2b764d"}`)
              }
            >
              See demo
            </a> */}
          </div>
        </div>

        <div className="flex justify-center items-center w-full mt-8 rounded-xl">
        <div
               className="relative w-full md:w-2/3 lg:w-2/3"
              style={{ paddingTop: "41%" }}
            >
              <iframe
                title="YouTube video player"
                className="absolute top-0 left-0 right-0 w-full h-full"
                src="https://www.youtube.com/embed/MOgNese4KUQ?si=NmaKwUNT-No0OgUs&amp;controls=0&autoplay=1&mute=1&loop=1&playlist=MOgNese4KUQ"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
