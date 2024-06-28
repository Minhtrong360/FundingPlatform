import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "antd";
import SpinnerBtn from "../../../components/SpinnerBtn";

const GroqJS = ({ datasrc }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [input, setInput] = useState("");
  const { startMonth, startYear } = useSelector(
    (state) => state.durationSelect
  );
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

      const response = await fetch(
        "https://news-fetcher-8k6m.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: [newMessage] }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const assistantResponse = data?.response?.replace(/[#*`]/g, "");

      const formattedAssistantResponse = assistantResponse.replace(
        /\n/g,
        "<br>"
      );
      setMessages([
        ...messages,
        { role: "assistant", content: formattedAssistantResponse },
      ]);
      setInput("");
      setIsModalVisible(true); // Show the modal
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
