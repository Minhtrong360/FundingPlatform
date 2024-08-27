import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../../context/AuthContext";

import { supabase } from "../../supabase";
import { ShopOutlined, UserOutlined } from "@ant-design/icons";
import { BellOutlined } from "@ant-design/icons";
import { UserSwitchOutlined } from "@ant-design/icons";
import { DashboardOutlined } from "@ant-design/icons";
import { DollarCircleOutlined } from "@ant-design/icons";
import { ProfileOutlined } from "@ant-design/icons";
import { LogoutOutlined } from "@ant-design/icons";

const ImageDropdown = ({ isContentChanged }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, currentUser } = useAuth();
  const userData = currentUser
    ? currentUser[0]
    : {
        full_name: "",
        email: "",
        plan: "",
        subscribe: "",
        company: "",
        company_website: "",
        detail: "",
        roll: "Founder",
        avatar: null,
        notification_count: 0,
      };

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    if (isContentChanged) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page?"
      );
      if (!confirmLeave) return;
    }
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = (e) => {
    if (isContentChanged) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to log out?"
      );
      if (!confirmLeave) return;
    }
    handleClickOutside(e); // Close the dropdown before signing out
    signOut();
    navigate("/");
  };

  const handleClickOutside = (event) => {
    if (!document.querySelector(".hs-dropdown").contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleClickUserInfo = (e) => {
    handleNavigation("/user-info");
  };

  const handleClickDashBoard = (e) => {
    handleNavigation("/dashboard");
  };

  const handleClickProject = (e) => {
    handleNavigation("/profile");
  };

  const handleClickFleaMarket = (e) => {
    handleNavigation("/Flea-Market");
  };

  const handleClickFinancial = (e) => {
    handleNavigation("/financials");
  };

  // Attach or detach event listener based on isOpen state
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleClickNotifications = async (e) => {
    const { error } = await supabase
      .from("users")
      .update({ notification_count: 0 })
      .eq("id", user.id);

    if (error) {
      throw error;
    }

    handleNavigation("/notifications");
  };

  return (
    <div className="hs-dropdown rounded-md relative inline-flex z-30">
      <button
        id="hs-dropdown-custom-trigger"
        type="button"
        className="hs-dropdown-toggle py-1 ps-1 pe-3 inline-flex items-center gap-x-2 text-sm  rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none darkBgBlue darkBorderGray darkTextWhite darkHoverBgBlue darkFocusOutlineNone darkFocusRing-1 darkFocus"
        onClick={toggleDropdown}
      >
        {userData.avatar ? (
          <img
            className="w-8 h-8 rounded-full"
            src={userData.avatar}
            alt={userData.email}
          />
        ) : (
          <AccountCircleIcon fontSize="large" />
        )}

        <span className="text-gray-600 text-sm truncate sm:max-w-[7.5rem] max-w-[4rem] darkTextGray">
          {userData.email ? userData.email : ""}
        </span>
        <svg
          className={`hs-dropdown-open:${isOpen ? "rotate-180" : ""} w-4 h-4`}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{ minWidth: "100%" }}
          className="hs-dropdown-menu transition-[opacity,margin] duration-300 opacity-100  bg-white shadow-md rounded-lg p-2 mt-2 absolute left-0 top-full"
        >
          {userData.admin && (
            <button
              style={{ minWidth: "100%" }}
              className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
              onClick={() => handleNavigation("/admin")}
            >
              <UserSwitchOutlined />
              Admin Dashboard
            </button>
          )}

          <button
            style={{ minWidth: "100%" }}
            className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
            onClick={handleClickUserInfo}
          >
            <UserOutlined />
            User Settings
          </button>
          <button
            style={{ minWidth: "100%" }}
            className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
            onClick={handleClickDashBoard}
          >
            <DashboardOutlined />
            User Dashboard
          </button>

          <button
            style={{ minWidth: "100%" }}
            className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
            onClick={handleClickFinancial}
          >
            <DollarCircleOutlined />
            Financial Model
          </button>
          <button
            style={{ minWidth: "100%" }}
            className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
            onClick={handleClickProject}
          >
            <ProfileOutlined />
            Project List
          </button>
          {/* <button
            style={{ minWidth: "100%" }}
            className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
            onClick={handleClickFleaMarket}
          >
            <ShopOutlined />
            Angel's Share
          </button> */}

          <button
            style={{ minWidth: "100%" }}
            className="hover:cursor-pointer flex items-center justify-between gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
            onClick={handleClickNotifications}
          >
            <span className="flex items-center gap-x-3.5">
              <BellOutlined /> Notifications
            </span>
            <span className="bg-red-600 text-white h-7 w-7 rounded-full text-sm flex items-center justify-center">
              {userData.notification_count ? userData.notification_count : 0}
            </span>
          </button>

          <hr />
          <button
            style={{ minWidth: "100%" }}
            onClick={handleLogout}
            className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
          >
            <LogoutOutlined />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageDropdown;
