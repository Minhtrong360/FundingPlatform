import React, { useState } from "react";
import { Input, Button, Typography, Alert } from "antd";

const { Text } = Typography;

const GPTAnalyzer = ({ setChatbotResponse }) => {
  const [inputValue, setInputValue] = useState("");
  const [responseResult, setResponseResult] = useState("");
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    try {
      const response = await fetch(
        "https://news-fetcher-8k6m.onrender.com/analyze", // Replace with actual backend URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_input: `${inputValue}. Give some red flags from this financial statement data and always back up reasons with specific numbers, figures.`,
          }),
        }
      );

      console.log("2", response);
      const data = await response.json();
      console.log("3", data);

      if (data.error) {
        throw new Error(data.error);
      }
      const cleanedResponseText = data?.response?.replace(/json|`/g, "");
      setResponseResult(data.response);
      console.log("response", responseResult);

      setError(null);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-semibold ">Financial Analysis</h2>

      <div>
        <div className="space-y-4">
          <div className="space-y-2">
            <input
              className=" m-2 px-4 block w-full h-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 "
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter text to analyze"
            />
          </div>
          <button
            className="w-[64px] h-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
            type="primary"
            onClick={handleAnalyze}
          >
            Analyze
          </button>
          <div className="max-w-2xl mx-auto p-4 bg-white border rounded-lg shadow-lg shadow-gray-100">
            {responseResult && (
              <div>
                <div>Analysis Result:</div>
                {responseResult.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
///////////////////

export default GPTAnalyzer;
