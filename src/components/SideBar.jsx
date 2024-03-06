import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import FolderCopyOutlinedIcon from "@mui/icons-material/FolderCopyOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import icons8 from "./icons8-home.gif";

function SideBar({ toggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setSelectedItem(location.pathname);
  }, [location]);

  const handleItemClick = (route) => {
    navigate(route);
  };

  return (
    <aside
      id="default-sidebar"
      className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out transform ${
        isSidebarOpen ? "w-auto" : "w-24 "
      } group hover:w-64 bg-gray-50 dark:bg-blue-900`}
      aria-label="Sidebar"
    >
      <style>
        {`
          .sidebar-text {
            max-width: 0;
            overflow: hidden;
            white-space: nowrap;
            transition: max-width 0.5s ease-in-out, opacity 0.5s ease;
            opacity: 0;
          }
          .group:hover .sidebar-text {
            max-width: 300px; /* Adjust as needed */
            opacity: 1;
            margin-left: 8px;
          }
          .sidebar-button {
            display: flex;
            justify-content: center; /* Căn giữa theo chiều ngang */
          }
          .group:hover .sidebar-button {
            justify-content: flex-start; /* Căng trái khi hover */
          }
        `}
      </style>
      <div className="mx-auto flex flex-col items-start h-full px-3 py-4 space-y-2 overflow-y-auto">
        <button
          className="w-full p-2 group flex items-center rounded-lg font-semibold text-xl text-blue-600 sidebar-button"
          onClick={() => navigate("/")}
        >
          <HomeOutlinedIcon fontSize="large" />
          <span className="sidebar-text">BeeKrowd</span>
        </button>
        <button
          className={`w-full p-2 group flex items-center rounded-lg font-medium ${
            selectedItem?.includes("/user-info")
              ? "bg-gray-300 "
              : "text-gray-900 darkTextWhite"
          } sidebar-button`}
          onClick={() => handleItemClick("/user-info")}
        >
          <AccountCircleOutlinedIcon fontSize="large" />
          <span className="sidebar-text">User Settings</span>
        </button>
        <button
          className={`w-full p-2 group flex items-center rounded-lg font-medium ${
            selectedItem?.includes("/dashboard")
              ? "bg-gray-300 "
              : "text-gray-900 darkTextWhite"
          } sidebar-button`}
          onClick={() => handleItemClick("/dashboard")}
        >
          <SpaceDashboardOutlinedIcon fontSize="large" className="stroke-1" />
          <span className="sidebar-text">Dashboard</span>
        </button>
        <button
          className={`w-full p-2 group flex items-center rounded-lg font-medium ${
            selectedItem?.includes("/financials")
              ? "bg-gray-300 "
              : "text-gray-900 darkTextWhite"
          } sidebar-button`}
          onClick={() => handleItemClick("/financials")}
        >
          <CalculateOutlinedIcon fontSize="large" />
          <span className="sidebar-text">Financials</span>
        </button>
        <button
          className={`w-full p-2 group flex items-center rounded-lg font-medium  ${
            selectedItem?.includes("/founder")
              ? "bg-gray-300"
              : "text-gray-900 darkTextWhite"
          } sidebar-button`}
          onClick={() => handleItemClick("/founder")}
        >
          <FolderCopyOutlinedIcon fontSize="large" />
          <span className="sidebar-text">Projects</span>
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
