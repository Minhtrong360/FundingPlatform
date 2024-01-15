import React from "react";

import {
  LinkedinOutlined,
  GoogleOutlined,
  FacebookOutlined,
  TwitterOutlined,
} from "@ant-design/icons";

function Footer() {
  return (
    <footer className="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5 text-center">
        <div>
          <a
            className="font-semibold text-2xl text-blue-600 flex items-center space-x-3 rtl:space-x-reverse hover:cursor-pointer"
            href="#"
            aria-label="Brand"
          >
            BeeKrowd
          </a>
        </div>
        <ul className="text-center">
          <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-gray-600">
            <a
              className="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              About
            </a>
          </li>
          <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-gray-600">
            <a
              className="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              Services
            </a>
          </li>
          <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-gray-600">
            <a
              className="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              Blog
            </a>
          </li>
        </ul>
        <div className="md:text-end space-x-2">
          <a
            className="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="#"
          >
            <GoogleOutlined
              style={{ color: "rgb(37, 99, 235)", fontSize: "24px" }}
            />
          </a>
          <a
            className="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="#"
          >
            <FacebookOutlined
              style={{ color: "rgb(37, 99, 235)", fontSize: "24px" }}
            />
          </a>
          <a
            className="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="https://twitter.com/BeeKrowd"
          >
            <TwitterOutlined
              style={{ color: "rgb(37, 99, 235)", fontSize: "24px" }}
            />
          </a>
          <a
            className="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="https://www.linkedin.com/company/beekrowd/"
          >
            <LinkedinOutlined
              style={{ color: "rgb(37, 99, 235)", fontSize: "24px" }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
