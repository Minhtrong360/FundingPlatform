import React, { useState } from "react";
import { Modal, Button } from "antd";
import step1 from "./step1.png";
import step2 from "./step2.png";
import step3 from "./step3.png";
const StepByStepModal = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Open Instructions
      </Button>
      <Modal
        open={visible}
        title="How to Apply Your Project?"
        footer={null}
        onCancel={handleCancel}
        centered
        style={{
          maxWidth: "56rem",
          fontSize: "30px",
          lineHeight: "36px",
          marginBottom: "2rem",
        }}
      >
        <div className="space-y-6">
          <div className="text-lg font-semibold">
            Step 1: Find "Project list"
          </div>
          <img
            src={step1}
            alt="Find Project list"
            className="w-full h-auto border rounded-lg"
          />
          <div className="text-lg font-semibold">
            Step 2: Choose "Action" &gt; "Submit"
          </div>
          <img
            src={step2}
            alt="Choose Action > Submit"
            className="w-full h-auto border rounded-lg"
          />
          <div className="text-lg font-semibold">
            Step 3: Fill all required information and "Submit"
          </div>
          <img
            src={step3}
            alt="Fill Information and Submit"
            className="w-full h-auto border rounded-lg"
          />
        </div>
      </Modal>
    </div>
  );
};

export default StepByStepModal;
