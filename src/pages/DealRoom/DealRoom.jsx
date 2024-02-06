import React from "react";
import { useState } from "react";
import { Pagination } from "antd";

const NavbarItem = ({ href, children, isActive }) => (
  <li>
    <a
      href={href}
      className={`block py-2 px-3 rounded md:p-0 ${
        isActive
          ? "text-white bg-blue-600 rounded md:bg-transparent md:text-blue-700 md:darkTextBlue"
          : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 darkTextWhite darkHoverBgBlue darkHoverTextWhite md:darkHoverBgBlue"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </a>
  </li>
);

const NavbarButton = ({ children, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-white bg-blue-600 hover:bg-blue-700800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center darkBgBlue darkHoverBgBlue darkFocus ${className}`}
  >
    {children}
  </button>
);

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white darkBg fixed w-full z-20 top-0 start-0 border-b border-gray-200 darkBorderGray">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-3xl font-semibold whitespace-nowrap darkTextWhite">
            BeeKrowd
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <NavbarButton>Get started</NavbarButton>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 darkTextGray darkHoverBgBlue darkFocus"
            onClick={() => setIsOpen(!isOpen)}
            aria-controls="navbar-sticky"
            aria-expanded={isOpen}
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
          className={`items-center justify-between hidden w-full md:flex md:w-auto md:order-1 ${
            isOpen ? "block" : "hidden"
          }`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white darkBgBlue md:darkBg darkBorderGray">
            <NavbarItem href="#" isActive>
              Home
            </NavbarItem>
            <NavbarItem href="#">About</NavbarItem>
            <NavbarItem href="#">Services</NavbarItem>
            <NavbarItem href="#">Contact</NavbarItem>
          </ul>
        </div>
      </div>
    </nav>
  );
};
const Search = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-2">
        <div className="text-center">
          <h3 className="text-3xl sm:text-5xl font-semibold text-gray-800 darkTextGray mt-28">
            <span className="text-blue-600">Signature </span> Deal Room
          </h3>
          <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
            <form>
              <div className="relative z-10 flex space-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-gray-100 darkBgBlue darkBorderGray darkShadowGray">
                <div className="flex-[1_0_0%]">
                  <label
                    htmlFor="hs-search-article-1"
                    className="block text-sm text-gray-700 font-medium darkTextWhite"
                  >
                    <span className="sr-only">Search article</span>
                  </label>
                  <input
                    type="email"
                    name="hs-search-article-1"
                    id="hs-search-article-1"
                    className="py-2.5 px-4 block w-full border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500 darkBgBlue darkBorderGray darkTextGray darkFocus"
                    placeholder="Search company"
                  />
                </div>
                <div className="flex-[0_0_auto]">
                  <a
                    className="w-[46px] h-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
                    href="#"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </a>
                </div>
              </div>
            </form>
            <div className="hidden md:block absolute top-0 end-0 -translate-y-12 translate-x-20">
              <svg
                className="w-16 h-auto text-orange-500"
                width="121"
                height="135"
                viewBox="0 0 121 135"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="hidden md:block absolute bottom-0 start-0 translate-y-10 -translate-x-32">
              <svg
                className="w-40 h-auto text-blue-500"
                width="347"
                height="188"
                viewBox="0 0 347 188"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2 sm:mt-4">
            <a
              className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none darkBgBlue darkBorderGray darkTextWhite darkHoverBgBlue darkFocusOutlineNone darkFocusRing-1 darkFocus"
              href="#"
            >
              <svg
                className="flex-shrink-0 w-3 h-auto"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z" />
              </svg>
              Business
            </a>
            <a
              className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none darkBgBlue darkBorderGray darkTextWhite darkHoverBgBlue darkFocusOutlineNone darkFocusRing-1 darkFocus"
              href="#"
            >
              <svg
                className="flex-shrink-0 w-3 h-auto"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z" />
              </svg>
              Technology
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, description, imageUrl, buttonText, buttonLink }) => (
  <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow darkBgBlue darkBorderGray">
    <a href={buttonLink}>
      <img className="rounded-t-lg" src={imageUrl} alt={title} />
    </a>
    <div className="p-5">
      <a href={buttonLink}>
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 darkTextWhite">
          {title}
        </h5>
      </a>
      <p className="mb-3 font-normal text-gray-700 darkTextGray">
        {description}
      </p>
      <a
        href={buttonLink}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkBgBlue darkHoverBgBlue darkFocus mt-8"
      >
        {buttonText}
        <span className="w-3.5 h-3.5 ml-2">🇻🇳</span>
      </a>
    </div>
  </div>
);

// Card3x component with given card data
const cardData = [
  {
    title: "Exciting Tech Innovations 2022",
    description:
      "A glimpse into the future: exploring the most anticipated technology innovations set to revolutionize the industry in 2023.",
    imageUrl:
      "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/blog/google-hq.png",
    buttonText: "Read more",
    buttonLink: "#",
  },
  {
    title: "New Developments in AI",
    description:
      "Discover the latest advancements in artificial intelligence and how they are reshaping industries worldwide.",
    imageUrl:
      "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/blog/google-hq.png",
    buttonText: "Learn more",
    buttonLink: "#",
  },
  {
    title: "Future of Sustainable Energy",
    description:
      "Explore the future of sustainable energy sources and their impact on environmental conservation.",
    imageUrl:
      "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/blog/google-hq.png",
    buttonText: "Find out more",
    buttonLink: "#",
  },
];

const Card3x = (props) => (
  <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
      <h2 className="text-2xl font-semibold md:text-4xl md:leading-tight darkTextWhite">
        {/* Insights */}
        {props.title}
      </h2>
      <p className="mt-1 text-gray-600 darkTextGray">
        {/* Stay in the know with insights from industry experts. */}
        {props.description}
      </p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardData.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
  </div>
);

function DealRoom() {
  return (
    <div>
      <NavBar />
      <Search />
      <Card3x />
      <Card3x />
      <Card3x />
    </div>
  );
}
export default DealRoom;
