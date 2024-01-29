import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import { useRef } from "react";
import _ from "lodash";
import ApexCharts from "apexcharts";
// import sale, growth, user icon from antd
import {
  UserOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { CreditCardOutlined } from "@ant-design/icons";
import apiService from "../../app/apiService";
import { gapi } from "gapi-script";

const NavbarItem = ({ href, children, isActive, onClick }) => (
  <li>
    <a
      href={href}
      className={`hover:cursor-pointer block py-2 px-3 rounded md:p-0 ${
        isActive
          ? "text-white bg-blue-600 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
          : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
      }`}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
    >
      {children}
    </a>
  </li>
);

const NavbarButton = ({ children, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-white bg-blue-600 hover:bg-blue-700800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${className}`}
  >
    {children}
  </button>
);

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">
            BeeKrowd
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <NavbarButton onClick={() => navigate("/login")}>
            Get started
          </NavbarButton>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <NavbarItem href="#" isActive>
              Home
            </NavbarItem>
            <NavbarItem onClick={() => navigate("/founder")}>
              For Founder
            </NavbarItem>
            <NavbarItem href="#">Services</NavbarItem>
            <NavbarItem href="#">Contact</NavbarItem>
          </ul>
        </div>
      </div>
    </nav>
  );
};

function Sidebar() {
  const [usersAccordionOpen, setUsersAccordionOpen] = useState(false);

  const toggleUsersAccordion = () => {
    setUsersAccordionOpen(!usersAccordionOpen);
  };

  const navigate = useNavigate();

  return (
    <div
      id="docs-sidebar"
      className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="px-6">
        <a
          className="hover:cursor-pointer flex-none text-xl font-semibold dark:text-white"
          onClick={() => navigate("/")}
          aria-label="Brand"
        >
          BeeKrowd
        </a>
      </div>
      <nav
        className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
        data-hs-accordion-always-open
      >
        <ul className="space-y-1.5">
          {/* Menu Items */}
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              <svg
                className="w-4 h-4"
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
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Dashboard
            </a>
          </li>

          {/* Users Accordion */}
          <li className="hs-accordion" id="users-accordion">
            <button
              type="button"
              className={`hs-accordion-toggle ${
                usersAccordionOpen
                  ? "hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent"
                  : ""
              } w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:hs-accordion-active:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
              onClick={toggleUsersAccordion}
            >
              <svg
                className="w-4 h-4"
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Users
              {/* Accordion Icons */}
              <svg
                className={`${
                  usersAccordionOpen
                    ? "hs-accordion-active:block"
                    : "hs-accordion-active:hidden"
                } ms-auto hidden w-4 h-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400`}
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
                <path d="m18 15-6-6-6 6" />
              </svg>
              <svg
                className={`${
                  usersAccordionOpen
                    ? "hs-accordion-active:hidden"
                    : "hs-accordion-active:block"
                } ms-auto block w-4 h-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400`}
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

            {/* Users Sub-Menu */}
            <div
              id="users-accordion"
              className={`${
                usersAccordionOpen
                  ? "hs-accordion-content"
                  : "hs-accordion-content hidden"
              } w-full overflow-hidden transition-[height] duration-300`}
            >
              <ul
                className="hs-accordion-group ps-3 pt-2"
                data-hs-accordion-always-open
              >
                <li className="hs-accordion" id="users-accordion-sub-1">
                  <button
                    type="button"
                    className="hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:hs-accordion-active:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  >
                    Sub Menu 1{/* Accordion Icons */}
                    <svg
                      className="hs-accordion-active:block ms-auto hidden w-4 h-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
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
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                    <svg
                      className="hs-accordion-active:hidden ms-auto block w-4 h-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
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

                  {/* Sub-Menu Content */}
                  <div
                    id="users-accordion-sub-1"
                    className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                  >
                    <ul className="ps-3 pt-2">
                      <li>
                        <a
                          className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          href="#"
                        >
                          Sub-Menu Item 1
                        </a>
                      </li>
                      <li>
                        <a
                          className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          href="#"
                        >
                          Sub-Menu Item 2
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>

                {/* Other Sub-Menu Items */}
                {/* Add more sub-menu items as needed */}
              </ul>
            </div>
          </li>

          {/* Other Menu Items */}
          {/* Add more menu items as needed */}
        </ul>
      </nav>
      <div className="px-6">
        <a
          className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="#"
        >
          <svg
            className="w-4 h-4"
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
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Calendar
        </a>
      </div>
      <div className="px-6">
        <a
          className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="#"
        >
          <svg
            className="w-4 h-4"
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
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Documentation
        </a>
      </div>
    </div>
  );
}

function Card({ icon, title, metric, description, badgeText }) {
  return (
    <div className="text-left w-full h-full bg-white shadow-lg rounded-lg p-5 dark:bg-slate-900">
      <div className="flex items-center gap-x-4 mb-3">
        <div className="inline-flex justify-center items-center w-[40px] h-[40px] rounded-full bg-blue-600 dark:bg-blue-700">
          {icon}
        </div>
        <div className="flex-shrink-0">
          <h3 className="block text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
        </div>
      </div>
      <h3 className="text-3xl font-semibold text-black-600 dark:text-gray-400">
        {metric}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mt-3">{description}</p>
      <Badge text={badgeText} />
    </div>
  );
}

// Badge component (same as provided in the original code)
function Badge({ text }) {
  return (
    <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-600 text-gray-500 dark:bg-white/[.05] dark:text-white mt-4">
      {text}
    </span>
  );
}

// IconBlock component using the Card component
function StatBadge({ ggData }) {
  console.log("ggData", ggData);
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 items-center gap-6 md:gap-10">
        <Card
          icon={<UserOutlined />}
          title="Build your portfolio"
          metric={ggData?.activeUsers}
          description="The simplest way to keep your portfolio always up-to-date."
          badgeText="New"
        />
        <Card
          icon={<UserOutlined />}
          title="Build your portfolio"
          metric={ggData?.eventCount}
          description="The simplest way to keep your portfolio always up-to-date."
          badgeText="New"
        />
        <Card
          icon={<UserOutlined />}
          title="Build your portfolio"
          metric={ggData?.newUsers}
          description="The simplest way to keep your portfolio always up-to-date."
          badgeText="New"
        />
        <Card
          icon={<UserOutlined />}
          title="Build your portfolio"
          metric={ggData?.averageSessionDuration}
          description="The simplest way to keep your portfolio always up-to-date."
          badgeText="New"
        />
        <Card
          icon={<UserOutlined />}
          title="Build your portfolio"
          metric={ggData?.screenPageViews}
          description="The simplest way to keep your portfolio always up-to-date."
          badgeText="New"
        />
      </div>
    </div>
  );
}
function buildTooltip(props, options) {
  const {
    title,
    mode,
    valuePrefix = "$",
    isValueDivided = true,
    valuePostfix = "",
    hasTextLabel = false,
    invertGroup = false,
    labelDivider = "",
    wrapperClasses = "ms-0.5 mb-2 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-md dark:bg-neutral-800 dark:border-neutral-700",
    wrapperExtClasses = "",
    seriesClasses = "text-[12px]",
    seriesExtClasses = "",
    titleClasses = "font-semibold !text-sm !bg-white !border-gray-200 text-gray-800 rounded-t-lg dark:!bg-neutral-800 dark:!border-neutral-700 dark:text-neutral-200",
    titleExtClasses = "",
    markerClasses = "!w-2.5 !h-2.5 !me-1.5",
    markerExtClasses = "!rounded-sm",
    valueClasses = "!font-medium text-gray-500 !ms-auto dark:text-neutral-400",
    valueExtClasses = "",
    labelClasses = "text-gray-500 dark:text-neutral-400",
    labelExtClasses = "",
  } = options;
  const { dataPointIndex } = props;
  const { colors } = props.ctx.opts;
  const series = props.ctx.opts.series;
  let seriesGroups = "";

  series.forEach((single, i) => {
    const val =
      props.series[i][dataPointIndex] ||
      (typeof series[i].data[dataPointIndex] !== "object"
        ? series[i].data[dataPointIndex]
        : props.series[i][dataPointIndex]);
    const label = series[i].name;
    const groupData = invertGroup
      ? {
          left: `${hasTextLabel ? label : ""}${labelDivider}`,
          right: `${valuePrefix}${
            val >= 1000 && isValueDivided ? `${val / 1000}k` : val
          }${valuePostfix}`,
        }
      : {
          left: `${valuePrefix}${
            val >= 1000 && isValueDivided ? `${val / 1000}k` : val
          }${valuePostfix}`,
          right: `${hasTextLabel ? label : ""}${labelDivider}`,
        };
    const labelMarkup = `<span class="apexcharts-tooltip-text-y-label ${labelClasses} ${labelExtClasses}">${groupData.left}</span>`;

    seriesGroups += `<div class="apexcharts-tooltip-series-group !flex ${
      hasTextLabel ? "!justify-between" : ""
    } order-${i + 1} ${seriesClasses} ${seriesExtClasses}">
        <span class="flex items-center">
          <span class="apexcharts-tooltip-marker ${markerClasses} ${markerExtClasses}" style="background: ${
      colors[i]
    }"></span>
          <div class="apexcharts-tooltip-text">
            <div class="apexcharts-tooltip-y-group !py-0.5">
              <span class="apexcharts-tooltip-text-y-value ${valueClasses} ${valueExtClasses}">${
      groupData.right
    }</span>
            </div>
          </div>
        </span>
        ${labelMarkup}
      </div>`;
  });

  return `<div class="${
    mode === "dark" ? "dark " : ""
  }${wrapperClasses} ${wrapperExtClasses}">
      <div class="apexcharts-tooltip-title ${titleClasses} ${titleExtClasses}">${title}</div>
      ${seriesGroups}
    </div>`;
}

