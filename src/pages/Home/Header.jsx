import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

import ImageDropdown from "./ImageDropdown";
import NavbarItem from "./NavbarItem";
import { useAuth } from "../../context/AuthContext";

const NavbarButton = ({ children, onClick, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800 ${className}`}
    >
      {children}
    </button>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [isHidden, setIsHidden] = useState(false);
  const { user } = useAuth();
  const [loginPart, setLoginPart] = useState("");
  const navigate = useNavigate();

  // Function to handle the click event of the Login button
  const handleLoginButtonClick = () => {
    navigate("/login"); // Show the LoginPage component when the button is clicked
  };

  // const handleFinancialProductClick = () => {
  //   // Lấy đối tượng ref của phần tử "Financial Product" từ Home component
  //   const financialProductRef = document.getElementById("platform"); // Đặt ID tương ứng với ref của bạn
  //   setIsOpen(!isOpen);
  //   if (financialProductRef) {
  //     // Sử dụng `scrollIntoView()` để cuộn đến phần tử "Financial Product"
  //     const elementRect = financialProductRef.getBoundingClientRect();
  //     const bodyRect = document.body.getBoundingClientRect();
  //     const offsetTop = elementRect.top - bodyRect.top;
  //     window.scrollTo({
  //       top: offsetTop - (window.innerHeight - elementRect.height) / 20,
  //       behavior: "smooth",
  //     });
  //   }
  // };
  const handleProductFeaturesClick = () => {
    // Lấy đối tượng ref của phần tử "Financial Product" từ Home component
    const financialProductRef = document.getElementById("profiles"); // Đặt ID tương ứng với ref của bạn
    setIsOpen(!isOpen);
    if (financialProductRef) {
      // Sử dụng `scrollIntoView()` để cuộn đến phần tử "Financial Product"
      const elementRect = financialProductRef.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const offsetTop = elementRect.top - bodyRect.top;
      window.scrollTo({
        top: offsetTop - (window.innerHeight - elementRect.height) / 20,
        behavior: "smooth",
      });
    }
  };

  const handlePricingClick = () => {
    // Lấy đối tượng ref của phần tử "Financial Product" từ Home component
    const financialProductRef = document.getElementById("pricing"); // Đặt ID tương ứng với ref của bạn
    setIsOpen(!isOpen);
    if (financialProductRef) {
      // Sử dụng `scrollIntoView()` để cuộn đến phần tử "Financial Product"
      const elementRect = financialProductRef.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const offsetTop = elementRect.top - bodyRect.top;
      window.scrollTo({
        top: offsetTop - (window.innerHeight - elementRect.height) / 20,
        behavior: "smooth",
      });
    }
  };

  // const handleFAQClick = () => {
  //   // Lấy đối tượng ref của phần tử "Financial Product" từ Home component
  //   const financialProductRef = document.getElementById("FAQ"); // Đặt ID tương ứng với ref của bạn
  //   setIsOpen(!isOpen);
  //   if (financialProductRef) {
  //     // Sử dụng `scrollIntoView()` để cuộn đến phần tử "Financial Product"
  //     const elementRect = financialProductRef.getBoundingClientRect();
  //     const bodyRect = document.body.getBoundingClientRect();
  //     const offsetTop = elementRect.top - bodyRect.top;
  //     window.scrollTo({
  //       top: offsetTop - (window.innerHeight - elementRect.height) / 20,
  //       behavior: "smooth",
  //     });
  //   }
  // };
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
    // if (screenWidth <= 1100) {
    //   setIsHidden(true);
    // } else setIsHidden(false);
    // Loại bỏ hàm xử lý sự kiện khi component unmount
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, [screenWidth]);

  const location = useLocation();

  const handleBurgerBtn = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const loginPart = location.pathname.split("/").pop();
    setLoginPart(loginPart);
  }, [location]); // Phụ thuộc vào location

  return (
    <>
      <nav className="fixed bg-white dark:bg-gray-900 w-full z-50  top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 ">
          <button
            onClick={(e) => handleClickHome(e)}
            className="font-semibold text-2xl text-blue-600 flex items-center space-x-3 rtl:space-x-reverse hover:cursor-pointer"
          >
            BeeKrowd
          </button>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {/* {isHidden || loginPart === "" ? (
              <form>
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                  Search
                </label>
                <div className="relative mr-4 hidden lg:block">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search"
                    required
                  />
                </div>
              </form>
            ) : (
              ""
            )} */}

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
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
          {loginPart === "" ? (
            <div
              className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
                isOpen ? "block" : "hidden"
              }`}
              id="navbar-sticky"
            >
              <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-4 lg:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <NavbarItem href="#" isActive>
                  Home
                </NavbarItem>
                <NavbarItem
                  onClick={() =>
                    navigate(
                      `/founder/${"3ec3f142-f33c-4977-befd-30d4ce2b764d"}`
                    )
                  }
                >
                  Demo
                </NavbarItem>
                <NavbarItem onClick={handleProductFeaturesClick}>
                  Profiles
                </NavbarItem>
                <NavbarItem onClick={handlePricingClick}>Pricing</NavbarItem>
                <NavbarItem onClick={() => navigate("/news")}>News</NavbarItem>
                <NavbarItem
                  href="https://beekrowd.canny.io/beekrowd-feedback"
                  target="_blank"
                >
                  Feedback
                </NavbarItem>
              </ul>
            </div>
          ) : (
            ""
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
