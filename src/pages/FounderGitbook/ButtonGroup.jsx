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
    <Dropdown
      className={`bg-yellow-300 text-black focus:ring-4 focus:outline-none font-medium rounded-md text-sm py-3 text-center px-2 hover:cursor-pointer`}
      overlay={menuItems}
      placement="bottomRight"
      disabled={isLoading}
      // icon={<SettingOutlined />}
      onClick={(e) => e.preventDefault()} // Prevents the dropdown from closing when clicking the button
    >
      <div
        className={`bg-yellow-300 text-black focus:ring-4 focus:outline-none font-medium rounded-md text-sm py-3 text-center px-2 hover:cursor-pointer`}
      >
        <span className="sm:!block !hidden">
          <SettingOutlined /> Profile Settings
        </span>
        <span className="sm:!hidden !block">
          <SettingOutlined />
        </span>
      </div>
    </Dropdown>
  );
};

export default ButtonGroup;
