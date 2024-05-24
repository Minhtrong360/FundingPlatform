import React, { useState } from "react";

import { supabase } from "../../../supabase";
import apiService from "../../../app/apiService";
import { SendOutlined } from "@ant-design/icons";
import { message } from "antd";

const GPT = ({
  inputValue,
  setChatbotResponse,
  
}) => {


  const handleSendMessage = async () => {
    try {
     
      const response = await fetch(
        "https://news-fetcher-8k6m.onrender.com/drawchart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_input: `
            
            Based on given ${inputValue} create arrays linearly with start is customersPerMonth and end is customersLastMonth, the number of objects in array equal end-begin months, return purely a JSON file with appropriate values used for business model of . All the keys must be included in new JSON with key name unchanged. Values of each key are unique. No explain.`,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }
   
      const cleanedResponseText = data?.response?.replace(/json|`/g, "");

      

      setChatbotResponse(cleanedResponseText);

      
    } catch (error) {
      console.log("Error sending message:", error);
      message.error("Error sending message. Please try again later.");
    }
  };

 

  return (
    <div className=" mx-auto w-full">
    <button
      onClick={handleSendMessage}
      className="w-[64px] h-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
    >
      <SendOutlined />
    </button>
    </div>
  );
};

export default GPT;
