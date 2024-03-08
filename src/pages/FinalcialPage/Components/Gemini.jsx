import React, { useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../../../supabase";
import apiService from "../../../app/apiService";

const industries = [
  "Coffee shop ☕",
  "Pizza restaurant 🍕",
  "HR SaaS 💼🖥️",
  "Lending fintech 💸🏦",
  "Food delivery platform 🚚🍲",
  "Ride-sharing service 🚗👥",
  "E-commerce platform 🛒🌐",
  "Subscription box service 📦🎁",
  "Social media management tool 📱💡",
  "Online tutoring platform 🖥️📚",
  "Health and wellness app 💪🍏",
  "Home cleaning service 🏠🧹",
  "Co-working space 🏢👩‍💻",
  "Meal kit delivery service 📦🥗",
  "Pet care app 🐶📱",
  "Fashion rental platform 👗🔄",
  "Online marketplace 🤲🛍️",
  "Personal finance management tool 💰📊",
  "Virtual event platform 🖥️🎤",
  "Language learning app 📚🌍",
  "Electric scooter rental service 🛴🔋",
  "Meal planning app 📝🥘",
  "Online therapy platform 💬❤️",
  "Digital marketing agency 💻📈",
  "Sustainable fashion brand 🌿👚",
  "Freelance marketplace 💻🤝",
  "Smart home technology provider 🏠💡",
  "Online event ticketing platform 🎟️🌐",
  "Plant-based food products company 🌱🍔",
  "Fitness app 🏋️‍♀️📱",
];

const Gemini = ({
  setIsLoading,
  setChatbotResponse,
  currentUser,
  setCurrentUser,
}) => {
  // const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = async () => {
    try {
      setIsLoading(true);
      console.log("1");
      const response = await fetch(
        "https://news-fetcher-8k6m.onrender.com/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_input: `{ "DurationSelect": { "selectedDuration": "5 years", "startingCashBalance": 20000, "status": "active", "industry": "retail", "incomeTax": 25, "payrollTax": 12, "currency": "USD" }, "CustomerSection": { "customerInputs": [ { "customersPerMonth": 500, "growthPerMonth": 5, "channelName": "In-Store", "beginMonth": 1, "endMonth": 60 }, { "customersPerMonth": 200, "growthPerMonth": 10, "channelName": "Online Delivery", "beginMonth": 6, "endMonth": 60 } ] }, "SalesSection": { "channelInputs": [ { "productName": "Coffee", "price": 5, "multiples": 1, "deductionPercentage": 0, "cogsPercentage": 30, "selectedChannel": "In-Store", "channelAllocation": 0.6 }, { "productName": "Pastries", "price": 4, "multiples": 1, "deductionPercentage": 0, "cogsPercentage": 50, "selectedChannel": "In-Store", "channelAllocation": 0.4 }, { "productName": "Coffee Subscription", "price": 20, "multiples": 1, "deductionPercentage": 5, "cogsPercentage": 25, "selectedChannel": "Online Delivery", "channelAllocation": 1 } ], "channelNames": [ "In-Store", "Online Delivery" ] }, "CostSection": { "costInputs": [ { "costName": "Rent", "costValue": 3000, "growthPercentage": 3, "beginMonth": 1, "endMonth": 60, "costType": "Operating Cost" }, { "costName": "Utilities", "costValue": 500, "growthPercentage": 4, "beginMonth": 1, "endMonth": 60, "costType": "Operating Cost" } ] }, "PersonnelSection": { "personnelInputs": [ { "jobTitle": "Barista", "salaryPerMonth": 2500, "numberOfHires": 3, "jobBeginMonth": 1, "jobEndMonth": 60 }, { "jobTitle": "Manager", "salaryPerMonth": 4000, "numberOfHires": 1, "jobBeginMonth": 1, "jobEndMonth": 60 } ] }, "InvestmentSection": { "investmentInputs": [ { "purchaseName": "Espresso Machine", "assetCost": 8000, "quantity": 2, "purchaseMonth": 1, "residualValue": 800, "usefulLifetime": 60 }, { "purchaseName": "Furniture", "assetCost": 10000, "quantity": 1, "purchaseMonth": 1, "residualValue": 1000, "usefulLifetime": 60 } ] }, "LoanSection": { "loanInputs": [ { "loanName": "Equipment Loan", "loanAmount": 15000, "interestRate": 4, "loanBeginMonth": 1, "loanEndMonth": 60 } ] } } create a json file like this for a ${inputValue}, return only json file`,
          }),
        }
      );
      console.log("2", response);
      const data = await response.json();
      console.log("3", data);
      //Remove backticks from the constant responseText
      const cleanedResponseText = data.response.replace(/json|`/g, "");
      console.log("4");
      // Set the chatbot response to the latest messag

      setChatbotResponse(cleanedResponseText);
      console.log("5");
      saveUserData();
      console.log("6");
      setIsLoading(false);
    } catch (error) {
      console.log("Error sending message:", error);
      setIsLoading(false);
    }
  };

  async function saveUserData() {
    try {
      console.log("7");
      // Thực hiện truy vấn để lấy thông tin người dùng theo id (điều này cần được thay đổi dựa trên cấu trúc dữ liệu của bạn trong Supabase)
      const currentPrompt = currentUser.financePromptNumber - 1;
      if (currentPrompt <= 0) {
        toast.warning("Prompt per hour limited. Let return after an hour.");
      } else {
        if (currentPrompt === 99) {
          await supabase
            .from("users")
            .update({ financeFirstPrompt: Date.now() })
            .eq("id", currentUser?.id);
        }
        const { data, error } = await supabase
          .from("users")
          .update({ financePromptNumber: currentPrompt })
          .eq("id", currentUser?.id)
          .select();
        console.log("8");
        await apiService.post("/count/finance");
        console.log("9");
        if (error) {
          throw error;
        }

        // Cập nhật state userData với thông tin người dùng đã lấy được
        if (data) {
          setCurrentUser(data[0]);
          console.log("10");
        }
      }
    } catch (error) {}
  }

  const handleIndustrySelect = (industry) => {
    setInputValue(industry);
  };

  return (
    <div className=" mx-auto w-full">
      <div className="input-container p-4">
        <h2 className="text-3xl sm:text-5xl font-semibold text-gray-800 darkTextGray mb-6 text-center">
          Build your financial model with AI
        </h2>
        <form onSubmit={handleSendMessage} className="flex justify-center">
          <div className="sm:w-[50%] w-[100%] relative z-10 flex space-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-gray-100 darkBgBlue darkBorderGray darkShadowGray">
            <div className="flex-[1_0_0%]">
              <input
                type="text"
                name="hs-search-article-1"
                id="hs-search-article-1"
                className=" px-4 block w-full h-full border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500 darkBgBlue darkBorderGray darkTextGray darkFocus"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Candy shop, pizza restaurant, hospital, HR SaaS software... or anything"
              />
            </div>

            <div className="flex-[0_0_auto]">
              <button
                type="submit"
                className="w-[64px] h-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
              >
                OK 🐶
              </button>
            </div>
          </div>
        </form>
        <h3 className="text-2xl font-semibold mt-8 text-center">Templates</h3>

        <div className="mt-2 sm:mt-4 hidden lg:flex flex-wrap justify-center">
          {industries.map((industry, index) => (
            <button
              key={index}
              onClick={() => handleIndustrySelect(industry)}
              className={`text-sm m-2 py-3 px-4 inline-flex items-center gap-x-2  rounded-lg border shadow-sm hover:cursor-pointer`}
            >
              {industry}
            </button>
          ))}
        </div>
        <div className="text-sm mt-4 lg:hidden overflow-x-auto flex flex-nowrap">
          {industries.map((industry, index) => (
            <button
              key={index}
              onClick={() => handleIndustrySelect(industry)}
              className={`m-2 py-3 px-4 inline-flex items-center gap-x-2  rounded-lg border shadow-sm hover:cursor-pointer`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gemini;