function buildTooltipCompareTwo(props, options) {
  const { dataPointIndex } = props;
  const { categories } = props.ctx.opts.xaxis;
  const { colors } = props.ctx.opts;
  const series = props.ctx.opts.series;

  const {
    title,
    mode,
    valuePrefix = "$",
    isValueDivided = true,
    valuePostfix = "",
    hasCategory = true,
    hasTextLabel = false,
    labelDivider = "",
    wrapperClasses = "ms-0.5 mb-2 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-md dark:bg-neutral-800 dark:border-neutral-700",
    wrapperExtClasses = "",
    seriesClasses = "!justify-between w-full text-[12px]",
    seriesExtClasses = "",
    titleClasses = "flex justify-between font-semibold !text-sm !bg-white !border-gray-200 text-gray-800 rounded-t-lg dark:!bg-neutral-800 dark:!border-neutral-700 dark:text-neutral-200",
    titleExtClasses = "",
    markerClasses = "!w-2.5 !h-2.5 !me-1.5",
    markerExtClasses = "!rounded-sm",
    valueClasses = "!font-medium text-gray-500 !ms-auto dark:text-neutral-400",
    valueExtClasses = "",
    labelClasses = "text-gray-500 dark:text-neutral-400 ms-2",
    labelExtClasses = "",
  } = options;

  let seriesGroups = "";
  const s0 = series[0].data[dataPointIndex];
  const s1 = series[1].data[dataPointIndex];
  const category = categories[dataPointIndex].split(" ");
  const newCategory = hasCategory
    ? `${category[0]}${category[1] ? " " : ""}${
        category[1] ? category[1].slice(0, 3) : ""
      }`
    : "";
  const isGrowing = s0 > s1;
  const isDifferenceIsNull = s0 / s1 === 1;
  const difference = isDifferenceIsNull ? 0 : (s0 / s1) * 100;
  const icon = isGrowing
    ? `<svg class="inline-block w-4 h-4 self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`
    : `<svg class="inline-block w-4 h-4 self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></svg>`;

  series.forEach((_, i) => {
    const val =
      props.series[i][dataPointIndex] ||
      (typeof series[i].data[dataPointIndex] !== "object"
        ? series[i].data[dataPointIndex]
        : props.series[i][dataPointIndex]);
    const label = series[i].name;
    const altValue = series[i].altValue || null;
    const labelMarkup = `<span class="apexcharts-tooltip-text-y-label ${labelClasses} ${labelExtClasses}">${newCategory} ${
      label || ""
    }</span>`;
    const valueMarkup =
      altValue ||
      `<span class="apexcharts-tooltip-text-y-value ${valueClasses} ${valueExtClasses}">${valuePrefix}${
        val >= 1000 && isValueDivided ? `${val / 1000}k` : val
      }${valuePostfix}${labelDivider}</span>`;

    seriesGroups += `<div class="apexcharts-tooltip-series-group ${seriesClasses} !flex order-${
      i + 1
    } ${seriesExtClasses}">
        <span class="flex items-center">
          <span class="apexcharts-tooltip-marker ${markerClasses} ${markerExtClasses}" style="background: ${
      colors[i]
    }"></span>
          <div class="apexcharts-tooltip-text">
            <div class="apexcharts-tooltip-y-group !py-0.5">
              ${valueMarkup}
            </div>
          </div>
        </span>
        ${hasTextLabel ? labelMarkup : ""}
      </div>`;
  });

  return `<div class="${
    mode === "dark" ? "dark " : ""
  }${wrapperClasses} ${wrapperExtClasses}">
      <div class="apexcharts-tooltip-title ${titleClasses} ${titleExtClasses}">
        <span>${title}</span>
        <span class="flex items-center gap-x-1 ${
          !isDifferenceIsNull
            ? isGrowing
              ? "text-green-600"
              : "text-red-600"
            : ""
        } ms-2">
          ${!isDifferenceIsNull ? icon : ""}
          <span class="inline-block text-sm">
            ${difference.toFixed(1)}%
          </span>
        </span>
      </div>
      ${seriesGroups}
    </div>`;
}

