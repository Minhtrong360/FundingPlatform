import { useAuth } from "../../context/AuthContext";
import apiService from "../../app/apiService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import SpinnerBtn from "../../components/SpinnerBtn";
import AlertMsg from "../../components/AlertMsg";
import { toast } from "react-toastify";

const PricingCard = ({ plan, onClick, isLoading }) => {
  return (
    <div
      className={` flex flex-col border rounded-xl p-8 text-center shadow-xl   group hover:scale-105  hover:border-blue-700 transition-transform duration-300 ease-in-out`}
    >
      <h4 className="font-medium text-lg text-gray-800 dark:text-gray-200">
        {plan?.name}
      </h4>
      <span className="mt-5 font-bold text-5xl text-gray-800 dark:text-gray-200">
        ${plan.price?.unit_amount / 100}
      </span>
      <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
      <ul className="mt-7 space-y-2.5 text-sm">
        {plan.features?.map((feature, index) => (
          <li key={index} className="flex space-x-2 justify-start items-center">
            {/* SVG Check Icon */}
            <svg
              className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-500"
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
            <span className="text-gray-800 dark:text-gray-400">
              {feature.name}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={onClick}
        className="mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        {isLoading ? <SpinnerBtn /> : "Sign up"}
      </button>
    </div>
  );
};

const PricingSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [pricingPlans, setPricingPlans] = useState([]);

  useEffect(() => {
    const fetchPricing = async () => {
      setIsLoading(true);

      try {
        const response = await apiService.get("stripe");
        const pricingData = response.data.data.products;

        pricingData.sort((a, b) => a.price.unit_amount - b.price.unit_amount);

        setPricingPlans(pricingData);
      } catch (error) {
        toast.error(error.message);
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricing();
  }, []);

  const makePayment = async (plan, userId) => {
    const stripe = await loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);
    try {
      // Khi xử lý form submit

      const checkoutSessionResponse = await apiService.post(
        "stripe/create-checkout-session",
        {
          plan,
          userId,
        }
      );

      const session = checkoutSessionResponse.data.data;

      console.log("session", session);
      window.location.href = session.url;
      // const result = await stripe.redirectToCheckout({
      //   sessionId: session.id,
      // });

      // if (result.error) {
      //   throw result.error;
      // }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  console.log("pricing", pricingPlans);

  return (
    <div className="max-w-[85rem] mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mt-28">
      <AlertMsg />
      <div className="text-center mb-10 lg:mb-14">
        <h2
          className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white  hover:cursor-pointer"
          id="pricing"
        >
          Pricing
        </h2>
        <p className="text-gray-600 mt-1 dark:text-gray-400">
          Whatever your status, our offers evolve according to your needs.
        </p>
      </div>
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-32 lg:items-center">
        {pricingPlans?.map((plan, index) => (
          <PricingCard
            isLoading={isLoading}
            key={index}
            plan={plan}
            onClick={() => {
              if (user?.id) {
                makePayment(plan, user?.id);
              } else {
                navigate("/login"); // Navigate to "/login" if user.id doesn't exist
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingSection;
