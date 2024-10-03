import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import { Progress } from "antd";
import { motion } from "framer-motion";

const backendTasks = [
  "Initializing data structures...",
  "Fetching business model preferences...",
  "Analyzing input parameters...",
  "Optimizing input values...",
  "Applying input values to calculations...",
  "Generating response...",
  "Finalizing outputs...",
];

const ProgressBar = ({ spinning, isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [loadingInterval, setLoadingInterval] = useState(200); // Default interval for loading
  const [closingTimeout, setClosingTimeout] = useState(null); // Timeout for closing the ProgressBar

  useEffect(() => {
    const updateProgress = () => {
      setProgress((prevProgress) => {
        if (isLoading && prevProgress >= 99) {
          return 99;
        } else if (!isLoading && prevProgress >= 100) {
          clearInterval(interval); // Stop interval when progress reaches 100
          return 100;
        }
        return prevProgress + 1;
      });
    };

    const interval = setInterval(updateProgress, loadingInterval);

    return () => clearInterval(interval);
  }, [loadingInterval, isLoading]);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      setLoadingInterval(700); // Start with the fast loading interval
      clearTimeout(closingTimeout); // Clear any existing closing timeout
    } else {
      setClosingTimeout(setTimeout(() => setProgress(100), 5000));
    }
  }, [isLoading]);

  useEffect(() => {
    const taskInterval = setInterval(() => {
      const randomTask =
        backendTasks[Math.floor(Math.random() * backendTasks.length)];
      setCurrentTask(randomTask);
    }, 3000); // Change task every 3 seconds

    return () => clearInterval(taskInterval);
  }, []);

  return (
    <>
      <Modal
        zIndex={42424244}
        ariaHideApp={false}
        isOpen={isLoading || progress < 100} // Keep modal open until progress reaches 100
        style={{
          overlay: {
            backgroundColor: "white",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          },
          content: {
            border: "none",
            background: "none",
            margin: "auto",
          },
        }}
      >
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200 stroke-current"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              ></circle>
              <motion.circle
                className="text-blue-500 stroke-current"
                strokeWidth="10"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                initial={{ strokeDasharray: "0 251.2" }}
                animate={{ strokeDasharray: `${progress * 2.512} 251.2` }}
                transition={{ duration: 0.3 }}
              ></motion.circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-semibold">{`${Math.round(progress)}%`}</span>
            </div>
          </div>

          <div className="text-blue-600 mb-4">
            <p className="text-lg font-medium text-gray-700">{currentTask}</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProgressBar;