function buildTooltipCompareTwoAlt(props, options) {
  const { dataPointIndex } = props;
  const { categories } = props.ctx.opts.xaxis;
  const { colors } = props.ctx.opts;
  const series = props.ctx.opts.series;

  const {
    title,
    mode,
    valuePrefix = "$",
    isValueDivided = true,
    valuePostfix = "",
    hasCategory = true,
    hasTextLabel = false,
    labelDivider = "",
    wrapperClasses = "ms-0.5 mb-2 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-md dark:bg-neutral-800 dark:border-neutral-700",
    wrapperExtClasses = "",
    seriesClasses = "!justify-between w-full text-[12px]",
    seriesExtClasses = "",
    titleClasses = "flex justify-between font-semibold !text-sm !bg-white !border-gray-200 text-gray-800 rounded-t-lg dark:!bg-neutral-800 dark:!border-neutral-700 dark:text-neutral-200",
    titleExtClasses = "",
    markerClasses = "!w-2.5 !h-2.5 !me-1.5",
    markerExtClasses = "!rounded-sm",
    valueClasses = "!font-medium text-gray-500 !ms-auto dark:text-neutral-400",
    valueExtClasses = "",
    labelClasses = "text-gray-500 dark:text-neutral-400 ms-2",
    labelExtClasses = "",
  } = options;

  let seriesGroups = "";
  const s0 = series[0].data[dataPointIndex];
  const s1 = series[1].data[dataPointIndex];
  const category = categories[dataPointIndex].split(" ");
  const newCategory = hasCategory
    ? `${category[0]}${category[1] ? " " : ""}${
        category[1] ? category[1].slice(0, 3) : ""
      }`
    : "";
  const isGrowing = s0 > s1;
  const isDifferenceIsNull = s0 / s1 === 1;
  const difference = isDifferenceIsNull ? 0 : (s0 / s1) * 100;
  const icon = isGrowing
    ? `<svg class="inline-block w-4 h-4 self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`
    : `<svg class="inline-block w-4 h-4 self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></svg>`;

  series.forEach((single, i) => {
    const val =
      props.series[i][dataPointIndex] ||
      (typeof series[i].data[dataPointIndex] !== "object"
        ? series[i].data[dataPointIndex]
        : props.series[i][dataPointIndex]);
    const label = series[i].name;
    const labelMarkup = `<span class="apexcharts-tooltip-text-y-label ${labelClasses} ${labelExtClasses}">${valuePrefix}${
      val >= 1000 && isValueDivided ? `${val / 1000}k` : val
    }${valuePostfix}</span>`;

    seriesGroups += `<div class="apexcharts-tooltip-series-group !flex ${seriesClasses} order-${
      i + 1
    } ${seriesExtClasses}">
        <span class="flex items-center">
          <span class="apexcharts-tooltip-marker ${markerClasses} ${markerExtClasses}" style="background: ${
      colors[i]
    }"></span>
          <div class="apexcharts-tooltip-text text-[12px]">
            <div class="apexcharts-tooltip-y-group !py-0.5">
              <span class="apexcharts-tooltip-text-y-value ${valueClasses} ${valueExtClasses}">${newCategory} ${
      label || ""
    }${labelDivider}</span>
            </div>
          </div>
        </span>
        ${hasTextLabel ? labelMarkup : ""}
      </div>`;
  });

  return `<div class="${
    mode === "dark" ? "dark " : ""
  }${wrapperClasses} ${wrapperExtClasses}">
      <div class="apexcharts-tooltip-title ${titleClasses} ${titleExtClasses}">
        <span>${title}</span>
        <span class="flex items-center gap-x-1 ${
          !isDifferenceIsNull
            ? isGrowing
              ? "text-green-600"
              : "text-red-600"
            : ""
        } ms-2">
          ${!isDifferenceIsNull ? icon : ""}
          <span class="inline-block text-sm">
            ${difference.toFixed(1)}%
          </span>
        </span>
      </div>
      ${seriesGroups}
    </div>`;
}

function buildTooltipForDonut({ series, seriesIndex, w }, textColor) {
  const { globals } = w;
  const { colors } = globals;

  return `<div class="apexcharts-tooltip-series-group" style="background-color: ${colors[seriesIndex]}; display: block;">
      <div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">
        <div class="apexcharts-tooltip-y-group" style="color: ${textColor[seriesIndex]}">
          <span class="apexcharts-tooltip-text-y-label">${globals.labels[seriesIndex]}: </span>
          <span class="apexcharts-tooltip-text-y-value">${series[seriesIndex]}</span>
        </div>
      </div>
    </div>`;
}

