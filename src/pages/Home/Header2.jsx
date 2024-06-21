import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Dropdown, Button, Space, Menu } from "antd";
import ImageDropdown from "./ImageDropdown";
import NavbarItem from "./NavbarItem";
import { useAuth } from "../../context/AuthContext";
import { ArrowDropDownOutlined } from "@mui/icons-material";

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

const Header2 = ({ position }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [loginPart, setLoginPart] = useState("");
  const navigate = useNavigate();

  const handleLoginButtonClick = () => {
    navigate("/login");
  };

  const handleClickHome = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const updateScreenWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
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
  }, [location]);

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

      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  const menuItems = [
    { title: "Home", path: "/" },
    {
      title: "Founders",
      subItems: [
        {
          key: "1",
          label: "Market Research",
          path: "/founders/market-research",
        },
        { key: "2", label: "Build Profile", path: "/founder" },
        {
          key: "3",
          label: "Build Financial Model",
          path: "/financials",
        },
        {
          key: "4",
          label: "List Private Shares",
          path: "/Flea-Market",
        },
      ],
    },
    {
      title: "Investors",
      subItems: [
        {
          key: "1",
          label: "Invest in Startups",
          path: "/startups",
        },
        {
          key: "2",
          label: "Buy Private Shares",
          path: "/Flea-Market/info",
        },
        {
          key: "3",
          label: "Work Space",
          path: "/workspace",
        },
      ],
    },
    { title: "Competitions", path: "/competitions" },
  ];

  const renderMenu = (subItems) => (
    <Menu
      items={subItems.map((subItem) => ({
        key: subItem.key,
        label: <a onClick={() => navigate(subItem.path)}>{subItem.label}</a>,
      }))}
    />
  );

  return (
    <>
      <nav
        className={`${
          position === "notFixed" ? "absolute" : "fixed "
        } z-50 top-0 start-0 bg-white darkBg w-full border-b border-gray-300 darkBorderGray transition-transform duration-100 ease-in-out ${
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
            {user ? (
              <ImageDropdown />
            ) : (
              <NavbarButton onClick={handleLoginButtonClick}>
                Sign in
              </NavbarButton>
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
            className={`items-center justify-between ${
              screenWidth > 820 ? "order-1 w-auto" : "w-full"
            } ${isOpen ? "block" : "hidden"}`}
            id="navbar-sticky"
            style={screenWidth > 820 ? { display: "flex" } : {}}
          >
            <ul
              className={`${
                screenWidth > 820
                  ? "flex-row mt-0 p-0 border-0 bg-white"
                  : "flex-col mt-4 p-4 border-gray-100 bg-gray-50"
              } flex font-medium border rounded-md  md:space-x-4 lg:space-x-8 rtl:space-x-reverse  darkBgBlue md:darkBg darkBorderGray`}
            >
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className={`relative ${
                    screenWidth > 820 ? "inline-block" : "block"
                  }`}
                >
                  {item.subItems ? (
                    <Dropdown
                      overlay={renderMenu(item.subItems)}
                      placement="bottomLeft"
                      arrow
                    >
                      <Button className="text-black hover:text-blue-600 border-0 bg-transparent shadow-none">
                        {item.title} <ArrowDropDownOutlined />
                      </Button>
                    </Dropdown>
                  ) : (
                    <Button
                      className="text-black hover:text-blue-600 border-0 bg-transparent shadow-none"
                      onClick={() => navigate(item.path)}
                    >
                      {item.title}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header2;
