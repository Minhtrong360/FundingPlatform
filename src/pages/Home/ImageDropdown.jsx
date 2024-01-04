import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../../context/AuthContext";

const ImageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  console.log("user", user);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = (e) => {
    handleClickOutside(e); //menu close before signout so that login won't pop up.
    signOut();
    navigate("/");
  };

  const handleClickOutside = (event) => {
    if (!document.querySelector(".hs-dropdown").contains(event.target)) {
      setIsOpen(false);
    }
  };
  const handleClickUserInfo = (e) => {
    navigate("/user-info");
    handleClickOutside(e);
    setIsOpen(false);
  };
  const handleClickDashBoard = (e) => {
    navigate("/dashboard");
    handleClickOutside(e);
    setIsOpen(false);
  };
  const handleClickProject = (e) => {
    navigate("/founder");
    handleClickOutside(e);
    setIsOpen(false);
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

  return (
    <div className="hs-dropdown relative inline-flex z-30">
      <button
        id="hs-dropdown-custom-trigger"
        type="button"
        className="hs-dropdown-toggle py-1 ps-1 pe-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        onClick={toggleDropdown}
      >
        {user?.user_metadata?.avatar_url ? (
          <img
            className="w-8 h-auto rounded-full"
            src={user?.user_metadata?.avatar_url}
            alt="Maria"
          />
        ) : (
          <AccountCircleIcon />
        )}

        <span className="text-gray-600 font-medium truncate max-w-[7.5rem] dark:text-gray-400">
          {user?.user_metadata?.email
            ? user?.user_metadata?.email
            : user?.email
            ? user?.email
            : ""}
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
        <div className="hs-dropdown-menu transition-[opacity,margin] duration-300 opacity-100 min-w-[15rem] bg-white shadow-md rounded-lg p-2 mt-2 absolute left-0 top-full">
          {/* <a
            className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-700"
            onClick={(e) => handleClickUserInfo(e)}
          >
            User Info
          </a> */}
          <a
            className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-700"
            onClick={(e) => handleClickDashBoard(e)}
          >
            Dashboard
          </a>
          <a
            className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-700"
            onClick={(e) => handleClickProject(e)}
          >
            Projects
          </a>
          <hr />
          <a
            onClick={(e) => handleLogout(e)}
            className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-700"
          >
            Log out
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageDropdown;
