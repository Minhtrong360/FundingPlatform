// src/ChatbotGe.js
// src/App.js
import React, { useState, useEffect } from 'react';
import { Input, Button, Typography } from 'antd';


const { TextArea } = Input;
const { Text } = Typography;

function ChatbotGe() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [websocket, setWebsocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('wss://fastapi-example-l5fo.onrender.com/ws');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const responseText = event.data;
      setMessages((prevMessages) => [...prevMessages, { role: 'gemini', text: responseText }]);
    };

    setWebsocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (websocket && inputValue.trim() !== '') {
      setMessages((prevMessages) => [...prevMessages, { role: 'user', text: inputValue }]);
      websocket.send(inputValue);
      setInputValue('');
    }
  };

  const handleExit = () => {
    if (websocket) {
      websocket.send('exit');
      websocket.close();
    }
  };

  return (
    <div className="w-1/2 mx-auto ">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`rounded-md ${message.role === 'user' ? 'bg-blue-600' : 'bg-lime-600'} p-4 mb-2`}>
            <Text className="text-white">{message.text}</Text>
          </div>
        ))}
      </div>
      <div className="input-container p-4">
        <TextArea className='p-4 m-4' value={inputValue} onChange={handleInputChange} rows={3} />
        <button  className="p-2 m-4 rounded-md bg-blue-600 text-white" onClick={handleSendMessage}>
          Send
        </button>
        <button  className="p-2 m-4 rounded-md bg-red-600 text-white" onClick={handleExit}>
          Exit
        </button>
      </div>
    </div>
  );
}



const Y = () => {
    return (
      <div >
        <ChatbotGe />
      </div>
    );
  };
  
  export default Y;
