import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import { Progress } from "antd";

const ProgressBar = ({ spinning, isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [loadingInterval, setLoadingInterval] = useState(200); // Default interval for loading
  const [closingTimeout, setClosingTimeout] = useState(null); // Timeout for closing the ProgressBar

  useEffect(() => {
    const updateProgress = () => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval); // Stop interval when progress reaches 100
          return 100;
        }
        return prevProgress + 1;
      });
    };

    const interval = setInterval(updateProgress, loadingInterval);

    return () => clearInterval(interval);
  }, [loadingInterval]); // Re-run effect when loadingInterval changes

  useEffect(() => {
    // Reset progress to 0 when isLoading becomes true
    if (isLoading) {
      setProgress(0);
      setLoadingInterval(200); // Start with the fast loading interval
      clearTimeout(closingTimeout); // Clear any existing closing timeout
    } else {
      // Set progress to 100 immediately when isLoading becomes false
      setProgress(100);
      // Optionally, you can set a timeout to close the ProgressBar after a delay
      setClosingTimeout(setTimeout(() => setProgress(100), 750));
    }
  }, [isLoading]);

  return (
    <>
      <Modal
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
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div className=" text-blue-600">
            <Progress
              type="circle"
              percent={progress}
              strokeWidth={12}
              size="large"
              className="h-full w-full flex justify-center items-center"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProgressBar;
