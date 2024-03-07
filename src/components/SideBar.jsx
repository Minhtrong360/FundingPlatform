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
      } group hover:w-64 bg-gray-50 `}
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
            font-size: 16px
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
      <div className="mt-16 mx-auto flex flex-col items-start h-full px-3 py-4 space-y-2 overflow-y-auto">
        <button
          className="mt-2  w-full p-2 group flex items-center rounded-lg text-sm  sidebar-button"
          onClick={() => navigate("/")}
        >
          <img
            width="18"
            height="18"
            src="https://img.icons8.com/ios/50/home--v1.png"
            alt="home--v1"
          />
          <span className="sidebar-text">Home</span>
        </button>
        <button
          className={`mt-2 mb-2 w-full p-2 group flex items-center rounded-lg text-sm ${
            selectedItem?.includes("/user-info")
              ? "bg-gray-300 "
              : "text-gray-900 darkTextWhite"
          } sidebar-button`}
          onClick={() => handleItemClick("/user-info")}
        >
          <img
            width="18"
            height="18"
            src="https://img.icons8.com/ios/50/user--v1.png"
            alt="user--v1"
          />
          <span className="sidebar-text">User Settings</span>
        </button>
        <button
          className={`mt-2 mb-2 w-full p-2 group flex items-center rounded-lg text-sm ${
            selectedItem?.includes("/dashboard")
              ? "bg-gray-300 "
              : "text-gray-900 darkTextWhite"
          } sidebar-button`}
          onClick={() => handleItemClick("/dashboard")}
        >
          <img
            width="18"
            height="18"
            src="https://img.icons8.com/ios/50/control-panel--v2.png"
            alt="control-panel--v2"
          />
          <span className="sidebar-text">Dashboard</span>
        </button>
        <button
          className={`mt-2 mb-2 w-full p-2 group flex items-center rounded-lg text-sm ${
            selectedItem?.includes("/financials")
              ? "bg-gray-300 "
              : "text-gray-900 darkTextWhite"
          } sidebar-button`}
          onClick={() => handleItemClick("/financials")}
        >
          <img
            width="18"
            height="18"
            src="https://img.icons8.com/ios/50/investment.png"
            alt="investment"
          />
          <span className="sidebar-text">Financials</span>
        </button>
        <button
          className={`mt-2 mb-2 w-full p-2 group flex items-center rounded-lg text-sm  ${
            selectedItem?.includes("/founder")
              ? "bg-gray-300"
              : "text-gray-900 darkTextWhite"
          } sidebar-button`}
          onClick={() => handleItemClick("/founder")}
        >
          <img
            width="18"
            height="18"
            src="https://img.icons8.com/ios/50/folder-invoices--v1.png"
            alt="folder-invoices--v1"
          />
          <span className="sidebar-text">Projects</span>
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