function buildChart(id, shared, light, dark) {
  const $chart = document.querySelector(id);
  let chart = null;

  if (!$chart) return false;

  const tabpanel = $chart.closest('[role="tabpanel"]');
  let modeFromBodyClass = null;

  Array.from(document.querySelector("html").classList).forEach((cl) => {
    if (["dark", "light", "default"].includes(cl)) modeFromBodyClass = cl;
  });

  const optionsFn = (
    mode = modeFromBodyClass || localStorage.getItem("hs_theme")
  ) => _.merge(shared(mode), mode === "dark" ? dark : light);

  if ($chart) {
    chart = new ApexCharts($chart, optionsFn());
    chart.render();

    window.addEventListener("on-hs-appearance-change", (evt) =>
      chart.updateOptions(optionsFn(evt.detail))
    );

    if (tabpanel)
      tabpanel.addEventListener("on-hs-appearance-change", (evt) =>
        chart.updateOptions(optionsFn(evt.detail))
      );
  }

  return chart;
}

const bardata = [
  { letter: "A", frequency: 0.08167 },
  { letter: "B", frequency: 0.01492 },
  { letter: "C", frequency: 0.02782 },
  { letter: "D", frequency: 0.04253 },
  { letter: "E", frequency: 0.12702 },
  { letter: "F", frequency: 0.02288 },
  { letter: "G", frequency: 0.02015 },
];

const data = [
  { name: "<5", value: 19912018 },
  { name: "5-9", value: 20501982 },
  { name: "10-14", value: 20679786 },
  { name: "15-19", value: 21354481 },
];

function DonusChart({ width = 500 }) {
  const height = Math.min(width, 500);
  const radius = Math.min(width, height) / 2;

  const arc = d3
    .arc()
    .innerRadius(radius * 0.67)
    .outerRadius(radius - 1);

  const pie = d3
    .pie()
    .padAngle(1 / radius)
    .sort(null)
    .value((d) => d.value);

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.name))
    .range(
      d3
        .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
        .reverse()
    );

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  svg
    .append("g")
    .selectAll()
    .data(pie(data))
    .join("path")
    .attr("fill", (d) => color(d.data.name))
    .attr("d", arc)
    .append("title")
    .text((d) => `${d.data.name}: ${d.data.value.toLocaleString()}`);

  svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("text-anchor", "middle")
    .selectAll()
    .data(pie(data))
    .join("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .call((text) =>
      text
        .append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text((d) => d.data.name)
    )
    .call((text) =>
      text
        .filter((d) => d.endAngle - d.startAngle > 0.25)
        .append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text((d) => d.data.value.toLocaleString("en-US"))
    );

  return <div dangerouslySetInnerHTML={{ __html: svg.node().outerHTML }} />;
}

const BarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const drawChart = () => {
      const width = 928;
      const height = 500;
      const marginTop = 30;
      const marginRight = 0;
      const marginBottom = 30;
      const marginLeft = 40;

      const x = d3
        .scaleBand()
        .domain(
          d3.groupSort(
            data,
            ([d]) => -d.frequency,
            (d) => d.letter
          )
        )
        .range([marginLeft, width - marginRight])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.frequency)])
        .range([height - marginBottom, marginTop]);

      const svg = d3
        .select(chartRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

      svg
        .append("g")
        .attr("fill", "steelblue")
        .selectAll()
        .data(data)
        .join("rect")
        .attr("x", (d) => x(d.letter))
        .attr("y", (d) => y(d.frequency))
        .attr("height", (d) => y(0) - y(d.frequency))
        .attr("width", x.bandwidth());

      svg
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

      svg
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickFormat((y) => (y * 100).toFixed()))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ Frequency (%)")
        );
    };

    drawChart();
  }, [data]);

  return <svg ref={chartRef}></svg>;
};

const DonutChart = () => {
  useEffect(() => {
    (function () {
      buildChart(
        "#hs-donut-chart",
        () => ({
          chart: {
            height: 300,
            width: 300,
            type: "donut",
            zoom: {
              enabled: false,
            },
          },
          plotOptions: {
            pie: {
              donut: {
                size: "76%",
              },
            },
          },
          series: [36, 23, 11, 30],
          labels: ["Tailwind CSS", "Preline UI", "MUI", "Others"],
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: true,
          },
          stroke: {
            width: 5,
          },
          grid: {
            padding: {
              top: -12,
              bottom: -11,
              left: -12,
              right: -12,
            },
          },
          states: {
            hover: {
              filter: {
                type: "none",
              },
            },
          },
        }),
        {
          colors: ["#3b82f6", "#22d3ee", "#e5e7eb"],
          stroke: {
            colors: ["rgb(255, 255, 255)"],
          },
        },
        {
          colors: ["#e5e7eb", "#3b82f6", "#22d3ee"],
          stroke: {
            colors: ["rgb(38, 38, 38)"],
          },
        }
      );
    })();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <div id="hs-donut-chart"></div>
    </div>
  );
};

