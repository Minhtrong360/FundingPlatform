import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import LoadingButtonClick from "../../../components/LoadingButtonClick";
import { message, Carousel } from "antd";
import { useMediaQuery } from "react-responsive";

const PricingCard = ({ plan, onClick }) => {
  const price_0 = [
    "Free forever",
    "01 profile (Public mode)",
    "Profile listing (Public mode)",
    "Invite collaborators",
    "Data room (Public mode)",
  ];

  const price_10 = [
    "Market Research with AI",
    "Startup Valuation with AI",
    "AI Chatbot for fundraising profile content",
    "Private Data room for Due Diligence",
    "Private listing for fundraising (up-to 05 profiles)",
  ];

  const price_30 = [
    "All features in FundFlow Growth",
    "Financial Model with AI feature",
    "Financial Model Guide chatbot",
    "Financial Analysis",
  ];

  return (
    <div className="flex flex-col border rounded-xl p-8 text-center shadow-xl group hover:scale-105 hover:border-blue-700 transition-transform duration-300 ease-in-out h-full">
      <h4 className="font-medium text-lg text-gray-800 darkTextGray">
        {plan?.name}
      </h4>
      <span className="mt-5 font-semibold text-5xl text-gray-800 darkTextGray">
        {(plan.price / 100) * 25}k VNĐ
        <span className="font-medium text-lg"> /month</span>
      </span>
      <div className="flex-grow">
        {plan.price_formatted.includes("$30") && (
          <>
            <p className="mt-2 text-sm text-gray-500">
              For building financial model and fundraising
            </p>
            <ul className="mt-7 space-y-2.5 text-sm">
              {price_30.map((feature, index) => (
                <li
                  key={index}
                  className="flex space-x-2 justify-start items-center"
                >
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray text-start">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {plan.price_formatted.includes("$10") && (
          <>
            <p className="mt-2 text-sm text-gray-500">
              For Startups, small project owners
            </p>
            <ul className="mt-7 space-y-2.5 text-sm">
              {price_10.map((feature, index) => (
                <li
                  key={index}
                  className="flex space-x-2 justify-start items-center"
                >
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray text-start">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {plan.price_formatted.includes("$0.0") && (
          <>
            <p className="mt-2 text-sm text-gray-500">Free Forever</p>
            <ul className="mt-7 space-y-2.5 text-sm">
              {price_0.map((feature, index) => (
                <li
                  key={index}
                  className="flex space-x-2 justify-start items-center"
                >
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray text-start">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <button
        onClick={onClick}
        className={`mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent text-white hover:bg-blue-700 disabled:opacity-0.5 disabled:pointer-events-none ${
          plan.price / 100 === 0 || plan.price_formatted.includes("$100")
            ? "bg-gray-400"
            : "bg-blue-600"
        } darkHoverBgBlue900 darkTextBlue darkFocusOutlineNone darkFocusRing-1 darkFocus`}
        disabled={
          plan.price / 100 === 0 || plan.price_formatted.includes("$100")
        }
      >
        {plan.price / 100 === 0 ? "Free" : "Subscribe"}
      </button>
    </div>
  );
};

const PricingWithLemon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const lemon_api_key = process.env.REACT_APP_LEMON_KEY;
  const isDesktop = useMediaQuery({ minWidth: 768 });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://api.lemonsqueezy.com/v1/products",
          {
            method: "GET",
            headers: {
              Accept: "application/vnd.api+json",
              "Content-Type": "application/vnd.api+json",
              Authorization: `Bearer ${lemon_api_key}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const sortedData = data.data.sort(
          (a, b) =>
            parseFloat(a.attributes.price) - parseFloat(b.attributes.price)
        );

        setProducts(sortedData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [lemon_api_key]);

  const makePayment = async (plan, useEmail) => {
    setIsLoading(true);
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }
      const checkoutUrl = plan.buy_now_url;
      window.location.href = checkoutUrl;
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-[85rem] mx-auto px-3 py-20 sm:px-6 lg:px-8 lg:py-14 md:mt-28">
      <LoadingButtonClick isLoading={isLoading} />
      <div className="text-center mb-10 lg:mb-14">
        <h2
          className="block text-3xl font-extrabold text-gray-800 sm:text-4xl md:text-5xl lg:text-7xl darkTextWhite"
          id="pricing"
        >
          Pricing
        </h2>
        <p className="text-gray-600 mt-4 darkTextGray">
          Whatever your status, our offers evolve according to your needs.
        </p>
      </div>
      {isDesktop ? (
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-32 lg:items-center">
          {products?.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan.attributes}
              onClick={() => {
                if (user?.email) {
                  makePayment(plan.attributes, user?.email);
                } else {
                  navigate("/login");
                }
              }}
            />
          ))}
        </div>
      ) : (
        <Carousel infinite={false} initialSlide={1}>
          {products?.map((plan, index) => (
            <div key={index} className="p-4">
              <PricingCard
                plan={plan.attributes}
                onClick={() => {
                  if (user?.email) {
                    makePayment(plan.attributes, user?.email);
                  } else {
                    navigate("/login");
                  }
                }}
              />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default PricingWithLemon;
