import React from "react";

import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from "../UserProfile/NewUserPage";

function Footer() {
  return (
    <footer className="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5 text-center">
        <div>
          <a
            className="font-semibold text-2xl text-blue-600 flex items-center sm:justify-start justify-center space-x-3 rtl:space-x-reverse hover:cursor-pointer"
            href="/"
            aria-label="Brand"
          >
            BeeKrowd
          </a>
        </div>
        <ul className="text-center">
          <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 darkBeforeTextGray">
            <a
              className="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 darkTextGray darkHoverTextWhite darkFocusOutlineNone darkFocusRing-1 darkFocus"
              href="/FAQ"
            >
              About
            </a>
          </li>
          <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 darkBeforeTextGray">
            <a
              className="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 darkTextGray darkHoverTextWhite darkFocusOutlineNone darkFocusRing-1 darkFocus"
              href="/services"
            >
              Services
            </a>
          </li>
          <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 darkBeforeTextGray">
            <a
              className="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 darkTextGray darkHoverTextWhite darkFocusOutlineNone darkFocusRing-1 darkFocus"
              href="/news"
            >
              Blog
            </a>
          </li>
        </ul>
        <div className="md:text-end space-x-2">
          <a
            className="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none darkTextGray darkHoverBgBlue darkFocusOutlineNone darkFocusRing-1 darkFocus"
            href="https://www.facebook.com/BeeKrowd"
          >
            <FacebookIcon />
          </a>
          <a
            className="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none darkTextGray darkHoverBgBlue darkFocusOutlineNone darkFocusRing-1 darkFocus"
            href="https://twitter.com/BeeKrowd"
          >
            <TwitterIcon />
          </a>
          <a
            className="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none darkTextGray darkHoverBgBlue darkFocusOutlineNone darkFocusRing-1 darkFocus"
            href="https://vn.linkedin.com/company/beekrowd"
          >
            <LinkedinIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
