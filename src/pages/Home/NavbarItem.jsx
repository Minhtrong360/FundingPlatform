import React from "react";

const NavbarItem = ({ id, href, children, isActive, onClick, target }) => (
  <li>
    <a
      id={id}
      onClick={onClick}
      href={href}
      target={target}
      className={`hover:cursor-pointer block py-1 px-3 rounded md:p-0 ${
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

export default NavbarItem;
