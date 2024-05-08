import React, { useState } from "react";
// import { toast } from "react-toastify";
import { supabase } from "../../../supabase";
import apiService from "../../../app/apiService";
import { SendOutlined } from "@ant-design/icons";
import { message } from "antd";

const Gemini = ({
  setIsLoading,
  setChatbotResponse,
  currentUser,
  setCurrentUser,
  spinning,
  setSpinning,
}) => {
  // const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = async () => {
    try {
      setIsLoading(true);
      setSpinning(true);

      const response = await fetch(
        "https://news-fetcher-8k6m.onrender.com/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_input: `{
              "DurationSelect": {
                "selectedDuration": "5 years",
                "startingCashBalance": 20000,
                "status": "active",
                "industry": "retail",
                "incomeTax": 25,
                "currency": "USD"
              },
              "CustomerSection": {
                "customerInputs": [
                  {
                    "id": 1,
                    "customersPerMonth": 300,
                    "growthPerMonth": 1,
                    "channelName": "Online",
                    "beginMonth": 1,
                    "endMonth": 36,
                    "beginCustomer": 0,
                    "churnRate": 0
                  },
                  {
                    "id": 2,
                    "customersPerMonth": 400,
                    "growthPerMonth": 2,
                    "channelName": "Offline",
                    "beginMonth": 1,
                    "endMonth": 36,
                    "beginCustomer": 0,
                    "churnRate": 0
                  }
                ]
              },
              "SalesSection": {
                "channelInputs": [
                  {
                    "id": 1,
                    "productName": "Coffee",
                    "price": 4,
                    "multiples": 1,
                    "deductionPercentage": 0,
                    "cogsPercentage": 30,
                    "selectedChannel": "Offline",
                    "channelAllocation": 0.4
                  },
                  {
                    "id": 2,
                    "productName": "Cake",
                    "price": 8,
                    "multiples": 1,
                    "deductionPercentage": 0,
                    "cogsPercentage": 35,
                    "selectedChannel": "Offline",
                    "channelAllocation": 0.3
                  },
                  {
                    "id": 3,
                    "productName": "Coffee Bag",
                    "price": 6,
                    "multiples": 1,
                    "deductionPercentage": 0,
                    "cogsPercentage": 25,
                    "selectedChannel": "Online",
                    "channelAllocation": 0.6
                  }
                ],
                "channelNames": ["Online", "Offline"]
              },
              "CostSection": {
                "costInputs": [
                  {
                    "id": 1,
                    "costName": "Website",
                    "costValue": 1000,
                    "growthPercentage": 0,
                    "beginMonth": 1,
                    "endMonth": 6,
                    "costType": "Sales, Marketing Cost"
                  },
                  {
                    "id": 2,
                    "costName": "Marketing",
                    "costValue": 500,
                    "growthPercentage": 0,
                    "beginMonth": 1,
                    "endMonth": 36,
                    "costType": "Sales, Marketing Cost"
                  },
                  {
                    "id": 3,
                    "costName": "Rent",
                    "costValue": 1000,
                    "growthPercentage": 2,
                    "beginMonth": 1,
                    "endMonth": 36,
                    "costType": "General Administrative Cost"
                  }
                ]
              },
              "PersonnelSection": {
                "personnelInputs": [
                  {
                    "id": 1,
                    "jobTitle": "Cashier",
                    "salaryPerMonth": 800,
                    "increasePerYear": 10,
                    "numberOfHires": 2,
                    "jobBeginMonth": 1,
                    "jobEndMonth": 36
                  },
                  {
                    "id": 2,
                    "jobTitle": "Manager",
                    "salaryPerMonth": 2000,
                    "increasePerYear": 10,
                    "numberOfHires": 1,
                    "jobBeginMonth": 1,
                    "jobEndMonth": 36
                  }
                ]
              },
              "InvestmentSection": {
                "investmentInputs": [
                  {
                    "id": 1,
                    "purchaseName": "Coffee machine",
                    "assetCost": 8000,
                    "quantity": 1,
                    "purchaseMonth": 2,
                    "residualValue": 0,
                    "usefulLifetime": 36
                  },
                  {
                    "id": 2,
                    "purchaseName": "Table",
                    "assetCost": 200,
                    "quantity": 10,
                    "purchaseMonth": 1,
                    "residualValue": 0,
                    "usefulLifetime": 36
                  }
                ]
              },
              "FundraisingSection": {
                "fundraisingInputs": [
                  {
                    id: 1,
                    name: "Money",
                    fundraisingAmount: 0,
                    fundraisingType: "Common Stock",
                    fundraisingBeginMonth: 1,
                    equityOffered: 0
                  }
                ]
              },         
              "LoanSection": {
                "loanInputs": [
                  {
                    "id": 1,
                    "loanName": "Banking loan",
                    "loanAmount": "15000",
                    "interestRate": "6",
                    "loanBeginMonth": "1",
                    "loanEndMonth": "12"
                  }
                ]
              }
            }
            Based on given JSON, return purely a JSON file with appropriate values used for business model of ${inputValue}. All the keys must be included in new JSON with key name unchanged. Values of each key are unique. No explain.`,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }
      //Remove backticks from the constant responseText
      const cleanedResponseText = data?.response?.replace(/json|`/g, "");

      // Set the chatbot response to the latest messag

      setChatbotResponse(cleanedResponseText);

      saveUserData();
    } catch (error) {
      console.log("Error sending message:", error);
      setIsLoading(false);
    }
  };

  async function saveUserData() {
    try {
      const maxPrompt = 20;
      // Thực hiện truy vấn để lấy thông tin người dùng theo id (điều này cần được thay đổi dựa trên cấu trúc dữ liệu của bạn trong Supabase)
      const currentPrompt = currentUser.financePromptNumber - 1;
      if (currentPrompt <= 0) {
        message.warning("Prompt per hour limited. Let return after an hour.");
        return;
      } else {
        if (currentPrompt == maxPrompt - 1) {
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

        await apiService.post("/count/finance");

        if (error) {
          throw error;
        }

        // Cập nhật state userData với thông tin người dùng đã lấy được
        if (data) {
          setCurrentUser(data[0]);
        }
      }
    } catch (error) {}
  }

  return (
    <div className=" mx-auto w-full">
      <div className="input-container p-4">
        <h2 className="text-3xl sm:text-5xl font-semibold text-gray-800 darkTextGray mb-6 text-center">
          Financial model with AI
        </h2>
        <form onSubmit={handleSendMessage} className="flex justify-center">
          <div className="sm:w-[50%] w-[100%] relative z-10 flex space-x-3 p-3 bg-white border rounded-md  darkBgBlue darkBorderGray darkShadowGray">
            <div className="flex-[1_0_0%]">
              <input
                type="text"
                name="hs-search-article-1"
                id="hs-search-article-1"
                className=" px-4 block w-full h-full border-transparent rounded-md focus:border-blue-500 focus:ring-blue-500 darkBgBlue darkBorderGray darkTextGray darkFocus"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Your business model"
              />
            </div>

            <div className="flex-[0_0_auto]">
              <button
                type="submit"
                className="w-[64px] h-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
              >
                <SendOutlined />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Gemini;
