import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import FolderCopyOutlinedIcon from "@mui/icons-material/FolderCopyOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
function SideBar({ toggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setSelectedItem(location.pathname);
  }, [location]);

  const handleItemClick = (route) => {
    navigate(route);
  };

  return (
    <div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="z-30 inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-20 h-screen transition-all duration-300 ease-in-out transform w-16 group hover:w-64 bg-gray-50 ${
          isSidebarOpen ? "" : "-translate-x-full sm:translate-x-0"
        }`}
        aria-label="Sidebar"
        aria-hidden={!isSidebarOpen}
        onClick={toggleSidebar}
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
            className="mt-2  w-full p-2 group flex items-center rounded-lg text-sm  sidebar-button hover:bg-gray-300"
            onClick={() => navigate("/")}
          >
            <img
              className="w-5 h-5"
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
            } sidebar-button hover:bg-gray-300`}
            onClick={() => handleItemClick("/user-info")}
          >
            <img
              className="w-5 h-5"
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
            } sidebar-button hover:bg-gray-300 hover:bg-gray-300`}
            onClick={() => handleItemClick("/dashboard")}
          >
            <img
              className="w-5 h-5"
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
            } sidebar-button hover:bg-gray-300`}
            onClick={() => handleItemClick("/financials")}
          >
            <img
              className="w-5 h-5"
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
            } sidebar-button hover:bg-gray-300`}
            onClick={() => handleItemClick("/founder")}
          >
            <img
              className="w-5 h-5"
              src="https://img.icons8.com/ios/50/folder-invoices--v1.png"
              alt="folder-invoices--v1"
            />
            <span className="sidebar-text">Projects</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

export default SideBar;
