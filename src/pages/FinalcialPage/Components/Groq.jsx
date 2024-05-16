// import React, { useState } from "react";

// const Groq = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const clearMessages = () => {
//     setMessages([]);
//   };
//   const handleSubmit = async () => {
//     try {
//       console.log("Input sent to backend:", JSON.stringify({messages}));
//       // Create a new message object for the user input
//       const newMessage = { role: "user", content: input };
    
//     // Update the messages state by adding the new message
//       setMessages([...messages, newMessage]);

//     // Log the updated messages array
//     console.log("Input sent to backend:", [...messages, newMessage]);
//       // const response = await fetch("https://news-fetcher-8k6m.onrender.com/chat", {
//         const response = await fetch("http://localhost:8000/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ messages: [ newMessage] }),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();
//       const assistantResponse = data?.response?.replace(/\*\*/g, '');
//       console.log(assistantResponse)
//        // Replace newline characters with <br> tags
//       const formattedAssistantResponse = assistantResponse.replace(/\n/g, '<br>');
//       setMessages([...messages,{ role: "user", content: input }, { role: "assistant", content: formattedAssistantResponse }]);
//       // setMessages([...messages, { role: "assistant", content: formattedAssistantResponse }]);
//       setInput("");
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="w-full max-h-[500px] flex flex-col rounded-md shadow-lg border p-4">
//       {/* Chat history */}
//       <div className="overflow-auto ">
//       {messages.map((message, index) => (
//         <div className="border p-2 rounded m-4 shadow-lg" key={index}>
//           {message.role === "user" ? (
//             <div>👨‍💻 {message.content}</div>
//           ) : (
//             <div dangerouslySetInnerHTML={{ __html: message.content }} />
//           )}
//         </div>
//       ))}
//     </div>
//       {/* Chat input */}
//       <input
//         className="border p-2 rounded m-4 shadow-lg"
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />
//       <button
//         className="max-w-[200px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4"
//         onClick={handleSubmit}
//       >
//         Send
//       </button>
//       <button  className="max-w-[200px] bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded m-4"
//        onClick={clearMessages}>Clear </button>
//     </div>
//   );
// };

// export default Groq;



// import React, { useState, useEffect } from "react";
// import { Input, Button } from "antd";


// const { TextArea } = Input;

// function PF() {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:8000/PF");

//     ws.onopen = () => {
//       console.log("Connected to WebSocket");
//     };

//     ws.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       setMessages((prevMessages) => [...prevMessages, message]);
//     };

//     setSocket(ws);

//     return () => {
//       ws.close();
//     };
//   }, []);

//   const sendMessage = () => {
//     if (inputMessage.trim() !== "") {
//       socket.send(inputMessage);
//       setInputMessage("");
//     }
//   };

//   return (
//     <div className="App h-screen flex flex-col justify-between p-4">
//       <div className="overflow-y-auto">
//         {messages.map((message, index) => (
//           <div key={index} className="mb-2">
//             {message}
//           </div>
//         ))}
//       </div>
//       <div className="flex">
//         <TextArea
//           value={inputMessage}
//           onChange={(e) => setInputMessage(e.target.value)}
//           placeholder="Type your message here..."
//           autoSize={{ minRows: 2 }}
//           className="mr-2"
//         />
//         <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={sendMessage}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default PF;

//////////////
///////////////////////////
import React, { useState, useRef } from 'react';
import { Button, Input } from 'antd';


const { TextArea } = Input;

const DF = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const eventSourceRef = useRef(null);

  const handleSend = async () => {
    const newMessages = [...messages, { role: "user", content: inputValue }];
    setMessages(newMessages);
    setInputValue("");

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const response = await fetch('http://localhost:8000/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: newMessages }),
    });

    eventSourceRef.current = new EventSource('http://localhost:8000/stream');
    eventSourceRef.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: event.data }]);
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white rounded shadow-md">
        <div className="mb-4">
          <TextArea 
            rows={4} 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Type a message" 
          />
        </div>
        <div className="flex justify-end mb-4">
          <Button type="primary" onClick={handleSend}>
            Send
          </Button>
        </div>
        <div className="border-t border-gray-200 pt-4">
          {messages.map((message, index) => (
            <div key={index} className={`p-2 rounded mb-2 shadow-sm ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {message.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DF;