const Chart = () => {
  useEffect(() => {
    const loadScript = () => {
      // Dynamically create a script element
      const script = document.createElement("script");
      script.src = "https://preline.co/assets/js/hs-apexcharts-helpers.js";
      script.async = true;

      // Append the script element to the document body
      document.body.appendChild(script);

      // Event listener for script load
      script.addEventListener("load", () => {
        // Initialize ApexCharts inside this callback to ensure the script has loaded
        (function () {
          buildChart(
            "#hs-multiple-area-charts",
            (mode) => ({
              chart: {
                height: 300,
                type: "area",
                toolbar: {
                  show: true,
                },
                zoom: {
                  enabled: true,
                },
              },
              series: [
                {
                  name: "Income",
                  data: [
                    18000, 51000, 60000, 38000, 88000, 50000, 40000, 52000,
                    88000, 80000, 60000, 70000,
                  ],
                },
                {
                  name: "Outcome",
                  data: [
                    27000, 38000, 60000, 77000, 40000, 50000, 49000, 29000,
                    42000, 27000, 42000, 50000,
                  ],
                },
              ],
              legend: {
                show: false,
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "straight",
                width: 2,
              },
              grid: {
                strokeDashArray: 2,
              },
              fill: {
                type: "gradient",
                gradient: {
                  type: "vertical",
                  shadeIntensity: 1,
                  opacityFrom: 0.1,
                  opacityTo: 0.8,
                },
              },
              xaxis: {
                type: "category",
                tickPlacement: "on",
                categories: [
                  "25 January 2023",
                  "26 January 2023",
                  "27 January 2023",
                  "28 January 2023",
                  "29 January 2023",
                  "30 January 2023",
                  "31 January 2023",
                  "1 February 2023",
                  "2 February 2023",
                  "3 February 2023",
                  "4 February 2023",
                  "5 February 2023",
                ],
                axisBorder: {
                  show: false,
                },
                axisTicks: {
                  show: false,
                },
                crosshairs: {
                  stroke: {
                    dashArray: 0,
                  },
                  dropShadow: {
                    show: false,
                  },
                },
                tooltip: {
                  enabled: false,
                },
                labels: {
                  style: {
                    colors: "#9ca3af",
                    fontSize: "13px",
                    fontFamily: "Inter, ui-sans-serif",
                    fontWeight: 400,
                  },
                  formatter: (title) => {
                    let t = title;

                    if (t) {
                      const newT = t.split(" ");
                      t = `${newT[0]} ${newT[1].slice(0, 3)}`;
                    }

                    return t;
                  },
                },
              },
              yaxis: {
                labels: {
                  align: "left",
                  minWidth: 0,
                  maxWidth: 140,
                  style: {
                    colors: "#9ca3af",
                    fontSize: "13px",
                    fontFamily: "Inter, ui-sans-serif",
                    fontWeight: 400,
                  },
                  formatter: (value) =>
                    value >= 1000 ? `${value / 1000}k` : value,
                },
              },
              tooltip: {
                x: {
                  format: "MMMM yyyy",
                },
                y: {
                  formatter: (value) =>
                    `$${value >= 1000 ? `${value / 1000}k` : value}`,
                },
                custom: function (props) {
                  const { categories } = props.ctx.opts.xaxis;
                  const { dataPointIndex } = props;
                  const title = categories[dataPointIndex].split(" ");
                  const newTitle = `${title[0]} ${title[1]}`;

                  return buildTooltip(props, {
                    title: newTitle,
                    mode,
                    hasTextLabel: true,
                    wrapperExtClasses: "min-w-[120px]",
                    labelDivider: ":",
                    labelExtClasses: "ms-2",
                  });
                },
              },
              responsive: [
                {
                  breakpoint: 568,
                  options: {
                    chart: {
                      height: 300,
                    },
                    labels: {
                      style: {
                        colors: "#9ca3af",
                        fontSize: "11px",
                        fontFamily: "Inter, ui-sans-serif",
                        fontWeight: 400,
                      },
                      offsetX: -2,
                      formatter: (title) => title.slice(0, 3),
                    },
                    yaxis: {
                      labels: {
                        align: "left",
                        minWidth: 0,
                        maxWidth: 140,
                        style: {
                          colors: "#9ca3af",
                          fontSize: "11px",
                          fontFamily: "Inter, ui-sans-serif",
                          fontWeight: 400,
                        },
                        formatter: (value) =>
                          value >= 1000 ? `${value / 1000}k` : value,
                      },
                    },
                  },
                },
              ],
            }),
            {
              colors: ["#2563eb", "#9333ea"],
              fill: {
                gradient: {
                  stops: [0, 90, 100],
                },
              },
              grid: {
                borderColor: "#e5e7eb",
              },
            },
            {
              colors: ["#3b82f6", "#a855f7"],
              fill: {
                gradient: {
                  stops: [100, 90, 0],
                },
              },
              grid: {
                borderColor: "#374151",
              },
            }
          );
        })();
      });
    };

    // Call the function to load the script
    loadScript();
  }, []); // Empty dependency array ensures the effect runs only once, similar to componentDidMount

  return (
    <div className="md:container md:mx-auto">
      {/* Legend Indicator */}
      <div className="flex justify-center sm:justify-end items-center gap-x-4 mb-3 sm:mb-6">
        <div className="inline-flex items-center">
          <span className="w-2.5 h-2.5 inline-block bg-blue-600 rounded-sm me-2"></span>
          <span className="text-[13px] text-gray-600 dark:text-neutral-400">
            Income
          </span>
        </div>
        <div className="inline-flex items-center">
          <span className="w-2.5 h-2.5 inline-block bg-purple-600 rounded-sm me-2"></span>
          <span className="text-[13px] text-gray-600 dark:text-neutral-400">
            Outcome
          </span>
        </div>
      </div>
      {/* End Legend Indicator */}

      {/* Container for the chart */}
      <div id="hs-multiple-area-charts"></div>
    </div>
  );
};

const BarChart1 = () => {
  useEffect(() => {
    (function () {
      buildChart(
        "#hs-multiple-bar-charts",
        (mode) => ({
          colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
          chart: {
            type: "bar",
            height: 300,
            toolbar: {
              show: false,
            },
            zoom: {
              enabled: true,
            },
          },

          series: [
            {
              name: "Income",
              data: [23000, 44000, 55000, 57000, 56000],
            },
            {
              name: "Outcome",
              data: [17000, 76000, 85000, 101000, 98000],
            },
          ],
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "60%",
              borderRadius: 0,
            },
          },
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 8,
            colors: ["transparent"],
          },
          xaxis: {
            categories: ["January", "February", "March", "April", "May"],
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            crosshairs: {
              show: false,
            },
            labels: {
              style: {
                colors: "#9ca3af",
                fontSize: "13px",
                fontFamily: "Inter, ui-sans-serif",
                fontWeight: 400,
              },
              offsetX: -2,
              formatter: (title) => title.slice(0, 3),
            },
          },
          yaxis: {
            labels: {
              align: "left",
              minWidth: 0,
              maxWidth: 140,
              style: {
                colors: "#9ca3af",
                fontSize: "13px",
                fontFamily: "Inter, ui-sans-serif",
                fontWeight: 400,
              },
              formatter: (value) =>
                value >= 1000 ? `${value / 1000}k` : value,
            },
          },
          states: {
            hover: {
              filter: {
                type: "darken",
                value: 0.9,
              },
            },
          },
          tooltip: {
            y: {
              formatter: (value) =>
                `$${value >= 1000 ? `${value / 1000}k` : value}`,
            },
            custom: function (props) {
              const { categories } = props.ctx.opts.xaxis;
              const { dataPointIndex } = props;
              const title = categories[dataPointIndex];
              const newTitle = `${title}`;

              return buildTooltip(props, {
                title: newTitle,
                mode,
                hasTextLabel: true,
                wrapperExtClasses: "min-w-[120px]",
                labelDivider: ":",
                labelExtClasses: "ms-2",
              });
            },
          },
          responsive: [
            {
              breakpoint: 568,
              options: {
                chart: {
                  height: 300,
                },
                plotOptions: {
                  bar: {
                    columnWidth: "14px",
                  },
                },
                stroke: {
                  width: 8,
                },
                labels: {
                  style: {
                    colors: "#9ca3af",
                    fontSize: "11px",
                    fontFamily: "Inter, ui-sans-serif",
                    fontWeight: 400,
                  },
                  offsetX: -2,
                  formatter: (title) => title.slice(0, 3),
                },
                yaxis: {
                  labels: {
                    align: "left",
                    minWidth: 0,
                    maxWidth: 140,
                    style: {
                      colors: "#9ca3af",
                      fontSize: "11px",
                      fontFamily: "Inter, ui-sans-serif",
                      fontWeight: 400,
                    },
                    formatter: (value) =>
                      value >= 1000 ? `${value / 1000}k` : value,
                  },
                },
              },
            },
          ],
        }),
        {
          colors: ["#2563eb", "#d1d5db"],
          grid: {
            borderColor: "#e5e7eb",
          },
        },
        {
          colors: ["#6b7280", "#2563eb"],
          grid: {
            borderColor: "#374151",
          },
        }
      );
    })();
  }, []);

  return <div id="hs-multiple-bar-charts"></div>;
};

