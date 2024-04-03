// import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import img from "../Components/UpscaleVideo.mp4";

const HeroSection = () => {
  const { user, subscribed } = useAuth();
  const navigate = useNavigate();

  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: { opacity: 1, transition: { duration: 1 } },
  // };

  // const textVariants = {
  //   hidden: { x: -50, opacity: 0 },
  //   visible: { x: 0, opacity: 0.9, transition: { delay: 0.5, duration: 1 } },
  // };

  // const buttonVariants = {
  //   hidden: { scale: 0 },
  //   visible: { scale: 1, transition: { delay: 1, duration: 0.5 } },
  // };

  // const textAnimation = {
  //   hidden: { opacity: 0, y: 50 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: { delay: 1, duration: 1.5, ease: "easeOut" },
  //   },
  // };

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

  // return (
  //   <motion.div
  //     className="max-w-[85rem] mx-auto mt-32 px-4 sm:px-6 lg:px-8 z-0"
  //     initial="hidden"
  //     animate="visible"
  //     variants={containerVariants}
  //   >
  //     <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
  //       <motion.div variants={textVariants}>
  //         <motion.h1
  //           className="block text-3xl font-semibold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight darkTextWhite"
  //           variants={textAnimation}
  //         >
  //           Building exceptional{" "}
  //           <motion.span
  //             className="text-blue-600"
  //             variants={textAnimation}
  //             animate="visible"
  //           >
  //             Fundraising profile
  //           </motion.span>{" "}
  //           and{" "}
  //           <motion.span
  //             className="text-blue-600"
  //             variants={textAnimation}
  //             animate="visible"
  //           >
  //             Financial model
  //           </motion.span>{" "}
  //           with{" "}
  //           <motion.span variants={textAnimation} animate="visible">
  //             AI
  //           </motion.span>
  //         </motion.h1>
  //         <p className="mt-3 text-lg text-gray-800 darkTextGray">
  //           We're here to provide you with the insights, strategies, and tools
  //           you need to craft an effective fundraising profile and compelling
  //           financial model on an AI-powered platform.
  //         </p>
  //         <div className="mt-7 grid gap-3 w-full sm:inline-flex">
  //           <motion.a
  //             className="hover:cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
  //             variants={containerVariants}
  //             onClick={handleClick}
  //           >
  //             {user ? "Financial Model" : "Get started"}
  //             <span>→</span>
  //           </motion.a>
  //           <motion.a
  //             className="hover:cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none darkBgBlue darkBorderGray darkTextWhite darkHoverBgBlue darkFocusOutlineNone darkFocusRing-1 darkFocus"
  //             onClick={() =>
  //               navigate(`/founder/${"3ec3f142-f33c-4977-befd-30d4ce2b764d"}`)
  //             }
  //             variants={containerVariants}
  //           >
  //             See demo
  //           </motion.a>
  //         </div>
  //       </motion.div>

  //       <motion.div className="relative ms-4" variants={textVariants}>
  //         <video
  //           className="w-full rounded-md"
  //           autoPlay
  //           loop
  //           muted
  //           playsInline
  //           src={img}
  //           alt="Description"
  //         />
  //         {/* <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 w-full h-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 darkFromSlate"></div> */}
  //       </motion.div>
  //     </div>
  //   </motion.div>
  // );

  return (
    <section className="bg-white mt-12">
      {" "}
      {/* Add margin-top */}
      <div className="container px-6 py-16 mx-auto text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="block text-3xl font-extrabold leading-relaxed text-gray-800 sm:text-4xl md:text-5xl lg:text-7xl">
            Build your{" "}
            <span className="text-blue-600 bg-yellow-300 h-6">
              Financial Model
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
              className="hover:cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() =>
                navigate(`/founder/${"3ec3f142-f33c-4977-befd-30d4ce2b764d"}`)
              }
            >
              See demo
            </a> */}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          {/* <video
            className="object-cover w-full md:w-4/5 rounded-xl shadow-2xl border border-gray-300"
            autoPlay
            loop
            muted
            playsInline
            src="https://www.youtube.com/embed/huFpQcuRHEw?si=nskABHXF2dDxbyix&amp;controls=0" 
            alt="Description"
          /> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
