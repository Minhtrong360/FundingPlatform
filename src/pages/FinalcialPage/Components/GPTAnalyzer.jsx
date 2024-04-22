import React, { useState } from "react";
import { Input, Button, Typography, Alert } from "antd";

const { Text } = Typography;

const GPTAnalyzer = ({ customerTableData }) => {
  const [inputValue, setInputValue] = useState("");
  const [responseResult, setResponseResult] = useState("");
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    try {
      console.log("customerTableData", customerTableData);
      const formattedData = customerTableData.map(entry => {
        const channelData = Object.entries(entry)
            .filter(([key]) => key.startsWith('month'))
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        return `${entry.channelName}: ${channelData}`;
    }).join('\n\n');
    
    const userInput = `Analyzing, warning and recommendations for the following data of The TableData :\n${formattedData}`;
    console.log(userInput)
    
      const response = await fetch(
        "http://localhost:8000/analyze", // Replace with actual backend URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_input: `Analyzing, warning, recommendations highlight, fluctuation, unusual points for the following data of The TableData : \n${formattedData}`,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }
      const cleanedResponseText = data?.response?.replace(/json|`|###|\*/g, "");
      setResponseResult(cleanedResponseText);

      setError(null);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  console.log("responseResult", responseResult);

  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="text-2xl font-semibold ">Financial Analysis</h2>

      <div>
        <div className="space-y-4">
          {/* <div className="space-y-2">
            <input
              className=" m-2 px-4 block w-full h-full border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 "
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter text to analyze"
            />
          </div> */}
          <button
            className="mt-4 w-[64px] h-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
            type="primary"
            onClick={handleAnalyze}
          >
            Analyze
          </button>
          <div className="max-w-4xl mx-auto p-4 bg-white border rounded-md shadow-lg shadow-gray-100">
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
