// src/ChatbotGe.js
// src/App.js
import React, { useState, useEffect } from 'react';
import { Input, Button, Typography } from 'antd';


const { TextArea } = Input;
const { Text } = Typography;

function ChatbotGemini() {
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

//   const handleSendMessage = () => {
//     if (websocket && inputValue.trim() !== '') {
//       setMessages((prevMessages) => [...prevMessages, { role: 'user', text: inputValue }]);
//       websocket.send(inputValue);
//       setInputValue('');
//     }
//   };

const handleSendMessage = () => {
    if (websocket && inputValue.trim() !== '') {
      const userMessage = `{ "DurationSelect": { "selectedDuration": "5 years", "startingCashBalance": 20000, "status": "active", "industry": "retail", "incomeTax": 25, "payrollTax": 12, "currency": "USD" }, "CustomerSection": { "customerInputs": [ { "customersPerMonth": 500, "growthPerMonth": 5, "channelName": "In-Store", "beginMonth": 1, "endMonth": 60 }, { "customersPerMonth": 200, "growthPerMonth": 10, "channelName": "Online Delivery", "beginMonth": 6, "endMonth": 60 } ] }, "SalesSection": { "channelInputs": [ { "productName": "Coffee", "price": 5, "multiples": 1, "txFeePercentage": 0, "cogsPercentage": 30, "selectedChannel": "In-Store", "channelAllocation": 0.6 }, { "productName": "Pastries", "price": 4, "multiples": 1, "txFeePercentage": 0, "cogsPercentage": 50, "selectedChannel": "In-Store", "channelAllocation": 0.4 }, { "productName": "Coffee Subscription", "price": 20, "multiples": 1, "txFeePercentage": 5, "cogsPercentage": 25, "selectedChannel": "Online Delivery", "channelAllocation": 1 } ], "channelNames": [ "In-Store", "Online Delivery" ] }, "CostSection": { "costInputs": [ { "costName": "Rent", "costValue": 3000, "growthPercentage": 3, "beginMonth": 1, "endMonth": 60, "costType": "Operating Cost" }, { "costName": "Utilities", "costValue": 500, "growthPercentage": 4, "beginMonth": 1, "endMonth": 60, "costType": "Operating Cost" } ] }, "PersonnelSection": { "personnelInputs": [ { "jobTitle": "Barista", "salaryPerMonth": 2500, "numberOfHires": 3, "jobBeginMonth": 1, "jobEndMonth": 60 }, { "jobTitle": "Manager", "salaryPerMonth": 4000, "numberOfHires": 1, "jobBeginMonth": 1, "jobEndMonth": 60 } ] }, "InvestmentSection": { "investmentInputs": [ { "purchaseName": "Espresso Machine", "assetCost": 8000, "quantity": 2, "purchaseMonth": 1, "residualValue": 800, "usefulLifetime": 60 }, { "purchaseName": "Furniture", "assetCost": 10000, "quantity": 1, "purchaseMonth": 1, "residualValue": 1000, "usefulLifetime": 60 } ] }, "LoanSection": { "loanInputs": [ { "loanName": "Equipment Loan", "loanAmount": 15000, "interestRate": 4, "loanBeginMonth": 1, "loanEndMonth": 60 } ] } } create a json file like this for a ${inputValue}, return only json file`;
      setMessages((prevMessages) => [...prevMessages, { role: 'user', text: userMessage }]);
      websocket.send(userMessage);
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
          <div key={index} className={`rounded-md border-2 border-slate-300 hover:border-blue-400 ${message.role === 'user' ? 'bg-white ' : 'bg-white'} p-4 mb-2`}>
            <Text className="text-black">{message.text}</Text>
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
        <ChatbotGemini />
      </div>
    );
  };
  
  export default Y;
