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
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PF() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  let eventSource = null;

  useEffect(() => { 
    const fetchData = async () => {
      try {
        await axios.post('http://localhost:8000/stream', { messages });
        const eventSource = new EventSource('http://localhost:8000/stream');
        
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data }]);
        };

        eventSource.onerror = () => {
          eventSource.close();
        };
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      // Clean up event source
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [messages]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages(prevMessages => [...prevMessages, { role: 'user', content: inputText }]);
    setInputText('');
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            {message.role === 'user' ? <p>User: {message.content}</p> : <p>Assistant: {message.content}</p>}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputText} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default PF;
