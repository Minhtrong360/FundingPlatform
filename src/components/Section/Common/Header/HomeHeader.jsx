import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleLeft } from "react-icons/fa";
import BrandLogo from "../../../ui/Logo/BrandLogo";
import ImageDropdown from "../../../../pages/Home/ImageDropdown";
import { useAuth } from "../../../../context/AuthContext";
import { LockOutlined } from "@ant-design/icons";

const HomeHeader = ({ logoSrc, roundedBtn }) => {
  const [isActive, setIsActive] = useState(false);
  const [subMenuArray, setSubMenuArray] = useState([]);
  const [subMenuTextArray, setSubMenuTextArray] = useState([]);
  const [scrollClassName, setScrollClassName] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrollClassName("sticky-menu");
      } else {
        setScrollClassName("");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menuMainClickHandler = (e) => {
    if (typeof window !== "undefined" && window.innerWidth <= 991) {
      document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.remove("active");
      });

      const hasChildren = e.target.closest(".nav-item-has-children");
      if (hasChildren) {
        e.preventDefault();
        if (hasChildren.classList.contains("nav-item-has-children")) {
          showSubMenu(hasChildren);
        }
      }
    }
  };

  const goBackClickHandler = () => {
    const lastItem = subMenuArray.slice(-1)[0];
    const lastItemText = subMenuTextArray.slice(-2)[0];
    setSubMenuArray(subMenuArray.slice(0, -1));
    setSubMenuTextArray(subMenuTextArray.slice(0, -1));
    if (lastItem) {
      if (subMenuArray.length >= 0) {
        if (
          !document
            .getElementById(lastItem)
            .classList.contains("nav-item-has-children")
        ) {
          document.getElementById(lastItem).style.animation =
            "slideRight 0.5s ease forwards";
          document.querySelector(".current-menu-title").innerHTML =
            lastItemText;
          setTimeout(() => {
            document.getElementById(lastItem).classList.remove("active");
          }, 300);
        } else {
          document.querySelector(".go-back").classList.remove("active");
        }
      }
    }
    if (subMenuArray.length === 1) {
      document.querySelector(".mobile-menu-head").classList.remove("active");
    }
  };

  const menuTriggerClickHandler = () => {
    toggleMenu();
  };

  const closeMenuClickHandler = () => {
    toggleMenu();
    const submenuAll = document.querySelectorAll(".sub-menu");
    submenuAll.forEach((submenu) => {
      submenu.classList.remove("active");
      submenu.style.animation = "";
    });

    document.querySelector(".go-back").classList.remove("active");
  };

  const overlayClickHandler = () => {
    toggleMenu();
  };

  const toggleMenu = () => {
    setIsActive(!isActive);
    document.querySelector(".menu-overlay").classList.toggle("active");
  };

  const showSubMenu = (hasChildren) => {
    const submenuAll = document.querySelectorAll(".sub-menu");
    submenuAll.forEach((submenu) => submenu.classList.remove());
    const subMenu = hasChildren.querySelector(".sub-menu");
    setSubMenuArray([...subMenuArray, subMenu.id]);
    subMenu.classList.add("active");
    subMenu.style.animation = "slideLeft 0.5s ease forwards";
    const menuTitle = hasChildren.querySelector(".drop-trigger").textContent;
    setSubMenuTextArray([...subMenuTextArray, menuTitle]);
    document.querySelector(".current-menu-title").innerHTML = menuTitle;
    document.querySelector(".mobile-menu-head").classList.add("active");
  };

  useEffect(() => {
    const handleResize = () => {
      if (
        typeof window !== "undefined" &&
        window.innerWidth > 991 &&
        isActive
      ) {
        toggleMenu();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isActive]);

  const { user } = useAuth();

  return (
    <header
      className={`site-header site-header--menu-center zubuz-header-section bg-white ${scrollClassName}`}
      id="sticky-menu"
    >
      <div className="container">
        <nav className="navbar site-navbar">
          <BrandLogo imageSrc={logoSrc} />
          <div className="menu-block-wrapper">
            <div className="menu-overlay" onClick={closeMenuClickHandler}></div>
            <nav
              className={`menu-block ${isActive ? "active" : ""}`}
              id="append-menu-header"
            >
              <div className="mobile-menu-head">
                <div className="go-back" onClick={goBackClickHandler}>
                  <FaAngleLeft />
                </div>
                <div className="current-menu-title"></div>
                <div
                  className="mobile-menu-close"
                  onClick={closeMenuClickHandler}
                >
                  {" "}
                  &times;
                </div>
              </div>
              <ul className="site-menu-main" onClick={menuMainClickHandler}>
                <li className="nav-item nav-item-has-children">
                  <Link to="/" className="nav-link-item drop-trigger">
                    Platforms{" "}
                    <i>
                      <FaAngleDown />
                    </i>
                  </Link>
                  <ul className="sub-menu" id="submenu-1">
                    <li className="sub-menu--item">
                      <Link to="/">
                        <span className="menu-item-text">BeeKrowd FP&A</span>
                      </Link>
                    </li>
                    <li className="sub-menu--item">
                      <Link to="/home-2">
                        <span className="menu-item-text">
                          BeeKrowd Education
                        </span>
                      </Link>
                    </li>
                    <li className="sub-menu--item">
                      <Link to="/home-3">
                        <span className="menu-item-text">
                          BeeKrowd Startups
                        </span>
                      </Link>
                    </li>
                    <li class="sub-menu--item nav-item-has-children">
                      <Link to="/" data-menu-get="h3" class="drop-trigger">
                        BeeKrowd Workspace
                        <i>
                          <FaAngleDown />
                        </i>
                      </Link>
                      <ul class="sub-menu shape-none" id="submenu-4">
                        <li class="sub-menu--item">
                          <Link to="/competitions">
                            <span class="menu-item-text">Competitions</span>
                          </Link>
                        </li>
                        <li class="sub-menu--item">
                          <Link to="/workspace">
                            <span class="menu-item-text">
                              workspace <LockOutlined />
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>

                <li className="nav-item nav-item-has-children">
                  <Link to="/" className="nav-link-item drop-trigger">
                    Founders{" "}
                    <i>
                      <FaAngleDown />
                    </i>
                  </Link>
                  <ul className="sub-menu" id="submenu-2">
                    <li className="sub-menu--item">
                      <Link to="/financials">
                        <span className="menu-item-text">
                          Build Financial Model
                        </span>
                      </Link>
                    </li>
                    <li className="sub-menu--item">
                      <Link to="/profile">
                        <span className="menu-item-text">Build Profile</span>
                      </Link>
                    </li>
                    <li className="sub-menu--item">
                      <Link to="/home-2">
                        <span className="menu-item-text">Startup Course</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link to="/startups" className="nav-link-item">
                    Investors
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/about-us" className="nav-link-item">
                    About Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-btn header-btn-l1 ms-auto">
            <div className="zubuz-header-btn-wrap">
              {user ? (
                <ImageDropdown />
              ) : (
                <>
                  <Link className="zubuz-login-btn" to="/sign-in">
                    Login
                  </Link>
                  <Link
                    className={` ${
                      roundedBtn
                        ? "zubuz-default-btn zubuz-header-btn pill"
                        : "zubuz-default-btn zubuz-header-btn"
                    } sm:!block !hidden`}
                    to="/sign-up"
                  >
                    <span>Get Started</span>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div
            className="mobile-menu-trigger light"
            onClick={menuTriggerClickHandler}
          >
            <span></span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default HomeHeader;
