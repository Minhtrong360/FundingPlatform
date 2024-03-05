import { Tooltip } from "antd";
import React from "react";

const MetricsFM = () => {
  // Define data for each card
  const cardData = [
    { text: "Total users", number: "72,540", percentage: "1.7%" },
    { text: "Total revenue", number: "$100,000", percentage: "3.2%" },
    { text: "Active users", number: "15,000", percentage: "2.1%" },
    { text: "New users", number: "5,000", percentage: "0.8%" },
  ];

  return (
    <div className="max-w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="flex flex-col bg-white border shadow-sm rounded-xl"
          >
            <div className="p-4 md:p-5">
              <div className="flex items-center gap-x-2">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {card.text}
                </p>
                <Tooltip title="The number of daily users">
                  <svg
                    className="flex-shrink-0 size-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                </Tooltip>
              </div>

              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-800">
                  {card.number}
                </h3>
                <span className="flex items-center gap-x-1 text-green-600">
                  <svg
                    className="inline-block size-4 self-center"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                  <span className="inline-block text-sm">
                    {card.percentage}
                  </span>
                </span>
              </div>
              <div>Say something</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsFM;
