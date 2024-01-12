import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const textVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { delay: 0.5, duration: 1 } },
  };

  const buttonVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { delay: 1, duration: 0.5 } },
  };

  const textAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 1, duration: 1.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="max-w-[85rem] mx-auto mt-24 px-4 sm:px-6 lg:px-8 z-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <motion.div variants={textVariants}>
          <motion.h1
            className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white"
            variants={textAnimation}
          >
            Building exceptional{" "}
            <motion.span
              className="text-blue-600"
              variants={textAnimation}
              animate="visible"
            >
              Fundraising profile
            </motion.span>{" "}
            with{" "}
            <motion.span
              className="text-blue-600"
              variants={textAnimation}
              animate="visible"
            >
              BeeKrowd
            </motion.span>
          </motion.h1>
          <p className="mt-3 text-lg text-gray-800 dark:text-gray-400">
            We're here to provide you with the insights, strategies, and tools
            you need to craft a compelling and effective fundraising profile.
          </p>
          <div className="mt-7 grid gap-3 w-full sm:inline-flex">
            <motion.a
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
              variants={buttonVariants}
              onClick={() => navigate(`/login`)}
            >
              Get started
              <span>→</span>
            </motion.a>
            <motion.a
              className="hover:cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              onClick={() =>
                navigate(`/founder/${"eecb5b9d-75eb-48a6-8c77-f3325a53db5b"}`)
              }
              variants={buttonVariants}
            >
              See demo
            </motion.a>
          </div>
        </motion.div>

        <motion.div className="relative ms-4" variants={textVariants}>
          <img
            className="w-full rounded-md"
            src="https://images.unsplash.com/photo-1633671475485-754e12f39817?q=80&w=700&h=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Image Description"
          />
          <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 w-full h-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 dark:from-slate-800 dark:via-slate-900/0 dark:to-slate-900/0"></div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
