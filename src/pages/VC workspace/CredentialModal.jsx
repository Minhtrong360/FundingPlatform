import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";

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

  return (
    <Modal
      title="Enter Credentials"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Submit"
      cancelText="Cancel"
      centered
      styles={{ mask: { backgroundColor: "black" } }} // This will set the background color
    >
      <Input
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Input.Password
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </Modal>
  );
};

export default CredentialModal;
