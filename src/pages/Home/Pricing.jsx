import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../../context/AuthContext";
import apiService from "../../app/apiService";

const pricingPlans = [
  {
    title: "Free",
    price: 0,
    description: "Free forever",
    features: ["1 user", "Demo profile", "Editable template"],
    isPopular: false,
  },
  {
    title: "Semi-Pro",
    price: 0.5,
    description: "Good for a new business",
    features: ["1 users", "Profile sharing", "Profile analytics"],
    isPopular: false,
  },
  {
    title: "Pro",
    price: 42,
    description: "Good for a new business",
    features: ["1 users", "Profile sharing", "Profile analytics"],
    isPopular: false,
  },
];

const PricingCard = ({
  title,
  price,
  description,
  features,
  isPopular,
  onClick,
}) => (
  <div
    className={` flex flex-col border rounded-xl p-8 text-center shadow-xl ${
      isPopular ? "border-2 border-blue-600" : "border-gray-200"
    } ${
      isPopular ? "dark:border-blue-700" : "dark:border-gray-700"
    } group hover:scale-105  hover:border-blue-700 transition-transform duration-300 ease-in-out`}
  >
    {isPopular && (
      <p className="mb-3">
        <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs uppercase font-semibold bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white">
          Most popular
        </span>
      </p>
    )}
    <h4 className="font-medium text-lg text-gray-800 dark:text-gray-200">
      {title}
    </h4>
    <span className="mt-5 font-bold text-5xl text-gray-800 dark:text-gray-200">
      ${price}
    </span>
    <p className="mt-2 text-sm text-gray-500">{description}</p>
    <ul className="mt-7 space-y-2.5 text-sm">
      {features?.map((feature, index) => (
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
          <span className="text-gray-800 dark:text-gray-400">{feature}</span>
        </li>
      ))}
    </ul>
    <button
      onClick={onClick}
      className="mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
    >
      Sign up
    </button>
  </div>
);

const makePayment = async (plan, userId) => {
  const stripe = await loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);
  console.log("apiService", apiService);
  const response = await apiService.post("stripe/create-checkout-session", {
    plan,
    userId,
  });
  console.log("response", response);

  const session = await response.data.data;

  const result = stripe.redirectToCheckout({
    sessionId: session.id,
  });

  if (result.error) {
    console.log(result.error);
  }
};

const PricingSection = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-[85rem] mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mt-28">
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
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:items-center">
        {pricingPlans.map((plan, index) => (
          <PricingCard
            key={index}
            {...plan}
            onClick={() => makePayment(plan, user.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingSection;
