import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

import ImageDropdown from "./ImageDropdown";
import NavbarItem from "./NavbarItem";
import { useAuth } from "../../context/AuthContext";
import { ShopOutlined } from "@ant-design/icons";
import { CalculatorOutlined } from "@ant-design/icons";
import { RocketOutlined } from "@ant-design/icons";

const NavbarButton = ({ children, onClick, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-white bg-blue-600 hover:bg-blue-700800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-2 text-center darkBgBlue darkHoverBgBlue darkFocus ${className}`}
    >
      {children}
    </button>
  );
};

const Header = ({ position }) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [isHidden, setIsHidden] = useState(false);
  const { user } = useAuth();
  const [loginPart, setLoginPart] = useState("");
  const navigate = useNavigate();
  // Function to handle the click event of the Login button
  const handleLoginButtonClick = () => {
    navigate("/login"); // Show the LoginPage component when the button is clicked
  };

  const handleClickHome = (e) => {
    e.preventDefault();
    navigate("/");
  };

  // Khởi tạo state để theo dõi độ rộng của màn hình
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Tạo một hàm xử lý sự kiện để cập nhật độ rộng của màn hình
  const updateScreenWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  // Sử dụng useEffect để thêm và loại bỏ hàm xử lý sự kiện khi component mount và unmount
  useEffect(() => {
    // Gắn hàm xử lý sự kiện vào sự kiện thay đổi kích thước màn hình
    window.addEventListener("resize", updateScreenWidth);

    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, [screenWidth]);

  const location = useLocation();

  const handleBurgerBtn = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const loginPart = location.pathname;

    setLoginPart(loginPart);
  }, [location]); // Phụ thuộc vào location

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (screenWidth < 768) {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }

        // Check if the user has scrolled to the top of the page
        if (window.scrollY === 0) {
          setIsVisible(true);
        }

        setLastScrollY(window.scrollY);
      }
    } else setIsVisible(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      // Cleanup function
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`${
          position === "notFixed" ? "absolute" : "fixed "
        } z-50 top-0 start-0 bg-white darkBg w-full  border-b border-gray-300 darkBorderGray transition-transform duration-100 ease-in-out ${
          !isVisible ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 sm:py-4 py-1">
          <button
            onClick={(e) => handleClickHome(e)}
            className="font-semibold text-2xl text-blue-600 flex items-center space-x-3 rtl:space-x-reverse hover:cursor-pointer"
          >
            BeeKrowd
          </button>
          <div
            className={`flex ${
              screenWidth > 820 ? "order-2" : ""
            } space-x-3 rtl:space-x-reverse`}
          >
            {/* Conditionally render the Login button or user avatar */}
            {user ? (
              <>
                <ImageDropdown />
              </>
            ) : (
              <>
                {/* Render the Login button when not logged in */}
                <NavbarButton onClick={handleLoginButtonClick}>
                  Sign in
                </NavbarButton>
              </>
            )}

            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className={`inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-md ${
                screenWidth > 820 ? "hidden" : "block"
              } hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 darkTextGray darkHoverBgBlue darkFocus`}
              aria-controls="navbar-sticky"
              aria-expanded={isOpen}
              onClick={handleBurgerBtn}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 17 14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          <div
            className={`items-center justify-between
            ${screenWidth > 820 ? "order-1 w-auto" : "w-full"}
           
             ${isOpen ? "block" : "hidden"}`}
            id="navbar-sticky"
            style={screenWidth > 820 ? { display: "flex" } : {}}
          >
            <ul
              className={`${
                screenWidth > 820
                  ? "flex-row mt-0 p-0 border-0 bg-white"
                  : "flex-col mt-4 p-4 border-gray-100 bg-gray-50"
              } flex font-medium border rounded-md  md:space-x-4 lg:space-x-8 rtl:space-x-reverse  darkBgBlue md:darkBg darkBorderGray`}
              // style={screenWidth > 820 ? { display: "flex" } : {}}
            >
              <NavbarItem
                onClick={() => navigate(`/`)}
                isActive={loginPart === "/"}
              >
                Home
              </NavbarItem>
              <NavbarItem
                onClick={() => navigate(`/financials`)}
                isActive={loginPart.includes("financials")}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  Financial Model
                 
                </span>
              </NavbarItem>
              <NavbarItem
                onClick={() => navigate(`/startups`)}
                isActive={loginPart.includes("startups")}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  Profile Listing
                </span>
              </NavbarItem>
              <NavbarItem
                onClick={() => navigate(`/Flea-Market/info`)}
                isActive={loginPart.includes("Flea-Market")}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  Angel's Share
                </span>
              </NavbarItem>
              {/* <NavbarItem
                onClick={() => navigate(`/marketresearch`)}
                isActive={loginPart === "/"}
              >
                Market Research
              </NavbarItem> */}

              {/* <NavbarItem
                href="https://beekrowd.gitbook.io/beekrowd-financial-model-guide"
                target="_blank"
              >
                Documentation
              </NavbarItem>
              <NavbarItem
                href="https://beekrowd.canny.io/beekrowd-feedback"
                target="_blank"
              >
                Feedback
              </NavbarItem> */}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
