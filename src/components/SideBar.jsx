import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckSquareOutlined,
  DashboardOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  ProfileOutlined,
  ShopOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

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

  const { currentUser } = useAuth();

  return (
    <div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="z-30 inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-md sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
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
        className={`fixed top-0 left-0 z-20 h-screen transition-transform duration-300 ease-out transform w-16 group hover:w-64 bg-gray-50 ${
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
            
            opacity: 0;
        }
          .group:hover .sidebar-text {
            max-width: 300px; /* Adjust as needed */
            opacity: 1;
            margin-left: 8px;
            font-size: 12px
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
            className="mt-2  w-full p-2 group flex items-center rounded-md text-sm  sidebar-button hover:bg-gray-200"
            onClick={() => navigate("/")}
          >
            <HomeOutlined />
            <span className="sidebar-text">Home</span>
          </button>
          {currentUser[0].admin && (
            <button
              style={{ minWidth: "100%" }}
              className={`mt-2 mb-2 w-full p-2 group flex items-center rounded-md text-sm ${
                selectedItem?.includes("/admin")
                  ? "bg-gray-300 "
                  : "text-gray-900 darkTextWhite"
              } sidebar-button hover:bg-gray-200`}
              onClick={() => navigate("/admin")}
            >
              <UserSwitchOutlined />
              <span className="sidebar-text">Admin Dashboard</span>
            </button>
          )}
          <button
            className={`mt-2 mb-2 w-full p-2 group flex items-center rounded-md text-sm ${
              selectedItem?.includes("/user-info")
                ? "bg-gray-300 "
                : "text-gray-900 darkTextWhite"
            } sidebar-button hover:bg-gray-200`}
            onClick={() => handleItemClick("/user-info")}
          >
            <UserOutlined />
            <span className="sidebar-text">User Settings</span>
          </button>
          <button
            className={`mt-2 mb-2 w-full p-2 group flex items-center rounded-md text-sm ${
              selectedItem?.includes("/dashboard")
                ? "bg-gray-300 "
                : "text-gray-900 darkTextWhite"
            } sidebar-button hover:bg-gray-200 `}
            onClick={() => handleItemClick("/dashboard")}
          >
            <DashboardOutlined />
            <span className="sidebar-text">Dashboard</span>
          </button>
          <button
            className={`mt-2 mb-2 w-full p-2 group flex items-center rounded-md text-sm ${
              selectedItem?.includes("/financials")
                ? "bg-gray-300 "
                : "text-gray-900 darkTextWhite"
            } sidebar-button hover:bg-gray-200`}
            onClick={() => handleItemClick("/financials")}
          >
            <DollarCircleOutlined />
            <span className="sidebar-text">Financial Model</span>
          </button>
          <button
            className={`mt-2 mb-2 w-full p-2 group flex items-center rounded-md text-sm  ${
              selectedItem?.includes("/profile")
                ? "bg-gray-300"
                : "text-gray-900 darkTextWhite"
            } sidebar-button hover:bg-gray-200`}
            onClick={() => handleItemClick("/profile")}
          >
            <ProfileOutlined />
            <span className="sidebar-text">Project list</span>
          </button>
          {/* <button
            className={`mt-2 mb-2 w-full p-2 group flex items-center rounded-md text-sm  ${
              selectedItem?.includes("/Flea-Market")
                ? "bg-gray-300"
                : "text-gray-900 darkTextWhite"
            } sidebar-button hover:bg-gray-200`}
            onClick={() => handleItemClick("/Flea-Market")}
          >
            <ShopOutlined />
            <span className="sidebar-text">Flea Market</span>
          </button> */}
          <button
            className={`mt-2 mb-2 w-full p-2 group flex items-center rounded-md text-sm  ${
              selectedItem?.includes("/workspace")
                ? "bg-gray-300"
                : "text-gray-900 darkTextWhite"
            } sidebar-button hover:bg-gray-200`}
            onClick={() => handleItemClick("/workspace")}
          >
            <CheckSquareOutlined />
            <span className="sidebar-text">Work Space</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

export default SideBar;
