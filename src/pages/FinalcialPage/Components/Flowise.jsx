import React, { useState } from "react";
import SpinnerBtn from "../../../components/SpinnerBtn";

const Flowise = ({ button, isButtonDisabled }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [specificPrompt, setSpecificPrompt] = useState("");

  const generatePromptMK = () => {
    return `${specificPrompt}`;
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Create a new message object for the user input
      const newMessage = { role: "user", content: generatePromptMK() };

      // Update the messages state by adding the new message
      setMessages([newMessage]);

      let assistantResponse = "";
      if (isButtonDisabled) {
        assistantResponse =
          "You need to subscribe to use this feature! Thank you.";
      } else {
        const response = await fetch(
          "https://flowise-ngy8.onrender.com/api/v1/prediction/eefcc2cf-c772-4b5d-be24-af5d2216d09e",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: [newMessage.content] }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataR = await response.json();

        assistantResponse =
          typeof dataR?.text === "string"
            ? dataR.text.replace(/[#*`]/g, "")
            : "";
      }

      // Replace newline characters with <br> tags
      const formattedAssistantResponse = assistantResponse.replace(
        /\n/g,
        "<br>"
      );

      setMessages([
        ...messages,
        { role: "user", content: input },
        { role: "assistant", content: formattedAssistantResponse },
      ]);
      setInput("");
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function formatUrls(text) {
    const urlPattern = /(https?:\/\/[^\s)]+)/g;
    return text.replace(
      urlPattern,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  }

  const formattedMessages = messages.map((message, index) => {
    if (message.role !== "user") {
      const formattedContent = formatUrls(
        message.content.replace(/\n/g, "<br>")
      );
      return (
        <div className="" key={index}>
          <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
        </div>
      );
    }
    return null;
  });

  return (
    <div className="">
      {/* Chat history */}
      <div className="">
        <div className="md:flex-row flex flex-col fixed z-5 bottom-5 w-full">
          <input
            placeholder="Specific prompt"
            value={specificPrompt}
            onChange={(e) => setSpecificPrompt(e.target.value)}
            className="max-w-[300px] md:max-w-[650px] mt-4 mb-4 py-3 px-4 block w-full border-transparent  rounded-md text-sm  bg-slate-100 "
          />
          <div className="flex items-center">
            <button
              disabled={isLoading}
              className=" max-w-[100px] min-w-[6rem] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded m-4"
              onClick={handleSubmit}
            >
              {isLoading ? <SpinnerBtn /> : button}
            </button>
            <button
              className="max-w-[100px] min-w-[6rem] bg-red-600 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded m-4"
              onClick={clearMessages}
            >
              Clear{" "}
            </button>
          </div>
        </div>
      </div>
      <div className=" pb-20">{formattedMessages}</div>
    </div>
  );
};

export default Flowise;
