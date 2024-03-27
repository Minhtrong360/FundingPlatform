  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";

  import AccountCircleIcon from "@mui/icons-material/AccountCircle";
  import { useAuth } from "../../context/AuthContext";
  import { toast } from "react-toastify";
  import { supabase } from "../../supabase";
  import { message } from "antd";
  import { UserOutlined } from '@ant-design/icons';
  import { BellOutlined } from '@ant-design/icons';
  import { UserSwitchOutlined } from '@ant-design/icons';
  import { DashboardOutlined } from '@ant-design/icons';
  import { DollarCircleOutlined } from '@ant-design/icons';
  import { ProfileOutlined } from '@ant-design/icons';
  import { LogoutOutlined } from '@ant-design/icons';



  


  const ImageDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, signOut } = useAuth();
    const [userData, setUserData] = useState({
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
    });

    useEffect(() => {
      // Tạo một async function để lấy thông tin người dùng từ Supabase
      async function fetchUserData() {
        try {
          if (!navigator.onLine) {
            // Không có kết nối Internet
            message.error("No internet access.");
            return;
          }

          // Thực hiện truy vấn để lấy thông tin người dùng theo id (điều này cần được thay đổi dựa trên cấu trúc dữ liệu của bạn trong Supabase)
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id) // Thay "id" bằng trường id thực tế trong cơ sở dữ liệu của bạn
            .single(); // Sử dụng .single() để lấy một bản ghi duy nhất

          if (error) {
            throw error;
          }

          // Cập nhật state userData với thông tin người dùng đã lấy được
          if (data) {
            setUserData(data);
          }
        } catch (error) {
          message.error(error.message);
          console.error("Error fetching user data:", error);
        }
      }

      // Gọi hàm fetchUserData khi component được mount
      fetchUserData();
    }, [user.id]); // Sử dụng user.id làm phần tử phụ thuộc để useEffect được gọi lại khi user.id thay đổi

    const navigate = useNavigate();

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

    const handleClickFinancial = (e) => {
      navigate("/financials");
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

    const handleClickNotifications = async (e) => {
      const { error } = await supabase
        .from("users")
        .update({ notification_count: 0 })
        .eq("id", user.id); // Thay "id" bằng trường id thực tế trong cơ sở dữ liệu của bạn

      if (error) {
        throw error;
      }

      navigate("/notifications");
      handleClickOutside(e);
      setIsOpen(false);
    };

    return (
      <div className="hs-dropdown relative inline-flex z-30">
        <button
          id="hs-dropdown-custom-trigger"
          type="button"
          className="hs-dropdown-toggle py-1 ps-1 pe-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none darkBgBlue darkBorderGray darkTextWhite darkHoverBgBlue darkFocusOutlineNone darkFocusRing-1 darkFocus"
          onClick={toggleDropdown}
        >
          {userData.avatar ? (
            <img
              className="w-8 h-auto rounded-full"
              src={userData.avatar}
              alt={userData.email}
            />
          ) : (
            <AccountCircleIcon fontSize="large" />
          )}

          <span className="text-gray-600 font-medium truncate sm:max-w-[7.5rem] max-w-[4rem] darkTextGray">
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
            className="hs-dropdown-menu transition-[opacity,margin] duration-300 opacity-100  bg-white shadow-md rounded-md p-2 mt-2 absolute left-0 top-full"
          >
            

            

            {userData.admin && (
              <button
                style={{ minWidth: "100%" }}
                className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
                onClick={() => navigate("/admin")}
              >
                < UserSwitchOutlined />
                Admin dashboard
              </button>
            )}

            <button
              style={{ minWidth: "100%" }}
              className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
              onClick={(e) => handleClickUserInfo(e)}
            >
              <UserOutlined />
              User settings
            </button>
            <button
              style={{ minWidth: "100%" }}
              className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
              onClick={(e) => handleClickDashBoard(e)}
            >
              <DashboardOutlined />
              User dashboard  
            </button>

            <button
              style={{ minWidth: "100%" }}
              className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
              onClick={(e) => handleClickFinancial(e)}
            > 
              <DollarCircleOutlined />  
              Financial model
            </button>
            <button
              style={{ minWidth: "100%" }}
              className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
              onClick={(e) => handleClickProject(e)}
            >
              <ProfileOutlined />
              Project list
            </button>

            <button
              style={{ minWidth: "100%" }}
              className="hover:cursor-pointer flex items-center justify-between gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
              onClick={(e) => handleClickNotifications(e)}
            >
              <span className="flex items-center gap-x-3.5">
              <BellOutlined /> Notifications</span>
              <span className="bg-red-600 text-white h-7 w-7 rounded-full text-sm flex items-center justify-center">
                {userData.notification_count ? userData.notification_count : 0}{" "}
                {/* Display the notification count here */}
              </span>
            </button>

            <hr />
            <button
              style={{ minWidth: "100%" }}
              onClick={(e) => handleLogout(e)}
              className="hover:cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 darkTextGray darkHoverBgBlue darkHoverTextWhite darkFocusBgBlue"
            >
              <LogoutOutlined />
              Log out
            </button>
          </div>
        )}
      </div>
    );
  };

  export default ImageDropdown;
