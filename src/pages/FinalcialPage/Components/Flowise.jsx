import React, { useState } from "react";

const Flowise = ({prompt,button}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const clearMessages = () => {
    setMessages([]);
  };
  const handleSubmit = async () => {
    try {
      console.log("Input sent to backend:", JSON.stringify({messages}));
      // Create a new message object for the user input
      const newMessage = { role: "user", content: prompt };
    
    // Update the messages state by adding the new message
      setMessages([ newMessage]);

      // Log the updated messages array
      console.log("Input sent to backend:", [ newMessage]);
        
     
        const response = await fetch(
            "https://flowise-ngy8.onrender.com/api/v1/prediction/d07c777f-6204-4699-92ea-9c0abb67d157",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "question": [ newMessage.content] })
            }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataR = await response.json();
        const dataAR = dataR.text
        console.log("dataAR:",dataAR)

      // const assistantResponse = data?.response?.replace(/[#*`]/g, "");
      const assistantResponse = typeof dataR?.text === 'string' ? dataR.text.replace(/[#*`]/g, "") : '';

      console.log("assistantResponse: ", assistantResponse)
       // Replace newline characters with <br> tags
      const formattedAssistantResponse = assistantResponse.replace(/\n/g, '<br>');
      setMessages([...messages,{ role: "user", content: input }, { role: "assistant", content: formattedAssistantResponse }]);
      // setMessages([...messages, { role: "assistant", content: formattedAssistantResponse }]);
      setInput("");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  function formatUrls(text) {
    const urlPattern = /(https?:\/\/[^\s)]+)/g;
    return text.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

const formattedMessages = messages.map((message, index) => {
    if (message.role !== "user") {
        const formattedContent = formatUrls(message.content.replace(/\n/g, '<br>'));
        return (
            <div className="p-2 rounded m-4" key={index}>
                <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
            </div>
        );
    }
    return null;
});
  return (
    <div className="w-full max-h-[500px] flex flex-col  p-4 mt-4 mb-4">
      {/* Chat history */}
      <div className="overflow-auto ">
      {formattedMessages}
      {/* {messages.map((message, index) => (
        <>
            {message.role !== "user" && (
                <div className=" p-2 rounded m-4 " key={index}>
                    <div dangerouslySetInnerHTML={{ __html: message.content }} />
                </div>
            )}
        </>
    ))} */}

       </div>
      <div className="md:flex-row flex flex-col">
      <button
        className=" max-w-[100px] bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded m-4"
        onClick={handleSubmit}
      >
        {button}
      </button>
      <button  className="max-w-[100px] bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded m-4"
       onClick={clearMessages}>Clear </button>
    </div>

    </div>
  );
};

export default Flowise;


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
