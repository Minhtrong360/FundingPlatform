import React from "react";

const NavbarItem = ({ id, href, children, isActive, onClick }) => (
  <li>
    <a
      id={id}
      onClick={onClick}
      href={href}
      className={`hover:cursor-pointer block py-2 px-3 rounded md:p-0 ${
        isActive
          ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
          : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </a>
  </li>
);

export default NavbarItem;
