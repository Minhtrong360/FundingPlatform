import React, { useState } from "react";
import { useSelector } from "react-redux";



const GroqJS = ({datasrc}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { startMonth, startYear } = useSelector(
    (state) => state.durationSelect
  );
  const handleSubmit = async () => {
    try {
     
      // Create a new message object for the user input
      // 
      
      const newMessage = { role: "user", content: `Given month1 is ${startMonth}/${startYear}. Use month1 as a index to get month and year from month1 to month36. 
      Based on information below, answer these request: 1. What is month2 Month/Year. 2. What is month10 Month/Year 3. What is total revenue of July, August and September 2025.` + "\n" + JSON.stringify(datasrc) };
      console.log("Input sent to backend:", JSON.stringify({messages}));
    // Update the messages state by adding the new message
      setMessages([...messages, newMessage]);

    // Log the updated messages array
    console.log("Input sent to backend:", [...messages, newMessage]);
      const response = await fetch("https://news-fetcher-8k6m.onrender.com/chat",
      // const response = await fetch("https://fastapi-example-l5fo.onrender.com/chat",
       {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const assistantResponse = data?.response?.replace(/\*\*/g, '');
      console.log(assistantResponse)
       // Replace newline characters with <br> tags
      const formattedAssistantResponse = assistantResponse.replace(/\n/g, '<br>');
      // setMessages([...messages,{ role: "user", content: input }, { role: "assistant", content: formattedAssistantResponse }]);
      setMessages([...messages, { role: "assistant", content: formattedAssistantResponse }]);
      setInput("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full max-h-[600px] flex flex-col rounded-md shadow-lg border p-4 ">
      <div className="overflow-auto ">
      {/* Chat history */}
      {/* {messages.map((message, index) => (
        <div className="border p-2 rounded  shadow-lg" key={index}>
          {message.role === "user" ? (
            <div>👨‍💻 {message.content}</div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: message.content }} />
          )}
        </div>
      ))} */}
       {messages.map((message, index) => (
    <div className="border p-2 rounded shadow-lg" key={index}>
      {message.role !== "user" ? (
        <div dangerouslySetInnerHTML={{ __html: message.content }} />
      ) : (
        <div ></div>
      )}
    </div>
  ))}
      </div>
      {/* Chat input */}
      {/* <input
        className="border p-2 rounded m-4 shadow-lg"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      /> */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4"
        onClick={handleSubmit}
      >
        Analyze
      </button>
    </div>
  );
};

export default GroqJS;
