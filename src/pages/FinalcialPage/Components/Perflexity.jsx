import React, { useState } from "react";
import SpinnerBtn from "../../../components/SpinnerBtn";

const Valuation = ({  button }) => {
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
      console.log("Input sent to backend:", JSON.stringify({ messages }));
      // Create a new message object for the user input
      const newMessage = { role: "user", content: generatePromptV() };

      // Update the messages state by adding the new message
      setMessages([newMessage]);

      // Log the updated messages array
      console.log("Input sent to backend:", [newMessage.content]);
      // const response = await fetch("https://news-fetcher-8k6m.onrender.com/chat", {
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
      console.log("data: ", data);
      // const assistantResponse = data?.response?.replace(/[#*`]/g, "");
      const assistantResponse =
        typeof data?.text === "string"
          ? data.text.replace(/[#*`]/g, "")
          : "";

      console.log("assistantResponse: ", assistantResponse);
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
      // setMessages([...messages, { role: "assistant", content: formattedAssistantResponse }]);
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
                  <input
                    placeholder="Yes/No"
                    value={ai}
                    onChange={(e) => setAi(e.target.value)}
                    className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  darkTextGray400 "
                  />
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
      
      {/* Chat input */}
      {/* <input
        className="border p-2 rounded m-4 shadow-lg"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      /> */}
      <div className="md:flex-row flex flex-col">
        <button
          disabled={isLoading}
          className=" max-w-[100px] min-w-[6rem] bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded m-4"
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
        {/* {messages.map((message, index) => (
        <div className="border p-2 rounded m-4 shadow-lg" key={index}>
          {message.role === "user" ? (
            // <div>👨‍💻 {message.content}</div>
            <div className="border-transparent"></div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: message.content }} />
          )}
        </div>
      ))} */}
        {messages.map((message, index) => (
          <>
            {message.role !== "user" && (
              <div className=" p-2 rounded m-4 " key={index}>
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

/////////////////////

// import React, { useState, useEffect } from "react";

// const Perflexity = ({ prompt, button }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const clearMessages = () => {
//     setMessages([]);
//   };

//   const handleStreamResponse = async () => {
//     try {
//       const newMessage = { role: "user", content: prompt };
//       setMessages([...messages, newMessage]);

//       const response = await fetch("http://localhost:8000/research", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ messages: [newMessage] }),
//       });

//       if (!response.body) {
//         throw new Error("No response body");
//       }

//       const reader = response.body.getReader();
//       let receivedLength = 0;
//       let chunks = [];

//       while (true) {
//         const { done, value } = await reader.read();

//         if (done) {
//           break;
//         }

//         chunks.push(value);
//         receivedLength += value.length;

//         const chunkText = new TextDecoder("utf-8").decode(value, { stream: true });
//         const assistantResponse = chunkText.replace(/\*\*/g, '').replace(/\n/g, '<br>');
//         setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: assistantResponse }]);
//       }

//       setInput("");
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="w-full max-h-[500px] flex flex-col rounded-md shadow-lg border p-4 mt-4 mb-4">
//       <div className="overflow-auto">
//         {messages.map((message, index) => (
//           <div className="border p-2 rounded m-4 shadow-lg" key={index}>
//             {message.role === "user" ? (
//               <div>{message.content}</div>
//             ) : (
//               <div dangerouslySetInnerHTML={{ __html: message.content }} />
//             )}
//           </div>
//         ))}
//       </div>
//       <button
//         className="max-w-[100px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4"
//         onClick={handleStreamResponse}
//       >
//         {button}
//       </button>
//       <button
//         className="max-w-[100px] bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded m-4"
//         onClick={clearMessages}
//       >
//         Clear
//       </button>
//     </div>
//   );
// };

// export default Perflexity;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { List, Input } from 'antd';

// const Perflexity = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');

//   useEffect(() => {
//     const eventSource = new EventSource('http://localhost:8000/research');

//     eventSource.onmessage = (event) => {
//       const newMessage = JSON.parse(event.data);
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     };

//     return () => {
//       eventSource.close();
//     };
//   }, []);

//   const sendMessage = async () => {
//     if (!inputValue.trim()) return;

//     try {
//       await axios.post('http://localhost:8000/research', {
//         messages: [{ role: 'user', content: inputValue }],
//       });
//       setInputValue('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <div>
//       <List
//         itemLayout="horizontal"
//         dataSource={messages}
//         renderItem={(message, index) => (
//           <List.Item>
//             <List.Item.Meta
//               title={message.role === 'assistant' ? 'Assistant' : 'You'}
//               description={message.content}
//             />
//           </List.Item>
//         )}
//       />
//       <Input.Search
//         placeholder="Type a message..."
//         enterButton="Send"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         onSearch={sendMessage}
//       />
//     </div>
//   );
// };

// export default Perflexity;
