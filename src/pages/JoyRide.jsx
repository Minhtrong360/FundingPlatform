import React, { useState } from "react";
import Joyride, { STATUS, CallBackProps, Step } from "react-joyride";
import {QuestionCircleOutlined } from "@ant-design/icons";
function TourComponent() {
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("customer");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const steps = [
    {
      target: ".tab-1",
      content: "How to start create a customer channel?",
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 20,
    },
    {
      target: ".tab-2",
      content: "How to start create a revenue channel?",
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 20,
    },
    {
      target: ".tab-3",
      content: "How to start create a income channel?",
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 20,
    },
    {
      target: ".tab-4",
      content: "Manage your balance sheet",
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 20,
    },
    {
      target: ".tab-5",
      content: "Manage your cash flow",
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 20,
    },
  ];

  const handleTourStatusChange = (data) => {
    if (data.status === "finished") {
      setIsTourRunning(false);
    }
  };
  const startTour = () => {
    setIsTourRunning(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "customer":
        return <p>Content for Customer tab goes here...</p>;
      case "revenue":
        return <p>Content for Revenue tab goes here...</p>;
      case "income":
        return <p>Content for Income tab goes here...</p>;
      case "balance":
        return <p>Content for Balance Sheet tab goes here...</p>;
      case "cashFlow":
        return <p>Content for Cash Flow tab goes here...</p>;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <div className="rounded-lg bg-blue-600 text-white shadow-lg p-4 mr-4">
        <button onClick={startTour}>
      <QuestionCircleOutlined />
      </button>
       </div> 
      <div className="w-2/3 rounded-lg bg-white shadow-lg p-4 ">
        <nav className="bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                className={`tab-1 text-white px-3 py-2 rounded-md hover:bg-gray-700 ${
                  activeTab === "customer" ? "bg-gray-700" : ""
                }`}
                onClick={() => handleTabClick("customer")}
              >
                Customer
              </button>
              <button
                className={`tab-2 text-white px-3 py-2 rounded-md hover:bg-gray-700 ${
                  activeTab === "revenue" ? "bg-gray-700" : ""
                }`}
                onClick={() => handleTabClick("revenue")}
              >
                Revenue
              </button>
              <button
                className={`tab-3 text-white px-3 py-2 rounded-md hover:bg-gray-700 ${
                  activeTab === "income" ? "bg-gray-700" : ""
                }`}
                onClick={() => handleTabClick("income")}
              >
                Income
              </button>
              <button
                className={`tab-4 text-white px-3 py-2 rounded-md hover:bg-gray-700 ${
                  activeTab === "balance" ? "bg-gray-700" : ""
                }`}
                onClick={() => handleTabClick("balance")}
              >
                Balance Sheet
              </button>
              <button
                className={`tab-5 text-white px-3 py-2 rounded-md hover:bg-gray-700 ${
                  activeTab === "cashFlow" ? "bg-gray-700" : ""
                }`}
                onClick={() => handleTabClick("cashFlow")}
              >
                Cash Flow
              </button>
            </div>
          </div>
        </nav>
        <div className="container mx-auto p-4">{renderTabContent()}</div>
        <Joyride
          continuous
          run={isTourRunning}
          steps={steps}
          hideCloseButton
          scrollToFirstStep
          showSkipButton
          showProgress
          callback={handleTourStatusChange}
          
        />
      </div>
    </div>
  );
}

export default TourComponent;
