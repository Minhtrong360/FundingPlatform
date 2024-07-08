import React, { useState } from "react";
import SpinnerBtn from "../../../components/SpinnerBtn";

const Valuation = ({ button, isButtonDisabled }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [industryV, setIndustryV] = useState("");
  const [yearV, setYearV] = useState("");
  const [bussinessmodel, setBussinessmodel] = useState("");
  const [ai, setAi] = useState("");
  const [arr, setArr] = useState("");
  const [teamsize, setTeamsize] = useState("");

  const generatePromptV = () => {
    return `Search revenue multiples for ${industryV} ${yearV} ${bussinessmodel} ${ai} ${arr} ${teamsize} . Calculate the estimated valuation by using ${arr} and multiples. Return the final valuation and source links.`;
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Create a new message object for the user input
      const newMessage = { role: "user", content: generatePromptV() };

      // Update the messages state by adding the new message
      setMessages([newMessage]);

      // Log the updated messages array

      let assistantResponse = "";

      if (isButtonDisabled) {
        assistantResponse =
          "You need to subscribe to use this feature! Thank you.";
      } else {
        const response = await fetch(
          "https://flowise-ngy8.onrender.com/api/v1/prediction/d8cd8202-5324-4743-b7ab-be418f21a947",
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

        const data = await response.json();
        assistantResponse =
          typeof data?.text === "string" ? data.text.replace(/[#*`]/g, "") : "";
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

  return (
    <div className="w-full max-h-[500px] flex flex-col  mt-4 mb-4">
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <div className="block mb-1">Industry</div>
          <input
            placeholder="Agritech, Ecommerce, etc."
            value={industryV}
            onChange={(e) => setIndustryV(e.target.value)}
            className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  darkTextGray400 "
          />

          <div className="block mb-1">Year</div>
          <input
            placeholder="2023, 2024, etc."
            value={yearV}
            onChange={(e) => setYearV(e.target.value)}
            className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  darkTextGray400 "
          />
          <div className="block mb-1">Estimate Arr</div>
          <input
            placeholder="$10k, $100k, $1M, etc."
            value={arr}
            onChange={(e) => setArr(e.target.value)}
            className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  darkTextGray400 "
          />
        </div>
        <div>
          <div className="block mb-1">Business Model</div>
          <input
            placeholder="SaaS, Marketplace, Licensing, Affiliate..."
            value={bussinessmodel}
            onChange={(e) => setBussinessmodel(e.target.value)}
            className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  darkTextGray400 "
          />
          <div className="block mb-1">AI</div>
          <select
            value={ai}
            onChange={(e) => setAi(e.target.value)}
            className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none darkTextGray400"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <div className="block mb-1">Teamsize</div>
          <input
            placeholder="1-10, 10-50, 50-100, etc."
            value={teamsize}
            onChange={(e) => setTeamsize(e.target.value)}
            className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  darkTextGray400 "
          />
        </div>
      </div>
      {/* Chat history */}

      <div className="md:flex-row flex flex-col">
        <button
          disabled={isLoading}
          className=" max-w-[100px] min-w-[6rem] bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded my-4"
          onClick={handleSubmit}
        >
          {isLoading ? <SpinnerBtn /> : button}
        </button>
        <button
          className="max-w-[100px] bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded m-4"
          onClick={clearMessages}
        >
          Clear{" "}
        </button>
      </div>
      <div className=" pb-14">
        {messages.map((message, index) => (
          <>
            {message.role !== "user" && (
              <div className=" p-2 rounded my-4 " key={index}>
                <div dangerouslySetInnerHTML={{ __html: message.content }} />
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default Valuation;
