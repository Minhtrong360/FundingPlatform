import React, { useState } from "react";

const Groq = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    try {
      console.log("Input sent to backend:", JSON.stringify({messages}));
      // Create a new message object for the user input
      const newMessage = { role: "user", content: input };
    
    // Update the messages state by adding the new message
      setMessages([...messages, newMessage]);

    // Log the updated messages array
    console.log("Input sent to backend:", [...messages, newMessage]);
      // const response = await fetch("https://news-fetcher-8k6m.onrender.com/chat", {
        const response = await fetch("http://localhost:8000/chat", {
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
      setMessages([...messages,{ role: "user", content: input }, { role: "assistant", content: formattedAssistantResponse }]);
      // setMessages([...messages, { role: "assistant", content: formattedAssistantResponse }]);
      setInput("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full h-96 flex flex-col rounded-md shadow-lg border p-4 overflow-auto">
      {/* Chat history */}
      {messages.map((message, index) => (
        <div className="border p-2 rounded m-4 shadow-lg" key={index}>
          {message.role === "user" ? (
            <div>👨‍💻 {message.content}</div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: message.content }} />
          )}
        </div>
      ))}

      {/* Chat input */}
      <input
        className="border p-2 rounded m-4 shadow-lg"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4"
        onClick={handleSubmit}
      >
        Analyst
      </button>
    </div>
  );
};

export default Groq;
