import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import { Progress } from "antd";

const ProgressBar = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [loadingInterval, setLoadingInterval] = useState(200); // Default interval for loading

  useEffect(() => {
    const updateProgress = () => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
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
    }
  }, [isLoading]);

  useEffect(() => {
    // Adjust interval based on isLoading status
    setLoadingInterval(isLoading ? 200 : 2000); // Example: 200ms when loading, 2000ms when not loading
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isLoading]);

  return (
    <>
      <Modal
        ariaHideApp={false}
        isOpen={isLoading}
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
