import { useNavigate } from "react-router-dom";
import Card from "./Card";
import videoSrc from "../Components/UpscaleVideo.mp4";
import video2 from "../Components/fm_demo03.mp4";
import video3 from "../Components/fm_demo04.mp4";

import { useAuth } from "../../../context/AuthContext";

const HeroCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/financials");
    }
  };

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

  return (
    <>
      <div className="max-w-[85rem]  mx-auto px-4 sm:px-6 lg:px-8 sm:mt-24">
        {/* Grid */}
        <div className="grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12 lg:items-center mt16 md:mt-64">
          <div className="lg:col-span-3">
            <h1 className="block text-3xl font-extrabold leading-relaxed text-gray-800 sm:text-4xl md:text-5xl lg:text-7xl">
              It can't be{" "}
              <span className="text-blue-600 bg-yellow-300 h-6">
                easier & faster
              </span>{" "}
              than this.
            </h1>
            <p className="mt-3 text-lg text-gray-800">
              All you need is a single prompt to obtain the financial model of a
              business model. All financial figures will be calculated and
              displayed instantly.
            </p>
            <div className="mt-5 lg:mt-8 flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
              {/* Removed email input field */}
              <button
                onClick={handlePricingClick}
                className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                14-day free trial
              </button>
            </div>
            {/* Brands */}
          </div>

          {/* Video */}
          <div className="lg:col-span-4 mt-10 order-2 lg:order-1">
            <div className="flex justify-center items-center w-full   mt-8 rounded-xl">
              <div
                className="relative w-full md:w-4/5 overflow-hidden shadow-2xl rounded-xl border border-gray-300"
                style={{ paddingTop: "56.25%" }}
              >
                <p>
                  <iframe
                    title="YouTube video player"
                    className="absolute top-0 left-0 right-0 w-full h-full shadow-2xl border border-gray-300 rounded-xl"
                    src="https://www.youtube.com/embed/bSZRgmHuZAY?si=-Bq1EI6BpePgDtz7&amp;controls=0&autoplay=1&mute=1&loop=1&playlist=bSZRgmHuZAY"
                    width="100%"
                    height="100%"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second card */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-24">
        {/* Grid */}
        <div className="grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12 lg:items-center mt-16 md:mt-64">
          {/* Video */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="flex justify-center items-center w-full   mt-8 rounded-xl">
              <div
                className="relative w-full md:w-4/5 overflow-hidden shadow-2xl rounded-xl border border-gray-300"
                style={{ paddingTop: "56.25%" }}
              >
                <p>
                  <iframe
                    title="YouTube video player"
                    className="absolute top-0 left-0 right-0 w-full h-full shadow-2xl border border-gray-300 rounded-xl"
                    src="https://www.youtube.com/embed/DYk03iWpfpM?si=98bILLnafaMlVosF&amp;controls=0&autoplay=1&mute=1&loop=1&playlist=DYk03iWpfpM"
                    width="100%"
                    height="100%"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 order-1 lg:order-2  sm:mt-0">
            <h1 className="block text-3xl font-extrabold text-gray-800 sm:text-4xl md:text-5xl lg:text-7xl">
              Insightful{" "}
              <span className="text-blue-600 bg-yellow-300 h-6">
                charts, ratios
              </span>{" "}
              are ready.
            </h1>
            <p className="mt-3 text-lg text-gray-800">
              We know you love insightful charts and metrics for tracking and
              pitching your project. That's why we've done it for you, so you
              don't have to.
            </p>
            <div className="my-8  flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
              {/* Removed email input field */}
              <button
                onClick={handlePricingClick}
                className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items  -center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                14-day free trial
              </button>
            </div>
            {/* Brands */}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroCard;
