import { DashboardOutlined, UserOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';

function SideBar({ toggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();

  return (
    <div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? "" : "-translate-x-full sm:translate-x-0"
        }`}
        aria-label="Sidebar"
        aria-hidden={!isSidebarOpen}
        onClick={toggleSidebar}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                className="p-2 hover:cursor-pointer font-semibold text-2xl text-blue-600 flex items-center space-x-3 rtl:space-x-reverse hover:cursor-pointer"
                onClick={() => navigate("/")}
              >
                BeeKrowd
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate("/user-info")}
                className=" hover:cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <AccountCircleOutlinedIcon />
                <span className="ms-3">User Settings</span>
              </a>
            </li>
            {/* <li>
              <a
                onClick={() => navigate("/dashboard")}
                className=" hover:cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <SpaceDashboardOutlinedIcon />
                <span className="ms-3">Dashboard</span>
              </a>
            </li> */}
            <li>
              <a
                onClick={() => navigate("/founder")}
                className="hover:cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FolderCopyOutlinedIcon/>
                <span className="ms-3">Projects</span>
              </a>
            </li>

            {/* Add more list items as needed */}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default SideBar;
