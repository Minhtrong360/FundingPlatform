import React, { useState } from "react";
import { Modal } from "antd";
import SpinnerBtn from "../../../components/SpinnerBtn";
import { useSelector } from "react-redux";

const GroqJS = ({ datasrc, inputUrl }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add the following state for controlling the modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Update the handleSubmit function to set modal visibility and response content
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const newMessage = {
        role: "user",
        content:
          `1. All answers are short and using bullet points.
        2. Analyze figures and numbers vertically and horizontally. 
        3. Show remarkable changes, red flags, insights based on quantitative reasonings. 
        4. Give a score out of 10 for the data below` +
          "\n" +
          JSON.stringify(datasrc),
      };
      setMessages([newMessage]);

      let url;
      if (inputUrl === "urlPNL") {
        url =
          "https://flowise-ngy8.onrender.com/api/v1/prediction/af577d02-be0e-477f-94ad-303c5bdb451e";
      } else if (inputUrl === "urlCF") {
        url =
          "https://flowise-ngy8.onrender.com/api/v1/prediction/cf33a36d-0f2e-40a1-b668-4074ab08e2cd";
      } else if (inputUrl === "urlBS") {
        url =
          "https://flowise-ngy8.onrender.com/api/v1/prediction/26a1b357-632b-4551-9f60-9d2e9b216738";
      } else if (inputUrl === "urlCus") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlSale") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlCost") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlPer") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlInv") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlFund") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlLoan") {
        url = "http://localhost:300/";
      } else {
        alert("Invalid URL input");
        return;
      }

      const response = await fetch(
        // "https://news-fetcher-8k6m.onrender.com/chat",
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: [JSON.stringify(datasrc)] }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const dataJS = JSON.stringify(data);

      const assistantResponse = data.text?.replace(/[#*`]/g, "");

      const formattedAssistantResponse = assistantResponse.replace(
        /\n/g,
        "<br>"
      );
      setMessages([
        ...messages,
        { role: "assistant", content: formattedAssistantResponse },
      ]);
      setIsModalVisible(true); // Show the modal
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const {positionDataWithNetIncome} = useSelector((state) => state.cashFlow);
  console.log("CF", positionDataWithNetIncome);
  const {positionDataWithNetIncome2} = useSelector((state) => state.balanceSheet);
  console.log("BS", positionDataWithNetIncome2);
  const {transposedData} = useSelector((state) => state.profitAndLoss);
  console.log("PL", transposedData);


  return (
    <div className=" flex flex-col rounded-md  ">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4"
        onClick={handleSubmit}
      >
        {isLoading ? <SpinnerBtn /> : "Analyze"}
      </button>
      <Modal
        open={isModalVisible}
        footer={null}
        centered
        onCancel={() => setIsModalVisible(false)}
        width="60%"
        style={{ top: 20 }}
      >
        {messages.length > 0 && (
          <div
            dangerouslySetInnerHTML={{
              __html: messages[messages.length - 1].content,
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default GroqJS;
