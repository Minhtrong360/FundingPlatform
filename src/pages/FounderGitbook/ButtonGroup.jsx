import React from "react";
import { Dropdown, Menu } from "antd";

const ButtonGroup = ({
  handleDrawChart,
  handleCompanySettings,
  handleSave,
  handleRequired,
  currentProject,
  isLoading,
}) => {
  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "chart":
        handleDrawChart();
        break;
      case "settings":
        handleCompanySettings();
        break;
      case "save":
        handleSave();
        break;
      case "verification":
        handleRequired();
        break;
      default:
        break;
    }
  };

  const menuItems = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="chart">Chart</Menu.Item>
      <Menu.Item key="settings">Settings</Menu.Item>
      <Menu.Item key="save">Save</Menu.Item>
      <Menu.Item key="verification" disabled={currentProject.required}>
        {currentProject.required
          ? currentProject.verified
            ? "Verified"
            : "Waiting for verification"
          : "Required verification"}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown.Button
      className={`bg-blue-600 text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm  py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
      overlay={menuItems}
      placement="bottomRight"
      disabled={isLoading}
      onClick={(e) => e.preventDefault()} // Prevents the dropdown from closing when clicking the button
    >
      <span className="p-1">Actions</span>
    </Dropdown.Button>
  );
};

export default ButtonGroup;
