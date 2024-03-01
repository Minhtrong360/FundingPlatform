import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import FolderCopyOutlinedIcon from "@mui/icons-material/FolderCopyOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
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
    <div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 darkTextGray darkHoverBgBlue darkFocus"
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
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 darkBgBlue">
          <ul className="space-y-2 font-medium">
            <li>
              <button
                className="p-2  font-semibold text-xl text-blue-600 flex items-center space-x-3 rtl:space-x-reverse hover:cursor-pointer"
                onClick={() => navigate("/")}
              >
                <HomeOutlinedIcon />
                <span>BeeKrowd</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleItemClick("/user-info")}
                className={` w-full hover:cursor-pointer flex items-center p-2 rounded-lg group ${
                  selectedItem?.includes("/user-info")
                    ? "bg-gray-200 "
                    : "text-gray-900 darkTextWhite"
                }`}
              >
                <AccountCircleOutlinedIcon />
                <span className="ms-3">User Settings</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleItemClick("/dashboard")}
                className={`w-full hover:cursor-pointer flex items-center p-2 rounded-lg group ${
                  selectedItem?.includes("/dashboard")
                    ? "bg-gray-200 "
                    : "text-gray-900 darkTextWhite"
                }`}
              >
                <SpaceDashboardOutlinedIcon />
                <span className="ms-3">Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleItemClick("/financials")}
                className={`w-full hover:cursor-pointer flex items-center p-2 rounded-lg group ${
                  selectedItem?.includes("/financials")
                    ? "bg-gray-200 "
                    : "text-gray-900 darkTextWhite"
                }`}
              >
                <CalculateOutlinedIcon />
                <span className="ms-3">Financials</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleItemClick("/founder")}
                className={`w-full hover:cursor-pointer flex items-center p-2 rounded-lg group ${
                  selectedItem.includes("/founder")
                    ? "bg-gray-200 "
                    : "text-gray-900 darkTextWhite"
                }`}
              >
                <FolderCopyOutlinedIcon />
                <span className="ms-3">Projects</span>
              </button>
            </li>

            {/* Add more list items as needed */}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default SideBar;
