import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const CredentialModal = ({ visible, onSubmit, onCancel }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleOk = () => {
    if (!id || !password) {
      message.error("Please enter both ID and password.");
      return;
    }
    onSubmit({ id, password });
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Modal
      zIndex={42424244}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Submit"
      cancelText="Cancel"
      centered
      styles={{ mask: { backgroundColor: "black" } }} // This will set the background color
    >
      <div className="zubuz-account-field">
        <label>Enter your full name</label>
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
      </div>

      <div className="zubuz-account-field">
        <label>Enter Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CredentialModal;
