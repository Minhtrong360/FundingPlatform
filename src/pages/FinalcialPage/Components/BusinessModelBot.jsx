import React, { useState } from "react";

import { supabase } from "../../../supabase";
import apiService from "../../../app/apiService";
import { SendOutlined } from "@ant-design/icons";
import { message } from "antd";

const BusinessModelBot = ({
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

      const canProceed = await saveUserData();

      if (!canProceed) {
        setIsLoading(false);
        setSpinning(false);
        return;
      }

      const response = await fetch(
        "https://flowise-ngy8.onrender.com/api/v1/prediction/28d10093-9e46-4387-a559-98b986583e1b",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question: [`${inputValue}`],
          }),
        }
      );

      const data = await response.json();
      const jsonString = data.text.match(/```json([\s\S]*?)```/)[1].trim();
      const parsedJson = JSON.parse(jsonString);
      const dataJS = JSON.stringify(parsedJson);
      if (data.error) {
        throw new Error(data.error);
      }

      // Set the chatbot response to the latest messag

      setChatbotResponse(dataJS);
      setIsLoading(false);
      setSpinning(false);
    } catch (error) {
      console.log("Error sending message:", error);
      setIsLoading(false);
      setSpinning(false);
    }
  };

  async function saveUserData() {
    try {
      const maxPrompt = 20;
      // Thực hiện truy vấn để lấy thông tin người dùng theo id (điều này cần được thay đổi dựa trên cấu trúc dữ liệu của bạn trong Supabase)
      const currentPrompt = currentUser.financePromptNumber - 1;
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

      if (currentPrompt <= 0) {
        const timeRemainingMs =
          oneHour - (Date.now() - currentUser.financeFirstPrompt);
        const timeRemainingMinutes = Math.ceil(timeRemainingMs / (60 * 1000));
        message.warning(
          `Prompt per hour limited. Please return after ${timeRemainingMinutes} minutes.`
        );
        return false;
      } else {
        if (
          currentPrompt == maxPrompt - 1 ||
          (currentPrompt != maxPrompt && !currentUser.financeFirstPrompt)
        ) {
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
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
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

export default BusinessModelBot;