const Table = () => {
  return (
    <div className="flex flex-col mt-6">
      <div className="overflow-x-auto rounded-lg">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                  >
                    Transaction
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                  >
                    Date & Time
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                  >
                    Reference number
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                  >
                    Payment method
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                <tr>
                  <td className="p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white">
                    Payment from{" "}
                    <span className="font-semibold">Bonnie Green</span>
                  </td>
                  <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                    Apr 23 ,2021
                  </td>
                  <td className="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                    $2300
                  </td>
                  <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                    0047568936
                  </td>
                  <td className="inline-flex items-center p-4 space-x-2 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                    <CreditCardOutlined className="w-7 h-7" />
                    <span>••• 475</span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 border border-green-100 dark:border-green-500">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white">
                    Payment from <span className="font-semibold">Santa</span>
                  </td>
                  <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                    Apr 23 ,2021
                  </td>
                  <td className="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                    $2300
                  </td>
                  <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                    0047568936
                  </td>
                  <td className="inline-flex items-center p-4 space-x-2 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                    <svg
                      className="w-7 h-7"
                      aria-hidden="true"
                      enable-background="new 0 0 780 500"
                      viewBox="0 0 780 500"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="m449.01 250c0 99.143-80.371 179.5-179.51 179.5s-179.5-80.361-179.5-179.5c0-99.133 80.362-179.5 179.5-179.5 99.137 0 179.51 80.371 179.51 179.5"
                        fill="#d9222a"
                      />
                      <path
                        d="m510.49 70.496c-46.379 0-88.643 17.596-120.5 46.467-6.49 5.889-12.548 12.237-18.125 18.996h36.267c4.965 6.037 9.536 12.387 13.685 19.012h-63.635c-3.827 6.122-7.281 12.469-10.342 19.008h84.313c2.894 6.185 5.431 12.53 7.601 19.004h-99.513c-2.09 6.234-3.832 12.58-5.217 19.008h109.94c2.689 12.49 4.045 25.231 4.042 38.008 0 19.935-3.254 39.112-9.254 57.021h-99.513c2.164 6.477 4.7 12.824 7.596 19.008h84.316c-3.063 6.541-6.519 12.889-10.347 19.013h-63.625c4.147 6.62 8.719 12.966 13.685 18.996h36.259c-5.57 6.772-11.63 13.127-18.13 19.013 31.857 28.866 74.117 46.454 120.5 46.454 99.139 0 179.51-80.361 179.51-179.5 0-99.129-80.371-179.5-179.51-179.5"
                        fill="#ee9f2d"
                      />
                      <path d="m666.07 350.06c0-3.199 2.592-5.801 5.796-5.801s5.796 2.602 5.796 5.801-2.592 5.801-5.796 5.801-5.796-2.602-5.796-5.801zm5.796 4.408c2.434-.001 4.407-1.974 4.408-4.408 0-2.432-1.971-4.402-4.402-4.404h-.006c-2.429-.003-4.4 1.963-4.404 4.391v.014c-.002 2.433 1.968 4.406 4.4 4.408.001-.001.003-.001.004-.001zm-.783-1.86h-1.187v-5.096h2.149c.45 0 .908 0 1.305.254.413.279.646.771.646 1.279 0 .571-.338 1.104-.884 1.312l.938 2.25h-1.315l-.779-2.017h-.871zm0-2.89h.658c.246 0 .505.021.726-.1.195-.125.296-.359.296-.584-.005-.209-.112-.402-.288-.518-.207-.129-.536-.101-.758-.101h-.634zm-443.5-80.063c-2.046-.238-2.945-.301-4.35-.301-11.046 0-16.638 3.787-16.638 11.268 0 4.611 2.729 7.545 6.987 7.545 7.939 0 13.659-7.559 14.001-18.512zm14.171 32.996h-16.146l.371-7.676c-4.926 6.065-11.496 8.949-20.426 8.949-10.563 0-17.804-8.25-17.804-20.229 0-18.024 12.596-28.541 34.217-28.541 2.208 0 5.042.199 7.941.57.604-2.441.763-3.488.763-4.801 0-4.908-3.396-6.737-12.5-6.737-9.533-.108-17.396 2.271-20.625 3.333.204-1.229 2.7-16.659 2.7-16.659 9.712-2.846 16.116-3.917 23.325-3.917 16.732 0 25.596 7.513 25.579 21.712.033 3.805-.597 8.5-1.579 14.671-1.691 10.734-5.32 33.721-5.816 39.325zm-62.158 0h-19.487l11.162-69.997-24.925 69.997h-13.279l-1.642-69.597-11.733 69.597h-18.242l15.237-91.056h28.021l1.7 50.968 17.092-50.968h31.167zm354.97-32.996c-2.037-.238-2.941-.301-4.342-.301-11.041 0-16.634 3.787-16.634 11.268 0 4.611 2.726 7.545 6.983 7.545 7.94 0 13.664-7.559 13.993-18.512zm14.184 32.996h-16.146l.366-7.676c-4.926 6.065-11.5 8.949-20.422 8.949-10.565 0-17.8-8.25-17.8-20.229 0-18.024 12.588-28.541 34.213-28.541 2.208 0 5.037.199 7.934.57.604-2.441.763-3.488.763-4.801 0-4.908-3.392-6.737-12.496-6.737-9.533-.108-17.387 2.271-20.629 3.333.204-1.229 2.709-16.659 2.709-16.659 9.712-2.846 16.112-3.917 23.313-3.917 16.74 0 25.604 7.513 25.587 21.712.032 3.805-.597 8.5-1.579 14.671-1.684 10.734-5.321 33.721-5.813 39.325zm-220.39-1.125c-5.333 1.679-9.491 2.398-14 2.398-9.962 0-15.399-5.725-15.399-16.267-.142-3.271 1.433-11.88 2.671-19.737 1.125-6.917 8.449-50.529 8.449-50.529h19.371l-2.263 11.208h11.699l-2.642 17.796h-11.742c-2.25 14.083-5.454 31.625-5.491 33.95 0 3.816 2.037 5.483 6.671 5.483 2.221 0 3.94-.227 5.254-.7zm59.392-.6c-6.654 2.034-13.075 3.017-19.879 3-21.684-.021-32.987-11.346-32.987-33.032 0-25.313 14.38-43.947 33.899-43.947 15.971 0 26.171 10.433 26.171 26.796 0 5.429-.7 10.729-2.388 18.212h-38.574c-1.305 10.741 5.57 15.217 16.837 15.217 6.935 0 13.188-1.429 20.142-4.663zm-10.888-43.9c.107-1.543 2.055-13.217-9.013-13.217-6.171 0-10.583 4.704-12.38 13.217zm-123.42-5.017c0 9.367 4.542 15.826 14.842 20.676 7.892 3.709 9.112 4.81 9.112 8.17 0 4.617-3.479 6.701-11.191 6.701-5.813 0-11.221-.908-17.458-2.922 0 0-2.563 16.321-2.68 17.102 4.43.967 8.38 1.861 20.279 2.19 20.563 0 30.059-7.829 30.059-24.75 0-10.175-3.976-16.146-13.737-20.634-8.171-3.75-9.108-4.587-9.108-8.045 0-4.004 3.237-6.046 9.537-6.046 3.825 0 9.05.408 14 1.112l2.775-17.175c-5.046-.8-12.696-1.442-17.15-1.442-21.801.001-29.347 11.388-29.28 25.063m229.09-23.116c5.412 0 10.458 1.421 17.412 4.921l3.188-19.763c-2.854-1.121-12.904-7.7-21.417-7.7-13.041 0-24.065 6.471-31.82 17.15-11.309-3.746-15.958 3.825-21.657 11.367l-5.063 1.179c.383-2.483.729-4.95.612-7.446h-17.896c-2.445 22.917-6.778 46.128-10.171 69.075l-.884 4.976h19.496c3.254-21.143 5.037-34.68 6.121-43.842l7.341-4.084c1.097-4.078 4.529-5.458 11.417-5.291-.926 5.008-1.389 10.091-1.383 15.184 0 24.225 13.07 39.308 34.05 39.308 5.404 0 10.041-.712 17.221-2.658l3.43-20.759c-6.458 3.181-11.759 4.677-16.559 4.677-11.329 0-18.184-8.363-18.184-22.185 0-20.051 10.196-34.109 24.746-34.109" />
                      <path
                        d="m185.21 297.24h-19.491l11.171-69.988-24.926 69.988h-13.283l-1.642-69.588-11.733 69.588h-18.241l15.237-91.042h28.021l.788 56.362 18.904-56.362h30.267z"
                        fill="#fff"
                      />
                      <path d="m647.52 211.6-4.321 26.309c-5.329-7.013-11.054-12.088-18.612-12.088-9.833 0-18.783 7.455-24.642 18.425-8.158-1.692-16.597-4.563-16.597-4.563l-.004.067c.658-6.134.921-9.875.862-11.146h-17.9c-2.438 22.917-6.771 46.128-10.157 69.075l-.893 4.976h19.492c2.633-17.096 4.648-31.291 6.133-42.551 6.658-6.016 9.992-11.266 16.721-10.916-2.979 7.205-4.725 15.503-4.725 24.017 0 18.513 9.366 30.725 23.533 30.725 7.142 0 12.621-2.462 17.967-8.171l-.913 6.884h18.435l14.842-91.042zm-24.371 73.941c-6.634 0-9.983-4.908-9.983-14.596 0-14.555 6.271-24.875 15.112-24.875 6.695 0 10.32 5.104 10.32 14.509.001 14.679-6.37 24.962-15.449 24.962z" />
                      <path
                        d="m233.19 264.26c-2.042-.236-2.946-.299-4.346-.299-11.046 0-16.634 3.787-16.634 11.266 0 4.604 2.729 7.547 6.979 7.547 7.947-.001 13.668-7.559 14.001-18.514zm14.178 32.984h-16.146l.367-7.663c-4.921 6.054-11.5 8.95-20.421 8.95-10.567 0-17.805-8.25-17.805-20.229 0-18.032 12.592-28.542 34.217-28.542 2.208 0 5.042.2 7.938.571.604-2.441.763-3.487.763-4.808 0-4.909-3.392-6.729-12.496-6.729-9.537-.108-17.396 2.271-20.629 3.321.204-1.225 2.7-16.637 2.7-16.637 9.708-2.858 16.12-3.929 23.32-3.929 16.737 0 25.604 7.517 25.588 21.704.029 3.821-.604 8.513-1.584 14.675-1.687 10.724-5.319 33.724-5.812 39.316zm261.38-88.592-3.191 19.767c-6.95-3.496-12-4.92-17.407-4.92-14.551 0-24.75 14.058-24.75 34.106 0 13.821 6.857 22.181 18.184 22.181 4.8 0 10.096-1.492 16.554-4.675l-3.421 20.75c-7.184 1.957-11.816 2.67-17.225 2.67-20.977 0-34.051-15.084-34.051-39.309 0-32.55 18.059-55.3 43.888-55.3 8.507.001 18.561 3.609 21.419 4.73m31.443 55.608c-2.041-.236-2.941-.299-4.347-.299-11.041 0-16.633 3.787-16.633 11.266 0 4.604 2.729 7.547 6.983 7.547 7.938-.001 13.663-7.559 13.997-18.514zm14.178 32.984h-16.15l.371-7.663c-4.925 6.054-11.5 8.95-20.421 8.95-10.563 0-17.804-8.25-17.804-20.229 0-18.032 12.596-28.542 34.212-28.542 2.213 0 5.042.2 7.941.571.601-2.441.763-3.487.763-4.808 0-4.909-3.393-6.729-12.495-6.729-9.533-.108-17.396 2.271-20.63 3.321.204-1.225 2.704-16.637 2.704-16.637 9.709-2.858 16.116-3.929 23.316-3.929 16.741 0 25.604 7.517 25.583 21.704.033 3.821-.596 8.513-1.579 14.675-1.682 10.724-5.323 33.724-5.811 39.316zm-220.39-1.121c-5.338 1.679-9.496 2.408-14 2.408-9.962 0-15.399-5.726-15.399-16.268-.138-3.279 1.438-11.88 2.675-19.736 1.12-6.926 8.445-50.534 8.445-50.534h19.368l-2.26 11.212h9.941l-2.646 17.788h-9.975c-2.25 14.092-5.463 31.62-5.496 33.95 0 3.83 2.041 5.482 6.671 5.482 2.221 0 3.938-.216 5.254-.691zm59.391-.592c-6.65 2.033-13.079 3.012-19.879 3-21.685-.021-32.987-11.346-32.987-33.033 0-25.321 14.379-43.95 33.899-43.95 15.971 0 26.171 10.429 26.171 26.8 0 5.434-.7 10.733-2.384 18.212h-38.574c-1.306 10.741 5.569 15.222 16.837 15.222 6.93 0 13.188-1.435 20.138-4.677zm-10.891-43.912c.116-1.538 2.06-13.217-9.013-13.217-6.167 0-10.579 4.717-12.375 13.217zm-123.42-5.005c0 9.367 4.542 15.818 14.842 20.675 7.892 3.709 9.112 4.812 9.112 8.172 0 4.616-3.483 6.699-11.188 6.699-5.816 0-11.225-.908-17.467-2.921 0 0-2.554 16.321-2.671 17.101 4.421.967 8.375 1.85 20.275 2.191 20.566 0 30.059-7.829 30.059-24.746 0-10.18-3.971-16.15-13.737-20.637-8.167-3.759-9.113-4.584-9.113-8.046 0-4 3.246-6.059 9.542-6.059 3.821 0 9.046.421 14.004 1.125l2.771-17.179c-5.042-.8-12.692-1.441-17.146-1.441-21.804 0-29.346 11.379-29.283 25.066m398.45 50.63h-18.438l.917-6.893c-5.347 5.717-10.825 8.18-17.968 8.18-14.166 0-23.528-12.213-23.528-30.726 0-24.63 14.521-45.392 31.708-45.392 7.559 0 13.279 3.087 18.604 10.096l4.325-26.308h19.221zm-28.746-17.109c9.075 0 15.45-10.283 15.45-24.953 0-9.405-3.629-14.509-10.325-14.509-8.837 0-15.115 10.315-15.115 24.875-.001 9.686 3.357 14.587 9.99 14.587zm-56.842-56.929c-2.441 22.917-6.773 46.13-10.162 69.063l-.892 4.976h19.491c6.972-45.275 8.658-54.117 19.588-53.009 1.742-9.267 4.982-17.383 7.399-21.479-8.163-1.7-12.721 2.913-18.688 11.675.471-3.788 1.333-7.467 1.162-11.225zm-160.42 0c-2.446 22.917-6.779 46.13-10.167 69.063l-.888 4.976h19.5c6.963-45.275 8.646-54.117 19.57-53.009 1.75-9.267 4.991-17.383 7.399-21.479-8.154-1.7-12.717 2.913-18.679 11.675.471-3.788 1.324-7.467 1.162-11.225zm254.57 68.241c-.004-3.199 2.586-5.795 5.784-5.799h.012c3.197-.004 5.793 2.586 5.796 5.783v.016c-.001 3.201-2.595 5.795-5.796 5.797-3.201-.002-5.795-2.596-5.796-5.797zm5.796 4.405c2.431.002 4.402-1.969 4.403-4.399v-.004c.003-2.433-1.968-4.406-4.399-4.408h-.004c-2.435.001-4.407 1.974-4.408 4.408.002 2.432 1.975 4.403 4.408 4.403zm-.784-1.871h-1.188v-5.082h2.153c.446 0 .909.009 1.296.254.417.283.654.767.654 1.274 0 .575-.337 1.112-.888 1.317l.941 2.236h-1.32l-.779-2.009h-.87zm0-2.879h.653c.246 0 .513.019.729-.1.196-.125.296-.361.296-.588-.009-.21-.114-.404-.287-.523-.204-.117-.542-.084-.763-.084h-.629z"
                        fill="#fff"
                      />
                    </svg>
                    <span>••• 475</span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 border border-green-100 dark:border-green-500">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const FundraisingRecords = () => {
  const [ggData, setGgData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await apiService.get("googleAnalytics/runReport");
      console.log("response", response);
      setGgData(response.data);
    };
    fetchData();
  }, []);

  return (
    <div className="shadow-sm bg-white pb-12">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
        <div className="flex flex-col items-stretch w-[18%] max-md:w-full max-md:ml-0">
          <Sidebar />
        </div>
        <div className="flex flex-col items-stretch w-[82%] max-md:w-full max-md:ml-0 mt-10 justify-left">
          <h2 className="ml-5 text-left text-2xl font-semibold md:text-4xl md:leading-tight dark:text-white text-black-500">
            Fundraising Records
          </h2>
          <StatBadge ggData={ggData[0]} />

          <div className="flex flex-col relative shrink-0 box-border mt-5">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0 items-end">
              <div className="flex flex-col items-stretch w-6/12 max-md:w-full max-md:ml-0">
                <Chart />
              </div>
              <div className="flex flex-col items-stretch w-6/12 ml-5 max-md:w-full max-md:ml-0">
                <BarChart1 />
              </div>
            </div>
          </div>

          <Table />
        </div>
      </div>
    </div>
  );
};

export default FundraisingRecords;
