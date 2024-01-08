import "@blocknote/core/style.css";
import "react-datepicker/dist/react-datepicker.css";

import { useEffect, useState } from "react";
import Footer from "./Footer";

import Header from "./Header";
import PricingSection from "./Pricing";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


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
            >
              Get started
              <span>→</span>
            </motion.a>
            <motion.a
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
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


function Features() {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h3
          id="platform"
          className="text-4xl font-bold md:text-4xl md:leading-tight dark:text-white"
        >
          A data-centric platform for all
        </h3>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
        Empowering Data-Driven Decisions: Unleash the Potential of Your Data with Our Comprehensive Platform.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          className="group flex flex-col h-full border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 rounded-xl p-5 dark:border-gray-700 dark:hover:border-transparent dark:hover:shadow-black/[.4] dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="#"
        >
          <div className="aspect-w-16 aspect-h-11">
            <img
              className="w-full object-cover rounded-xl"
              src="https://images.unsplash.com/photo-1692606932040-c7788965e217?q=80&h=2360&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Image Description"
            />
          </div>
          <div className="my-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 dark:group-hover:text-white">
              Startup Founder
            </h3>
            <p className="mt-5 text-gray-600 dark:text-gray-400">
              To present compelling evidence of market demand, growth potential,
              and a clear path to profitability, making their proposition more
              attractive.
            </p>
          </div>
          <div className="mt-auto flex items-center gap-x-3">
            <img
              className="w-8 h-8 rounded-full"
              src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
              alt="Image Description"
            />
            <div>
              <h5 className="text-sm text-gray-800 dark:text-gray-200">
                By Mr. Hung, Founder & CEO BOS.
              </h5>
            </div>
          </div>
        </a>

        <a
          className="group flex flex-col h-full border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 rounded-xl p-5 dark:border-gray-700 dark:hover:border-transparent dark:hover:shadow-black/[.4] dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="#"
        >
          <div className="aspect-w-16 aspect-h-11">
            <img
              className="w-full object-cover rounded-xl"
              src="https://images.unsplash.com/photo-1692607038301-07f744323ede?q=80&h=2360&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Image Description"
            />
          </div>
          <div className="my-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 dark:group-hover:text-white">
              Angel Investor
            </h3>
            <p className="mt-5 text-gray-600 dark:text-gray-400">
              Data-centric fundraising provides transparency and evidence of
              impact, helping them trust the project or organization they're
              considering.
            </p>
          </div>
          <div className="mt-auto flex items-center gap-x-3">
            <img
              className="w-8 h-8 rounded-full"
              src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
              alt=""
            />
            <div>
              <h5 className="text-sm text-gray-800 dark:text-gray-200">
                By Mr. Don, Angel Investor
              </h5>
            </div>
          </div>
        </a>

        <a
          className="group flex flex-col h-full border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 rounded-xl p-5 dark:border-gray-700 dark:hover:border-transparent dark:hover:shadow-black/[.4] dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="#"
        >
          <div className="aspect-w-16 aspect-h-11">
            <img
              className="w-full object-cover rounded-xl"
              src="https://images.unsplash.com/photo-1692606866812-843adbc73e18?q=80&h=2360&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Image Description"
            />
          </div>
          <div className="my-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 dark:group-hover:text-white">
              Venture Capitalist
            </h3>
            <p className="mt-5 text-gray-600 dark:text-gray-400">
              Data helps them monitor the performance of their portfolio
              companies, identify trends, and make strategic decisions to
              maximize returns.
            </p>
          </div>
          <div className="mt-auto flex items-center gap-x-3">
            <img
              className="w-8 h-8 rounded-full"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
              alt=""
            />
            <div>
              <h5 className="text-sm text-gray-800 dark:text-gray-200">
                By Lauren Waller, VC
              </h5>
            </div>
          </div>
        </a>
      </div>

      <div className="mt-12 text-center"></div>
    </div>
  );
}

const Card = ({ title, description, imageUrl, buttonText, buttonLink }) => (
  <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700  hover:border-transparent hover:shadow-lg transition-all duration-300">
    <a href={buttonLink}>
      <img className="rounded-t-lg" src={imageUrl} alt={title} />
    </a>
    <div className="p-5">
      <a href={buttonLink}>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
      </a>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {description}
      </p>
      <a
        href={buttonLink}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
      >
        {buttonText}
      </a>
    </div>
  </div>
);

const ProfileCard = () => {
  return (
    <div className="max-w-[85rem] px-4 py-2 sm:px-6 lg:px-8 lg:py-2 mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14"></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="BOSGAURUS"
          description="Bosgaurus Coffee is actively involved in transforming how Vietnamese coffee is perceived worldwide. This effort reflects the broader growth of the coffee scene in Vietnam.​"
          imageUrl="https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=716&h=384&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          buttonText="Read more"
          buttonLink="#"
        />
        <Card
          title="WOW"
          description="It is a full-service agency with a mission to become a leading 360-degree agency in Vietnam. The company emphasizes the vigorous growth of its clients' businesses as central to its own development."
          imageUrl="https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=716&h=384&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          buttonText="Read more"
          buttonLink="#"
        />
        <Card
          title="MEGASOP"
          description="Megasop specializes in providing digital transformation solutions for supply chains. This includes the integration of various systems such as retail management nRMS, WMS, TMS, ERP."
          imageUrl="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=716&h=384&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          buttonText="Read more"
          buttonLink="#"
        />
      </div>
    </div>
  );
};

