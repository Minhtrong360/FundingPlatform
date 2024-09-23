import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Carousel, message } from "antd";
import LoadingButtonClick from "../../../components/LoadingButtonClick";

const PricingCard = ({ plan, onClick }) => {
  const price_0 = [
    "Free forever",
    "01 profile (Public mode)",
    "Profile listing (Public mode)",
    "Invite collaborators",
    "Data room (Public mode)",
  ];

  const price_10 = [
    // "Market Research with AI",
    // "Startup Valuation with AI",
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

  const getFeatures = () => {
    if (plan.price_formatted.includes("$30")) {
      return price_30;
    }
    if (plan.price_formatted.includes("$10")) {
      return price_10;
    }
    if (plan.price_formatted.includes("$0.0")) {
      return price_0;
    }
    return [];
  };

  const getDescription = () => {
    if (plan.price_formatted.includes("$30")) {
      return "For building financial model and fundraising";
    }
    if (plan.price_formatted.includes("$10")) {
      return "For Startups, small project owners";
    }
    if (plan.price_formatted.includes("$0.0")) {
      return "Free Forever";
    }
    return "";
  };

  return (
    <div className="zubuz-pricing-wrap flex flex-col justify-between h-full">
      <div>
        <div className="zubuz-pricing-header">
          <h5>{plan?.name}</h5>
        </div>

        <div className="zubuz-pricing-price">
          <h2>$</h2>
          <div className="zubuz-price dynamic-value">{plan.price / 100}</div>
          <p className="dynamic-value">/month</p>
        </div>

        <div className="zubuz-pricing-description">
          <p>{getDescription()}</p>
        </div>
        <div className="zubuz-pricing-body">
          <ul>
            {getFeatures().map((feature, index) => (
              <li key={index}>
                <img src="/images/v3/check.png" alt="" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onClick}
        className="zubuz-pricing-btn"
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
    <div className="section zubuz-section-padding3 bg-light position-relative">
      <div className="container">
        <LoadingButtonClick isLoading={isLoading} />
        <div className="zubuz-section-title center">
          <h2>Rational planning for learners</h2>
          <p className="text-gray-600 mt-4 darkTextGray">
            Whatever your status, our offers evolve according to your needs.
          </p>
        </div>
        {isDesktop ? (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            id="table-price-value"
            data-pricing-dynamic
            data-value-active="monthly"
          >
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
    </div>
  );
};

export default PricingWithLemon;
