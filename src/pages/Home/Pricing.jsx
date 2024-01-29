import { useAuth } from "../../context/AuthContext";
import apiService from "../../app/apiService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SpinnerBtn from "../../components/SpinnerBtn";

import AlertMsg from "../../components/AlertMsg";
import { toast } from "react-toastify";
import { stripeAPI } from "../../stripe/stripeAPI";
import Modal from "react-modal";
import Spinner from "../../components/Spinner";
import LoadingButtonClick from "../../components/LoadingButtonClick";

const PricingCard = ({ plan, onClick }) => {
  // const { user } = useAuth();
  // const navigate = useNavigate();
  return (
    <>
      <div
        className={` flex flex-col border rounded-xl p-8 text-center shadow-xl   group hover:scale-105  hover:border-blue-700 transition-transform duration-300 ease-in-out`}
      >
        <h4 className="font-medium text-lg text-gray-800 dark:text-gray-200">
          {plan?.name}
        </h4>
        <span className="mt-5 font-semibold text-5xl text-gray-800 dark:text-gray-200">
          ${plan.price?.unit_amount / 100}
          <br />
          <span className="font-medium text-3xl">
            /{plan.price?.recurring?.interval}
          </span>
        </span>
        <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
        <ul className="mt-7 space-y-2.5 text-sm">
          {plan.features?.map((feature, index) => (
            <li
              key={index}
              className="flex space-x-2 justify-start items-center"
            >
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
        {/* <div
          className={`flex flex-col border rounded-xl text-center shadow-xl group hover:scale-105 hover:border-blue-700 transition-transform duration-300 ease-in-out ${
            isLoading ? "p-8" : "px-4 py-2"
          }`}
        >
          {user ? ( // Kiểm tra xem user có tồn tại không
            <stripe-buy-button
              buy-button-id={plan?.metadata.buttonId}
              publishable-key={process.env.REACT_APP_PUBLISHABLE_KEY}
              customer-email={user ? user.email : ""}
            ></stripe-buy-button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 dark:bg-blue-600"
            >
              Login required
            </button>
          )}
        </div> */}
        <button
          onClick={onClick}
          className="mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-700900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          disabled={plan.price?.unit_amount / 100 === 0 ? true : false}
        >
          {plan.price?.unit_amount / 100 === 0 ? "Free" : "Subscribe"}
        </button>
      </div>
    </>
  );
};

const PricingSection = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [pricingPlans, setPricingPlans] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPricing = async () => {
      setIsLoading(true);

      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          toast.error("No internet access.");
          return;
        }
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
    setIsLoading(true);
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        toast.error("No internet access.");
        return;
      }
      // Khi xử lý form submit
      const customer = await stripeAPI.customers.create({
        email: user.email, // Địa chỉ email của khách hàng
      });

      const checkoutSessionResponse = await apiService.post(
        "stripe/create-checkout-session",
        { customerId: customer.id, plan, userId }
      );

      const session = checkoutSessionResponse.data.data.session;

      const userEmail = encodeURIComponent(user.email); // Encode email để đảm bảo nó an toàn trong URL
      const updatedURL = `${session.url}?prefilled_email=${userEmail}`;

      window.open(updatedURL, "_blank");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-[85rem] mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mt-28">
      <AlertMsg />
      <LoadingButtonClick isLoading={isLoading} />
      <div className="text-center mb-10 lg:mb-14">
        <h2
          className="text-2xl font-semibold md:text-4xl md:leading-tight dark:text-white  hover:cursor-pointer"
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