const Search = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-2">
        <div className="text-center">
          <h3
            id="profiles"
            className="text-3xl sm:text-5xl font-bold text-gray-800 dark:text-gray-200"
          >
            Fundraising profiles
          </h3>
          <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
            <form>
              <div className="relative z-10 flex space-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-slate-900 dark:border-gray-700 dark:shadow-gray-900/[.2]">
                <div className="flex-[1_0_0%]">
                  <label
                    htmlFor="hs-search-article-1"
                    className="block text-sm text-gray-700 font-medium dark:text-white"
                  >
                    <span className="sr-only">Search article</span>
                  </label>
                  <input
                    type="email"
                    name="hs-search-article-1"
                    id="hs-search-article-1"
                    className="py-2.5 px-4 block w-full border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-transparent dark:text-gray-400 dark:focus:ring-gray-600"
                    placeholder="Search company"
                  />
                </div>
                <div className="flex-[0_0_auto]">
                  <a
                    className="w-[46px] h-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="#"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </a>
                </div>
              </div>
            </form>
          </div>
          <div className="mt-2 sm:mt-4">
            <a
              className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              <svg
                className="flex-shrink-0 w-3 h-auto"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z" />
              </svg>
              Business
            </a>
            <a
              className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              <svg
                className="flex-shrink-0 w-3 h-auto"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z" />
              </svg>
              Technology
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroCard = () => {
  return (
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 mt-28">
      <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div className="relative ms-4 flex justify-center items-center">
          <Card
            title="BOSGAURUS"
            description="Bosgaurus Coffee is actively involved in transforming how Vietnamese coffee is perceived worldwide. This effort reflects the broader growth of the coffee scene in Vietnam."
            imageUrl="https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=716&h=384&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            buttonText="Read more"
            buttonLink="#"
          />
        </div>
        <div>
          <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">
            BOS. roasted a fruitful campaign with{" "}
            <span className="text-blue-600"> $170k raised.</span>
          </h1>
          <p className="mt-3 text-lg text-gray-800 dark:text-gray-400">
            Distinctively, Bosgaurus Coffee is one of the few specialty coffee
            stores in Ho Chi Minh City that uses Arabica beans for their
            traditional Vietnamese ca phe sua da.
          </p>
          <div className="mt-7 grid gap-3 w-full sm:inline-flex">
            <a
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              Get started
              <span>→</span>
            </a>
            <a
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              See demo
            </a>
          </div>
          <div className="mt-6 lg:mt-10 grid grid-cols-2 gap-x-5">
            <div className="py-5">
              <div className="flex space-x-1">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <p className="mt-3 text-sm text-gray-800 dark:text-gray-200">
                <span className="font-bold">4.6</span> /5 - from 12k reviews
              </p>
            </div>
            <div className="py-5">
              <div className="flex space-x-1">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <p className="mt-3 text-sm text-gray-800 dark:text-gray-200">
                <span className="font-bold">4.8</span> /5 - from 5k reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const faqData = [
    {
      question: "Can I cancel at anytime?",
      answer:
        "Yes, you can cancel anytime no questions are asked while you cancel but we would highly appreciate if you will give us some feedback.",
    },
    {
      question: "My team has credits. How do we use them?",
      answer:
        "Once your team signs up for a subscription plan. This is where we sit down, grab a cup of coffee and dial in the details.",
    },
    {
      question: "What is fundraising profile as a service?",
      answer:
        "Once your team signs up for a subscription plan. This is where we sit down, grab a cup of coffee and dial in the details.",
    },
    {
      question: "How much should I pay for the service?",
      answer:
        "Once your team signs up for a subscription plan. This is where we sit down, grab a cup of coffee and dial in the details.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="max-w-xs">
            <h2
              id="FAQ"
              className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white"
            >
              Frequently
              <br />
              asked questions
            </h2>
            <p className="mt-1 hidden md:block text-gray-600 dark:text-gray-400">
              Answers to the most frequently asked questions.
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="hs-accordion-group divide-y divide-gray-200 dark:divide-gray-700">
            {faqData.map((item, index) => (
              <div
                className={`hs-accordion pb-3 ${
                  index === activeAccordion ? "active" : ""
                }`}
                key={index}
              >
                <button
                  className="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  aria-controls={`hs-basic-with-title-and-arrow-stretched-collapse-${index}`}
                  onClick={() => toggleAccordion(index)}
                >
                  {item.question}
                  <svg
                    className={`hs-accordion-active:${
                      index === activeAccordion ? "block" : "hidden"
                    } flex-shrink-0 w-5 h-5 text-gray-600 group-hover:text-gray-500 dark:text-gray-400`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div
                  id={`hs-basic-with-title-and-arrow-stretched-collapse-${index}`}
                  className={`hs-accordion-content ${
                    index === activeAccordion ? "block" : "hidden"
                  } w-full overflow-hidden transition-[height] duration-300`}
                  aria-labelledby={`hs-basic-with-title-and-arrow-stretched-heading-${index}`}
                >
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// create a function that returns all the components

const HomePage = () => {
  const { user } = useAuth();
  // Khởi tạo trạng thái currentUser với giá trị ban đầu là null
  const [currentUser, setCurrentUser] = useState(null);

  // Sử dụng useEffect để lấy thông tin người dùng khi trang được tải
  useEffect(() => {
    // Import Supabase client và thiết lập nó

    const fetchProjects = async () => {
      try {
        console.log("user", user);

        let { data: users, error } = await supabase
          .from("users")
          .select("*")

          // Filters
          .eq("id", user.id);

        if (error) {
          console.log("error", error);
          throw error;
        }

        setCurrentUser(users[0]);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  return (
    <>
      <Header />
      <HeroSection />
      <Features />
      <Search />
      <ProfileCard />
      <HeroCard />
      <PricingSection />

      <FAQ />
      <Footer />
    </>
  );
};
export default HomePage;
