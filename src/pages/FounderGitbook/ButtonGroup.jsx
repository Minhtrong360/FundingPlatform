import React from "react";
import { Dropdown, Menu } from "antd";
import { SettingOutlined } from "@ant-design/icons";

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
      <Menu.Item key="chart">Draw Chart</Menu.Item>
      <Menu.Item key="settings">Profile Settings</Menu.Item>
      {/* <Menu.Item key="save">Save</Menu.Item> */}
      <Menu.Item key="verification" disabled={currentProject.required}>
        {currentProject.required
          ? currentProject.verified
            ? "Verified"
            : "Verifying"
          : "Verify profile"}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown.Button
      className={`bg-yellow-300 text-black focus:ring-4 focus:outline-none font-medium rounded-md text-sm py-1.5 px-0.5 text-center`}
      overlay={menuItems}
      placement="bottomRight"
      disabled={isLoading}
      icon={<SettingOutlined />}
      onClick={(e) => e.preventDefault()} // Prevents the dropdown from closing when clicking the button
    >
      {/* <span className="p-1">Action</span> */}
    </Dropdown.Button>
  );
};

export default ButtonGroup;
