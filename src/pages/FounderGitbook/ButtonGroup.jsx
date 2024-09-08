import React from "react";
import { Dropdown, Menu } from "antd";
import { Settings } from "lucide-react";
import { Button } from "../../components/ui/button";

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
      overlay={menuItems}
      placement="bottomRight"
      disabled={isLoading}
      // icon={<SettingOutlined />}
      onClick={(e) => e.preventDefault()} // Prevents the dropdown from closing when clicking the button
    className="m-0"
    >
      <Button variant="outline">
        <Settings className="mr-2 h-4 w-4" />
        <span>Profile Settings</span>
      </Button>
    </Dropdown>
  );
};

export default ButtonGroup;
