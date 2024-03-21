import { useNavigate } from "react-router-dom";
import Card from "./Card";

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
  return (
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 mt-28">
      <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div className="relative  flex justify-center items-center">
          <Card
            title="BOSGAURUS"
            description="Bosgaurus Coffee is actively involved in transforming how Vietnamese coffee is perceived worldwide. This effort reflects the broader growth of the coffee scene in Vietnam."
            imageUrl="https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=716&h=384&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            buttonText="Read more"
            buttonLink="#"
          />
        </div>
        <div>
          <h1 className="block text-3xl font-semibold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight darkTextWhite">
            BOS. roasted a fruitful campaign with{" "}
            <span className="text-blue-600"> $170K raised.</span>
          </h1>
          <p className="mt-3 text-lg text-gray-800 darkTextGray">
            Distinctively, Bosgaurus Coffee is one of the few specialty coffee
            stores in Ho Chi Minh City that uses Arabica beans for their
            traditional Vietnamese ca phe sua da.
          </p>
          <div className="mt-7 grid gap-3 w-full sm:inline-flex">
            <button
              className=" py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
              onClick={handleClick}
            >
              {user ? "Financial Model" : "Get started"}
              <span>→</span>
            </button>
            <button
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none darkBgBlue darkBorderGray darkTextWhite darkHoverBgBlue darkFocusOutlineNone darkFocusRing-1 darkFocus"
              onClick={() =>
                navigate(`/founder/${"3ec3f142-f33c-4977-befd-30d4ce2b764d"}`)
              }
            >
              See demo
            </button>
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
              <p className="mt-3 text-sm text-gray-800 darkTextGray">
                <span className="font-semibold">4.6</span> /5 - from 12k reviews
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
              <p className="mt-3 text-sm text-gray-800 darkTextGray">
                <span className="font-semibold">4.8</span> /5 - from 5k reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
